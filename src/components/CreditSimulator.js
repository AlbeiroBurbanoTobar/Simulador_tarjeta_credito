import React, { useState } from "react";
import ReactTypingEffect from "react-typing-effect";
import { LuCalculator } from "react-icons/lu";
/**
 * Calcula el plan de pagos para una compra con tarjeta de crédito.
 *
 * @param {number} montoTotal - Monto total de la compra.
 * @param {number} numCuotas - Número de cuotas.
 * @param {number} tasaInteres - Tasa de interés mensual en porcentaje.
 * @returns {Array} Lista de objetos con la información de cada cuota.
 */

export const calcularCuotas = (montoTotal, numCuotas, tasaInteres) => {
  const tasaDecimal = tasaInteres / 100;

  if (numCuotas === 1) {
    return [
      {
        cuota: 1,
        valorCuota: montoTotal,
        abonoCapital: montoTotal,
        intereses: 0,
        saldo: 0,
      },
    ];
  }

  // Abono redondeado; la última cuota absorbe la diferencia para que el saldo cierre en 0
  const valorCapital = Math.round(montoTotal / numCuotas);
  const planPagos = [];
  let saldo = montoTotal;

  for (let i = 1; i <= numCuotas; i++) {
    const abonoCapital = i === numCuotas ? saldo : valorCapital;
    let intereses = 0;

    if (i === 1) {
      // Primera cuota: solo capital
      intereses = 0;
    } else if (i === 2) {
      // Segunda cuota: incluye intereses del primer y segundo mes
      const interesesPrimerMes = montoTotal * tasaDecimal;
      const interesesSegundoMes = saldo * tasaDecimal;
      intereses = interesesPrimerMes + interesesSegundoMes;
    } else {
      // Demás cuotas: incluye intereses del saldo
      intereses = saldo * tasaDecimal;
    }

    intereses = Math.round(intereses);
    saldo -= abonoCapital;

    planPagos.push({
      cuota: i,
      valorCuota: abonoCapital + intereses,
      abonoCapital,
      intereses,
      saldo,
    });
  }

  return planPagos;
};



/**
 * Formatea un número con puntos de miles.
 * @param {string} value - Valor ingresado.
 * @returns {string} Valor formateado con puntos de miles.
 */
