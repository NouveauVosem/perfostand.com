import imgC01 from '../../../../assets/concepts/concept-c01.jpg'
import imgC02 from '../../../../assets/concepts/concept-c02.jpg'
import imgC03 from '../../../../assets/concepts/concept-c03.jpg'
import imgC04 from '../../../../assets/concepts/concept-c04.jpg'
import imgC05 from '../../../../assets/concepts/concept-c05.jpg'
import imgC06 from '../../../../assets/concepts/concept-c06.jpg'
import styles from './Concepts.module.scss'

const CONCEPTS = [
  { tag: 'C-01', title: 'Power Tools',         desc: 'Heavy-duty pegboard with reinforced hooks and locked display units.', img: imgC01 },
  { tag: 'C-02', title: 'Paint Products',       desc: 'Tiered shelving with color-sample integration and branding topper.', img: imgC02 },
  { tag: 'C-03', title: 'Gardening Tools',      desc: 'Tall-format racks with handle hooks and seasonal endcaps.', img: imgC03 },
  { tag: 'C-04', title: 'Batteries & Power',    desc: 'Compact counter units with secure dispensers and POS branding.', img: imgC04 },
  { tag: 'C-05', title: 'Automotive Accessories', desc: 'Modular bays for fluids, tools, and hanging consumables.', img: imgC05 },
  { tag: 'C-06', title: 'Hardware & Fasteners', desc: 'High-density bin systems with dividers and printed indexing.', img: imgC06 },
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
              {c.img
                ? <img src={c.img} alt={c.title} className={styles.cardImage} />
                : <div className={`placeholder-surface ${styles.cardImage}`} />
              }
              <h3 className={styles.cardTitle}>{c.title}</h3>
              <p className={styles.cardDesc}>{c.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
