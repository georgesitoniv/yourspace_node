import _ from 'lodash';
import React from 'react';
import * as firebase from 'firebase';
import { Layout, Table, Input, Button } from 'antd';

import Chat from './Chat';
import ChatMembersModal from './ChatMembersModal';

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

class ChatContainer extends React.Component{
  constructor(props){
    super(props);
    this.state = { users: [], memberModalVisible: false};
  }

  showModal = () => {
    this.setState({
      memberModalVisible: true,
    });
  }
  
  handleOk = (e) => {
    console.log(e);
    this.setState({
      memberModalVisible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      memberModalVisible: false,
    });
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
            <Table columns={columns} dataSource={this.state.users}/>
            <Button onClick={this.showModal}>
              New Chat
            </Button>
          </Sider>
          <Chat/>
          <ChatMembersModal 
            visible={this.state.memberModalVisible} 
            handleCancel={this.handleCancel}
            handleOk={this.handleOk}/>
        </Layout>
      </div>
    );
  }
}

export default ChatContainer;