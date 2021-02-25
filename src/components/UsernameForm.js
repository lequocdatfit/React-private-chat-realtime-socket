import React, { Component } from 'react';
import { Button, Form, FormGroup, Input } from 'reactstrap';

class UsernameForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'inputUsername' : ''
    }
    this.inputElement = React.createRef();
  }

  componentDidMount() { 
    this.inputElement.current.focus();
  }

  updateInputUsername(event) {
    this.setState({
      'inputUsername' : event.target.value
    })
  }

  render() {
    const { onSubmit } = this.props;
    const { inputUsername } = this.state;
    return (
      <div className="UsernameForm">
        <div className="form-username">
          <Form inline onSubmit={ () => onSubmit(inputUsername) }>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <input
                ref={ this.inputElement }
                onChange={ (event) => this.updateInputUsername(event) }
                type="text" value={this.state.inputUsername} placeholder="Your username..." />
            </FormGroup>
            <Button>Send</Button>
          </Form>
        </div>
      </div>
    )
  }
}

export default UsernameForm;