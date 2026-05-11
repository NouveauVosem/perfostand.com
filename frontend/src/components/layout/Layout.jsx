import { Outlet } from 'react-router-dom'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import styles from './Layout.module.scss'

export default function Layout() {
  return (
    <div className={styles.root}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
