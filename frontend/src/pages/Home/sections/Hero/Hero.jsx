import heroImage from '../../../../assets/hero-stands.png'
import styles from './Hero.module.scss'

const STATS = [
  { value: '12+', label: 'Years OEM' },
  { value: '30+', label: 'EU Markets' },
  { value: 'RAL', label: 'Custom Finish' },
]

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.imageWrap}>
        <img
          src={heroImage}
          alt="Modular pegboard tool display stands — Perfostand OEM merchandising systems"
          className={styles.image}
          loading="eager"
        />

        <div className={styles.overlay}>
          <div className={`container ${styles.content}`}>
            <div className={styles.inner}>
              <div className={styles.eyebrowRow}>
                <span className={styles.eyebrowLine} />
                <span className="eyebrow">01 — OEM Merchandising Systems</span>
              </div>

              <h1 className={styles.title}>
                Custom Tool<br />Display Stands.
              </h1>

              <p className={styles.lead}>
                Modular merchandising systems designed for retail brands, DIY chains,
                and hardware stores. Engineered in the EU. Built around your SKUs.
              </p>

              <div className={styles.actions}>
                <a href="#contact" className={styles.btnPrimary}>
                  Request Quote →
                </a>
                <a href="#contact" className={styles.btnOutline}>
                  Send Product List
                </a>
              </div>

              <dl className={styles.stats}>
                {STATS.map(({ value, label }) => (
                  <div key={label} className={styles.stat}>
                    <dt className={styles.statValue}>{value}</dt>
                    <dd className="num-badge">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
