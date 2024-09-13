import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './data/store.ts';
import { DevSupport } from '@react-buddy/ide-toolbox';
import { ComponentPreviews, useInitial } from './dev';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <DevSupport ComponentPreviews={ComponentPreviews}
                  useInitialHook={useInitial}
      >
        <App/>
      </DevSupport>
    </Provider>
  </React.StrictMode>
);