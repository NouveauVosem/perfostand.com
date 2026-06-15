import Link from 'next/link'
import styles from './not-found.module.scss'

export default function NotFound() {
  return (
    <main className={styles.notFound}>
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link href="/">На главную</Link>
    </main>
  )
}
