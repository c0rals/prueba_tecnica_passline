# Smoke tests — Book Store

## Criterio de “sistema sano”

Se considera que el sistema **queda sano** después del deploy si se cumplen, como mínimo, estos criterios:

- La aplicación responde (no hay 5xx ni timeout en los puntos de entrada clave).
- Un usuario puede ver el catálogo (página principal de libros).
- Un usuario puede acceder a la pantalla de login.
- Las rutas sensibles (p. ej. panel admin) no están expuestas sin autenticación.
- El login con credenciales válidas funciona y la sesión se mantiene.
- Un administrador autenticado puede acceder al panel de administración.

## Qué se valida (checks)

| Check 					          | Descripción 																			                                | Riesgo si falla 											
|---------------------------|-----------------------------------------------------------------------------------|-----------------------------------------------
| **Catálogo carga**        | `GET /books` devuelve 200 y HTML con "Book Store". 									              | App caída o DB inaccesible; usuarios no ven la tienda. 	
| **Página de login**       | `GET /users/login` devuelve 200. | No se puede iniciar sesión. 						        |															
| **Admin protegido**       | `GET /admin` sin sesión devuelve 302 y redirige a `/users/login`. 					      | Panel admin expuesto sin autenticación. 				
| **Login funciona**        | `POST /users/login` con credenciales de admin devuelve 200/302 y establece sesión.| Autenticación rota (Passport, sesión, DB). 			
| **Panel admin con sesión**| `GET /admin` con cookie de sesión devuelve 200 y cuerpo con "Admin Panel". 			  | Admin no puede acceder al panel tras deploy. 

## Listado de checks (definición detallada)

### 1 La aplicación levanta y el catálogo carga

- **Qué se valida:** Que el endpoint que sirve la página principal del catálogo responde correctamente.
- **Cómo:** Petición `GET` a la ruta del catálogo (p. ej. `/books`, que es la home de la app).
- **Criterio de éxito:**
  - Código HTTP `200`.
  - Cuerpo de la respuesta es HTML (p. ej. contiene `<!DOCTYPE html` o similar) e incluye un indicador de la aplicación (p. ej. “Book Store”).
- **Criterio de fallo:** Código distinto de 200, timeout, o respuesta que no sea la página esperada (error 500, página en blanco, etc.).
- **Riesgo cubierto:** App caída, base de datos inaccesible o error en la ruta/template del catálogo; el usuario no podría ver la tienda.

### 2 Página de login carga

- **Qué se valida:** Que la pantalla de login está disponible y se renderiza.
- **Cómo:** Petición `GET` a la ruta de login (p. ej. `/users/login`).
- **Criterio de éxito:**
  - Código HTTP `200`.
  - Página de login visible (formulario con email y contraseña).
- **Criterio de fallo:** Código distinto de 200 o respuesta que no corresponda a la vista de login.
- **Riesgo cubierto:** Imposibilidad de iniciar sesión por fallo en la ruta o en la vista.

### 3 Panel admin está protegido (sin sesión)

- **Qué se valida:** Que el panel de administración no es accesible sin autenticación.
- **Cómo:** Petición `GET` a la ruta del panel admin (p. ej. `/admin`) **sin** enviar cookies de sesión.
- **Criterio de éxito:**
  - Código HTTP de redirección (p. ej. `301` o `302`).
  - Header `Location` apunta a la ruta de login (p. ej. contiene `/users/login`).
- **Criterio de fallo:** Código 200 mostrando el panel admin sin haber iniciado sesión (acceso no autorizado).
- **Riesgo cubierto:** Exposición del panel admin a usuarios no autenticados (fallo de middleware de autorización o de configuración de rutas).

### 4 Login funciona (autenticación y sesión)

- **Qué se valida:** Que el flujo de login con credenciales válidas termina en autenticación y establecimiento de sesión.
- **Cómo:** Petición `POST` a la ruta de login (p. ej. `/users/login`) con cuerpo `application/x-www-form-urlencoded` (email y contraseña de un usuario conocido, p. ej. admin del seed). Opcionalmente, comprobar que la respuesta incluye cabeceras de sesión (p. ej. `Set-Cookie`).
- **Criterio de éxito:**
  - Código HTTP `200` o `302` (redirección tras login exitoso).
  - En caso de usar comprobación de cookie: la respuesta incluye cookie de sesión (o equivalente) que permita identificar sesión autenticada en la siguiente petición.
- **Criterio de fallo:** 4xx/5xx, o respuesta que indique fallo de autenticación cuando las credenciales son correctas (p. ej. siempre redirect a login con mensaje de error).
- **Riesgo cubierto:** Autenticación rota (Passport, sesión, base de datos, contraseñas); nadie podría loguearse tras el deploy.

### 5 Panel admin responde con sesión de administrador

- **Qué se valida:** Que un usuario con rol admin, ya autenticado, puede acceder al panel de administración.
- **Cómo:** Tras un login exitoso (misma sesión), petición `GET` a la ruta del panel admin (p. ej. `/admin`) enviando la cookie de sesión (o el mismo mecanismo que use la app).
- **Criterio de éxito:**
  - Código HTTP `200`.
  - Cuerpo de la respuesta corresponde al panel de admin (p. ej. contiene texto como “Admin Panel” o “Books in Your Store”, listados de libros/usuarios/órdenes según la vista).
- **Criterio de fallo:** 302 a login (sesión no reconocida o rol incorrecto), 500, o contenido que no corresponda al panel admin.
- **Riesgo cubierto:** Administradores legítimos no pueden acceder al panel tras el deploy (problemas de sesión, roles o rutas).


---

