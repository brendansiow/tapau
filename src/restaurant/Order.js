import React, { Component } from 'react';

class Order extends Component {
    componentDidMount() {
        this.props.setTitle("My Order");
      }
    render() {
        return (
            <div style={{paddingTop: "60px"}}>
                <h1>My Order</h1>
            </div>
        );
    }
}

export default Order;