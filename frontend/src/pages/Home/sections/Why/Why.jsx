import styles from './Why.module.scss'

const POINTS = [
  { title: 'OEM Manufacturing',  desc: 'Direct production. No middlemen. Full IP confidentiality.' },
  { title: 'Powder-Coated Steel', desc: 'Industrial-grade finish, RAL palette, retail-floor durability.' },
  { title: 'Modular Systems',    desc: 'Scale, swap, and reconfigure displays without re-tooling.' },
  { title: 'Custom Branding',    desc: 'Printed, laser-cut, or backlit. Toppers, panels, accessories.' },
  { title: 'Scalable Production', desc: 'From pilot stores to nationwide DIY chain rollouts.' },
  { title: 'EU Logistics',       desc: 'Flat-pack engineering, palletized shipping across Europe.' },
]

export default function Why() {
  return (
    <section id="why" className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.heading}>
            <span className={`eyebrow ${styles.eyebrow}`}>04 — Why Perfostand</span>
            <h2 className={styles.title}>
              An EU manufacturer,<br />not a reseller.
            </h2>
          </div>

          <div className={styles.points}>
            {POINTS.map((p, i) => (
              <div key={p.title} className={styles.point}>
                <div className={styles.pointTop}>
                  <span className={`num-badge ${styles.pointNum}`}>0{i + 1}</span>
                  <span className={styles.pointDot} />
                </div>
                <h3 className={styles.pointTitle}>{p.title}</h3>
                <p className={styles.pointDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
