import { render, screen } from '@testing-library/react';
import App from './App';

test('renders title', () => {
  render(<App />);
  const linkElement = screen.getByText(/The 4 Quadrants Bar Chart: Sports Injury Example/i);
  expect(linkElement).toBeInTheDocument();
});
