import React from 'react';
import { connect } from 'react-redux';
import { startConversationMessagesListener, stopConversationMessagesListener } from '../../../actions';
import { Card } from 'antd';
import moment from 'moment';

class ConversationMessages extends React.Component{

  componentWillMount(){
    this.listenToConversationMessages(this.props);
  }

  componentWillUnmount(){
    const { currentConversation, stopConversationMessagesListener } = this.props;
    stopConversationMessagesListener(currentConversation.key);
  }

  componentWillUpdate(nextProps){
    if(this.checkIfComponentMustUpdate(this.props, nextProps)){
      nextProps.stopConversationMessagesListener(nextProps.currentConversation.key);
      this.listenToConversationMessages(nextProps);
    }
  }

  checkIfComponentMustUpdate = (currentProps, nextProps) => {
    if(currentProps.currentConversation.key != nextProps.currentConversation.key 
      || currentProps.limit != nextProps.limit){
        return true;
      }
    return false;
  }

  listenToConversationMessages = (props) => {
    const { currentConversation, limit, startConversationMessagesListener } = props;
    startConversationMessagesListener(currentConversation.key, limit);
  }

  renderMessages = () => {
    const { conversationMessages } = this.props;
    if(conversationMessages){
      return Object.keys(conversationMessages).map((key, index) => {
        const message = conversationMessages[key];
        return(
          <div key={message.key}  className="chat-instance">
            <Card noHovering={true}>
              <div className="text-right">
                <i>{moment(message.timestamp).startOf('minute').fromNow()}</i>
              </div>
              <p>{message.sender.email}: {message.messageContent}</p>
            </Card>
          </div>
          );
      }); 
    }
  }

  render(){
    return(
      <div>
        {this.renderMessages()}
      </div>
    );
  }
}

const mapStateToProps = ({conversationMessages}) => { return {conversationMessages}};

export default connect(mapStateToProps, 
  {startConversationMessagesListener, stopConversationMessagesListener}
)(ConversationMessages);