const formatNumber = (value) => {
  // Elimina caracteres no numéricos
  const cleanValue = value.replace(/\D/g, '');
  // Formatea con puntos de miles
  return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Formatea un valor como moneda colombiana (puntos de miles, sin decimales).
 * @param {number} value - Valor a formatear.
 * @returns {string} Valor con signo de pesos.
 */
const formatMoneda = (value) =>
  `$${value.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;

/**
 * Valida los datos del formulario.
 * @returns {string|null} Mensaje de error o null si los datos son válidos.
 */
const validar = (monto, cuotas, tasa) => {
  if (!(monto > 0)) return "El monto total debe ser mayor que 0.";
  if (!Number.isInteger(cuotas) || cuotas < 1)
    return "El número de cuotas debe ser un entero mayor o igual a 1.";
  if (Number.isNaN(tasa) || tasa < 0)
    return "La tasa de interés no puede ser negativa.";
  return null;
};

/**
 * Componente principal para simular créditos con tarjeta de crédito.
 */
const CreditSimulator = () => {
  const [montoTotal, setMontoTotal] = useState("");
  const [numCuotas, setNumCuotas] = useState("");
  const [tasaInteres, setTasaInteres] = useState("");
  const [planPagos, setPlanPagos] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Actualiza un campo y descarta el plan calculado, que ya no corresponde a los datos.
   */
  const actualizar = (setter) => (value) => {
    setter(value);
    setPlanPagos(null);
    setError(null);
  };

/**
   * Maneja el cambio en el campo "Monto Total" y formatea el valor.
   */
const handleMontoChange = (e) => {
  actualizar(setMontoTotal)(formatNumber(e.target.value));
};


 /**
   * Maneja el envío del formulario y calcula el plan de pagos.
   */
 const handleSubmit = (e) => {
  e.preventDefault();

  // Elimina los puntos antes de realizar cálculos
  const montoTotalParsed = parseFloat(montoTotal.replace(/\./g, ''));
  const numCuotasParsed = Number(numCuotas);
  const tasaInteresParsed = parseFloat(tasaInteres);

  const mensajeError = validar(montoTotalParsed, numCuotasParsed, tasaInteresParsed);
  if (mensajeError) {
    setError(mensajeError);
    setPlanPagos(null);
    return;
  }

  const plan = calcularCuotas(
    montoTotalParsed,
    numCuotasParsed,
    tasaInteresParsed
  );
  setError(null);
  setPlanPagos(plan);
};

  /**
   * Limpia el formulario y el plan de pagos.
   */
  const handleReset = () => {
    setMontoTotal("");
    setNumCuotas("");
    setTasaInteres("");
    setPlanPagos(null);
    setError(null);
  };

  const totalPagado = planPagos?.reduce((acc, c) => acc + c.valorCuota, 0) ?? 0;
  const totalIntereses = planPagos?.reduce((acc, c) => acc + c.intereses, 0) ?? 0;

  return (
    <div className="credit-simulator">
      <ReactTypingEffect
        className="typing-header"
        text={["Simulador de Crédito", "Calculadora de Cuotas"]}
        speed={150}
        eraseSpeed={80}
        typingDelay={300}
      />
      <br/>
      <br/>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="montoTotal">Monto Total:</label>
          <input
            id="montoTotal"
            type="text"
            inputMode="numeric"
            value={montoTotal}
            onChange={handleMontoChange}
            placeholder="Ingresa el monto de la compra"
            required
          />
        </div>
        <div>
          <label htmlFor="numCuotas">Número de Cuotas:</label>
          <input
            id="numCuotas"
            type="number"
            min="1"
            step="1"
            value={numCuotas}
            placeholder="Ingresa el número de cuotas"
            onChange={(e) => actualizar(setNumCuotas)(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="tasaInteres">Tasa de Interés Mensual (%):</label>
          <input
            id="tasaInteres"
            type="number"
            min="0"
            step="any"
            value={tasaInteres}
            placeholder="Ingresa la tasa de interés mensual (m.v). Ejemplo: 2.06"
            onChange={(e) => actualizar(setTasaInteres)(e.target.value)}
            required
          />
        </div>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="acciones">
          <button type="submit">
            <LuCalculator aria-hidden="true" /> Calcular
          </button>
          <button type="button" className="secundario" onClick={handleReset}>
            Limpiar
          </button>
        </div>
      </form>

      {planPagos && (
        <div>
          <h2>Plan de Pagos</h2>
          <table>
            <thead>
              <tr>
                <th>Cuota</th>
                <th>Valor Cuota</th>
                <th>Abono a Capital</th>
                <th>Intereses</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
            {planPagos.map((cuota) => (
              <tr key={cuota.cuota}>
                <td>{cuota.cuota}</td>
                <td>{formatMoneda(cuota.valorCuota)}</td>
                <td>{formatMoneda(cuota.abonoCapital)}</td>
                <td>{formatMoneda(cuota.intereses)}</td>
                <td>{formatMoneda(cuota.saldo)}</td>
              </tr>
            ))}
          </tbody>

          </table>

          <dl className="resumen">
            <div>
              <dt>Total pagado</dt>
              <dd>{formatMoneda(totalPagado)}</dd>
            </div>
            <div>
              <dt>Total intereses</dt>
              <dd>{formatMoneda(totalIntereses)}</dd>
            </div>
            <div>
              <dt>Cuota promedio</dt>
              <dd>{formatMoneda(Math.round(totalPagado / planPagos.length))}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
};

export default CreditSimulator;
