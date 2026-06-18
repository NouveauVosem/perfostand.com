import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.scss';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-root">
      <header className="admin-header">
        <div className="admin-brand">Perfostand Admin</div>
        <nav className="admin-nav">
          <NavLink to="/products">Продукты</NavLink>
          <NavLink to="/sync">Синхронизация</NavLink>
          <NavLink to="/reviews">Отзывы</NavLink>
        </nav>
        <div className="admin-user">
          <span>{user?.email}</span>
          <button onClick={logout}>Выйти</button>
        </div>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
