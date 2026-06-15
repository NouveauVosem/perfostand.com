import { useEffect, useState, useCallback, useRef } from 'react';
import { pickName, formatDate } from '../../utils/name';
import Spinner from '../Spinner/Spinner';
import SyncResults from './SyncResults';
import './SyncPage.scss';

const STATUS_LABEL = {
  new: 'Новый',
  outdated: 'Устарел',
  synced: 'Синхронизирован',
};

export default function SyncPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ data: [], meta: { total: 0, totalPages: 1 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(() => new Set());
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);
  const debounceRef = useRef(null);

  const load = useCallback(async (searchValue, pageValue) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(pageValue), limit: '20' });
      if (searchValue) params.set('search', searchValue);
      const res = await fetch(`/api/sync/crystal-products?${params.toString()}`);
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || `Ошибка ${res.status}`);
      }
      setData(await res.json());
    } catch (e) {
      setError(e.message);
      setData({ data: [], meta: { total: 0, totalPages: 1 } });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(search, page), 300);
    return () => clearTimeout(debounceRef.current);
  }, [search, page, load]);

  const rows = data.data || [];
  const meta = data.meta || { total: 0, totalPages: 1 };

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allOnPageSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        rows.forEach((r) => next.delete(r.id));
      } else {
        rows.forEach((r) => next.add(r.id));
      }
      return next;
    });
  };

  const handleSync = async () => {
    const ids = [...selected];
    if (ids.length === 0) return;
    setImporting(true);
    setResults(null);
    try {
      const res = await fetch('/api/sync/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message || `Ошибка ${res.status}`);
      setResults(payload);
      setSelected(new Set());
      load(search, page);
    } catch (e) {
      setError(e.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="sync-page">
      <div className="sync-toolbar">
        <h2>Синхронизация с Crystal</h2>
        <input
          type="text"
          placeholder="Поиск продуктов на Crystal…"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <button className="btn-sync" disabled={selected.size === 0 || importing} onClick={handleSync}>
          {importing ? 'Синхронизация…' : `Синхронизировать (${selected.size})`}
        </button>
      </div>

      {error && <p className="sync-error">{error}</p>}

      {results && <SyncResults results={results} onClose={() => setResults(null)} />}

      {loading ? (
        <Spinner label="Загрузка с Crystal…" />
      ) : rows.length === 0 ? (
        <p className="sync-empty">Ничего не найдено.</p>
      ) : (
        <table className="sync-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" checked={allOnPageSelected} onChange={toggleAll} />
              </th>
              <th>Название</th>
              <th>Артикулы</th>
              <th>Тип</th>
              <th>Статус</th>
              <th>Обновлён на Crystal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className={selected.has(r.id) ? 'row-selected' : ''}>
                <td>
                  <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggle(r.id)} />
                </td>
                <td>{pickName(r.name)}</td>
                <td className="sync-articles">{(r.articles || []).join(', ') || '—'}</td>
                <td>{r.typeCode || '—'}</td>
                <td>
                  <span className={`badge badge-${r.syncStatus}`}>{STATUS_LABEL[r.syncStatus]}</span>
                </td>
                <td>{formatDate(r.crystalUpdatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="sync-pagination">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          ←
        </button>
        <span>
          Стр. {page} из {meta.totalPages || 1} · всего {meta.total}
        </span>
        <button disabled={page >= (meta.totalPages || 1)} onClick={() => setPage((p) => p + 1)}>
          →
        </button>
      </div>
    </div>
  );
}
