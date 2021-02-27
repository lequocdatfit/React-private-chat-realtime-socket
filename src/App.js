import React, { Component } from 'react'
import './App.css';
import Heading from './components/Heading';
import ChatList from './components/ChatList';
import MessArea from './components/MessArea';
import UsernameForm from './components/UsernameForm';
import socket from './socket';

class App extends Component{
  constructor() {
    super();
    this.state = {
      'usernameAlreadySelected' : false,
      'selectedUser' : '',
      'users': [],
    }

    socket.on('users', (users) => {
      users.forEach((user) => {
        user.self = user.userID === socket.id;
        user.messages = [];
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
        'users': users.slice(1),
        'selectedUser': selectedUser,
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

    socket.on('private message', ({content, from}) => {
      let { users, selectedUser } = this.state;
      for(let i=0; i< users.length; i++) {
        if(users[i].userID === from) {
          users[i].messages.push({
            content,
            fromSelf: false,
          });
          
          // them message vao selectedUser

          if(users[i].userID !== selectedUser) {
            users[i].hasNewMessages = true;
          }
          break;
        }
      }

      debugger;
      
      this.setState({
        'users' : users,
      })
    })

    this.onUsernameSelection = this.onUsernameSelection.bind(this);
    this.onChatItemClicked = this.onChatItemClicked.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  initReactiveProperties(user) {
    user.connected = true;
    user.messages = [];
    user.hasNewMessages = false;
  }
  
  onUsernameSelection(username) {
    socket.auth = { username };
    socket.connect();
    this.setState({
      'usernameAlreadySelected' : true,
    }, () => {
      console.log(this.state);
    })
  }

  onChatItemClicked(user) {
    return (event) => {
      this.setState({
        'selectedUser': user.userID
      })
    }
  }

  componentDidMount() {
    socket.on('connect_error', (err) => {
      if(err.message === 'invalid username') {
        this.setState({
          'usernameAlreadySelected' : false
        })
      }
    })
  }

  onMessage(content) {
    const { selectedUser, users } = this.state;
    if(selectedUser) {
      socket.emit('private message', {
        content,
        to: selectedUser,
      });

      for(let i=0; i <users.length; i++) {
        if(users[i].userID === selectedUser) {
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

  componentWillUnmount() {
    socket.off("connect_error");
  }

  render() {
    const { usernameAlreadySelected, selectedUser, users } = this.state;
    if(usernameAlreadySelected) {
      return (
        <div className="App">
          <div className="container">
            <h3 className=" text-center">Messaging</h3>
            <div className="messaging">
              <div className="inbox_msg">
                <div className="inbox_people">
                  <Heading />
                  <div className="inbox_chat">
                    <ChatList 
                      onClick={this.onChatItemClicked}
                      users={users}
                      selectedUser={selectedUser} />
                  </div>
                </div>
                <MessArea users={users} selectedUser={selectedUser} onMessage={this.onMessage} />
              </div>
              <p className="text-center top_spac"> Copyright by <a target="_blank" href="#">Le Quoc Dat</a></p>
            </div>
          </div>
        </div>
      );
    } else {
      return(
        <UsernameForm onSubmit={ this.onUsernameSelection }/>
      )
    }
  }
}

export default App;
