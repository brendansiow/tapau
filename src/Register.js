import React, { Component } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress
} from "@material-ui/core";
import firebase from "./firebase";
const db = firebase.firestore();
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      name: "",
      accounttype: "customer",
      restaurantname: "",
      address: "",
      contactno: "",
      website: "",
      SignUp: false
    };
  }
  componentDidMount() {
    this.props.setTitle("Register");
  }
  handleRequestClose = e => {
    this.setState({
      snackbarIsOpen: false
    });
  };
  handleChange = e => {
    if (e.target.id) {
      this.setState({
        [e.target.id]: e.target.value
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  };
  handleRegister = e => {
    e.preventDefault();
    this.setState({
      SignUp: true
    });
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        db.collection("user")
          .add({
            uid: user.user.uid,
            name: this.state.name,
            accounttype: this.state.accounttype
          })
          .then(doc => {
            if (this.state.accounttype === "restaurant") {
              db.collection("restaurant")
                .add({
                  uid: user.user.uid,
                  name: this.state.restaurantname,
                  address: this.state.address,
                  contactno: this.state.contactno,
                  website: this.state.website
                })
              }
          });
      })
      .catch(error => {
        if (error.code === "auth/invalid-email") {
          this.setState({
            SignUp: false,
            snackBarMsg: "Invalid email address !!",
            snackBarBtn: "Okay !!",
            snackbarIsOpen: !this.state.snackbarIsOpen
          });
        } else if (error.code === "auth/weak-password") {
          this.setState({
            SignUp: false,
            snackBarMsg: "Weak password (> 6 characters)!",
            snackBarBtn: "Okay !!",
            snackbarIsOpen: !this.state.snackbarIsOpen
          });
        } else if (error.code === "auth/email-already-in-use") {
          this.setState({
            SignUp: false,
            snackBarMsg: "Email already in used !",
            snackBarBtn: "Okay !!",
            snackbarIsOpen: !this.state.snackbarIsOpen
          });
        }
      });
  };
  render() {
    return (
      <div style={{ paddingTop: "60px" }}>
        <form onSubmit={this.handleRegister}>
          <Card style={{ marginTop: "10px", padding: "0px 20px 15px 20px" }}>
            <CardContent>
              <h2 style={{ margin: "0px", textAlign: "center" }}>
                Register Form
              </h2>
              <TextField
                id="name"
                label="Name"
                margin="normal"
                type="text"
                required
                inputProps={{
                  autoComplete: "off",
                  pattern: "[^-\\s][a-zA-Z\\s]+[a-zA-Z]+$",
                  title: "Name can only contains a-z,A-Z, and space between!"
                }}
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
                inputProps={{
                  autoComplete: "off"
                }}
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
                  name: "accounttype"
                }}
                fullWidth
              >
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="restaurant">Restaurant</MenuItem>
              </Select>
              {this.state.accounttype === "restaurant" && (
                <div>
                  <h3
                    style={{ margin: "10px 0px 0px 0px", textAlign: "center" }}
                  >
                    My Restaurant Profile
                  </h3>
                  <TextField
                    id="restaurantname"
                    label="Restaurant Name"
                    margin="normal"
                    required
                    inputProps={{
                      autoComplete: "off",
                      pattern: "[^-\\s][a-zA-Z0-9-\\s]+[a-zA-Z0-9-]+$",
                      title:
                        "Restaurant name can only contains a-z,A-Z,0-9,- and space between!"
                    }}
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
                    inputProps={{
                      autoComplete: "off"
                    }}
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
                    inputProps={{
                      autoComplete: "off",
                      pattern: "[^-\\s][0-9-]+$",
                      title: "Contact number can only contains 0-9,- and +!"
                    }}
                    fullWidth
                    onChange={this.handleChange}
                    value={this.state.contactno}
                  />
                  <TextField
                    id="website"
                    label="Website / Facebook Page"
                    margin="normal"
                    type="url"
                    helperText="eg:https://tapau.tk"
                    required
                    fullWidth
                    inputProps={{
                      autoComplete: "off"
                    }}
                    onChange={this.handleChange}
                    value={this.state.website}
                  />
                </div>
              )}
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
                Sign up
              </Button>
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
          open={this.state.SignUp}
          fullWidth
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle style={{ textAlign: "center" }}>
            Registering User...
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

export default Register;
