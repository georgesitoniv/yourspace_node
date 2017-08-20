import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { 
  createConversation,
  fetchConversationMembers,
  listenToUserConversations,
  setCurrentConversation,
  setCurrentConversationMembers,
  setIsConversationNew
} from '../../../actions';
import { Button, Card } from 'antd';
import fbUtils from '../../../firebase/utils';

class ConversationsList extends React.Component{
  constructor(props){
    super(props);
    fbUtils.fetchAuthenticatedUser()
      .then(user => {
        props.listenToUserConversations(user.key, 15);
      });
  }

  handleNewMessage = () => {
    this.props.createConversation();
    this.props.setCurrentConversationMembers({});
    this.props.setIsConversationNew(true);
  }

  handleSelectConversation = (conversationKey) => {
    this.props.setCurrentConversation(conversationKey);
    this.props.setIsConversationNew(false);
  }

  renderConversations(){  
    const { userConversations } = this.props;
    if(Object.keys(userConversations).length > 0){
      return _.map(userConversations, conversation => {
        const isTitleLong = conversation.title.length > 20;
        
        return(
          <Card 
            className="conversation-instance"
            key={conversation.key} 
            onClick={() => this.handleSelectConversation(conversation.key)}>
            <p>{isTitleLong? `${conversation.title.slice(0, 20)}...`:conversation.title}</p>
            <p>{conversation.messageContent}</p>
          </Card> 
        );
      });
    } else {
      return(
        <div className="margin-5 text-center">
          No Messages
        </div>
      )
    }
  }

  render(){
    return(
      <div>
        <div className="text-center">
          <Button className="margin-5" 
            onClick={this.handleNewMessage}>
            New Chat
          </Button>
        </div>
        {this.renderConversations()}
      </div>
    );
  }
}

const mapStateToProps = ({ userConversations }) => { 
  return { userConversations } 
};

export default connect(mapStateToProps, { 
  createConversation,
  listenToUserConversations,
  fetchConversationMembers,
  setCurrentConversation,
  setCurrentConversationMembers,
  setIsConversationNew
})(ConversationsList);