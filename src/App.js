import React, { Component } from 'react'
import './App.css';
import Heading from './components/Heading';
import ChatList from './components/ChatList';
import MessArea from './components/MessArea';
import UsernameForm from './components/UsernameForm';
import socket from './socket';




class App extends Component {
  constructor() {
    super();
    this.state = {
      'yourSelf': '',
      'usernameAlreadySelected': false,
      'selectedUser': '',
      'users': [],
    }

    const sessionID = localStorage.getItem('sessionID');
    if (sessionID) {
      this.state.usernameAlreadySelected = true;
      socket.auth = { sessionID };
      socket.connect();
    }

    socket.on('session', ({ sessionID, userID }) => {
      socket.auth = { sessionID };
      socket.userID = userID;
      localStorage.setItem('sessionID', sessionID);


    });

    socket.on('users', (users) => {
      let yourSelf = null;
      users.forEach((user) => {
        user.self = user.userID === socket.userID;
        if (user.self) {
          yourSelf = user.userID;
        }
        user.isShow = true;

        user.messages.forEach((message) => {
          if (message.from === socket.userID) {
            message.fromSelf = true;
          } else {
            message.fromSelf = false;
          }
        })
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

      const selectedUser = users[1] ? users[1].userID : null;
      this.setState({
        'yourSelf': yourSelf,
        'users': users,
        'selectedUser': selectedUser,
      })
    });

    socket.on('user connected', (user) => {
      this.initReactiveProperties(user)
      const { users } = this.state;
      let isNewUserConnected = true;
      for (let i = 0; i < users.length; i++) {
        if (users[i].userID === user.userID) {
          isNewUserConnected = false;
          break;
        }
      }
      if (isNewUserConnected) {
        this.setState({
          'users': [
            ...this.state.users,
            user,
          ]
        });
      }
    })

    socket.on('private message', ({ content, from, to }) => {
      let { users, selectedUser, yourSelf } = this.state;
      // messages from another tab
      if (from === yourSelf && from !== to) {
        for (let i = 0; i < users.length; i++) {
          if (users[i].userID === to) {
            users[i].messages.push({
              content,
              fromSelf: true,
            });
          }
        }
      } else {
        for (let i = 0; i < users.length; i++) {
          if (users[i].userID === from) {
            users[i].messages.push({
              content,
              fromSelf: false,
            });

            // them message vao selectedUser

            if (users[i].userID !== selectedUser) {
              users[i].hasNewMessages = true;
            }
            break;
          }
        }
      }

      this.setState({
        'users': users,
      })
    })

    socket.on("connect", () => {
      const { users } = this.state;
      users.forEach((user) => {
        if (user.self) {
          user.connected = true;
        }
      });

      this.setState({
        'users': users,
      })
    });

    socket.on("disconnect", () => {
      console.log('a user disconnected');
      const { users } = this.state;
      users.forEach((user) => {
        if (user.self) {
          user.connected = false;
        }
      });
      this.setState({
        'users': users,
      })
    });

    socket.on('user disconnected', (userID) => {
      const { users } = this.state;
      users.forEach((user) => {
        if (user.userID === userID) {
          user.connected = false;
        }
      });

      this.setState({
        'users': users,
      })
    })

    this.onUsernameSelection = this.onUsernameSelection.bind(this);
    this.onChatItemClicked = this.onChatItemClicked.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onSearchingUser = this.onSearchingUser.bind(this);
  }

  initReactiveProperties(user) {
    user.connected = true;
    user.messages = [];
    user.hasNewMessages = false;
    user.isShow = true;
  }

  onUsernameSelection(username) {
    socket.auth = { username };
    socket.connect();
    this.setState({
      'usernameAlreadySelected': true,
    }, () => {
      console.log(this.state);
    })
  }

  onChatItemClicked(user) {
    return (event) => {
      const users = this.state.users;
      users.forEach((userItem) => {
        if (userItem.userID === user.userID) {
          userItem.hasNewMessages = false;
        }
      })
      this.setState({
        'selectedUser': user.userID,
        'users': users,
      })
    }
  }

  componentDidMount() {
    socket.on('connect_error', (err) => {
      if (err.message === 'invalid username') {
        this.setState({
          'usernameAlreadySelected': false
        })
      }
    })
  }

  onMessage(content) {
    const { selectedUser, users } = this.state;
    if (selectedUser) {
      socket.emit('private message', {
        content,
        to: selectedUser,
      });

      for (let i = 0; i < users.length; i++) {
        if (users[i].userID === selectedUser) {
          users[i].messages.push({
            content,
            fromSelf: true,
          })
          break;
        }
      }
      this.setState({
        'users': users
      })
    }
  }

  onSearchingUser(text) {
    const users = this.state.users;
    const result = users.map((user) => {
      if (user.username.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
        user.isShow = true;
      } else {
        user.isShow = false;
      }
      return user;
    });

    debugger;

    this.setState({
      'users': result,
    })
  }

  componentWillUnmount() {
    socket.off("connect_error");
  }
  
  render() {
    
    const { usernameAlreadySelected, selectedUser, users } = this.state;
    if (usernameAlreadySelected) {
      return (
        <div className="App">
          <div className="container">
            <h3 className=" text-center">Chat everything</h3>
            <div className="messaging">
              <div className="inbox_msg">
                <div className="inbox_people">
                  <Heading onSearchingUser={this.onSearchingUser} />
                  <div className="inbox_chat">
                    <ChatList
                      onClick={this.onChatItemClicked}
                      users={users}
                      selectedUser={selectedUser} />
                  </div>
                </div>
                <MessArea users={users} selectedUser={selectedUser} onMessage={this.onMessage} />
              </div>
              <p className="text-center top_spac"> Copyright by <a target="_blank" rel="noreferrer" href="https://www.facebook.com/quocdatle.44/">Le Quoc Dat</a></p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <UsernameForm onSubmit={this.onUsernameSelection} />
      )
    }
  }
}

export default App;
