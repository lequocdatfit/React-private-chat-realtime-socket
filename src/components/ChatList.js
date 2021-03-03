import React, { Component } from 'react';


import ChatItem from './ChatItem'


class ChatList extends Component {

  render() {
    const { onClick, selectedUser, users } = this.props;
    return (
      <div className="ChatList">
        {
          users && users.map((user, index) => 
          user.isShow && 
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