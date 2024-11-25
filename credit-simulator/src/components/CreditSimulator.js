import React, { useState } from "react";
import ReactTypingEffect from "react-typing-effect";
/**
 * Calcula el plan de pagos para una compra con tarjeta de crédito.
 *
 * @param {number} montoTotal - Monto total de la compra.
 * @param {number} numCuotas - Número de cuotas.
 * @param {number} tasaInteres - Tasa de interés mensual en porcentaje.
 * @returns {Array} Lista de objetos con la información de cada cuota.
 */

const calcularCuotas = (montoTotal, numCuotas, tasaInteres) => {
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

  const valorCapital = montoTotal / numCuotas;
  const planPagos = [];
  let saldo = montoTotal;

  for (let i = 1; i <= numCuotas; i++) {
    let intereses = 0;
    let valorCuota = 0;

    if (i === 1) {
      // Primera cuota: solo capital
      intereses = 0;
      valorCuota = valorCapital;
    } else if (i === 2) {
      // Segunda cuota: incluye intereses del primer y segundo mes
      const interesesPrimerMes = montoTotal * tasaDecimal;
      const interesesSegundoMes = (montoTotal - valorCapital) * tasaDecimal;
      intereses = interesesPrimerMes + interesesSegundoMes;
      valorCuota = valorCapital + intereses;
    } else {
      // Demás cuotas: incluye intereses del saldo
      intereses = saldo * tasaDecimal;
      valorCuota = valorCapital + intereses;
    }

    saldo -= valorCapital;

    planPagos.push({
      cuota: i,
      valorCuota: Math.round(valorCuota),
      abonoCapital: Math.round(valorCapital),
      intereses: Math.round(intereses),
      saldo: Math.round(saldo),
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
 * Componente principal para simular créditos con tarjeta de crédito.
 */
const CreditSimulator = () => {
  const [montoTotal, setMontoTotal] = useState("");
  const [numCuotas, setNumCuotas] = useState("");
  const [tasaInteres, setTasaInteres] = useState("");
  const [planPagos, setPlanPagos] = useState(null);

/**
   * Maneja el cambio en el campo "Monto Total" y formatea el valor.
   */
const handleMontoChange = (e) => {
  const formattedValue = formatNumber(e.target.value);
  setMontoTotal(formattedValue);
};


 /**
   * Maneja el envío del formulario y calcula el plan de pagos.
   */
 const handleSubmit = (e) => {
  e.preventDefault();

  // Elimina los puntos antes de realizar cálculos
  const montoTotalParsed = parseFloat(montoTotal.replace(/\./g, ''));

  const plan = calcularCuotas(
    montoTotalParsed,
    parseInt(numCuotas, 10),
    parseFloat(tasaInteres)
  );
  setPlanPagos(plan);
};

  return (
    <div className="credit-simulator">
      <ReactTypingEffect
        className="typing-header"
        text={["Simulador de Crédito"]}
        speed={150}
        eraseSpeed={80}
        typingDelay={300}
      />
      <br/>
      <br/>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Monto Total:</label>
          <input
            type="number"
            value={montoTotal}
            onChange={handleMontoChange}
            placeholder="Ingresa el monto"
            required
          />
        </div>
        <div>
          <label>Número de Cuotas:</label>
          <input
            type="number"
            value={numCuotas}
            onChange={(e) => setNumCuotas(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tasa de Interés Mensual (%):</label>
          <input
            type="number"
            value={tasaInteres}
            onChange={(e) => setTasaInteres(e.target.value)}
            required
          />
        </div>
        <button type="submit">Calcular</button>
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
                <td>${cuota.valorCuota.toLocaleString()}</td>
                <td>${cuota.abonoCapital.toLocaleString()}</td>
                <td>${cuota.intereses.toLocaleString()}</td>
                <td>${cuota.saldo.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default CreditSimulator;
