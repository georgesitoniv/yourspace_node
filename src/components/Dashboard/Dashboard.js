import React from 'react';
import * as firebase from 'firebase';
import { Layout, Button, notification } from 'antd';

import DashboardMenu from './DashboardMenu';
import ChatContainer from './ChatContainer';
import FriendList from './FriendList';

const { Header, Content } = Layout;

const signOut = (message, description) => {
  firebase.auth().signOut()
    .then(() => {  
      notification.open({ message, description})
    });
}

class Dashboard extends React.Component{
  constructor(props){
    super(props);
    this.state = { currentTab: 'chats'}
  }

  handleMenuClick = (e) => {
    if(e.key == 'signout'){
      signOut('Signed Out', 'You have successfully signed out.');
    } else {
      this.setState({
        currentTab: e.key
      });
    }
  }

  getTabContent = () =>{
    switch(this.state.currentTab){
      case 'chats':
        return <ChatContainer/>;
      case 'friends':
        return <FriendList/>;
      case 'users':
        return <FriendList/>;
      default:
        return <div></div>
    }
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

export default Dashboard;