import { useEffect, useState, useCallback } from 'react';
import { formatDate } from '../../utils/name';
import Spinner from '../Spinner/Spinner';
import './ReviewsList.scss';

const STATUS_FILTERS = [
  { value: '',         label: 'Все' },
  { value: 'pending',  label: 'На модерации' },
  { value: 'approved', label: 'Одобренные' },
  { value: 'rejected', label: 'Отклонённые' },
];

const STATUS_LABELS = {
  pending:  'На модерации',
  approved: 'Одобрен',
  rejected: 'Отклонён',
};

// URL фото через публичный прокси бекенда (стрим с Synology).
function photoUrl(reviewId, index) {
  return `/api/reviews/${reviewId}/photo/${index}`;
}

export default function ReviewsList() {
  const [status, setStatus] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightbox, setLightbox] = useState(null); // { src }

  const load = useCallback(async (statusValue) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (statusValue) params.set('status', statusValue);
      const qs = params.toString();
      const res = await fetch(`/api/reviews${qs ? `?${qs}` : ''}`);
      if (!res.ok) throw new Error(`Ошибка ${res.status}`);
      setReviews(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(status);
  }, [status, load]);

  const changeStatus = async (id, newStatus) => {
    const res = await fetch(`/api/reviews/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      load(status);
    } else {
      window.alert('Не удалось изменить статус');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить отзыв безвозвратно (вместе с фото)?')) return;
    const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    if (res.ok) {
      load(status);
    } else {
      window.alert('Не удалось удалить отзыв');
    }
  };

  return (
    <div className="reviews-page">
      <div className="reviews-toolbar">
        <h2>Отзывы</h2>
        <div className="reviews-filters">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              className={`reviews-filter ${status === f.value ? 'is-active' : ''}`}
              onClick={() => setStatus(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="reviews-error">{error}</p>}

      {loading ? (
        <Spinner label="Загрузка…" />
      ) : reviews.length === 0 ? (
        <p className="reviews-empty">Отзывов нет.</p>
      ) : (
        <div className="reviews-list">
          {reviews.map((r) => (
            <article key={r.id} className={`review-card review-card--${r.status}`}>
              <header className="review-card-head">
                <div className="review-author">
                  <span className="review-name">{r.name}</span>
                  {r.company && <span className="review-company">· {r.company}</span>}
                </div>
                <span className={`review-badge review-badge--${r.status}`}>
                  {STATUS_LABELS[r.status] || r.status}
                </span>
              </header>

              <div className="review-meta">
                {r.email && (
                  <a className="review-email" href={`mailto:${r.email}`}>{r.email}</a>
                )}
                <span className="review-date">{formatDate(r.createdAt)}</span>
              </div>

              <p className="review-message">{r.message}</p>

              {Array.isArray(r.photos) && r.photos.length > 0 && (
                <div className="review-photos">
                  {r.photos.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className="review-photo"
                      onClick={() => setLightbox({ src: photoUrl(r.id, i) })}
                    >
                      <img src={photoUrl(r.id, i)} alt={`Фото ${i + 1}`} loading="lazy" />
                    </button>
                  ))}
                </div>
              )}

              <footer className="review-actions">
                {r.status !== 'approved' && (
                  <button className="btn-approve" onClick={() => changeStatus(r.id, 'approved')}>
                    Одобрить
                  </button>
                )}
                {r.status !== 'rejected' && (
                  <button className="btn-reject" onClick={() => changeStatus(r.id, 'rejected')}>
                    Отклонить
                  </button>
                )}
                {r.status !== 'pending' && (
                  <button className="btn-neutral" onClick={() => changeStatus(r.id, 'pending')}>
                    На модерацию
                  </button>
                )}
                <button className="btn-danger" onClick={() => handleDelete(r.id)}>
                  Удалить
                </button>
              </footer>
            </article>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="review-lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox.src} alt="" onClick={(e) => e.stopPropagation()} />
          <button className="review-lightbox-close" onClick={() => setLightbox(null)}>×</button>
        </div>
      )}
    </div>
  );
}
