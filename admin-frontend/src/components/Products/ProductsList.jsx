import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { pickName, formatDate } from '../../utils/name';
import Spinner from '../Spinner/Spinner';
import './ProductsList.scss';

export default function ProductsList() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ data: [], meta: { total: 0, totalPages: 1 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const debounceRef = useRef(null);

  const load = useCallback(async (searchValue, pageValue) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(pageValue), limit: '20' });
      if (searchValue) params.set('search', searchValue);
      const res = await fetch(`/api/products/getAll?${params.toString()}`);
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      setData(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(search, page), 300);
    return () => clearTimeout(debounceRef.current);
  }, [search, page, load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить продукт из локальной базы?')) return;
    const res = await fetch(`/api/products/delete/${id}`, { method: 'DELETE' });
    if (res.ok) {
      load(search, page);
    } else {
      window.alert('Не удалось удалить продукт');
    }
  };

  const rows = data.data || [];
  const meta = data.meta || { total: 0, totalPages: 1 };

  return (
    <div className="products-page">
      <div className="products-toolbar">
        <h2>Продукты в локальной базе</h2>
        <input
          type="text"
          placeholder="Поиск по названию или артикулу…"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {error && <p className="products-error">{error}</p>}

      {loading ? (
        <Spinner label="Загрузка…" />
      ) : rows.length === 0 ? (
        <p className="products-empty">Пока ничего не синхронизировано. Перейдите на вкладку «Синхронизация».</p>
      ) : (
        <table className="products-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Тип</th>
              <th>Вариантов</th>
              <th>Обновлён (синк)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link className="product-link" to={`/products/${p.id}`}>
                    {pickName(p.name)}
                  </Link>
                </td>
                <td>{p.productType?.code || '—'}</td>
                <td>{(p.variants || []).length}</td>
                <td>{formatDate(p.updatedAt)}</td>
                <td>
                  <button className="btn-danger" onClick={() => handleDelete(p.id)}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="products-pagination">
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
