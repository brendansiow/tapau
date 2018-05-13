import React, { Component } from 'react';
import QrReader from 'react-qr-reader'

class RestHome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            delay: 300,
            result: 'No result',
        }
        this.handleScan = this.handleScan.bind(this)
    }
    componentDidMount() {
        this.props.setTitle("Home");
    }
    handleScan(data) {
        if (data) {
            this.setState({
                result: data,
            })
        }
    }
    handleError(err) {
        console.error(err)
    }
    render() {
        return (
            <div style={{ paddingTop: "60px" }}>
                <h1>Restaurant Home Page</h1>
                <QrReader
                    delay={this.state.delay}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    style={{ width: '100%' }}
                />
                <p>{this.state.result}</p>
            </div>
        );
    }
}

export default RestHome;