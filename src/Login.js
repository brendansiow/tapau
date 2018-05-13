import React, { Component } from 'react';
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from 'material-ui';
import {
  Link
} from 'react-router-dom';
import firebase from './firebase';
import { Icon } from 'material-ui';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }
  componentDidMount() {
    this.props.setTitle("Login");
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }
  handleLogin = (e) => {
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((user) => {
        this.setState({
          snackBarMsg: "Login Successfully !!",
          snackBarBtn: "Okay !!",
          email: '',
          password: '',
          snackbarIsOpen: !this.state.snackbarIsOpen,
          loginsuccess: true
        })
      })
      .catch((error) => {
        console.log(error.code);
        if (error.code === 'auth/invalid-email') {
          this.setState({
            snackBarMsg: "Invalid email address !!",
            snackBarBtn: "Okay !!",
            snackbarIsOpen: !this.state.snackbarIsOpen
          })
        } else if (error.code === 'auth/wrong-password') {
          this.setState({
            snackBarMsg: "Invalid password !!",
            snackBarBtn: "Okay !!",
            snackbarIsOpen: !this.state.snackbarIsOpen
          })
        } else if (error.code === 'auth/user-not-found') {
          this.setState({
            snackBarMsg: "User does not exist !!",
            snackBarBtn: "Okay !!",
            snackbarIsOpen: !this.state.snackbarIsOpen
          })
        }
      });
  }
  handleLogout = (e) => {
    firebase.auth().signOut().then(() => {
      this.setState({
        snackBarMsg: "Logout Successfully !!",
        snackBarBtn: "Okay !!",
        snackbarIsOpen: !this.state.snackbarIsOpen
      })
    }).catch(function (error) {
      console.log(error)
    });
  }
  handleRequestClose = (e) => {
    this.setState({
      snackbarIsOpen: false
    })
  }
  render() {
    return (
      <div style={{paddingTop: "60px"}}>
        <div style={{ flexGrow: 1 }}>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<Icon style={{ color: "#ef5350" }}>expand_more</Icon>}>
              <h2 style={{ textAlign: "center", margin: "0px", width: "100%" }}>Welcome to Tapau</h2>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              Tapau is a multi-user takeaway management platform for both restaurants and customers to handle their takeaway order.
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
        {!this.props.loginuser ? (
          <form onSubmit={this.handleLogin}>
            <Card style={{ marginTop: "10px", padding: "0px 20px 15px 20px" }}>
              <CardContent>
                <h2 style={{ margin: "0px", textAlign: "center" }}>Login Form</h2>
                <TextField
                  id="email"
                  label="Email"
                  margin="normal"
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
                  fullWidth
                  required
                  onChange={this.handleChange}
                  helperText="Password should contain 6 or more characters!"
                  value={this.state.password}
                />
              </CardContent>
              <CardActions style={{ display: "flex", justifyContent: "center" }}>
                <Button type="submit" variant="raised" style={{ backgroundColor: '#EF5350', color: "white", margin: '10px 10px 0px 0px' }}>Login</Button>
                <Link to="/register" style={{ textDecoration: "none" }}>
                  <Button variant="raised" style={{ color: '#EF5350', backgroundColor: '#ffffff', margin: '10px 0px 0px 20px' }}>Sign Up</Button>
                </Link>
              </CardActions>
            </Card>
          </form>
        ) : (null)}
        {this.props.loginuser ? (
          <div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
              <h3 style={{ margin: "0px", textAlign: "center" }}> You've signed in with {this.props.loginuser.email} </h3>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
              <Button variant="raised" style={{ backgroundColor: 'grey', color: 'white' }} onClick={this.handleLogout}>Logout</Button>
            </div>
          </div>
        ) : (null)}
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
      </div>
    )
  }
}

export default Login;