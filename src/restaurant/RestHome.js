import React, { Component } from 'react';
import QrReader from 'react-qr-reader'
import { Button, Dialog, DialogContent, DialogTitle } from 'material-ui';

class RestHome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            delay: 100,
            result: 'No result',
            open: false
        }
        this.handleScan = this.handleScan.bind(this)
        this.openDialog = this.openDialog.bind(this)
        this.handleClose = this.handleClose.bind(this)
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
    handleClose() {
        this.setState({
            open: false,
        })
    }
    openDialog() {
        this.setState({
            open: true,
        })
    }
    render() {
        return (
            <div style={{ paddingTop: "60px" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="raised" style={{ backgroundColor: '#EF5350', color: "white", margin: '10px 10px 0px 0px' }}
                        onClick={this.openDialog}
                    >Scan QR code for customer order</Button>
                </div>
                <p style={{textAlign:'center'}}>{this.state.result}</p>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle>Scan QR code below</DialogTitle>
                    <DialogContent>
                        <QrReader
                            delay={this.state.delay}
                            onError={this.handleError}
                            onScan={this.handleScan}
                            style={{ width: "100%" }}
                            showViewFinder={false}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

export default RestHome;