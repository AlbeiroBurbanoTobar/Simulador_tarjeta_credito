import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { calcularCuotas } from './components/CreditSimulator';

const llenarFormulario = (monto, cuotas, tasa) => {
  userEvent.type(screen.getByLabelText(/monto total/i), monto);
  userEvent.type(screen.getByLabelText(/número de cuotas/i), cuotas);
  userEvent.type(screen.getByLabelText(/tasa de interés/i), tasa);
  userEvent.click(screen.getByRole('button', { name: /calcular/i }));
};

test('acepta montos de un millón o más y formatea con puntos', () => {
  render(<App />);
  llenarFormulario('1200000', '6', '2');

  expect(screen.getByLabelText(/monto total/i)).toHaveValue('1.200.000');
  expect(screen.getByText('Plan de Pagos')).toBeInTheDocument();
  // 6 cuotas + encabezado
  expect(screen.getAllByRole('row')).toHaveLength(7);
  expect(screen.getAllByText('$200.000').length).toBeGreaterThan(0);
});

test('muestra un error con 0 cuotas', () => {
  render(<App />);
  llenarFormulario('600000', '0', '2');

  expect(screen.getByRole('alert')).toHaveTextContent(/número de cuotas/i);
  expect(screen.queryByText('Plan de Pagos')).not.toBeInTheDocument();
});

test('limpiar borra el formulario y el plan', () => {
  render(<App />);
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
