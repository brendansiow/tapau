import React, { Component } from 'react';

class RestHome extends Component {
    componentDidMount() {
        this.props.setTitle("Home");
      }
    render() {
        return (
            <div style={{paddingTop: "60px"}}>
                <h1>Restaurant Home Page</h1>
            </div>
        );
    }
}

export default RestHome;