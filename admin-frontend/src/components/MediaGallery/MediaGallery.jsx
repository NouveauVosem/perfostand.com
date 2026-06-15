import { useState, useEffect, useCallback } from 'react';
import { imageUrl, pickLocalized } from '../../utils/name';
import './MediaGallery.scss';

// Галерея картинок с лайтбоксом. media — массив { url, order, typeOfMedia, useType, alt }.
export default function MediaGallery({ media }) {
  const items = (media || [])
    .filter((m) => m && m.url && (m.typeOfMedia || 'image') === 'image')
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const [openIndex, setOpenIndex] = useState(-1);

  const close = useCallback(() => setOpenIndex(-1), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i <= 0 ? items.length - 1 : i - 1)),
    [items.length]
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i >= items.length - 1 ? 0 : i + 1)),
    [items.length]
  );

  useEffect(() => {
    if (openIndex < 0) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex, close, prev, next]);

  if (items.length === 0) {
    return <div className="gallery-empty">Нет изображений</div>;
  }

  const current = openIndex >= 0 ? items[openIndex] : null;

  return (
    <>
      <div className="gallery-grid">
        {items.map((m, i) => (
          <button
            key={`${m.url}-${i}`}
            type="button"
            className="gallery-thumb"
            onClick={() => setOpenIndex(i)}
            title={pickLocalized(m.alt) || m.useType || ''}
          >
            <img src={imageUrl(m.url)} alt={pickLocalized(m.alt) || `media-${i}`} loading="lazy" />
            {m.useType && <span className="gallery-thumb-tag">{m.useType}</span>}
          </button>
        ))}
      </div>

      {current && (
        <div className="lightbox" onClick={close}>
          <button className="lightbox-close" onClick={close} aria-label="Закрыть">
            ×
          </button>
          {items.length > 1 && (
            <button
              className="lightbox-nav lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Назад"
            >
              ‹
            </button>
          )}
          <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <img src={imageUrl(current.url)} alt={pickLocalized(current.alt) || 'image'} />
            <figcaption>
              {openIndex + 1} / {items.length}
              {pickLocalized(current.alt) ? ` · ${pickLocalized(current.alt)}` : ''}
              {current.useType ? ` · ${current.useType}` : ''}
            </figcaption>
          </figure>
          {items.length > 1 && (
            <button
              className="lightbox-nav lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Вперёд"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
