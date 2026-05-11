import styles from './Industries.module.scss'

const INDUSTRIES = [
  { title: 'DIY Retail',       desc: 'Nationwide chains, big-box format rollouts.' },
  { title: 'Hardware Stores',  desc: 'Independent and franchise hardware retail.' },
  { title: 'Automotive',       desc: 'Parts retailers, accessory chains, workshops.' },
  { title: 'Garden Retail',    desc: 'Garden centers and seasonal endcaps.' },
  { title: 'FMCG',             desc: 'Supermarket POS units and counter displays.' },
  { title: 'Tool OEMs',        desc: 'Branded shop-in-shop concepts for manufacturers.' },
]

export default function Industries() {
  return (
    <section id="industries" className={styles.section}>
      <div className="container">
        <span className="eyebrow">05 — Industries</span>
        <h2 className={styles.title}>
          Built for retail environments
          <span className={styles.accent}> across Europe.</span>
        </h2>

        <ul className={styles.list}>
          {INDUSTRIES.map((item, i) => (
            <li key={item.title} className={styles.item}>
              <div>
                <span className="num-badge">/ 0{i + 1}</span>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <p className={styles.itemDesc}>{item.desc}</p>
              </div>
              <span className={styles.arrow}>→</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
