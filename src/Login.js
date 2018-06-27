import React, { Component } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Typography,
  Snackbar,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Icon,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress
} from "@material-ui/core";
import { Link } from "react-router-dom";
import firebase from "./firebase";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      LoggingIn: false
    };
  }
  componentDidMount() {
    this.props.setTitle("Login");
  }
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  handleLogin = e => {
    e.preventDefault();
    this.setState({
      LoggingIn: true
    });
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        this.setState({
          snackBarMsg: "Login Successfully !!",
          snackBarBtn: "Okay !!",
          snackbarIsOpen: !this.state.snackbarIsOpen
        });
      })
      .catch(error => {
        if (error.code === "auth/invalid-email") {
          this.setState({
            LoggingIn: false,
            snackBarMsg: "Invalid email address !!",
            snackBarBtn: "Okay !!",
            snackbarIsOpen: !this.state.snackbarIsOpen
          });
        } else if (error.code === "auth/wrong-password") {
          this.setState({
            LoggingIn: false,
            snackBarMsg: "Invalid password !!",
            snackBarBtn: "Okay !!",
            snackbarIsOpen: !this.state.snackbarIsOpen
          });
        } else if (error.code === "auth/user-not-found") {
          this.setState({
            LoggingIn: false,
            snackBarMsg: "User does not exist !!",
            snackBarBtn: "Okay !!",
            snackbarIsOpen: !this.state.snackbarIsOpen
          });
        }
      });
  };
  handleRequestClose = e => {
    this.setState({
      snackbarIsOpen: false
    });
  };
  render() {
    return (
      <div style={{ paddingTop: "60px" }}>
        <div style={{ flexGrow: 1 }}>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<Icon style={{ color: "#ef5350" }}>expand_more</Icon>}
            >
              <h2 style={{ textAlign: "center", margin: "0px", width: "100%" }}>
                Welcome to Tapau
              </h2>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              Tapau is a multi-user takeaway management platform for both
              restaurants and customers to handle their takeaway order.
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <Card>
            <CardContent>
              <Typography style={{ fontSize: "18px" }} color="textSecondary">
                Word of the Day
              </Typography>
              <Typography variant="headline" component="h2">
                Ta<span
                  style={{
                    display: "inline-block",
                    transform: "scale(0.6)"
                  }}
                >
                  •
                </span>pau
              </Typography>
              <Typography color="textSecondary">verb, noun</Typography>
              <Typography component="p">
                In Hokkien (one of the chinese dialects), Tapau means to take
                away. <br />
                {'"I tapau (actual term) lunch for you."'}
              </Typography>
            </CardContent>
          </Card>
        </div>
        <form onSubmit={this.handleLogin}>
          <Card style={{ marginTop: "10px", padding: "0px 20px 15px 20px" }}>
            <CardContent>
              <h2 style={{ margin: "0px", textAlign: "center" }}>Login Form</h2>
              <TextField
                id="email"
                label="Email"
                margin="normal"
                type="email"
                required
                onChange={this.handleChange}
                value={this.state.email}
                inputProps={{
                  autoComplete:"off",
                }}
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
              <Button
                type="submit"
                variant="raised"
                style={{
                  backgroundColor: "#EF5350",
                  color: "white",
                  margin: "10px 10px 0px 0px"
                }}
              >
                Login
              </Button>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <Button
                  variant="raised"
                  style={{
                    color: "#EF5350",
                    backgroundColor: "#ffffff",
                    margin: "10px 0px 0px 20px"
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </CardActions>
          </Card>
        </form>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          open={this.state.snackbarIsOpen}
          autoHideDuration={3000}
          onClose={this.handleRequestClose}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">{this.state.snackBarMsg}</span>}
          action={
            <Button
              key="undo"
              style={{ color: "#EF5350" }}
              dense="true"
              onClick={this.handleRequestClose}
            >
              {this.state.snackBarBtn}
            </Button>
          }
        />
        <Dialog
          open={this.state.LoggingIn}
          fullWidth
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle style={{ textAlign: "center" }}>
            Logging in...
          </DialogTitle>
          <DialogContent style={{ textAlign: "center" }}>
            <CircularProgress
              style={{ color: "#ef5350" }}
              size={50}
              thickness={5}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default Login;
