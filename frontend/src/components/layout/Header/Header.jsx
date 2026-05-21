import { Link } from 'react-router-dom'
import styles from './Header.module.scss'

const NAV_LINKS = [
  { label: 'Customization', href: '#customization' },
  { label: 'Concepts',      href: '#concepts' },
  { label: 'Why Perfostand', href: '#why' },
  { label: 'Contact',       href: '#contact' },
]

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className={styles.logoMark}>P</span>
          <span className={styles.logoName}>Perfostand</span>
          <span className={`num-badge ${styles.logoBadge}`}>/ EU OEM</span>
        </Link>

        <nav className={styles.nav}>
          {NAV_LINKS.map(({ label, href }) => (
            <a key={href} href={href} className={styles.navLink}>
              {label}
            </a>
          ))}
        </nav>

        <a href="#contact" className={styles.cta}>
          Request Quote
        </a>
      </div>
    </header>
  )
}
