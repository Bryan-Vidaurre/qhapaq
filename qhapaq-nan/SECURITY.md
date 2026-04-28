# Seguridad y cumplimiento

Este documento define las prácticas de seguridad de Qhapaq Ñan y el plan de cumplimiento con la Ley 29733 (Protección de Datos Personales del Perú).

> **Importante:** este documento es interno-técnico. La política de privacidad pública para usuarios está en `docs/PRIVACIDAD.md`.

---

## Marco legal aplicable

- **Ley N° 29733** — Ley de Protección de Datos Personales (Perú).
- **Reglamento de la Ley 29733** — DS 003-2024-JUS.
- **Ley N° 32104** — Ley sobre uso de plataformas digitales (Perú, 2024).
- Estándares de referencia: OWASP Top 10, OWASP ASVS Level 1, NIST 800-63B (auth).

---

## Datos que tratamos

### Datos públicos (no protegidos)
- Padrón oficial del MINSA (16,018 plazas, públicas por ley).
- Catálogo de profesiones y familias.
- Logros otorgados (visibles en perfil público).

### Datos personales
- **Comunes**: nombre público, username, avatar, bio, correo electrónico.
- **Sensibles** (Art. 2.5 Ley 29733):
  - DNI (almacenamos hash + últimos 4 dígitos).
  - Documentos de verificación profesional (resoluciones, diplomas, constancias).
  - Datos biométricos (selfie de liveness — eliminada 30 días después de verificación).

### Datos de uso
- Logs de acceso (IP, User-Agent, timestamp) — retención 90 días.
- Logs de auditoría (acciones sensibles) — retención 2 años.
- Sesiones (cookies) — TTL 7 días, refresh con rotación.

---

## Principios técnicos

### 1. Defensa en profundidad
- **Capa de DB**: Row Level Security (RLS) en cada tabla con datos de usuario.
- **Capa de aplicación**: validación con Zod en cada endpoint, helpers de auth en cada Server Component que requiera sesión.
- **Capa de transporte**: HTTPS obligatorio (HSTS preload), TLS 1.2+.
- **Capa de cliente**: CSP estricta, X-Frame-Options DENY, sin storage de tokens en localStorage.

### 2. Mínimo privilegio
- La `anon key` y la `service_role key` están separadas. Solo Route Handlers server-side controlados usan `service_role`.
- Usuarios solo pueden leer/escribir sus propios datos (RLS).
- Datos sensibles (`perfiles_sensibles`, `audit.events`, `rate_limits`) **nunca** son accesibles desde el cliente — solo `service_role`.

### 3. Auditoría
- Cada operación sensible (login, verificación, cambio de perfil, exportación, eliminación) deja registro en `audit.events`.
- El log es append-only — no se modifica ni borra (excepto retención automática a los 2 años).

### 4. Cifrado
- DNI: SHA-256 antes de almacenar; solo guardamos los últimos 4 dígitos en claro para mostrar al usuario.
- Documentos en Storage: buckets privados, URLs firmadas con TTL corto.
- Selfies de liveness: hash + eliminación a los 30 días.

### 5. Anti-enumeración y anti-abuso
- Magic link: rate limit 3 intentos / 15 min por correo.
- Mensajes de error genéricos en login (no revelan si un correo está registrado).
- Captcha futuro: integrar Turnstile en endpoints de signup si hay abuso.

---

## Cumplimiento Ley 29733 — checklist

### Antes de aceptar primer usuario en producción

- [ ] **Inscribir banco de datos** en el Registro Nacional de Protección de Datos Personales (ANPD).
  - Autoridad Nacional de Protección de Datos Personales (ANPD), antes ANPDP.
  - Registro: https://www.gob.pe/9183
