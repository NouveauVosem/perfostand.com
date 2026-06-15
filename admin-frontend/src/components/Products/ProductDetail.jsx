import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pickName, pickLocalized, formatDate } from '../../utils/name';
import Spinner from '../Spinner/Spinner';
import MediaGallery from '../MediaGallery/MediaGallery';
import VariantCard from './VariantCard';
import './ProductDetail.scss';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [specKeys, setSpecKeys] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [pRes, kRes] = await Promise.all([
        fetch(`/api/products/getOne/${id}`),
        fetch('/api/products/spec-keys'),
      ]);
      if (!pRes.ok) throw new Error(`Ошибка ${pRes.status}`);
      setProduct(await pRes.json());
      if (kRes.ok) {
        const keys = await kRes.json();
        const map = {};
        for (const k of keys) map[k.code] = k;
        setSpecKeys(map);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Spinner label="Загрузка…" />;
  if (error) return <p className="detail-error">{error}</p>;
  if (!product) return null;

  const specEntries = Object.entries(product.specifications || {});

  return (
    <div className="product-detail">
      <div className="detail-back">
        <Link to="/products">← к списку</Link>
      </div>

      <header className="detail-head">
        <div>
          <h2>{pickName(product.name)}</h2>
          <div className="detail-meta">
            <span className="chip">{product.productType?.code || 'без типа'}</span>
            {product.status && <span className="chip">{product.status}</span>}
            <span className="detail-id">id: {product.id}</span>
          </div>
        </div>
        <div className="detail-dates">
          <div>Синхронизирован: {formatDate(product.updatedAt)}</div>
          <div>Создан: {formatDate(product.createdAt)}</div>
        </div>
      </header>

      {/* Тексты */}
      {(pickLocalized(product.webTitle) || pickLocalized(product.shortDescription)) && (
        <section className="detail-section">
          {pickLocalized(product.webTitle) && (
            <p className="detail-webtitle">{pickLocalized(product.webTitle)}</p>
          )}
          {pickLocalized(product.shortDescription) && (
            <p className="detail-short">{pickLocalized(product.shortDescription)}</p>
          )}
        </section>
      )}

      {pickLocalized(product.htmlDescription) && (
        <section className="detail-section">
          <h3>Описание</h3>
          <div
            className="detail-html"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: pickLocalized(product.htmlDescription) }}
          />
        </section>
      )}

      {/* Картинки продукта */}
      <section className="detail-section">
        <h3>Изображения продукта</h3>
        <MediaGallery media={product.media} />
      </section>

      {/* Спецификации продукта */}
      {specEntries.length > 0 && (
        <section className="detail-section">
          <h3>Спецификации</h3>
          <table className="spec-table">
            <tbody>
              {specEntries.map(([code, values]) => {
                const key = specKeys[code];
                const label = key ? pickLocalized(key.labels) || code : code;
                const unit = key ? pickLocalized(key.unit) : '';
                const shown = Array.isArray(values) ? values.join(', ') : String(values);
                return (
                  <tr key={code}>
                    <td className="spec-label">{label}</td>
                    <td>
                      {shown}
                      {unit ? ` ${unit}` : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {/* Варианты */}
      <section className="detail-section">
        <h3>Варианты ({(product.variants || []).length})</h3>
        <div className="variant-list">
          {(product.variants || []).map((v) => (
            <VariantCard key={v.id} variant={v} specKeys={specKeys} />
          ))}
          {(product.variants || []).length === 0 && <p className="detail-muted">Вариантов нет.</p>}
        </div>
      </section>

      {/* Совместимость */}
      {(product.compatLinks || []).length > 0 && (
        <section className="detail-section">
          <h3>Совместимость</h3>
          <ul className="compat-list">
            {product.compatLinks.map((c) => (
              <li key={c.id}>
                <span className="chip">{c.type}</span>
                {c.compatProduct ? (
                  <Link to={`/products/${c.compatProduct.id}`}>{pickName(c.compatProduct.name)}</Link>
                ) : (
                  <span className="detail-muted">— продукт не синхронизирован</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
