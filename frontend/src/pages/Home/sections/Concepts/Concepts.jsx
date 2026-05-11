import styles from './Concepts.module.scss'

const CONCEPTS = [
  { tag: 'C-01', title: 'Power Tools',         desc: 'Heavy-duty pegboard with reinforced hooks and locked display units.' },
  { tag: 'C-02', title: 'Paint Products',       desc: 'Tiered shelving with color-sample integration and branding topper.' },
  { tag: 'C-03', title: 'Gardening Tools',      desc: 'Tall-format racks with handle hooks and seasonal endcaps.' },
  { tag: 'C-04', title: 'Batteries & Power',    desc: 'Compact counter units with secure dispensers and POS branding.' },
  { tag: 'C-05', title: 'Automotive Accessories', desc: 'Modular bays for fluids, tools, and hanging consumables.' },
  { tag: 'C-06', title: 'Hardware & Fasteners', desc: 'High-density bin systems with dividers and printed indexing.' },
]

export default function Concepts() {
  return (
    <section id="concepts" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <span className="eyebrow">03 — Display Concepts</span>
            <h2 className={styles.title}>
              Six Reference Concepts.<br />Engineered for Category.
            </h2>
          </div>
          <p className={styles.subtitle}>
            Reference projects illustrating typical configurations. All Perfostand
            stands are built to order — these are not catalog products.
          </p>
        </div>

        <div className={styles.grid}>
          {CONCEPTS.map((c) => (
            <article key={c.tag} className={styles.card}>
              <div className={styles.cardTop}>
                <span className="num-badge">{c.tag}</span>
                <span className={styles.cardRef}>Reference →</span>
              </div>
              <div className={`placeholder-surface ${styles.cardImage}`} />
              <h3 className={styles.cardTitle}>{c.title}</h3>
              <p className={styles.cardDesc}>{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
