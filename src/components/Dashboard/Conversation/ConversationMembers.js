import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import { 
  fetchConversationMembers,
  setCurrentConversationMembers 
} from '../../../actions';
import { Modal, Tag, Input, Tooltip, Button, AutoComplete } from 'antd';
import fbUtils from '../../../firebase/utils';

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
    if(this.props.currentConversation != nextProps.currentConversation){
      this.fetchConversationMembers(nextProps);
    }
  }

  fetchConversationMembers = (props) => {
    const { currentConversation, isConversationNew, fetchConversationMembers } = props;
    if(!isConversationNew){
      fetchConversationMembers(currentConversation);
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
    fbUtils.fetchUsers(value)
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
        const isLengthLong = members[key].email.length > 20;
        const tagElement = (
          <Tag key={key} closable={this.props.isConversationNew} afterClose={() => this.handleClose(key)}>
            {isLengthLong ? `${members[key].email.slice(0, 15)}...`: members[key].email}
          </Tag>
        );
        return isLengthLong ? <Tooltip title={members[key].email} key={key}>{tagElement}</Tooltip> : tagElement;
      });
    }
  }

  render(){
    const { isConversationNew } = this.props;
    return(
      <div>
        {this.renderMembers()}
        {isConversationNew && this.renderInput()}
        {isConversationNew && this.renderInputButton()}
      </div>
    );  
  }
}

const mapStateToProps = ({currentConversation, conversationMembers, isConversationNew}) => {
  return {currentConversation, conversationMembers, isConversationNew};
}

export default connect(mapStateToProps, 
  {setCurrentConversationMembers, fetchConversationMembers}
)(ChatMembers);