# Perfostand Backend

Express + TypeORM + PostgreSQL. Своя БД продукции, синхронизируемая с Crystal.

## Стек
- Express 4 + TypeScript, TypeORM 0.3 (`synchronize: true`, без миграций)
- JWT auth (access 15m в теле ответа + refresh 4d в httpOnly-cookie)
- Порт по умолчанию **8300**

## Первый запуск (локально / Windows)

1. Создать БД и роль в PostgreSQL (через pgAdmin или psql):
   ```sql
   CREATE ROLE perfostand_user LOGIN PASSWORD 'ваш_пароль';
   CREATE DATABASE perfostand_db OWNER perfostand_user;
   ```
2. Скопировать `.env.example` → `.env` и заполнить:
   - `DB_*` — доступ к `perfostand_db`
   - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — любые случайные строки
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` — первый админ (сидится при старте)
   - `CRYSTAL_API_URL` — `http://127.0.0.1:8200` (локальный Crystal) либо прод-URL
   - `CRYSTAL_API_KEY` — **должен совпадать** с `CRM_API_KEY` на Crystal
3. `npm install`
4. `npm start` — TypeORM создаст таблицы (`synchronize`), засидит админа, поднимет API.

## API
- `POST /auth/login` `{ email, password }` → `{ user, accessToken }` + refresh-cookie
- `POST /auth/refresh` → `{ accessToken }` (по cookie)
- `POST /auth/logout`, `GET /auth/me`
- `GET /products/getAll?search=&page=&limit=` — локальные продукты
- `GET /products/getOne/:id`, `DELETE /products/delete/:id`
- `GET /sync/crystal-products?search=&page=&limit=` — список с Crystal + статус синка
- `POST /sync/import { ids: [] }` — копирует выбранные продукты (всё дерево, те же UUID)

## Синхронизация
Бекенд ходит на Crystal HTTP API с заголовком `X-Api-Key`. Crystal отдаёт сырые
entity через `GET /products/export?ids=...` (добавлено в Crystal-беке). Импорт
апсертит в FK-порядке (типы → спек-справочники → теги → продукт → варианты →
variant_tags → комплектация → совместимость) с сохранением crystal-UUID.
Связи на ещё не синхронизированные продукты пропускаются с предупреждением.

Нормы на Perfostand **не переносятся** — их можно смотреть на Crystal по тому же id.

## Прод (как на Crystal)
PM2 + nginx. `deploy.sh` в корне репозитория собирает фронт/бек/админку и
рестартит `pm2: perfostand-api`. nginx-блок `admin.perfostand.com` отдаёт
`admin-frontend/dist` и проксирует `/api/` → `127.0.0.1:8300`.
