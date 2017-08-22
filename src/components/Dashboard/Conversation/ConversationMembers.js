import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import { 
  fetchConversationMembers,
  setCurrentConversationMembers 
} from '../../../actions';
import { Modal, Tag, Input, Tooltip, Button, AutoComplete } from 'antd';
import fireUtils from '../../../firebase/utils';

const Option = AutoComplete.Option;

const renderUserOptions = (user) => {
  return (
    <Option key={user.key} text={user.email}>
      {user.email}
    </Option>
  );
}

class ChatMembers extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      inputValue: '',
      inputVisible: false,
      dataSource: []
    }
  }

  componentWillMount(){
    this.fetchConversationMembers(this.props);
  }

  componentWillUpdate(nextProps){
    if(this.props.currentConversation.key != nextProps.currentConversation.key){
      this.fetchConversationMembers(nextProps);
    }
  }

  fetchConversationMembers = (props) => {
    const { currentConversation, fetchConversationMembers } = props;
    if(!currentConversation.isNew){
      fetchConversationMembers(currentConversation.key);
    }
  }

  handleClose = (key) => {
    const { conversationMembers, setCurrentConversationMembers } = this.props;
    let members = conversationMembers;
    delete members[key];
    setCurrentConversationMembers(members);
  }

  handleSelectMember = (value, option) => {
    const { conversationMembers, setCurrentConversationMembers } = this.props;
    let members = {...conversationMembers };
    members[value] = _.find(this.state.dataSource, (member) => {
      if(member.key == value){
        return member;
      }
    });
    setCurrentConversationMembers(members);
    this.setState({inputVisible: false, inputValue: '', dataSource: []});
  }

  handleSearch = (value) => {
    fireUtils.fetchUsers(value)
      .then((users) => {
        this.setState({dataSource: _.map(users)});
      })
  }

  renderInputButton = () => {
    if(!this.state.inputVisible){
      return (
        <Button 
          size="small" 
          type="dashed" 
          onClick={() => this.setState({ inputVisible: true})}>
          + New Member
        </Button>
        );
    }
  }
  
  renderInput = () => {
    const { inputValue, inputVisible, dataSource } = this.state;
    if(inputVisible){
      return <AutoComplete
        allowClear={true}
        style={{ width: 130 }}
        dataSource={dataSource.map(renderUserOptions)}
        onSelect={this.handleSelectMember}
        onSearch={this.handleSearch}
      >
        <Input 
          type="text" 
          size="small" 
          value={inputValue}
          onChange={value => this.setState({inputValue: value})}
          placeholder="Add new member"/>
      </AutoComplete>
    }
  }

  renderMembers = () => {
    const members =  this.props.conversationMembers;
    if(Object.keys(members).length > 0){
      return Object.keys(members).map((key, index) => {
        const member = members[key];
        const isLengthLong = member.email.length > 20;
        const tagElement = (
          <Tag key={key} closable={this.props.currentConversation.isNew} afterClose={() => this.handleClose(key)}>
            {isLengthLong ? `${member.email.slice(0, 15)}...`: member.email}
          </Tag>
        );
        return isLengthLong ? <Tooltip title={member.email} key={key}>{tagElement}</Tooltip> : tagElement;
      });
    }
  }

  render(){
    const { currentConversation } = this.props;
    return(
      <div>
        {this.renderMembers()}
        {currentConversation.isNew && this.renderInput()}
        {currentConversation.isNew && this.renderInputButton()}
      </div>
    );  
  }
}

const mapStateToProps = ({currentConversation, conversationMembers}) => {
  return {currentConversation, conversationMembers};
}

export default connect(mapStateToProps, 
  {setCurrentConversationMembers, fetchConversationMembers}
)(ChatMembers);