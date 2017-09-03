import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import createMiddleware from './middleware/clientMiddleware';
import { routerMiddleware } from 'react-router-redux';

export default function createStore(history, client, data) {
  console.log('-------create store--------01-----------');
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = routerMiddleware(history);
  console.log('-------create store--------02-----------');

  const middleware = [createMiddleware(client), reduxRouterMiddleware];
  console.log('-------create store--------03-----------');
  
  let finalCreateStore;
  if (__DEVELOPMENT__ && __CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('../containers/DevTools/DevTools');
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }
  
  const reducer = require('./modules/reducer');
  console.log(reducer);
  console.log('-------create store--------04-----------');
  const store = finalCreateStore(reducer, data);
  

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('./modules/reducer', () => {
      store.replaceReducer(require('./modules/reducer'));
    });
  }

  return store;
}
