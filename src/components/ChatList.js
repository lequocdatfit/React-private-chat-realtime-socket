import React, { Component } from 'react';
import socket from '../socket';


import ChatItem from './ChatItem'


class ChatList extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    const { onClick, selectedUser, users } = this.props;
    return (
      <div className="ChatList">
        {
          users && users.map((user, index) => 
            <ChatItem 
              key={index} 
              user={user} 
              selectedUser = {selectedUser}
              onClick={ onClick }/>)
        }
      </div>
    )
  }
}

export default ChatList;