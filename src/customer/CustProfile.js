import React, { Component } from "react";
import {
  CardContent,
  TextField,
  Card,
  CardActions,
  Button,
  Snackbar
} from "@material-ui/core";
import firebase from "../firebase";
const db = firebase.firestore();
class CustProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      oldpw: "",
      newpw: "",
      cnewpw: ""
    };
  }
  componentDidMount() {
    this.props.setTitle("My Profile");
    db.collection("user")
      .where("uid", "==", this.props.loginuser.uid)
      .get()
      .then(doc => {
        doc.forEach(eachdoc => {
          this.setState({
            id: eachdoc.id,
            name: eachdoc.data().name
          });
        });
      })
      .catch(function(error) {
        console.log(error);
      });
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
  handleUpdate = e => {
    e.preventDefault();
    db.collection("user")
      .doc(this.state.id)
      .update({
        name: this.state.name
      })
      .then(() => {
        this.setState({
          snackBarMsg: "Your Profile Updated !!",
          snackBarBtn: "Okay !!",
          snackbarIsOpen: !this.state.snackbarIsOpen
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
  changePassword = e => {
    e.preventDefault();
    if (this.state.newpw === this.state.cnewpw) {
      var user = firebase.auth().currentUser;
      user
        .reauthenticateAndRetrieveDataWithCredential(
          firebase.auth.EmailAuthProvider.credential(
            user.email,
            this.state.oldpw
          )
        )
        .then(() => {
          user
            .updatePassword(this.state.newpw)
            .then(()=> {
                this.setState({
                    oldpw:"",
                    newpw:"",
                    cnewpw:"",
                    snackBarMsg: "New Password Updated!",
                    snackBarBtn: "Okay !!",
                    snackbarIsOpen: !this.state.snackbarIsOpen
                  });
            })
            .catch(error=> {
              if(error.code === "auth/weak-password"){
                this.setState({
                  snackBarMsg: "Password must be > 6 !",
                  snackBarBtn: "Okay !!",
                  snackbarIsOpen: !this.state.snackbarIsOpen
                });
              }else{
                this.setState({
                    snackBarMsg: "Update Password Failed!",
                    snackBarBtn: "Okay !!",
                    snackbarIsOpen: !this.state.snackbarIsOpen
                  });
                }
            });
        })
        .catch(error => {
          this.setState({
            snackBarMsg: "Incorrect Old Password!",
            snackBarBtn: "Okay !!",
            snackbarIsOpen: !this.state.snackbarIsOpen
          });
        });
    } else {
      this.setState({
        snackBarMsg: "New Password not matched !",
        snackBarBtn: "Okay !!",
        snackbarIsOpen: !this.state.snackbarIsOpen
      });
    }
  };
  render() {
    return (
      <div style={{ paddingTop: "60px" }}>
        <Card style={{ marginTop: "10px", padding: "0px 20px 15px 20px" }}>
        <form onSubmit={this.handleUpdate}>
          <CardContent>
            <h2 style={{ margin: "0px", textAlign: "center" }}>My Profile</h2>
            <TextField
              id="email"
              label="Email"
              margin="normal"
              disabled
              value={this.props.loginuser.email}
              fullWidth
            />
            <TextField
              id="name"
              label="Name"
              inputProps={{
                autoComplete:"off",
                pattern:"[^-\\s][a-zA-Z\\s]+[a-zA-Z]+$",
                title:"Name can only contains a-z,A-Z, and space between!"
              }}
              margin="normal"
              onChange={this.handleChange}
              value={this.state.name}
              fullWidth
              required
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
              Update
            </Button>
          </CardActions>
          </form>
          <form onSubmit={this.changePassword }>
          <CardContent>
            <h2 style={{ margin: "0px", textAlign: "center" }}>
              Change password
            </h2>
            <TextField
              id="oldpw"
              label="Old Password"
              margin="normal"
              type="password"
              onChange={this.handleChange}
              value={this.state.oldpw}
              required
              fullWidth
            />
            <TextField
              id="newpw"
              label="New Password"
              margin="normal"
              type="password"
              onChange={this.handleChange}
              value={this.state.newpw}
              helperText="Password should contain 6 or more characters!"
              fullWidth
              required
            />
            <TextField
              id="cnewpw"
              label="Confirmation Password"
              margin="normal"
              type="password"
              helperText="Password should match above!"
              onChange={this.handleChange}
              value={this.state.cnewpw}
              fullWidth
              required
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
              Change Password
            </Button>
          </CardActions>
          </form>
        </Card>
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
      </div>
    );
  }
}

export default CustProfile;
