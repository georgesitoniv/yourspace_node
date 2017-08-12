import React from 'react';
import {Field, reduxForm} from 'redux-form';
import * as firebase from 'firebase';
import validator from 'validator';
import {Form, Input, Button, notification} from 'antd';

const renderField = ({
    input,
    label,
    type,
    meta: { asyncValidating, touched, error, warning }
  }) => {
  return (
    <div className={asyncValidating ? 'async-validating' : ''}>
      <Input {...input} placeholder={label} type={type} />
      {touched &&
        ((error &&
          <span>
            {error}
          </span>) ||
          (warning &&
            <span>
              {warning}
            </span>))}
    </div>
  );
};

const validate = (values) => {
  const errors = {};
  if(!values.email){
    errors.email = 'Required';
  }
  if(!values.password){
    errors.password = 'Required';
  }
  if(!validator.isEmail(String(values.email))){
    errors.email = 'Invalid email';
  }
  return errors;
};

const handleLogInError = (errorCode) => {
  switch(errorCode){
    case 'auth/user-not-found':
      return 'User does not exists.'
    case 'auth/wrong-password':
      return 'Sorry, the password is incorrect.';
  };
}

class LogInForm extends React.Component{
  constructor(props){
    super(props);
    this.onLogIn = this.onLogIn.bind(this);
  }

  onLogIn(values) {
  return new Promise((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(values.email, values.password)
      .then((user) => {
        notification.open({
          message:'Welcome',
          description: 'You have successfully logged in.'
        });
        resolve();
      })
      .catch(err => {
        notification.open({
          message:'Ooops',
          description: handleLogInError(err.code)
        });
        reject(err)
      });
    });
  };

  render(){
    const { handleSubmit, submitting } = this.props;
    return(
      <Form onSubmit={handleSubmit(this.onLogIn)}>
        <Field
          name='email'
          type='text'
          label='Email'
          component={renderField}
        />
        <Field
          name='password'
          type='password'
          label='Password'
          component={renderField}
        />
        <div>
          <Button htmlType="submit" disabled={submitting}>
            Log In
          </Button>
        </div>
      </Form>
    );
  }
}

export default reduxForm({
  form: 'LogInForm',
  validate
})(LogInForm);