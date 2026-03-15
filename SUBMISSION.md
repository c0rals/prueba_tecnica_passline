# Resumen del MVP

## Link del repositorio

- `https://github.com/c0rals/prueba_tecnica_passline.git`

---

## Stack o herramientas elegidas 

- Api testing: Postman
- e2e testing: Selenium en Python
- CI/CD 	 : GitHub

---

## Setup y ejecución

> Requisito: En la raíz del proyecto Node, icluir el archivo seed.js y carpeta tests (ambos incluidos en la raiz del repositorio entregado) 

**Levantar la aplicación**
-  En la raíz del proyecto Node, ejecutar:
     ```bash
     npm run seed
     npm start
     ```
- Asegúrate de que la app responde en `http://localhost:5050`.

**Requisitos previos**
   - Postman instalado
   - Python 3 instalado
   - Paquete Selenium para Python
   - Driver del navegador (ejemplo: ChromeDriver para Google Chrome) instalado y disponible en el `PATH` o con ruta configurada en el script.

---

## Decisiones principales y priorización

- Para el caso de la Test Strategy, lo inicial fue elegir el scope que se debia abarcar para crear el MVP. La cobertura del Happy Path y la definición de que se dejaria fuera eran las tareas mas importantes y dependian de los test que fallando producirian mas problemas al negocio.

- Para la creación de la automatización de pruebas de API, solo elegí tres casos simples (y clasicos para este tipo de aplicaciones) que cubren y poseen mayor valor para la cobertura. Estos son utilizados frecuentemente en tests mas complejos en el futuro.

- Para el e2e, elegí una de las herramientas que mejor manejo y posee una velocidad considerable al momento de ejecutar. Cubri lo mas basico que generaba mas valor: login y verificación de un item.

- En base a la definición de los riesgos, el Smoke test tomó forma por si solo. Si bien el definir un sistema "sano" deberia ser lo inicial, en este caso (y para acortar el tiempo de creación), lo definí luego de tener claro lo peligros de cada componente. Esto posible ya que la aplicación es pequeña pero normalmente debería ser al reves.

- El reporte de bugs fue lo mas facil. Luego de explorar durante la creación de los otros items, ya tenia claro cuales eran las falencias de laa aaplicación. De todas formas consulte con una IA para verificar la existencia de otros bugs pero no incluí los que no fui capaz de comprobar.

---

## Que hacer con mas tiempo

- Casos de **checkout y creación de orden**.
- Casos de **CRUD de libros** (crear/editar/borrar libro desde las rutas protegidas de admin).
- Casos de **comentarios** (crear/editar/borrar).
- Actualizar constantemente la definición de DONE en caso de que la aplicación crezca

---
