import React from 'react';
import * as firebase from 'firebase';
import fbUtils from '../../firebase/utils';

export default function (Component) {
  return class extends React.Component{
    constructor(props){
      super(props);
      firebase.auth().onAuthStateChanged(user => {
        if(!user){
          this.props.history.push('/');
        }
      })
    }

    render(){
      return <Component {...this.props}/>;
    }
  };
}