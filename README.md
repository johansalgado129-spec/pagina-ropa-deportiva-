# PULSO Active

Sitio web de catálogo de ropa deportiva, listo para alojarse en GitHub Pages. Está desarrollado con HTML, CSS y JavaScript; no requiere instalar dependencias ni ejecutar un proceso de compilación.

## Contenido

- `index.html`: página principal.
- `css/styles.css`: estilos y diseño adaptable.
- `js/app.js`: catálogo, búsqueda, filtros, favoritos, selección de tallas y carrito.
- `js/config.js`: configuración del WhatsApp de la tienda.
- `assets/favicon.svg`: ícono de marca.

## Cómo publicarlo en GitHub Pages

1. Crea un repositorio público en GitHub (por ejemplo, `pulso-active`).
2. Sube **los archivos y carpetas que contiene este ZIP** a la raíz del repositorio. El archivo `index.html` debe quedar en la raíz, no dentro de otra carpeta.
3. Abre **Settings → Pages** del repositorio.
4. En **Build and deployment**, elige **Deploy from a branch**.
5. Selecciona la rama `main`, la carpeta `/(root)` y pulsa **Save**.
6. Espera a que GitHub muestre el enlace de la página y entra a visitarlo.

## Personalización

**Nombre y textos:** en `index.html` puedes cambiar el nombre PULSO, los titulares y las secciones.

**Productos:** en `js/app.js`, edita el arreglo `products`. Cada artículo tiene nombre, categoría, precio, imagen, tallas, colores y descripción. Los precios son datos de muestra expresados en pesos colombianos.

**Recibir pedidos en WhatsApp:** en `js/config.js` reemplaza el valor vacío de `whatsapp` por el número de contacto **con indicativo de país, sin signo + ni espacios**, por ejemplo `57` seguido de los 10 dígitos de tu móvil. El botón del carrito enviará el resumen del pedido a ese chat. Si no configuras un número, el botón descargará el resumen en un archivo de texto.

**Imágenes:** las fotografías de referencia se cargan desde Pexels mediante URLs públicas. Necesitan conexión a internet. Antes de usar este catálogo para ventas reales, sustituye esas fotos por imágenes de tus productos y comprueba precios, stock, condiciones de envío y tallas. Los colores y precios aquí son ilustrativos y no constituyen una oferta de una tienda existente.

**Colores y tipografía:** cambia las variables de `:root` al inicio de `css/styles.css`.

## Funciones disponibles

- Diseño para móvil, tableta y computador.
- Navegación móvil y búsqueda de productos.
- Filtros por categoría y orden por precio o nombre.
- Favoritos guardados en el navegador.
- Vista rápida para elegir talla antes de comprar.
- Carrito con cantidades, eliminación de artículos y subtotal.
- Solicitud del pedido por WhatsApp cuando se configura un número.

El sitio es estático. No incluye cobros en línea, inventario en tiempo real, cuenta de usuario ni base de datos. Para aceptar pagos automáticos se necesita conectar un servicio de pagos y contar con un proceso de compra adecuado.

## Fotografías

Fotografías procedentes de Pexels (https://www.pexels.com/), ofrecidas bajo su licencia para uso gratuito en sitios web. Referencias de los originales utilizados:

- https://www.pexels.com/photo/woman-in-orange-sports-wear-running-9226723/
- https://www.pexels.com/photo/women-wearing-sports-bra-and-leggings-8483389/
- https://www.pexels.com/photo/muscular-man-wearing-sports-clothing-14756459/
- https://www.pexels.com/photo/gray-and-brown-backpack-on-brown-wooden-table-9391902/
- https://www.pexels.com/photo/a-woman-getting-ready-to-run-8454952/
- https://www.pexels.com/photo/woman-in-stylish-activewear-posing-in-studio-28774694/
- https://www.pexels.com/photo/fit-woman-in-sportswear-standing-in-studio-6453528/
- https://www.pexels.com/photo/portrait-of-a-man-at-a-gym-5878697/
- https://www.pexels.com/photo/man-in-tank-top-at-gym-20367859/
- https://www.pexels.com/photo/photo-of-two-models-wearing-activewear-clothes-8483358/
- https://www.pexels.com/photo/a-man-in-a-hoodie-sitting-at-the-gym-19790236/
- https://www.pexels.com/photo/photo-of-woman-posing-in-purple-sports-bra-and-black-leggings-8523574/

Las fotografías se utilizan como imágenes de ambiente y referencia visual; no implican que las personas fotografiadas representen la marca ni que las prendas tengan relación comercial con PULSO.
