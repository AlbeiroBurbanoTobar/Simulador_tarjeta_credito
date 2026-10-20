import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { calcularCuotas } from './components/CreditSimulator';
import { eaAMensual } from './services/tasas';

// Respuestas simuladas de datos.gov.co para no depender de la red
const respuestaApi = (url) => {
  if (url.includes('pare-7x5i')) {
    return [{
      vigencia_desde: '2026-10-01T00:00:00.000',
      vigencia_hasta: '2026-10-31T00:00:00.000',
      interes_bancario_corriente: '19.06%',
      modalidad: 'CONSUMO Y ORDINARIO',
    }];
  }
  if (url.includes('max%28fecha_corte%29')) {
    return [{ corte: '2026-10-09T00:00:00.000' }];
  }
  return [
    { nombre_entidad: 'Banco Uno', tasa_ea: '18.0' },
    { nombre_entidad: 'Banco Dos', tasa_ea: '28.56' },
  ];
};

beforeEach(() => {
  global.fetch = jest.fn((url) =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(respuestaApi(url)) })
  );
});

afterEach(() => {
  delete global.fetch;
});

// Renderiza la app y espera a que carguen las tasas de referencia
const renderApp = async () => {
  render(<App />);
  await screen.findByRole('option', { name: /banco uno/i });
  await screen.findByText(/tasa de usura vigente/i);
};

const llenarFormulario = (monto, cuotas, tasa) => {
  userEvent.type(screen.getByLabelText(/monto total/i), monto);
  userEvent.type(screen.getByLabelText(/número de cuotas/i), cuotas);
  userEvent.type(screen.getByLabelText(/tasa de interés/i), tasa);
  userEvent.click(screen.getByRole('button', { name: /calcular/i }));
};

test('acepta montos de un millón o más y formatea con puntos', async () => {
  await renderApp();
  llenarFormulario('1200000', '6', '2');

  expect(screen.getByLabelText(/monto total/i)).toHaveValue('1.200.000');
  expect(screen.getByText('Plan de Pagos')).toBeInTheDocument();
  // 6 cuotas + encabezado
  expect(screen.getAllByRole('row')).toHaveLength(7);
  expect(screen.getAllByText('$200.000').length).toBeGreaterThan(0);
});

test('muestra un error con 0 cuotas', async () => {
  await renderApp();
  llenarFormulario('600000', '0', '2');

  expect(screen.getByRole('alert')).toHaveTextContent(/número de cuotas/i);
  expect(screen.queryByText('Plan de Pagos')).not.toBeInTheDocument();
});

test('limpiar borra el formulario y el plan', async () => {
  await renderApp();
  llenarFormulario('600000', '6', '2');
  userEvent.click(screen.getByRole('button', { name: /limpiar/i }));

  expect(screen.getByLabelText(/monto total/i)).toHaveValue('');
  expect(screen.queryByText('Plan de Pagos')).not.toBeInTheDocument();
});

test('el saldo cierra en 0 y los abonos suman el monto aunque no divida exacto', () => {
  const plan = calcularCuotas(1000000, 3, 2);

  expect(plan[plan.length - 1].saldo).toBe(0);
  expect(plan.reduce((acc, c) => acc + c.abonoCapital, 0)).toBe(1000000);
  plan.forEach((c) => expect(c.valorCuota).toBe(c.abonoCapital + c.intereses));
});

test('elegir un banco llena la tasa mensual con su tasa plena', async () => {
  await renderApp();
  userEvent.selectOptions(screen.getByLabelText(/banco/i), 'Banco Dos');

  expect(screen.getByLabelText(/tasa de interés/i)).toHaveValue(2.1156);
  expect(screen.getByText(/corte 09\/10\/2026/i)).toBeInTheDocument();
});

test('avisa cuando la tasa supera la usura', async () => {
  await renderApp();
  expect(screen.getByText(/2,12|2\.12/)).toBeInTheDocument();

  userEvent.type(screen.getByLabelText(/tasa de interés/i), '3');
  expect(screen.getByText(/supera la tasa de usura/i)).toBeInTheDocument();
});

test('si la API falla se puede ingresar la tasa a mano', async () => {
  global.fetch = jest.fn(() => Promise.reject(new Error('sin red')));
  render(<App />);

  expect(await screen.findByText(/no se pudieron cargar las tasas/i)).toBeInTheDocument();
  llenarFormulario('600000', '6', '2');
  expect(screen.getByText('Plan de Pagos')).toBeInTheDocument();
});

test('convierte efectiva anual a mensual vencida', () => {
  expect(eaAMensual(12.68250301)).toBeCloseTo(1, 6);
});
