import React, { Component } from 'react';

class Menu extends Component {
    constructor(props){
        super(props)
    }
    componentDidMount(){
        this.props.setTitle("My Menu");
    }
    render() {
        return (
            <div style={{ paddingTop: "60px" }}>
                
            </div>
        );
    }
}

export default Menu;