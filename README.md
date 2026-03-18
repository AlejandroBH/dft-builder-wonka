# DTF Gang Sheet Builder

🚀 **DTF Gang Sheet Builder** es una aplicación web avanzada que facilita la creación y composición de "gang sheets" (hojas de impresión múltiples) para estampados DTF (Direct to Film). 

Esta herramienta permite a los diseñadores y clientes subir sus propios diseños en PNG, organizarlos libremente en un lienzo interactivo (canvas), ajustar sus tamaños y opciones, para finalmente exportar la composición completa como un archivo PNG o PDF de alta resolución listo para enviarse a los equipos de impresión.

## ✨ Características Principales

- **Editor Visual en Canvas:** Área de trabajo interactiva donde puedes seleccionar, arrastrar, redimensionar y rotar elementos de forma fluida.
- **Gestión de Recursos:** Sube múltiples imágenes PNG manteniendo sus transparencias originales.
- **Panel de Propiedades:** Control granular y numérico para cada diseño seleccionado, permitiendo ajustar la posición (X, Y), escala y rotación de forma precisa.
- **Exportación de Calidad:** Genera el diseño final agrupado (Gang Sheet) en formatos estandarizados de la industria gráfica (PDF y PNG).
- **Interfaz Moderna:** Interfaz de usuario intuitiva compuesta por una barra de herramientas, un panel lateral de imágenes y un panel lateral de propiedades.

## 🛠️ Tecnologías Utilizadas

Este proyecto ha sido desarrollado utilizando un stack frontend moderno y optimizado:

- **[React 19](https://react.dev/):** Biblioteca estrella para la construcción asíncrona y basada en componentes de la interfaz de usuario.
- **[TypeScript](https://www.typescriptlang.org/):** Tipado estricto que asegura la robustez del código y previene errores en tiempo de desarrollo.
- **[Vite](https://vitejs.dev/):** Entorno de desarrollo ultra-rápido y empaquetador (bundler) optimizado.
- **[Tailwind CSS v4](https://tailwindcss.com/):** Framework de CSS utilitario para dar estilos de forma ágil, responsiva y altamente personalizable.
- **[Fabric.js v7](http://fabricjs.com/):** Librería líder de Canvas HTML5 para la manipulación y renderizado de objetos interactivos.
- **[jsPDF](https://github.com/parallax/jsPDF):** Solución para la generación de archivos PDF directamente desde el lado del cliente (Navegador).
- **[Zustand v5](https://github.com/pmndrs/zustand):** Herramienta minimalista y potente para la gestión del estado global de la aplicación.

## 📦 Instalación y Uso Local

Para ejecutar este proyecto en tu entorno local, sigue las siguientes instrucciones:

1. **Clona el proyecto o navega al directorio:**
   ```bash
   cd dft-builder-wonka
   ```

2. **Instala las dependencias necesarias:**
   Requiere Node.js.
   ```bash
   npm install
   ```

3. **Inicia el entorno de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación normalmente estará accesible en `http://localhost:5173`.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```
   Los archivos listos para producción se generarán en la carpeta `dist`.

## 📂 Arquitectura

El diseño interno sigue un enfoque altamente modular:
- Separación clara entre componentes de interfaz (React) y la manipulación intensiva del canvas (Fabric.js).
- Estados globales compartidos con Zustand para evitar *prop drilling* en árboles de componentes profundos.
- Utilización de Tailwind para una definición de estilos sistemática sin hojas de CSS dispersas.
