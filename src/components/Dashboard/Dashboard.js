import React from 'react';
import * as firebase from 'firebase';
import { Layout, Button, notification } from 'antd';

import DashboardMenu from './DashboardMenu';
import ConversationContainer from './Conversation/ConversationContainer';
import FriendList from './FriendList';
import { notifyUser } from '../_utils/utils';
import { connect } from 'react-redux';
import { signOut } from '../../actions';

const { Header, Content } = Layout;

class Dashboard extends React.Component{
  constructor(props){
    super(props);
    this.state = { currentTab: 'chats'}
  }

  handleMenuClick = (e) => {
    if(e.key == 'signout'){
      this.signOut('Signed Out', 'You have successfully signed out.');
    } else {
      this.setState({
        currentTab: e.key
      });
    }
  }

  getTabContent = () =>{
    switch(this.state.currentTab){
      case 'chats':
        return <ConversationContainer/>;
      case 'friends':
        return <FriendList/>;
      case 'users':
        return <FriendList/>;
      default:
        return <div></div>
    }
  }

  signOut = (message, description) => {
    firebase.auth().signOut()
      .then(() => {  
        notifyUser(message, description);
        this.props.signOut();
      });
  }
  
  render(){
    return(
      <div>
        <Layout className="fullscreen">
          <Header>
            <DashboardMenu 
              handleClick={this.handleMenuClick} 
              selectedKeys={this.state.currentTab}/>
          </Header>
          <Content className="fullscreen bg-white">
            {this.getTabContent()}
          </Content>
        </Layout>
      </div>
    );
  }
}

export default connect(null, {signOut})(Dashboard);