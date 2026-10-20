# Simulador de Crédito

Simulador de cuotas para compras con tarjeta de crédito. Ingresas el monto de la compra, el número de cuotas y la tasa de interés mensual, y obtienes el plan de pagos mes a mes con el total pagado y el total de intereses.

## Funcionalidades

- Plan de pagos con valor de cada cuota, abono a capital, intereses y saldo.
- Resumen con el total pagado, el total de intereses y la cuota promedio.
- Montos con puntos de miles mientras escribes (por ejemplo, `1.200.000`).
- Validación de datos: el monto debe ser mayor que 0, las cuotas un entero de 1 o más y la tasa no puede ser negativa.
- Botón para limpiar el formulario.
- Cuadro informativo que explica cómo se calcula cada cuota.

## Cómo se calculan las cuotas

El capital se divide en partes iguales entre las cuotas. Los intereses se calculan así:

| Cuota | Qué pagas |
|---|---|
| 1 | Solo el abono a capital. |
| 2 | Abono a capital + intereses del mes 1 (sobre el monto total) + intereses del mes 2 (sobre el saldo). |
| 3 en adelante | Abono a capital + intereses del mes sobre el saldo pendiente. Como el saldo baja, la cuota también. |

Si la compra es a 1 cuota, no se cobran intereses. Los valores se redondean a pesos y la última cuota ajusta la diferencia para que el saldo termine en $0.

**Ejemplo:** $1.200.000 en 6 cuotas al 2,06 % mensual da un total pagado de $1.286.520, de los cuales $86.520 son intereses.

## Requisitos

- [Node.js](https://nodejs.org/) (probado con la versión 24)
- [pnpm](https://pnpm.io/) 12 (el proyecto fija la versión en `packageManager`; con Corepack se usa automáticamente: `corepack enable`)

## Instalación y uso

```bash
pnpm install
pnpm start
```

La app se abre en [http://localhost:3000](http://localhost:3000) y se recarga sola al guardar cambios.

## Scripts

| Comando | Descripción |
|---|---|
| `pnpm start` | Inicia el servidor de desarrollo. |
| `pnpm test` | Ejecuta los tests en modo interactivo. |
| `pnpm build` | Genera la versión de producción en la carpeta `build/`. |

## Estructura

```
src/
├── App.js                         # Composición de la página
├── App.css                        # Estilos
├── App.test.js                    # Tests
└── components/
    ├── CreditSimulator.js         # Formulario, cálculo y plan de pagos
    ├── InfoPagos.js               # Cuadro "Información de Pagos"
    ├── Footer.js                  # Autor y enlaces de contacto
    └── ParticlesBackground.js     # Fondo animado de partículas
```

## Tecnologías

- [React 18](https://react.dev/) con [Create React App](https://create-react-app.dev/)
- [react-icons](https://react-icons.github.io/react-icons/)
- [react-typing-effect](https://www.npmjs.com/package/react-typing-effect)

## Autor

**Albeiro J. Burbano Tobar**

- GitHub: [@AlbeiroBurbanoTobar](https://github.com/AlbeiroBurbanoTobar)
- Correo: [albeirojbt@gmail.com](mailto:albeirojbt@gmail.com)
