import React, { Component } from 'react'
import classnames from 'classnames';
import OnlineIcon from '../img/online.png'

class ChatItem extends Component {
  


  render() {
    const { user, onClick, selectedUser } = this.props;
    const lastMessage = user.messages[user.messages.length -1];
    return (
      <div className="ChatItem" onClick={ onClick(user) }>
        <div className={classnames('chat_list', { ' active_chat':  selectedUser === user.userID})}>
          <div className="chat_people">
            <div className="chat_img">
              <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" />
            </div>
            <div className="chat_ib">
              <h5>{user.self ? user.username + ' (yourself)' : user.username}<span className="chat_date">Dec 25</span></h5>
              {
                user.connected && <img className="status-icon" src={OnlineIcon} alt='online' />
              }
              {
                lastMessage && lastMessage.fromSelf &&<p>You: { lastMessage.content }</p>
              }
              {
                lastMessage && !lastMessage.fromSelf && <p className={classnames({'hasNewMessages': user.hasNewMessages})}>{user.username}: { lastMessage.content }</p>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ChatItem;