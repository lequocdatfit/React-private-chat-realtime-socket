import React, { Component } from 'react'
import classnames from 'classnames';

class ChatItem extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const { user, onClick, selectedUser } = this.props;
    return (
      <div className="ChatItem" onClick={ onClick(user) }>
        <div className={classnames('chat_list', { ' active_chat':  selectedUser === user.userID})}>
          <div className="chat_people">
            <div className="chat_img">
              <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" />
            </div>
            <div className="chat_ib">
              <h5>{user.username}<span className="chat_date">Dec 25</span></h5>
              <p>Test, which is a new approach to have all solutions
                astrology under one roof.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ChatItem;