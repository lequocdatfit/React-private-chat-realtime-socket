import React, { Component } from 'react';
import PaperPlane from '../img/paper-plane.svg';


class MessArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'inputValue' : ''
    }
    this.inputElement = React.createRef();
    this.messagesScroll = React.createRef();
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.messagesScroll.current.scrollTo(0, this.messagesScroll.current.scrollHeight);
  }


  onInputMessageChange(event) {
    this.setState({
      'inputValue': event.target.value,
    })
  }

  onKeyUp(event) {
    if(event.keyCode === 13) {
      let text = this.state.inputValue;
      text = text.trim();
      if(text !== '') {
        this.setState({
          'inputValue': ''
        }, () => {
          this.props.onMessage(text);
        })
      }
    }
  }

  onSendMessageClick(event) {
    let text = this.state.inputValue;
    text = text.trim();
    if(text !== '') {
      this.setState({
        'inputValue': ''
      }, () => {
        this.props.onMessage(text);
      })
    }
  }

  render() {
    const { users, selectedUser } = this.props;
    let matchedUser = null;
    for(let i=0; i<users.length; i++) {
      if(users[i].userID === selectedUser) {
        matchedUser = users[i];
        break;
      }
    }

    return (
      <div className="MessArea">
        <div className="mesgs">
          <div className="msg_history" ref={this.messagesScroll}>
            {
              matchedUser && matchedUser.messages.map((msg, index) => {
                if (!msg.fromSelf)
                  return (
                  <div key={index} className="incoming_msg">
                    <div className="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
                    <div className="received_msg">
                      <div className="received_withd_msg">
                        <p>{ msg.content }</p>
                        <span className="time_date"> 11:01 AM    |    June 9</span></div>
                    </div>
                  </div>
                  )
                return (
                  <div key={index} className="outgoing_msg">
                    <div className="sent_msg">
                      <p>{ msg.content }</p>
                      <span className="time_date"> 11:01 AM    |    June 9</span> </div>
                  </div>
                )
              })
            }

          </div>

          <div className="type_msg">
            <div className="input_msg_write">
              <input 
                onKeyUp={(event) => this.onKeyUp(event)}
                onChange={(event) => this.onInputMessageChange(event) }
                value={this.state.inputValue}
                ref={this.inputElement} 
                type="text" className="write_msg" placeholder="Type a message" />
              <button
                onClick={(event)=> this.onSendMessageClick(event)}
                className="msg_send_btn"
                type="button">
                <img src={PaperPlane} alt="paper-plane" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MessArea;