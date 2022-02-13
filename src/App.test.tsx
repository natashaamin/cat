import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import ReactDOM from 'react-dom';

test('renders no search found', () => {
  render(<App />);
  const noSearchFound = <p>No search found</p>;
  expect(noSearchFound).toBeInTheDocument();

});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});