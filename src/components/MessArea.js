import React, { Component } from 'react';

class MessArea extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="MessArea">
        <div className="mesgs">
          <div className="msg_history">
            <div className="incoming_msg">
              <div className="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
              <div className="received_msg">
                <div className="received_withd_msg">
                  <p>Test which is a new approach to have all
                  solutions</p>
                  <span className="time_date"> 11:01 AM    |    June 9</span></div>
              </div>
            </div>

            <div className="outgoing_msg">
              <div className="sent_msg">
                <p>Test which is a new approach to have all
                  solutions</p>
                <span className="time_date"> 11:01 AM    |    June 9</span> </div>
            </div>
          </div>

          <div className="type_msg">
            <div className="input_msg_write">
              <input type="text" className="write_msg" placeholder="Type a message" />
              <button className="msg_send_btn" type="button"><i className="fas fa-paper-plane"></i></button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MessArea;