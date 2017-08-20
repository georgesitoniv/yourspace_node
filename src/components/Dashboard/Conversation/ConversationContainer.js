import _ from 'lodash';
import React from 'react';
import * as firebase from 'firebase';
import { Layout, Table, Input, Button } from 'antd';

import Conversation from './Conversation';
import ConversationList from './ConversationList';

const { Sider, Content, Footer } = Layout;
const { TextArea } = Input;

const columns = [
  {
    title: 'Friends',
    dataIndex: 'email',
    key: 'email',
    render: text => <a href="#">{text}</a>,
  }
]

const getChatList = () => {
  const userRef = firebase.database().ref('users');
  return userRef.once('value').then(snap => {
    return snap.val();
  });
}

class ConversationContainer extends React.Component{
  constructor(props){
    super(props);
    this.state = { users: [] };
  }

  componentWillMount(){
    getChatList()
      .then(result => {
        const users = Object.keys(result).map((key, index) => {
          return {
            ...result[key],
            key
          }
        });
        this.setState({users});
      });
  }


  render(){
    return(
      <div>
        <Layout className="chat-container">
          <Sider className="bg-white sidebar-chat">
            <ConversationList/>
          </Sider>
          <Conversation/>
        </Layout>
      </div>
    );
  }
}

export default ConversationContainer;