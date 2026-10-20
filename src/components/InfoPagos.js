import React from "react";
import {
  LuInfo,
  LuCreditCard,
  LuCalendar,
  LuTrendingDown,
  LuDollarSign,
} from "react-icons/lu";

const ITEMS = [
  {
    icono: LuCreditCard,
    titulo: "Primera Cuota",
    texto: "Pagas solo el valor a capital.",
  },
  {
    icono: LuCalendar,
    titulo: "Segunda Cuota",
    texto: "Pagas el valor a capital + los intereses del mes uno y del mes dos.",
  },
  {
    icono: LuTrendingDown,
    titulo: "A partir de la Tercera Cuota",
    texto:
      "La cuota disminuye mes a mes si no realizas nuevas compras, debido a que los intereses se liquidan sobre el saldo de la obligación.",
  },
  {
    icono: LuDollarSign,
    titulo: "Tercer Mes en Adelante",
    texto: "El valor de las cuotas corresponde al capital + los intereses de cada mes.",
  },
];

/**
 * Explica cómo se calcula cada cuota del plan de pagos.
 */
const InfoPagos = () => (
  <section className="info-pagos">
    <h2 className="info-pagos-titulo">
      <LuInfo aria-hidden="true" /> Información de Pagos
    </h2>
    <div className="info-pagos-grid">
      {ITEMS.map(({ icono: Icono, titulo, texto }) => (
        <div className="info-pagos-item" key={titulo}>
          <span className="info-pagos-icono">
            <Icono aria-hidden="true" />
          </span>
          <div>
            <h3>{titulo}</h3>
            <p>{texto}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default InfoPagos;
