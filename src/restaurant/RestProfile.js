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
class RestProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      contactno: "",
      website: "",
      oldpw: "",
      newpw: "",
      cnewpw: ""
    };
  }
  componentDidMount() {
    this.props.setTitle("My Restaurant");
    db.collection("restaurant")
      .doc(this.props.loginuser.restaurant)
      .get()
      .then(doc => {
        this.setState({
          name: doc.data().name,
          address: doc.data().address,
          contactno: doc.data().contactno,
          website: doc.data().website
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }
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
  handleRequestClose = e => {
    this.setState({
      snackbarIsOpen: false
    });
  };
  handleUpdate = (e) => {
    e.preventDefault();
    db.collection("restaurant")
      .doc(this.props.loginuser.restaurant)
      .update({
        name: this.state.name,
        address: this.state.address,
        contactno: this.state.contactno,
        website: this.state.website
      })
      .then(() => {
        this.setState({
          snackBarMsg: "Restaurant Profile Updated !!",
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
            .then(() => {
              this.setState({
                oldpw: "",
                newpw: "",
                cnewpw: "",
                snackBarMsg: "New Password Updated!",
                snackBarBtn: "Okay !!",
                snackbarIsOpen: !this.state.snackbarIsOpen
              });
            })
            .catch(error => {
              if (error.code === "auth/weak-password") {
                this.setState({
                  snackBarMsg: "Password must be > 6 !",
                  snackBarBtn: "Okay !!",
                  snackbarIsOpen: !this.state.snackbarIsOpen
                });
              } else {
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
            <h2 style={{ margin: "0px", textAlign: "center" }}>
              My Restaurant Profile
            </h2>
            <TextField
              id="name"
              type="text"
              label="Restaurant Name"
              margin="normal"
              inputProps={{
                autoComplete:"off",
                pattern:"[^-\\s][a-zA-Z0-9-\\s]+[a-zA-Z0-9-]+$"
              }}
              onChange={this.handleChange}
              value={this.state.name}
              required
              fullWidth
            />
            <TextField
              id="address"
              type="text"
              label="Address"
              margin="normal"
              rows="3"
              multiline
              inputProps={{
                autoComplete:"off"
              }}
              onChange={this.handleChange}
              value={this.state.address}
              required
              fullWidth
            />
            <TextField
              id="contactno"
              label="Contact Number"
              margin="normal"
              fullWidth
              inputProps={{
                autoComplete:"off",
                pattern:"[^-\\s][0-9-]+$"
              }}
              onChange={this.handleChange}
              value={this.state.contactno}
              required
            />
            <TextField
              id="website"
              label="Website / Facebook Page"
              margin="normal"
              type="url"
              fullWidth
              helperText="eg:https://tapau.tk"
              onChange={this.handleChange}
              value={this.state.website}
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
          <form onSubmit={this.changePassword}>
            <CardContent>
              <h2 style={{ margin: "0px", textAlign: "center" }}>
                Change password
              </h2>
              <TextField
                id="email"
                label="Email"
                margin="normal"
                disabled
                value={this.props.loginuser.email}
                fullWidth
              />
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
                onChange={this.handleChange}
                helperText="Password should match above!"
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

export default RestProfile;
