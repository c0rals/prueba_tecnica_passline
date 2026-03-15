# Reporte de bugs / hallazgos — Book Store

## 1. Eliminación de ítem del carrito puede borrar el elemento incorrecto

| Campo 					| Contenido 
|---------------------------|-------------------------------------------------------------------------------------------------------------------------
| **Título** 				| 	Eliminación de ítem del carrito puede borrar el elemento incorrecto 
| **Descripción** 			| 	Al tener mas de un libro en el carrito y decidir borrar el primero (el de mas arriba en la lista), se borra el ultimo de la 									lista y el resto permanece
| **Pasos para reproducir** | 	1. Iniciar sesión como cliente. 
								2. Agregar al carrito al menos dos libros (A y B, en ese orden). 
								3. Intentar eliminar del carrito el **primero** (A) usando el botón "Remove" de ese ítem. 
								4. Observar el carrito tras la redirección. 
| **Resultado esperado** 	| 	Se elimina solo el ítem A; el ítem B permanece en el carrito. 
| **Resultado observado** 	| 	Se elimina el **último** ítem (B); el ítem A permanece. 
| **Severidad estimada** 	| 	Alta 
| **Impacto de negocio** 	|	El usuario pierde el producto que quería conservar y puede quedar con uno que no deseaba; pérdida de confianza y soporte. 
| **Mitigación** 			| 	Corregir y verificar el indice con el que se selecciona el elemento a borrar 

---

## 2. Registrar nuevo usuario muestra un fallo pero agrega al usuario → estado inconsistente

| Campo 					| Contenido 
|---------------------------|-------------------------------------------------------------------------------------------------------------------------
| **Título** 				| 	Registrar nuevo usuario muestra un fallo pero agrega al usuario→ estado inconsistente
| **Descripción** 			| 	Al intentar enrolar un nuevo usuario, la pagina muestra "Internal Server Error" pero el usuario es creado de todos modos
| **Pasos para reproducir** | 	1. Ingresar a Login → register
								2. Completar el formulario de registro con datos válidos y enviar. 
								3. Observar respuesta y estado en la base de datos
| **Resultado esperado** 	| 	O bien el usuario no se crea hasta no confirmar el envío del email, o bien se crea y se informa al usuario aunque el email 										falle. No debería mostrarse "Internal Server Error" dejando al usuario ya creado
| **Resultado observado** 	| 	Usuario creado en DB; el cliente ve "Internal Server Error" y puede reintentar registro con el mismo email (luego "Email is 									already Registered"). 
| **Severidad estimada** 	| 	Media 
| **Impacto de negocio** 	| 	Daño reputacional y posible incumplimiento de buenas prácticas de seguridad. 
| **Mitigación** 			| 	Eliminar el `value` del input de contraseña en login (siempre vacío) o usar solo variables que nunca contengan secretos (p. ej. 								`email` desde `newUser` para rellenar solo el email en caso de error). Revisar todas las vistas que muestran formularios con 									datos de usuario para no exponer `password`. |


---

## 3. Riesgo: sin rate limiting en login (brute force)

| Campo 					| Contenido 
|---------------------------|-------------------------------------------------------------------------------------------------------------------------
| **Título** 				| 	Riesgo: sin rate limiting en login (brute force) 
| **Descripción** 			| 	Login no aplica límite de intentos por IP ni por cuenta. Un atacante puede probar muchas contraseñas o muchas cuentas sin restricción. 
| **Pasos para reproducir** | 	1. Enviar muchas peticiones POST a `/users/login` con distintas contraseñas (o la misma) desde la misma IP o desde varias. 
								2. Observar que el servidor sigue respondiendo sin bloqueo ni retraso. 
| **Resultado esperado** 	| 	Tras N intentos fallidos (por IP o por cuenta), el sistema limita o bloquea temporalmente más intentos (rate limiting o lockout). 
| **Resultado observado** 	| 	No hay limitación; se pueden realizar intentos ilimitados. 
| **Severidad estimada** 	| 	Media (riesgo de seguridad; impacto depende de exposición y robustez de contraseñas).
| **Impacto de negocio** 	| 	Cuentas comprometidas por fuerza bruta; posible uso fraudulento (compras, acceso admin si se adivina una contraseña débil). |
| **Mitigación** 			| 	Añadir rate limiting (p. ej. express-rate-limit) en la ruta de login (y opcionalmente en registro). Considerar bloqueo temporal 								o captcha tras X intentos fallidos.

---

## 4. Editar precio: validación de monto rechaza valores válidos

| Campo 					| Contenido 
|---------------------------|-------------------------------------------------------------------------------------------------------------------------
| **Título** 				| 	Editar precio: validación de monto rechaza valores válidos 
| **Descripción** 			| 	El input del precio en el formulario de libro, si el precio actual es decimal (p. ej. 99.99), los únicos valores considerados válidos son 99.99, 								 100.99, 101.99, … (incrementos de 1). Por tanto el valor **100** no es aceptado y el navegador muestra la alerta nativa: “Ingrese un valor 									válido; los valores más cercanos son 99.99 y 100.99”. 
| **Pasos para reproducir** | 	1. Iniciar sesión como admin. 
								2. Editar un libro cuyo precio sea decimal (p. ej. 99.99 o 29.99). 
								3. Cambiar el precio a un número entero (p. ej. 100 o 30) y enviar. 
								4. Observar la alerta del navegador antes de enviar el formulario. 
| **Resultado esperado** 	| 	Cualquier precio numérico válido (entero o decimal, p. ej. 100, 99.99, 34.50) se acepta y guarda correctamente. 
| **Resultado observado** 	| 	El navegador bloquea el envío y muestra que debe ingresar un valor válido, sugiriendo los “más cercanos” (99.99 y 100.99 cuando se intenta 100). 
| **Severidad estimada** 	| 	Media
| **Impacto de negocio** 	| 	El admin no puede fijar precios redondos (100, 50, etc.) ni muchos decimales; experiencia confusa y catálogo con precios 										limitados de forma artificial. 		
| **Mitigación** 			| 	Corregir el valor para poder ingresar cualquier decimal de dos digitos despues de la coma y numeros enteros


---