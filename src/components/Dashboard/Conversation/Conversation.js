import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { sendMessage, sendNewMessage } from '../../../actions';
import { Layout, Input, Button, Card } from 'antd';
import fireUtils from '../../../firebase/utils';
import moment from 'moment';

import ConversationMembers from './ConversationMembers';
import ConversationMessages from './ConversationMessages';

const { Content, Header, Footer } = Layout;
const { TextArea } = Input;

class Conversation extends React.Component{
  constructor(props){
    super(props);
    this.state = { messageContent: '', limit: 50};
  }

  isMessageValid = () => {
    const { conversationMembers } = this.props;
    const { messageContent } = this.state;
    if(Object.keys(conversationMembers).length > 0){
      if(messageContent.length > 0){
        return true;
      }
    }
    return false;
  }

  handleSendCliked = () => {
    const { messageContent } = this.state;
    if(this.isMessageValid()){
      fireUtils.fetchAuthenticatedUser()
        .then(user => {
          console.log(user);
          const message = {
            messageContent: messageContent,
            sender: user,
            timestamp: new Date().getTime()
          };
          this.handleSendMessage(message, user);
        });
    }
  }

  handleSendMessage = (message, user) => {
    const { currentConversation, conversationMembers, sendMessage, sendNewMessage } = this.props;
    const members = { ...conversationMembers, [user.key]: user};
    if(currentConversation.isNew){
      sendNewMessage(currentConversation.key, message, members);
    } else {
      sendMessage(currentConversation.key, message, members);
    }
    this.setState({messageContent: ''});
  }

  handleMessageBoxChange = (e) => {
    this.setState({
      messageContent: e.target.value
    });
  }

  render(){
    const { currentConversation } = this.props;
    if(!currentConversation){
      return <div></div>
    }
    return(
      <Layout>
        <Header className="white chat-header">         
          <ConversationMembers />
        </Header>
        <Content className="bg-white chat-area">
          <ConversationMessages 
            limit={this.state.limit} 
            currentConversation={this.props.currentConversation}/>
        </Content>
        <Footer className="grey lighten-3">
          <TextArea rows="4" 
            value={this.state.messageContent} 
            onChange={this.handleMessageBoxChange}/>
          <div className="pull-right">
            <Button onClick={this.handleSendCliked}>
              Send
            </Button>
          </div>
        </Footer>
      </Layout>
    );
  }
}

const mapStateToProps = ({conversationMembers, currentConversation }) => {
   return { conversationMembers, currentConversation } 
  };

export default connect(mapStateToProps, {sendMessage, sendNewMessage})(Conversation);