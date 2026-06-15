import { useState } from 'react';
import { pickName, pickLocalized } from '../../utils/name';
import MediaGallery from '../MediaGallery/MediaGallery';

function dims(d) {
  if (!d) return '';
  return `${d.height ?? '—'} × ${d.width ?? '—'} × ${d.depth ?? '—'} мм`;
}

export default function VariantCard({ variant: v, specKeys }) {
  const [open, setOpen] = useState(true);

  const specEntries = Object.entries(v.specs || {});
  const ext = v.dimensions?.external;
  const int = v.dimensions?.internal;

  return (
    <article className={`variant-card${v.isActive === false ? ' inactive' : ''}`}>
      <header className="variant-head" onClick={() => setOpen((o) => !o)}>
        <div className="variant-title">
          <span className="variant-toggle">{open ? '▾' : '▸'}</span>
          <strong>{pickName(v.name)}</strong>
          {v.article && <span className="variant-article">{v.article}</span>}
        </div>
        <div className="variant-flags">
          {v.isActive === false && <span className="chip chip-muted">не активен</span>}
          {(v.tags || []).map((t) => (
            <span key={t.id} className="chip chip-tag">
              {pickName(t.name) !== '—' ? pickName(t.name) : t.code}
            </span>
          ))}
        </div>
      </header>

      {open && (
        <div className="variant-body">
          <div className="variant-props">
            {ext && (
              <div className="prop">
                <span className="prop-label">Габариты (внеш.)</span>
                <span>{dims(ext)}</span>
              </div>
            )}
            {int && (
              <div className="prop">
                <span className="prop-label">Габариты (внутр.)</span>
                <span>{dims(int)}</span>
              </div>
            )}
            {v.weight != null && (
              <div className="prop">
                <span className="prop-label">Вес</span>
                <span>{v.weight} кг</span>
              </div>
            )}
            {v.venturaLink && (
              <div className="prop">
                <span className="prop-label">Ventura</span>
                <span>{v.venturaLink}</span>
              </div>
            )}
          </div>

          {pickLocalized(v.shortDescription) && (
            <p className="variant-short">{pickLocalized(v.shortDescription)}</p>
          )}

          <div className="variant-media">
            <MediaGallery media={v.media} />
          </div>

          {specEntries.length > 0 && (
            <table className="spec-table">
              <tbody>
                {specEntries.map(([code, value]) => {
                  const key = specKeys[code];
                  const label = key ? pickLocalized(key.labels) || code : code;
                  const unit = key ? pickLocalized(key.unit) : '';
                  const shown = Array.isArray(value) ? value.join(', ') : String(value);
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
          )}

          {(v.equipComponents || []).length > 0 && (
            <div className="variant-equip">
              <span className="prop-label">Комплектация</span>
              <ul>
                {v.equipComponents.map((c) => (
                  <li key={c.id}>
                    <span className="chip">{c.type}</span>
                    {c.componentVariant ? (
                      <>
                        {pickName(c.componentVariant.name)}
                        {c.componentVariant.article ? ` (${c.componentVariant.article})` : ''}
                      </>
                    ) : (
                      <span className="detail-muted">— не синхронизирован</span>
                    )}
                    <span className="equip-qty">× {c.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(v.updatedByName || v.updatedByCrystalId || v.updatedByBitrixId) && (
            <div className="variant-prov">
              Источник: {v.updatedByName || v.updatedByCrystalId || v.updatedByBitrixId}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
