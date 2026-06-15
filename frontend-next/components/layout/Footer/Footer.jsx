import styles from './Footer.module.scss'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.logoMark}>P</span>
          <span className={styles.logoName}>Perfostand</span>
          <span className="num-badge">EU OEM · Est. 2012</span>
        </div>
        <p className="num-badge">
          © {new Date().getFullYear()} Perfostand · All rights reserved
        </p>
      </div>
    </footer>
  )
}
