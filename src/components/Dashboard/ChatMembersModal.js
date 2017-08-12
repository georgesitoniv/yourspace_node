import React from 'react';
import { Modal } from 'antd';

class ChatMembersModal extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div>
        <Modal
            title="Basic Modal"
            visible={this.props.visible}
            onOk={this.props.handleOk}
            onCancel={this.props.handleCancel}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Modal>
      </div>
    );
  }
}

export default ChatMembersModal;