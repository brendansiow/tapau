import React, { Component } from 'react';
import {
    Button,
    TextField,
    Card,
    CardContent,
    CardActions,
    Snackbar,
    InputLabel, Select, MenuItem
} from 'material-ui';
import firebase from './firebase';
const db = firebase.firestore();
class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            name: '',
            accounttype: 'customer',
            restaurantname: '',
            address: '',
            contactno: '',
            website: '',
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
        if (e.target.id) {
            this.setState({
                [e.target.id]: e.target.value
            });
        } else {
            this.setState({
                [e.target.name]: e.target.value
            });
        }
    }
    handleRegister = (e) => {
        e.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((user) => {
                db.collection("user").add({
                    uid: user.user.uid,
                    name: this.state.name,
                    accounttype: this.state.accounttype
                }).then((doc) => {
                    db.collection("restaurant").add({
                        uid: user.user.uid,
                        name: this.state.restaurantname,
                        address: this.state.address,
                        contactno: this.state.contactno,
                        website: this.state.website
                    }).then((doc) => {
                        this.setState({
                            snackBarMsg: "Sign up Successfully !!",
                            snackBarBtn: "Okay !!",
                            snackbarIsOpen: !this.state.snackbarIsOpen,
                        })
                    })
                })
            }).catch((error) => {
                console.log(error);
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
            <div style={{paddingTop: "60px"}}>
                <form onSubmit={this.handleRegister}>
                    <Card style={{ marginTop: "10px", padding: "0px 20px 15px 20px" }}>
                        <CardContent>
                            <h2 style={{ margin: "0px", textAlign: "center" }}>Register Form</h2>
                            <TextField
                                id="name"
                                label="Name"
                                margin="normal"
                                required
                                onChange={this.handleChange}
                                value={this.state.name}
                                fullWidth
                            />
                            <TextField
                                id="email"
                                label="Email"
                                margin="normal"
                                type="email"
                                required
                                onChange={this.handleChange}
                                value={this.state.email}
                                fullWidth
                            />
                            <TextField
                                id="password"
                                label="Password"
                                type="password"
                                margin="normal"
                                required
                                fullWidth
                                onChange={this.handleChange}
                                helperText="Password should contain 6 or more characters!"
                                value={this.state.password}
                            />
                            <InputLabel htmlFor="accounttype">Account type</InputLabel>
                            <Select
                                margin="dense"
                                id="accounttype"
                                value={this.state.accounttype}
                                onChange={this.handleChange}
                                inputProps={{
                                    name: 'accounttype'
                                }}
                                fullWidth
                            >
                                <MenuItem value="customer">
                                    Customer
                            </MenuItem>
                                <MenuItem value="restaurant">Restaurant</MenuItem>
                            </Select>
                            {this.state.accounttype === "restaurant" &&
                                <div>
                                    <h3 style={{ margin: "10px 0px 0px 0px", textAlign: "center" }}>My Restaurant Profile</h3>
                                    <TextField
                                        id="restaurantname"
                                        label="Restaurant Name"
                                        margin="normal"
                                        required
                                        onChange={this.handleChange}
                                        value={this.state.restaurantname}
                                        fullWidth
                                    />
                                    <TextField
                                        id="address"
                                        label="Address"
                                        margin="normal"
                                        required
                                        multiline
                                        rows="3"
                                        onChange={this.handleChange}
                                        value={this.state.address}
                                        fullWidth
                                    />
                                    <TextField
                                        id="contactno"
                                        label="Contact Number"
                                        margin="normal"
                                        required
                                        fullWidth
                                        onChange={this.handleChange}
                                        helperText="Password should contain 6 or more characters!"
                                        value={this.state.contactno}
                                    />
                                    <TextField
                                        id="website"
                                        label="Website / Facebook Page"
                                        margin="normal"
                                        required
                                        fullWidth
                                        onChange={this.handleChange}
                                        value={this.state.website}
                                    />
                                </div>
                            }
                        </CardContent>
                        <CardActions style={{ display: "flex", justifyContent: "center" }}>
                            <Button type="submit" variant="raised" style={{ backgroundColor: '#EF5350', color: "white", margin: '10px 10px 0px 0px' }}>Sign up</Button>
                        </CardActions>
                    </Card>
                </form>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={this.state.snackbarIsOpen}
                    autoHideDuration={3000}
                    onClose={this.handleRequestClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.snackBarMsg}</span>}
                    action={
                        <Button key="undo" style={{ color: '#EF5350' }} dense="true" onClick={this.handleRequestClose}>
                            {this.state.snackBarBtn}
                        </Button>
                    } />
            </div >
        );
    }
}

export default Register;