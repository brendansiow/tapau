import React, { Component } from 'react';

class RestHome extends Component {
    componentDidMount() {
        this.props.setTitle("Home");
      }
    render() {
        return (
            <div>
                <h1>Restaurant Home Page</h1>
            </div>
        );
    }
}

export default RestHome;