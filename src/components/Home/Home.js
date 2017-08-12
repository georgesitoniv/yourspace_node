import React from 'react';
import SignUpForm from './SignUpForm';
import LogInForm from './LogInForm';

const Home = (props) => {
  return (
    <div>
      <div className="row">
        <div className="container">
          <div className="col col-xs-12 col-md-6">
            <h2>Sign Up</h2>
            <SignUpForm/>
          </div>
          <div className="col col-xs-12 col-md-6">
            <h2>Log In</h2>
            <LogInForm/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;