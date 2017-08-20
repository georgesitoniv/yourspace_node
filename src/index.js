import './styles/styles.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'; 
import thunk from 'redux-thunk';
import * as firebase from 'firebase';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import { config } from './firebase/index';
import reducers from './reducers';
import Routes from './routes';

if(!firebase.apps.length){
  firebase.initializeApp(config);  
}

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const Root = () => {
  return(
    <LocaleProvider locale={enUS}>
      <Provider store={createStoreWithMiddleware(reducers)}>
        <Routes/>
      </Provider>
    </LocaleProvider>
  );
}

ReactDOM.render(<Root/>, document.querySelector('#root'));

