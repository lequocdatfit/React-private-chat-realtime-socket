import React, { Component } from 'react'


class Heading extends Component {
  constructor(props) {
    super(props);
  }

  onSearchTextChange(evt) {
    this.props.onSearchingUser(evt.target.value);
  }

  render() {

    return (
      <div className="Heading">
        <div className="headind_srch">
          <div className="recent_heading">
            <h4>Recent</h4>
          </div>
          <div className="srch_bar">
            <div className="stylish-input-group">
              <input 
                onChange={(evt) => this.onSearchTextChange(evt)}
                type="text" 
                className="search-bar"  
                placeholder="Search" />
              <span className="input-group-addon">
                <button type="button"> <i className="fa fa-search" aria-hidden="true"></i> </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Heading;