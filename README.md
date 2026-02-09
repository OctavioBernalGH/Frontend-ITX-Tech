# 📱 Zara Phone Store - Frontend Technical Test

Solución implementada para la prueba técnica de Frontend de Inditex. Se trata de una SPA (Single Page Application) desarrollada con **React** y **TypeScript**, enfocada en la arquitectura limpia, el rendimiento y una experiencia de usuario minimalista estilo "Zara".

## 🚀 Demo Desplegada
El proyecto se encuentra desplegado y accesible públicamente a través de AWS Amplify:

🔗 **[Ver Aplicación en Vivo](https://main.d23wb3tljmr2tj.amplifyapp.com/)**

---

## 🛠 Tech Stack

* **Core:** React 18, TypeScript, Vite.
* **Routing:** React Router DOM v6.
* **Estado Global:** React Context API (Carrito y Notificaciones).
* **Estilos:** CSS3 Nativo (Diseño Responsive y Minimalista).
* **Testing:** Vitest (Tests unitarios de lógica de negocio y servicios).
* **Despliegue:** AWS Amplify (CI/CD integrado).

---

## 🏗 Arquitectura y Características

El proyecto sigue una estructura de **Clean Architecture** para asegurar la escalabilidad:

1.  **Componentes:** Reutilizables y atomizados (`ProductItem`, `Header`, `Breadcrumbs`, etc.).
2.  **Servicios:** Capa de abstracción para la comunicación con la API (`productService.ts`) y gestión de caché local (`localStorage`).
3.  **Vistas:** Páginas principales separadas (`ProductList`, `ProductDetail`, `CartPage`, `NotFound`).
4.  **Custom Hooks:** Lógica encapsulada para SEO dinámico (`useSEO`) y optimización de búsquedas.
5.  **Enrutado:** Configuración de rutas de lado cliente para una navegación fluida sin recargas.
6.  **Estilado:** Hoja de estilos unificada en `index.css` siguiendo una línea de diseño "Fashion/Retail".

---

## ✅ Tests

Se han implementado tests unitarios para validar la robustez de los servicios críticos, incluyendo:
* Mocking de `fetch` y `localStorage`.
* Verificación de la lógica de caché (persistencia y expiración de 1 hora).
* Filtrado de productos (búsqueda por marca/modelo).

Ejecutar el proyecto:
```bash
npm start
```

Ejecutar los tests:
```bash
npm run test
```

