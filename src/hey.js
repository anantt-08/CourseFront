import React, { Component } from 'react';
class Hey extends Component {
    constructor(props) {
        super(props);
        this.state = {
          isChecked: true,
        };
      }
      toggleChange = () => {
        this.setState({
          isChecked: !this.state.isChecked,
        });
      }
      render() {
        return (
            <div className="banUserDiv">
                 <input type="checkbox" id="banUser"
              checked={this.state.isChecked}
              onChange={this.toggleChange}
            />
            <label htmlFor="banUser"></label>
        </div>
        );
      }
}

export default Hey;