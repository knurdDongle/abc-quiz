import { AppContainer } from 'react-hot-loader';
import React from 'react';
import { render } from 'react-dom';
import css from './scss/app.scss';
import App from './components/App';

const rootEl = document.getElementById('root');
const renderApp = Component =>
  render(
    <AppContainer>
      <Component />
    </AppContainer>,
    rootEl,
  );

renderApp(App);
if (module.hot) module.hot.accept('./components/App', () => renderApp(App));
