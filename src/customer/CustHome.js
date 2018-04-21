import React, { Component } from 'react';

class CustHome extends Component {
    componentDidMount() {
        this.props.setTitle("Home");
      }
    render() {
        return (
            <div>
                <h1>Customers Page- Restaurants list</h1>
            </div>
        );
    }
}

export default CustHome;