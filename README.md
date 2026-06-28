# Sistema de pedidos QR V1

Base funcional para una webapp de menu digital para cafeteria/restaurante.

## Stack

- React + Vite
- TypeScript
- Tailwind CSS
- Datos locales sin backend ni base de datos
- Envio de pedido por WhatsApp Click-to-Chat

## Comandos de terminal

```bash
npx.cmd pnpm install = instala librerias del proyecto
npx.cmd pnpm dev = abre el proyecto en el servidor local
npx.cmd pnpm build = prepara el proyecto para su publicacion
npx.cmd pnpm lint = revisa el codigo en busca de posibles errores
```

## Donde editar

- `src/data/businessConfig.ts`: nombre del negocio, telefono de WhatsApp, delivery y metodos de pago.
- `src/data/menuData.ts`: categorias, productos, precios, imagenes y disponibilidad.
- `src/utils/whatsapp.ts`: formato del mensaje que recibe el negocio.
- `src/context`: estado del carrito.
- `src/pages`: vistas del flujo V1.
- `src/components`: piezas reutilizables de UI.

## Flujo incluido

1. Cliente abre el link o `/?table=3`.
2. Ve productos por categoria.
3. Agrega productos al carrito y cambia cantidades.
4. Elige mesa, delivery o pickup.
5. Completa datos requeridos.
6. Revisa el pedido.
7. Abre WhatsApp con el mensaje estructurado.
8. Ve confirmacion y puede iniciar otro pedido.

## Fuera de alcance en esta V1

No incluye login, panel admin, backend, pagos online, base de datos, POS,
analytics ni sistema SaaS multi-negocio.

Las funciones mencionadas enteriomente se estaran implementando a partir de la V2.
