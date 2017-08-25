import React from 'react';
import { Field, reduxForm } from 'redux-form';
import validator from 'validator';
import * as firebase from 'firebase';
import { Input, Button, FormItem, Form, notification } from 'antd';
import FireEmailAuthentication from '../../firebase/emailAuthentication';

const validate = (values) => {
  const errors = {};
  if(!values.email){
    errors.email = 'Required';
  }
  if(!values.password){
    errors.password = 'Required';
  }
  if(!values.confirmPassword){
    errors.confirmPassword = 'Required';
  }
  if(String(values.password) !== String(values.confirmPassword)){
    errors.confirmPassword = 'Passwords does not match';
  }
  if(!validator.isEmail(String(values.email))){
    errors.email = 'Invalid email';
  }
  return errors;
};

const asyncValidate = (values) => {
  const userRef = firebase.database().ref().child('users')
  const emails = userRef.orderByChild('email').equalTo(values.email);
  return emails.once('value').then(snap => {
    if(snap){
      if(snap.val()){
        throw { email: 'Email already exists'};
      }
    }
  });
};

const renderField = ({
    input,
    label,
    type,
    meta: { asyncValidating, touched, error, warning }
  }) => {
  return (
    <div
      className={asyncValidating ? 'async-validating' : ''}
      >
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
}

class SignUpForm extends React.Component {
  constructor(props){
    super(props);
    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp(values) {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(
        values.email, 
        values.password
      ).then((user) => {
        return firebase.database().ref('users/' + user.uid).set({
          email: user.email
        });
      })
      .then(() =>{
        notification.open({
          message:'Well Done!',
          description: 'You have successfully registered.'
        });
        this.props.reset();
        resolve();
      })
      .catch(err => reject(err));
    });
  };

  render(){
    const { handleSubmit, submitting, reset } = this.props; 
    return (
      <Form onSubmit={handleSubmit(this.onSignUp)}>
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
        <Field
          name='confirmPassword'
          type='password'
          label='Confirm Password'
          component={renderField}
        />
        <div>
          <Button htmlType="submit" disabled={submitting}>
            Sign Up
          </Button>
        </div>
      </Form>
    );
  }
}

export default reduxForm({
  form: 'SignUpForm',
  validate,
  asyncValidate,
  asyncBlurFields: ['email']
})(SignUpForm);