import { createContext, useContext, useState, useEffect, useRef } from 'react';

const AuthContext = createContext();

// Сохраняем настоящий fetch один раз на window, чтобы пережить hot-reload
// и не обернуть уже пропатченный fetch.
if (!window.__originalFetch) {
  window.__originalFetch = window.fetch.bind(window);
}
const originalFetch = window.__originalFetch;

// Singleflight: один общий промис на refresh — несколько параллельных 401
// ждут один и тот же запрос на /api/auth/refresh.
let refreshPromise = null;

const SKIP_REFRESH_URLS = ['/api/auth/refresh', '/api/auth/login'];

function getUrl(input) {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.toString();
  if (input && typeof input.url === 'string') return input.url;
  return '';
}
function isApiRequest(input) {
  return getUrl(input).includes('/api/');
}
function shouldSkipRefresh(input) {
  const url = getUrl(input);
  return SKIP_REFRESH_URLS.some((skip) => url.includes(skip));
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const accessTokenRef = useRef(null);
  accessTokenRef.current = accessToken;

  const refreshAccessToken = async () => {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
      try {
        const res = await originalFetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!res.ok) return null;
        const data = await res.json();
        const newToken = data.accessToken;
        accessTokenRef.current = newToken;
        setAccessToken(newToken);
        return newToken;
      } catch {
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  };

  const refreshFnRef = useRef(refreshAccessToken);
  refreshFnRef.current = refreshAccessToken;

  const handleAuthFailureRef = useRef(() => {});
  handleAuthFailureRef.current = () => {
    setUser(null);
    setAccessToken(null);
    accessTokenRef.current = null;
  };

  // Глобальный fetch-перехватчик: на 401 наших API-запросов рефрешит токен
  // и повторяет запрос с новым Bearer. Так все api-вызовы работают без правок.
  useEffect(() => {
    window.fetch = async (input, init = {}) => {
      // Автоматически подставляем актуальный access token на API-запросы.
      let withAuth = init;
      if (isApiRequest(input) && !shouldSkipRefresh(input) && accessTokenRef.current) {
        const headers = new Headers(init.headers || {});
        if (!headers.has('Authorization')) {
          headers.set('Authorization', `Bearer ${accessTokenRef.current}`);
        }
        withAuth = { ...init, headers };
      }

      const response = await originalFetch(input, withAuth);

      if (response.status !== 401 || !isApiRequest(input) || shouldSkipRefresh(input)) {
        return response;
      }

      const newToken = await refreshFnRef.current();
      if (!newToken) {
        handleAuthFailureRef.current();
        return response;
      }

      const retriedHeaders = new Headers(withAuth.headers || {});
      retriedHeaders.set('Authorization', `Bearer ${newToken}`);
      return originalFetch(input, { ...withAuth, headers: retriedHeaders });
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const newToken = await refreshAccessToken();
      if (!newToken) {
        setUser(null);
        return;
      }
      const meRes = await originalFetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      if (meRes.ok) {
        setUser(await meRes.json());
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
      setAccessToken(null);
      accessTokenRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      /* ignore */
    }
    handleAuthFailureRef.current();
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, checkAuth, refreshAccessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
