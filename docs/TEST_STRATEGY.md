# Test Strategy (MVP) — Book Store

## Alcance del sistema (visión rápida)

- **Autenticación / sesión**: login/register con Passport Local + cookie-session.
- **Catálogo**: listado de libros, detalle, CRUD de libros (admin).
- **Comentarios**: CRUD de comentarios asociado a un libro (propiedad del comentario).
- **Carrito / Checkout / Orden**: carrito en `User.carts`, cálculo de total, creación de `Order`.
- **Pago**: integración con Stripe (customer + charge).
- **Notificaciones**: emails por registro y por orden (Nodemailer).
- **Admin**: dashboard con métricas/listados (books/users/orders).

## Módulos/áreas principales del sistema
(basado en rutas y middleware)

- **`/users`**: registro, login/logout, dashboard, carrito, checkout, orden, historial.
- **`/books`**: home (catálogo), view (detalle + comentarios), new/edit/delete (admin).
- **`/books/:id/comments`**: alta/edición/borrado de comentarios.
- **`/admin`**: dashboard (admin-only).

- **Middleware**:
  - `checkAuthentication`: requiere sesión.
  - `checkAuthorization`: requiere rol `admin`.
  - `checkCommentOwnerShip`: autor del comentario.

- **Integraciones**:
  - Stripe: `STRIPE_SECRET_KEY` (pago).
  - SMTP: `EMAIL_SMTP_*` + `EMAIL_SENDER_ADDRESS` (correo).

## Flujos críticos de negocio

1. **Registro → Login** (creación de usuario + autenticación).
2. **Navegación catálogo → ver detalle** (listado y carga de detalle).
3. **Agregar al carrito → actualizar cantidades → checkout** (cálculo de total).
4. **Orden y pago**: crear orden, vaciar carrito, persistir Order.
5. **Admin**: acceso autorizado y operaciones CRUD de libros.
6. **Comentarios**: usuario autenticado crea comentario y se refleja en el detalle del libro.

## Riesgos principales

### Riesgos de negocio
- **Compra/orden**: errores en cálculo de total/moneda; orden creada sin pago real; inconsistencia entre carrito y orden.
- **Acceso admin**: exposición de acciones sensibles (crear/editar/borrar libros).
- **Pérdida de datos**: borrado de libro sin limpieza de referencias; comentarios “huérfanos”.
- **Emails**: fallas de SMTP bloquean registro/orden si no hay manejo robusto de errores.

### Riesgos técnicos / calidad
- **Dependencia de integraciones externas** (Stripe/SMTP) rompe tests si no se stubbea.
- **Validaciones insuficientes**: inputs malformados (precio, email, cantidades).
- **Sesión y autorización**: bypass de rutas protegidas; redirect “back” no determinista.
- **Concurrencia / consistencia**: carrito se modifica por update parcial; cantidades vienen de `req.body` con keys dinámicas.
- **Errores no manejados**: múltiples rutas hacen `console.log` y redirigen; poca observabilidad.

## Qué automatizar primero y por qué
1. **register/login**  
   - Alto impacto; precondición de carrito/checkout/admin; fácil de automatizar; reduce regresiones.

2. **Catálogo (GET list + GET view)**  
   - Core del producto; detecta caídas de DB/templates; bajo costo.

3. **Carrito + checkout (sin pago real)**  
   - Camino al revenue; riesgo de totales/cantidades; valida consistencia del carrito y cálculo.

4. **Admin (autorización + CRUD de libros)**  
   - Alto riesgo por privilegios; protege operaciones destructivas.

5. **Comentarios (crear/editar/borrar con ownership)**  
   - Valida permisos y relaciones Book↔Comment.

## Qué dejaría fuera del MVP
- **Pago real end-to-end con Stripe**: alto costo/flakiness; depende de credenciales/red; mejor stub en MVP.
- **Entrega real de emails**: depende de SMTP; validar “invocación”/payload es suficiente al inicio.
- **Cobertura exhaustiva de UI**: priorizar 1 E2E crítico + smoke; el resto por API para velocidad/estabilidad.
- **Performance/seguridad profunda**: dejar como “siguiente iteración” (básicos: rate limiting, OWASP, carga).

## Criterios de salida (Definition of Done) para un release (MVP)
- Smoke suite pasa.
- 0 tests (críticos) fallando en login, catálogo, carrito y admin.
- Evidencia y artefactos documentados accesibles para revisión.

---

