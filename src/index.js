import './styles/styles.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'; 
import * as firebase from 'firebase';

import { config } from './server/firebase/index';
import reducers from './reducers';
import Routes from './routes';

if(!firebase.apps.length){
  firebase.initializeApp(config);  
}

const createStoreWithMiddleware = applyMiddleware()(createStore);

const Root = () => {
  return(
    <Provider store={createStoreWithMiddleware(reducers)}>
      <Routes/>
    </Provider>
  );
}

ReactDOM.render(<Root/>, document.querySelector('#root'));

