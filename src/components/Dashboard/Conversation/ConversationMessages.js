import React from 'react';
import { connect } from 'react-redux';
import { listenToConversation, stopConversationListener } from '../../../actions';
import { Card } from 'antd';
import moment from 'moment';

class ConversationMessages extends React.Component{

  componentWillMount(){
    this.listenToConversationMessages(this.props);
  }

  componentWillUpdate(nextProps){
    const { currentConversation, limit } = this.props;
    if(currentConversation.key != nextProps.currentConversation.key || limit != nextProps.limit){
      nextProps.stopConversationListener(nextProps.currentConversation.key);
      this.listenToConversationMessages(nextProps);
    }
  }

  listenToConversationMessages = (props) => {
    const { currentConversation, limit, listenToConversation } = props;
    listenToConversation(currentConversation.key, limit);
  }

  renderMessages = () => {
    const { conversation } = this.props;
    if(conversation){
      return Object.keys(conversation).map((key, index) => {
        const message = conversation[key];
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

const mapStateToProps = ({conversation}) => { return {conversation}};

export default connect(mapStateToProps, 
  {listenToConversation, stopConversationListener}
)(ConversationMessages);