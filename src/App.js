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
    }

    this.onUsernameSelection = this.onUsernameSelection.bind(this);
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

  componentDidMount() {
    socket.on('connect_error', (err) => {
      if(err.message === 'invalid username') {
        this.setState({
          'usernameAlreadySelected' : false
        })
      }
    })
  }

  componentWillUnmount() {
    socket.off("connect_error");
  }

  render() {
    const { usernameAlreadySelected } = this.state;
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
                    <ChatList />
                  </div>
                </div>
                <MessArea />
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
