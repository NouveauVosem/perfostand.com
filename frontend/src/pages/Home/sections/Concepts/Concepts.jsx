import { Link } from 'react-router-dom'
import { CONCEPTS } from '../../../../data/concepts'
import styles from './Concepts.module.scss'

export default function Concepts() {
  return (
    <section id="concepts" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <span className="eyebrow">03 — Display Concepts</span>
            <h2 className={styles.title}>
              Reference Concepts.<br />Engineered for Category.
            </h2>
          </div>
          <p className={styles.subtitle}>
            Reference projects illustrating typical configurations. All Perfostand
            stands are built to order — these are not catalog products.
          </p>
        </div>

        <div className={styles.grid}>
          {CONCEPTS.map((c) => (
            <Link key={c.id} to={c.slug ? `/${c.slug}` : `/concepts/${c.id}`} className={styles.cardLink}>
              <article className={styles.card}>
                <div className={styles.cardTop}>
                  <span className="num-badge">{c.tag}</span>
                  <span className={styles.cardRef}>Reference →</span>
                </div>
                {c.img
                  ? <img src={c.img} alt={c.title} className={styles.cardImage} />
                  : <div className={`placeholder-surface ${styles.cardImage}`} />
                }
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <p className={styles.cardDesc}>{c.desc}</p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
