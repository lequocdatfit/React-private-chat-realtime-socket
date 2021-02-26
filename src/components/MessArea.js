import React, { Component } from 'react';
import classnames from 'classnames';


class MessArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'inputValue' : ''
    }
    this.inputElement = React.createRef();
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

  render() {
    const { selectedUser, onMessage } = this.props;
    return (
      <div className="MessArea">
        <div className="mesgs">
          <div className="msg_history">
            {
              selectedUser.messages && selectedUser.messages.map((msg, index) => {
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
                onClick={()=> onMessage(this.inputElement.current.value)}
                className="msg_send_btn"
                type="button">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MessArea;