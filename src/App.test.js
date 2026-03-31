import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login button', () => {
  render(<App />);
  const linkElement = screen.getByText(/ACCEDI ORA/i);
  expect(linkElement).toBeInTheDocument();
});
