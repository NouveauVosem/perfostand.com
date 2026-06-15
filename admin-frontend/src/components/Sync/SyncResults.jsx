import { pickName } from '../../utils/name';

export default function SyncResults({ results, onClose }) {
  const { summary, results: rows } = results;

  return (
    <div className="sync-results">
      <div className="sync-results-head">
        <strong>
          Готово: {summary.ok} ок, {summary.failed} с ошибкой из {summary.total}
        </strong>
        <button onClick={onClose}>×</button>
      </div>
      <ul>
        {rows.map((r) => (
          <li key={r.id} className={`res-${r.status}`}>
            <span className="res-name">{pickName(r.name)}</span>
            {r.status === 'ok' ? (
              <span className="res-tag ok">ок</span>
            ) : (
              <span className="res-tag err">ошибка: {r.error}</span>
            )}
            {r.warnings?.length > 0 && (
              <ul className="res-warnings">
                {r.warnings.map((w, i) => (
                  <li key={i}>⚠ {w}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
