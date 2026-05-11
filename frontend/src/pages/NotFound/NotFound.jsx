import { Link } from 'react-router-dom'
import styles from './NotFound.module.scss'

export default function NotFound() {
  return (
    <main className={styles.notFound}>
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link to="/">На главную</Link>
    </main>
  )
}
