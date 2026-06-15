// Локализованное имя из jsonb-объекта { ru, en, ... } с фолбэком.
export function pickName(name) {
  if (!name || typeof name !== 'object') return '—';
  return name.ru || name.en || Object.values(name)[0] || '—';
}

// Локализованное значение без дефиса-заглушки (для опциональных полей).
export function pickLocalized(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return value.ru || value.en || Object.values(value)[0] || '';
  return String(value);
}

// URL картинки через прокси бекенда (media[].url — путь на WebDAV кристала).
export function imageUrl(path) {
  if (!path) return '';
  return `/api/files/image?path=${encodeURIComponent(path)}`;
}

export function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