- [ ] **Designar Oficial de Protección de Datos** (cuando aplique según volumen de datos).
- [ ] **Política de privacidad versionada y publicada** (`docs/PRIVACIDAD.md`).
- [ ] **Términos y condiciones versionados y publicados** (`docs/TERMINOS.md`).
- [ ] **Procedimiento ARCO** documentado y endpoint funcional (`/api/me/export`, `/api/me/delete`).
- [ ] **Aviso de tratamiento** mostrado en formulario de registro.
- [ ] **Consentimiento granular** para marketing (default: NO marcado).
- [ ] **Encargado de tratamiento** firmado con cada proveedor (Supabase, Resend, Vercel) — DPA / acuerdo de procesamiento de datos.
- [ ] **Plan de respuesta a incidentes** documentado (sección abajo).

### Antes de cobrar (boletines, marketplace, pedidos colectivos)

- [ ] RUC activo (RUS o RER según volumen).
- [ ] Términos de servicio actualizados con cláusula de pagos.
- [ ] Cumplimiento de Ley 32104 (plataformas digitales).
- [ ] Política de devoluciones publicada.

### Permanente

- [ ] Revisión de logs de auditoría (semanal).
- [ ] Backup automático diario de la DB.
- [ ] Rotación de claves cada 90 días o ante sospecha.
- [ ] Pen-test anual (mínimo).

---

## Plan de respuesta a incidentes

### Detección
- Alertas en Supabase logs por queries anómalas.
- Monitoreo de tasa de errores en Vercel.
- Reportes de usuarios al canal `seguridad@qhapaqnan.pe`.

### Clasificación

| Severidad | Definición | Tiempo de respuesta |
|---|---|---|
| **Crítico** | Fuga de datos sensibles confirmada (DNI, documentos, biométricos) | Inmediato |
| **Alto** | Acceso no autorizado o escalación de privilegios | < 4 h |
| **Medio** | Vulnerabilidad explotable sin evidencia de explotación | < 24 h |
| **Bajo** | Fallo sin impacto en datos | < 7 días |

### Procedimiento (incidente crítico)

1. **Contención**: revocar credenciales comprometidas (rotar `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`).
2. **Evidencia**: snapshot de logs y tabla de auditoría.
3. **Notificación a usuarios afectados**: dentro de 72 horas (Art. 30 reglamento Ley 29733), por correo, con: qué pasó, qué datos se vieron afectados, qué medidas tomó la empresa, qué puede hacer el usuario.
4. **Notificación a la ANPD**: dentro de 72 horas.
5. **Postmortem público**: dentro de 30 días, en `docs/INCIDENTES.md`.

---

## Responsabilidades de quien contribuye al código

Si tu PR toca alguno de estos archivos, debe pasar por revisión de seguridad:

- `supabase/migrations/*` — cualquier cambio de RLS, schema, triggers.
- `src/middleware.ts` — auth + rate limiting.
- `src/lib/supabase/*` — clientes y configuraciones de Supabase.
- `src/lib/auth.ts` — helpers de sesión.
- `src/app/api/auth/*` — endpoints de autenticación.
- `src/app/api/me/*` — endpoints ARCO.
- `next.config.mjs` — headers de seguridad y CSP.

Antes de mergear:

- [ ] No exponer `SUPABASE_SERVICE_ROLE_KEY` en código del cliente.
- [ ] Validar todo input externo con Zod.
- [ ] Aplicar rate limiting a endpoints públicos.
- [ ] Loguear acción a `audit.events` si toca datos personales.
- [ ] No hacer logging de datos sensibles en `console.log` ni en Sentry.
- [ ] Probar como usuario anónimo y como usuario autenticado distinto al dueño.

---

## Reportar una vulnerabilidad

Si encuentras una vulnerabilidad, por favor **no la publiques**. Escribe a:

**seguridad@qhapaqnan.pe**

Si es crítica, marca el correo como "URGENTE - SEGURIDAD". Confirmaremos la recepción dentro de 48 h y te mantendremos al tanto del proceso.

Reconocemos públicamente a quienes reporten vulnerabilidades responsablemente (con su consentimiento) en `docs/AGRADECIMIENTOS.md`.

---

*Versión 0.1 · Abril 2026. Este documento debe revisarse antes del lanzamiento público y luego anualmente.*
