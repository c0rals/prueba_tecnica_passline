# API Tests — Book Store (Postman)

## Herramientas elegidas
- **Postman** para definir y ejecutar la colección de requests.

Archivos:
- Colección: `tests/api/book-store-api.postman_collection.json`
- Environment local: `tests/api/book-store-local.postman_environment.json`

## Endpoints cubiertos y razones

### 1. `GET /books` — Catálogo (caso exitoso)
- **Request en Postman**: `GET /books - catálogo (éxito)`
- **Tipo de caso**: exitoso.
- **Qué se valida**:
  - Status code `200 OK`.
  - El cuerpo contiene `<!DOCTYPE html` (indicio de render EJS correcto).
- **Por qué este endpoint**:
  - Es el **home del catálogo**, primera pantalla para usuarios.
  - Si falla, la aplicación “parece caída” incluso si el resto funciona.
- **Riesgo cubierto**:
  - Caída de la app o de MongoDB al listar libros.
  - Errores de plantilla que rompen la vista inicial.

### 2. `GET /admin` sin login — Autorización (caso negativo)
- **Request en Postman**: `GET /admin sin login - autorización (negativo)`
- **Tipo de caso**: validación negativa / error.
- **Qué se valida**:
  - Si no hay sesión activa, la respuesta es un redirect (`301` o `302`).
  - El header `Location` contiene `/users/login`.
- **Por qué este endpoint**:
  - El panel de admin expone datos y acciones sensibles (usuarios, pedidos, gestión de libros).
  - Es crítico asegurar que nadie sin autenticación pueda entrar.
- **Riesgo cubierto**:
  - Fallos en `checkAuthentication`/`checkAuthorization` que permitan acceso sin login.
  - Rutas mal configuradas que expongan el dashboard de admin.

### 3. Flujo admin: login + acceso a `/admin` — Caso de negocio / regresión

Este flujo se implementa con **dos requests secuenciales** en la colección:

1. **`Login admin`** (`POST /users/login`)  
   - Envía `email={{adminEmail}}` y `password={{adminPassword}}` como `x-www-form-urlencoded`.
   - **Tests**:
     - El status es `200/301/302` (Passport redirige tras login exitoso).

2. **`GET /admin con sesión admin`**  
   - Usa la cookie de sesión almacenada por Postman tras el login anterior.
   - **Tests**:
     - El status es `200 OK`.
     - El cuerpo incluye la palabra `Admin` (indicador de dashboard).

- **Tipo de caso**: escenario de negocio / regresión.
- **Por qué este flujo**:
  - Representa la capacidad del administrador de entrar al sistema y ver el panel operativo.
  - Combina autenticación + autorización + render de vista protegida, zona de alto riesgo de regresiones.
- **Riesgo cubierto**:
  - Cambios en Passport/sesión que rompan el login de usuarios admin.
  - Middlewares que bloqueen incluso a admins válidos.
  - Errores en la ruta o vista de `/admin` (500 en dashboard).

---

