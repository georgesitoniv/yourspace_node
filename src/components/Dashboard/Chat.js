import React from 'react';
import { Layout, Input, Button, Card } from 'antd';

const { Content, Footer } = Layout;
const { TextArea } = Input;

class Chat extends React.Component{
  render(){
    return(
      <Layout >
        <Content className="bg-white chat-area">
          
        </Content>
        <Footer className="grey lighten-3">
          <TextArea rows="4"/>
          <div className="pull-right">
            <Button>
              Send
            </Button>
          </div>

        </Footer>
      </Layout>
    );
  }
}

export default Chat;