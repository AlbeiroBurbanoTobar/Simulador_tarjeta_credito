import React, { useState } from "react";

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
 * Componente principal para simular créditos con tarjeta de crédito.
 */
const CreditSimulator = () => {
  const [montoTotal, setMontoTotal] = useState("");
  const [numCuotas, setNumCuotas] = useState("");
  const [tasaInteres, setTasaInteres] = useState("");
  const [planPagos, setPlanPagos] = useState(null);

  /**
   * Maneja el envío del formulario y calcula el plan de pagos.
   * @param {Object} e - Evento de envío del formulario.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const plan = calcularCuotas(
      parseFloat(montoTotal),
      parseInt(numCuotas, 10),
      parseFloat(tasaInteres)
    );
    setPlanPagos(plan);
  };

  return (
 <div className="credit-simulator">
      <h1>Simulador de Crédito</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Monto Total:</label>
          <input
            type="number"
            value={montoTotal}
            onChange={(e) => setMontoTotal(e.target.value)}
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
                  <td>${cuota.valorCuota}</td>
                  <td>${cuota.abonoCapital}</td>
                  <td>${cuota.intereses}</td>
                  <td>${cuota.saldo}</td>
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
