import { Award, Wrench, Boxes } from 'lucide-react'
import styles from './Customization.module.scss'
import imgHooks        from '../../../../assets/customization/hooks-crop.jpg'
import imgShelves      from '../../../../assets/customization/shelves-crop.jpg'
import imgPegboard     from '../../../../assets/customization/pegboard-crop.jpg'
import imgTopper       from '../../../../assets/customization/topper-crop.jpg'
import imgAccessories  from '../../../../assets/customization/accesories-crop.jpg'
import imgRal          from '../../../../assets/customization/ral-crop.jpg'

const ITEMS = [
  { title: 'Interchangeable Hooks', desc: 'Single, double, and product-specific hook profiles for maximum flexibility.',  img: imgHooks },
  { title: 'Adjustable Shelves',    desc: 'Tool-free repositioning across the full panel height to fit any product.',      img: imgShelves },
  { title: 'Pegboard Panels',       desc: 'Standard and reinforced gauges for heavy SKUs and hooks.',                      img: imgPegboard },
  { title: 'Branding Toppers',      desc: 'Printed, embossed, or backlit header units for strong brand presence.',         img: imgTopper },
  { title: 'RAL Color Range',       desc: 'Any RAL powder-coated finish for perfect brand alignment.',                     img: imgRal },
  { title: 'Modular Accessories',   desc: 'Trays, dividers, price rails, lighting, and more to complete your display.',    img: imgAccessories },
]

const BENEFITS = [
  { Icon: Award,  title: 'Tailored to Your Brand', desc: 'Custom colors, logos, and graphics for maximum brand impact.' },
  { Icon: Wrench, title: 'Built for Performance',  desc: 'Durable materials and smart engineering for long-term reliability.' },
  { Icon: Boxes,  title: 'Flexible & Scalable',    desc: 'Easily adapt, expand, and evolve with your business needs.' },
]

export default function Customization() {
  return (
    <section id="customization" className={styles.section}>
      <div className={styles.layout}>

        {/* Col 1 — text */}
        <div className={styles.text}>
          <span className="eyebrow">02 — Customization</span>
          <h2 className={styles.title}>
            Designed<br />Around Your<br />
            <span className={styles.accent}>Products.</span>
          </h2>
          <div className={styles.divider} />
          <p className={styles.lead}>
            Every Perfostand system is configured to your SKUs, packaging
            dimensions, and brand identity. We engineer the fixture — you own the shelf.
          </p>
          <ul className={styles.benefits}>
            {BENEFITS.map(({ Icon, title, desc }, i) => (
              <li key={title} className={styles.benefit}>
                {i > 0 && <div className={styles.benefitRule} />}
                <div className={styles.benefitInner}>
                  <span className={styles.benefitIcon}>
                    <Icon size={24} strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className={styles.benefitTitle}>{title}</h3>
                    <p className={styles.benefitDesc}>{desc}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 2 — cards */}
        <div className={styles.cards}>
          {ITEMS.map((item, i) => (
            <article key={item.title} className={styles.card}>
              <div className={`${styles.cardImage}${!item.img ? ` placeholder-surface` : ''}`}>
                {item.img && <img src={item.img} alt={item.title} className={styles.cardImg} />}
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <span className={styles.cardIcon} />
                  <span className="num-badge">0{i + 1}</span>
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
