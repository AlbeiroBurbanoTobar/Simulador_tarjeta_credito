/**
 * Consulta las tasas de interés publicadas por la Superintendencia Financiera
 * en el portal de datos abiertos datos.gov.co (API Socrata, sin autenticación).
 */

const API = "https://www.datos.gov.co/resource";
// Tasas de interés activas por tipo de crédito – últimos dos meses (corte semanal)
const DATASET_TASAS = "qzsc-9esp";
// Tasa de interés bancario corriente (certificación mensual)
const DATASET_TIBC = "pare-7x5i";

// Solo tarjetas de personas naturales, sin la tarjeta empresarial
const FILTRO_TARJETAS =
  "producto_de_cr_dito in ('Tarjeta de crédito para ingresos hasta 2 SMMLV', " +
  "'Tarjeta de crédito para ingresos superiores a 2 SMMLV') AND tipo_de_persona = 'Natural'";

/**
 * Convierte una tasa efectiva anual a mensual vencida.
 * @param {number} ea - Tasa efectiva anual en porcentaje.
 * @returns {number} Tasa mensual vencida en porcentaje.
 */
export const eaAMensual = (ea) => (Math.pow(1 + ea / 100, 1 / 12) - 1) * 100;

const consultar = async (dataset, params) => {
  const url = `${API}/${dataset}.json?${new URLSearchParams(params)}`;
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error(`datos.gov.co respondió ${respuesta.status}`);
  }
  return respuesta.json();
};

/**
 * Obtiene la tasa plena de tarjeta de crédito de cada banco en el último corte:
 * la tasa más alta que reportó. No se usa el promedio porque los bancos reportan
 * muchas compras con tasas promocionales (0 % a 0,5 % E.A.) que lo bajan muy por
 * debajo de lo que cobran en el extracto.
 *
 * @returns {Promise<{fechaCorte: string, bancos: Array<{nombre: string, tasaEA: number, tasaMV: number}>}>}
 */
export const obtenerTasasBancos = async () => {
  const [{ corte }] = await consultar(DATASET_TASAS, {
    $select: "max(fecha_corte) as corte",
    $where: FILTRO_TARJETAS,
  });

  const filas = await consultar(DATASET_TASAS, {
    $select: "nombre_entidad, max(tasa_efectiva_promedio) as tasa_ea",
    $where: `${FILTRO_TARJETAS} AND fecha_corte = '${corte}'`,
    $group: "nombre_entidad",
    $order: "nombre_entidad",
  });

  const bancos = filas.map((fila) => {
    const tasaEA = parseFloat(fila.tasa_ea);
    return { nombre: fila.nombre_entidad, tasaEA, tasaMV: eaAMensual(tasaEA) };
  });

  return { fechaCorte: corte.slice(0, 10), bancos };
};

/**
 * Obtiene la tasa de usura vigente para consumo, que es 1,5 veces
 * el interés bancario corriente certificado.
 *
 * @returns {Promise<{vigenciaDesde: string, vigenciaHasta: string, usuraEA: number, usuraMV: number}>}
 */
export const obtenerTasaUsura = async () => {
  const [fila] = await consultar(DATASET_TIBC, {
    $where: "modalidad = 'CONSUMO Y ORDINARIO'",
    $order: "vigencia_desde DESC",
    $limit: 1,
  });

  const usuraEA = parseFloat(fila.interes_bancario_corriente) * 1.5;
  return {
    vigenciaDesde: fila.vigencia_desde.slice(0, 10),
    vigenciaHasta: fila.vigencia_hasta.slice(0, 10),
    usuraEA,
    usuraMV: eaAMensual(usuraEA),
  };
};
