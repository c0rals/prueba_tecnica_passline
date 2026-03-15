# Como ejecutar los test — Book Store

## Cómo levatar la aplicación

> Requisito: En la raíz del proyecto Node, icluir el archivo seed.js y carpeta tests (ambos incluidos en la raiz del repositorio entregado) 

**Levantar la aplicación**
-  En la raíz del proyecto Node, ejecutar:
     ```bash
     npm run seed
     npm start
     ```
- Asegúrate de que la app responde en `http://localhost:5050`.

## Cómo ejecutar los tests de API (Postman)

Archivos del test:
- `tests/api/book-store-api.postman_collection.json`
- `tests/api/book-store-local.postman_environment.json`

---

1. **Requisitos previos**
	- Postman instalado

2. **Ejecutar colección**
	1. Abrir Postman.
	2. Importar:
	   - la colección `tests/api/book-store-api.postman_collection.json`
	   - el environment `tests/api/book-store-local.postman_environment.json`
	3. Seleccionar el environment **“Book Store Local”**
	4. Ejecutar la colección (Run collection):
	   - Esto correrá los 4 requests definidos, que cubren 3 casos útiles:
	     - caso exitoso,
	     - caso negativo,
	     - flujo de negocio (login admin + acceso a `/admin`).

## Cómo ejecutar el test E2E (Selenium Puthon)

Archivo del test:
- `tests/e2e/test_login_and_browse.py`

---

1. **Requisitos previos**
   - Python 3 instalado
   - Paquete Selenium para Python
   - Driver del navegador (ejemplo: ChromeDriver para Google Chrome) instalado y disponible en el `PATH` o con ruta configurada en el script.

2. **Ejecutar el test Selenium**
   Desde la raíz del repositorio:

   ```bash
   python tests/e2e/test_login_and_browse.py
   ```
