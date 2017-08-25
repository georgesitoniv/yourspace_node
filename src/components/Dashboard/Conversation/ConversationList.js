import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { 
  createConversation,
  setCurrentConversation,
  startUserConversationsListener
} from '../../../actions';
import { Button, Card } from 'antd';
import fireUtils from '../../../firebase/utils';

class ConversationsList extends React.Component{
  constructor(props){
    super(props);
    fireUtils.fetchAuthenticatedUser()
      .then(user => {
        props.startUserConversationsListener(user.key, 15);
      });
  }

  renderConversations(){  
    const { userConversations } = this.props;
    if(userConversations){
      if(Object.keys(userConversations).length > 0){
        return _.map(userConversations, messageMeta => {
          const isTitleLong = messageMeta.title.length > 20;
          return(
            <Card 
              className="message-meta-instance"
              key={messageMeta.key} 
              onClick={() => this.props.setCurrentConversation(messageMeta)}>
              <p>{isTitleLong? `${messageMeta.title.slice(0, 20)}...`:messageMeta.title}</p>
              <p>{messageMeta.messageContent}</p>
            </Card> 
          );
        });
      } 
    }
    return(
      <div className="margin-5 text-center">
        No Messages
      </div>
    );
  }

  render(){
    return(
      <div>
        <div className="text-center margin-5">
          <Button
            onClick={this.props.createConversation}>
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
  startUserConversationsListener,
  setCurrentConversation
})(ConversationsList);