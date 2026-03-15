# E2E Tests — Book Store (Selenium + Python)

## Flujo crítico automatizado

**Flujo cubierto (MVP)**: login de administrador y navegación por el catálogo.

Pasos cubiertos por el script:
1. Abrir `http://localhost:5050/books`.
2. Verificar que la página carga correctamente (título contiene “Book Store”).
3. Hacer clic en **Login** en el navbar.
4. Completar el formulario de login con:
   - `admin@bookstore.local`
   - `Password123!`
5. Enviar el formulario y esperar a que se verifique que aparece el nombre del usuario en el navbar.
6. Verificar que hay al menos unlibro en el catálogo.

## Riesgo cubierto por este E2E

- Cambios en autenticación que rompan el login del admin.
- Errores en las vistas de login o catálogo que impidan navegar o renderizar libros.
- Problemas de datos (seed no aplicada, fallos de conexión a la base) que dejen el catálogo vacío.

---

