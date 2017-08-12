import _ from 'lodash';
import React from 'react';
import * as firebase from 'firebase';
import { Table, Card } from 'antd';

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

class FriendList extends React.Component{
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
      <div style={{padding: 25}}>
          <Table columns={columns} bordered dataSource={this.state.users}/>
      </div>
    );
  }
}

export default FriendList;