import React, { Component } from 'react';
import {
    Button,
    TextField,
    Card,
    CardContent,
    CardActions,
    Snackbar
} from 'material-ui';
import firebase from './firebase';

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
        };
    }
    componentDidMount() {
        this.props.setTitle("Register");
    }
    handleRequestClose = (e) => {
        this.setState({
            snackbarIsOpen: false
        })
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }
    handleRegister = (e) => {
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((user) => {
                this.setState({
                    snackBarMsg: "Sign up Successfully !!",
                    snackBarBtn: "Okay !!",
                    email: '',
                    password: '',
                    snackbarIsOpen: !this.state.snackbarIsOpen
                })
                this.handleLogout();
            })
            .catch((error) => {
                console.log(error.code);
                if (error.code === 'auth/invalid-email') {
                    this.setState({
                        snackBarMsg: "Invalid email address !!",
                        snackBarBtn: "Okay !!",
                        snackbarIsOpen: !this.state.snackbarIsOpen
                    })
                } else if (error.code === 'auth/weak-password') {
                    this.setState({
                        snackBarMsg: "Weak password (> 6 characters)!",
                        snackBarBtn: "Okay !!",
                        snackbarIsOpen: !this.state.snackbarIsOpen
                    })

                } else if (error.code === 'auth/email-already-in-use') {
                    this.setState({
                        snackBarMsg: "Email already in used !",
                        snackBarBtn: "Okay !!",
                        snackbarIsOpen: !this.state.snackbarIsOpen
                    })
                }
            });
    }
    render() {
        return (
            <div>
                <Card style={{ marginTop: "10px", padding: "0px 20px 15px 20px" }}>
                    <CardContent>
                        <h2 style={{ margin: "0px", textAlign: "center" }}>Register Form</h2>
                        <TextField
                            id="email"
                            label="Email"
                            margin="normal"
                            onChange={this.handleChange}
                            value={this.state.email}
                            fullWidth
                        />
                        <TextField
                            id="password"
                            label="Password"
                            type="password"
                            margin="normal"
                            fullWidth
                            onChange={this.handleChange}
                            helperText="Password should contain 6 or more characters!"
                            value={this.state.password}
                        />
                    </CardContent>
                    <CardActions style={{ display: "flex", justifyContent: "center" }}>
                        <Button variant="raised" style={{ backgroundColor: '#EF5350', color: "white", margin: '10px 10px 0px 0px' }} onClick={this.handleRegister}>Sign up</Button>
                    </CardActions>
                </Card>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={this.state.snackbarIsOpen}
                    autoHideDuration={3000}
                    onClose={this.handleRequestClose}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.snackBarMsg}</span>}
                    action={
                        <Button key="undo" style={{ color: '#EF5350' }} dense="true" onClick={this.handleRequestClose}>
                            {this.state.snackBarBtn}
                        </Button>
                    } />
            </div>
        );
    }
}

export default Register;