import { useParams, Link, Navigate } from 'react-router-dom'
import { CONCEPTS } from '../../data/concepts'
import styles from './ConceptPage.module.scss'

export default function ConceptPage() {
  const { id, slug } = useParams()
  const concept = slug
    ? CONCEPTS.find(c => c.slug === slug)
    : CONCEPTS.find(c => c.id === id)

  if (!concept) return <Navigate to="/" replace />

  const currentIndex = CONCEPTS.indexOf(concept)
  const prev = CONCEPTS[currentIndex - 1] ?? null
  const next = CONCEPTS[currentIndex + 1] ?? null

  return (
    <div className={styles.page}>

      <div className={styles.metaBar}>
        <span>PERFOSTAND / CATALOGUE 2026</span>
        <span>DISPLAY — {concept.num}</span>
        <span>PS-2026</span>
      </div>

      <div className={styles.body}>

        <aside className={styles.sidebar}>
          <p className={styles.conceptLabel}>CONCEPT {concept.num}</p>
          <h1 className={styles.name}>{concept.name}</h1>
          <p className={styles.fullDesc}>{concept.fullDesc}</p>

          <div className={styles.block}>
            <h2 className={styles.blockTitle}>DIMENSIONS</h2>
            <table className={styles.table}>
              <tbody>
                <tr><td>HEIGHT</td><td>{concept.dimensions.height}</td></tr>
                <tr><td>WIDTH</td><td>{concept.dimensions.width}</td></tr>
                <tr><td>DEPTH</td><td>{concept.dimensions.depth}</td></tr>
                <tr><td>WEIGHT</td><td>{concept.dimensions.weight}</td></tr>
              </tbody>
            </table>
          </div>

          <div className={styles.block}>
            <h2 className={styles.blockTitle}>COLOUR</h2>
            <div className={styles.swatches}>
              {concept.colours.map(c => (
                <div key={c.ral} className={styles.swatch}>
                  <div className={styles.swatchColor} style={{ background: c.hex }} />
                  <span>{c.ral}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.block}>
            <h2 className={styles.blockTitle}>ATTRIBUTES</h2>
            <ul className={styles.attrList}>
              {concept.attributes.map(a => (
                <li key={a}>— {a}</li>
              ))}
            </ul>
          </div>
        </aside>

        <div className={styles.content}>
          <figure className={styles.mainFig}>
            <div className={styles.mainImgWrap}>
              {concept.img
                ? <img src={concept.img} alt={concept.name} className={styles.mainImg} />
                : <div className={styles.hatch} />
              }
              <span className={styles.figTag}>FIG. 01</span>
            </div>
            <figcaption className={styles.mainCaption}>
              <span>MAIN VIEW</span>
              <span>DESIGN WITH PACKAGE</span>
            </figcaption>
          </figure>

          <div className={styles.detailGrid}>
            {concept.figs.map((fig, i) => (
              <figure key={fig.num} className={styles.detailFig}>
                <div className={styles.detailImgWrap}>
                  {fig.img
                    ? <img src={fig.img} alt={fig.label} className={styles.mainImg} />
                    : <div className={styles.hatch} />
                  }
                  <span className={styles.figTag}>FIG. {fig.num}</span>
                </div>
                <figcaption className={styles.detailCaption}>
                  <span>DETAIL {fig.num}</span>
                  <div className={styles.detailLabel}>
                    <span className={styles.detailNum}>{fig.num}</span>
                    <span>{fig.label}</span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

      </div>

      <div className={styles.pageFooter}>
        <div className={styles.footerMeta}>
          <span>CAT: {concept.catRef}</span>
          <span>REV: {concept.rev}</span>
        </div>
        <span>PERFOSTAND S.R.O. — INTERNAL DRAFT · PS-2026</span>
        <div className={styles.footerNav}>
          {prev
            ? <Link to={`/concepts/${prev.id}`}>← {prev.tag}</Link>
            : <span />
          }
          <span>{concept.pageNum} / 24</span>
          {next
            ? <Link to={`/concepts/${next.id}`}>→ {next.tag}</Link>
            : <span />
          }
        </div>
      </div>

    </div>
  )
}
