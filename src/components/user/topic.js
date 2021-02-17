import React, { Component } from 'react';

class Topic extends Component {
    render(props) {
        return (
            <div>
                {this.props.id}
            </div>
        );
    }
}

export default Topic;