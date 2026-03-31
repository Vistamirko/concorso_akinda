import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SCRAPER.HUB branding', () => {
  render(<App />);
  const linkElement = screen.getByText(/SCRAPER/i);
  expect(linkElement).toBeInTheDocument();
});
