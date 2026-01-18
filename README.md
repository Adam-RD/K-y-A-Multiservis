# K y A Multiservis - Inventario

App web de inventario construida con Next.js (App Router), Prisma y Neon (PostgreSQL).

## Requisitos
- Node.js 18+
- Base de datos PostgreSQL (Neon recomendado)

## Configuración
1) Instala dependencias:
```bash
npm install
```

2) Crea el archivo `.env` con tus variables:
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"
JWT_SECRET="cambia-esto-por-un-secreto-seguro"
```

3) Ejecuta migraciones:
```bash
npx prisma migrate dev
```

4) (Opcional) Carga datos de ejemplo:
```bash
npx prisma db seed
```

5) Inicia el servidor:
```bash
npm run dev
```

## Acceso
Si ejecutas el seed, se crea un usuario admin:
- Usuario: `admin`
- Contraseña: `admin123`

## Scripts utiles
- `npm run dev`
- `npx prisma migrate dev`
- `npx prisma db seed`

## Notas
- Las escrituras usan Server Actions.
- La lectura se resuelve con Server Components.
