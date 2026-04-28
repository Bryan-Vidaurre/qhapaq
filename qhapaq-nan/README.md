# Qhapaq Ñan

> *El gran camino del SERUMS peruano* — mapa colaborativo, reseñas verificadas, comunidad de profesionales de salud.

Este repositorio contiene el código fuente de la plataforma. Es un proyecto en desarrollo activo. Versión actual: **v0.1 "Atlas SERUMS Vivo"**.

---

## ¿Qué hace v0.1?

- **Mapa interactivo** de las 16,018 plazas oficiales del SERUMS 2026-I (MINSA).
- **Filtros** por profesión, departamento, grado de dificultad, bonos ZAF/VRAEM.
- **Páginas SEO** para cada centro de salud (`/plazas/00005055`).
- **Magic link auth** — sin contraseñas, solo correo.
- **Perfil mínimo** con derechos ARCO funcionales (exportar y eliminar datos).
- **Row Level Security** en cada tabla desde el día uno.
- **Audit log** de operaciones sensibles.
- **Headers de seguridad** (CSP, HSTS, X-Frame-Options).

Lo que **no** está en v0.1: verificación profesional con documentos, sistema Yachay activo (el schema y catálogo están listos, falta la UI), reseñas, feed, foros, marketplace, boletines IA. Esos sprints están planificados en `docs/ROADMAP.md`.

---

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Supabase** (Postgres + Auth + Storage)
- **Resend** para email transaccional
- **Leaflet** + react-leaflet para mapas
- **Zod** para validación
- **Vercel** para hosting

---

## Setup local

### 1. Pre-requisitos

```bash
node --version    # >= 20.0.0
npm --version
git --version

# Supabase CLI (necesario para migrations y desarrollo local)
npm install -g supabase
```

También necesitarás Docker corriendo (para `supabase start` levantar la DB local).

### 2. Clonar e instalar

```bash
git clone <tu-repo-url> qhapaq-nan
cd qhapaq-nan
npm install
```

### 3. Variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con valores reales. Para desarrollo local con Supabase CLI, los valores aparecen al ejecutar `supabase start`.

### 4. Levantar Supabase local

```bash
npm run supabase:start
```

Esto levanta Postgres, Auth, Storage y un servidor SMTP de prueba (Inbucket en http://localhost:54324). Las migraciones de `supabase/migrations/` se aplican automáticamente.

### 5. Cargar seed inicial

```bash
npm run seed
```

Esto carga:
- 12 familias profesionales
- 17 profesiones
- ~115 logros del catálogo Yachay
- 16,018 ofertas del padrón SERUMS 2026-I

Toma 1–3 minutos por la carga del padrón.

### 6. Generar tipos TypeScript de Supabase

```bash
npm run supabase:gen-types
```

### 7. Ejecutar la app

```bash
npm run dev
```

Abre http://localhost:3000.

Para probar el magic link, ve a Inbucket (http://localhost:54324) — los correos de desarrollo llegan ahí.

---

## Comandos útiles

```bash
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run start            # Servir build de producción
npm run lint             # ESLint
npm run typecheck        # TypeScript sin emit
npm run format           # Prettier
npm run seed             # Cargar datos iniciales
npm run supabase:start   # Levantar Supabase local
npm run supabase:stop    # Detener Supabase local
npm run supabase:reset   # Reset DB (cuidado, borra datos)
```

---

## Despliegue

### Vercel + Supabase Cloud

1. Crear proyecto en Supabase Cloud: https://app.supabase.com
2. En el dashboard, ir a **SQL Editor** → ejecutar las migraciones de `supabase/migrations/` en orden numérico.
3. Configurar SMTP custom (Resend) en **Authentication → Settings → SMTP Settings**.
4. Importar el repo en Vercel: https://vercel.com/new
5. Configurar variables de entorno (las mismas de `.env.example`).
6. Deploy.

### Plan SERUMS (post-MVP)

- Configurar custom domain (qhapaqnan.pe).
- Cron job en Vercel para procesar `account_deletions` vencidas y mantener Supabase activo.
- Backup automático diario de la DB (Supabase Pro o pg_dump cron).
- Monitoreo de errores (Sentry o LogRocket).

---

## Estructura del proyecto

```
qhapaq-nan/
├── docs/                     # Documentos legales y de gobernanza
├── public/                   # Assets estáticos
├── scripts/                  # Scripts auxiliares (parseo de PDFs, etc.)
├── src/
│   ├── app/                  # Rutas Next.js (App Router)
│   │   ├── (public)/         # Rutas públicas (mapa, auth)
│   │   ├── (auth)/           # Rutas que requieren sesión
│   │   ├── api/              # Route handlers
│   │   ├── layout.tsx
│   │   └── page.tsx          # Landing
│   ├── components/
│   │   ├── ui/               # Primitivos compartidos
│   │   ├── plaza/            # Componentes del mapa y plazas
│   │   ├── auth/             # Forms de auth
│   │   ├── perfil/
│   │   └── layout/
│   ├── lib/
│   │   ├── supabase/         # Clientes (browser + server)
│   │   ├── auth.ts           # Helpers de sesión
│   │   └── rate-limit.ts
│   ├── types/                # TypeScript types del dominio
│   ├── styles/
│   └── middleware.ts
└── supabase/
    ├── migrations/           # 7 archivos SQL ordenados
    ├── seed/
    │   ├── seed.ts           # Script de carga
    │   └── *.json            # Datos
    ├── templates/            # Plantillas de email
    └── config.toml
```

---

## Seguridad y privacidad

Lee `SECURITY.md` antes de hacer cambios que toquen autenticación, datos personales o storage.

Cumplimos con la **Ley 29733** (Protección de Datos Personales) y el **DS 003-2024-JUS**. La política de privacidad pública está en `docs/PRIVACIDAD.md`.

---

## Aporte

Este es un proyecto comunitario. Si vas a contribuir:

1. Lee `docs/POLITICA_CONTENIDO.md` y `docs/CONTRIBUIR.md`.
2. Crea una rama desde `main`.
3. Asegúrate de pasar `npm run lint` y `npm run typecheck`.
4. Abre un PR con descripción clara.

---

## Licencia

Por definir. El código está bajo licencia restringida hasta tomar decisión sobre apertura. Los datos del padrón son de dominio público (publicados por MINSA).

---

*Construido por una persona, con paciencia. Si encuentras algo roto o quieres ayudar, escribe a hola@qhapaqnan.pe.*
