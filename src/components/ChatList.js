import React, { Component } from 'react';
import socket from '../socket';


import ChatItem from './ChatItem'


class ChatList extends Component {
  constructor(props) {
    super(props);

    this.onChatItemClicked = this.onChatItemClicked.bind(this);
    this.state = {
      'users': [],
    }

    socket.on('users', (users) => {
      users.forEach((user) => {
        user.self = user.userID === socket.id;
        user.isClicked = false;
      });
      // put current user on the top
      users.sort((a, b) => {
        if (a.self) {
          return -1;
        }
        if (b.self) {
          return 1;
        }
        if (a.username < b.username) {
          return -1;
        }
        return a.username > b.username ? 1 : 0;
      });

      this.setState({
        'users': users.slice(1),
      })
    });

    socket.on('user connected', (user) => {
      this.initReactiveProperties(user)

      this.setState({
        'users': [
          ...this.state.users,
          user,
        ]
      });
    })

  }

  initReactiveProperties(user) {
    user.connected = true;
    user.messages = [];
    user.hasNewMessages = false;
    user.isClicked = false;
  }

  onChatItemClicked(user) {
    const { users } = this.state;


    var index = users.indexOf(user);
    return (event) => {
      
      users.forEach((user) => {
        user.isClicked = false;
      });

      this.setState({
        'users' :[
            ...users.slice(0, index),
          {
            ...user,
            isClicked: true,
          },
          ...users.slice(index + 1)
        ]
      });
    }
  }


  render() {
    const { users } = this.state;
    return (
      <div className="ChatList">
        {
          users && users.map((user, index) => 
            <ChatItem 
              key={index} 
              user={user} 
              fn={this.onChatItemClicked}/>)
        }
      </div>
    )
  }
}

export default ChatList;