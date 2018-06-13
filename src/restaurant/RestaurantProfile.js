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
class RestaurantProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      contactno: "",
      website: ""
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
        console.log("Error getting documents: ", error);
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
  handleUpdate = () => {
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
  render() {
    return (
      <div style={{ paddingTop: "60px" }}>
        <Card style={{ marginTop: "10px", padding: "0px 20px 15px 20px" }}>
          <CardContent>
            <h2 style={{ margin: "0px", textAlign: "center" }}>
              My Restaurant Profile
            </h2>
            <TextField
              id="name"
              label="Restaurant Name"
              margin="normal"
              onChange={this.handleChange}
              value={this.state.name}
              fullWidth
            />
            <TextField
              id="address"
              label="Address"
              margin="normal"
              rows="3"
              multiline
              onChange={this.handleChange}
              value={this.state.address}
              fullWidth
            />
            <TextField
              id="contactno"
              label="Contact Number"
              margin="normal"
              fullWidth
              onChange={this.handleChange}
              helperText="Password should contain 6 or more characters!"
              value={this.state.contactno}
            />
            <TextField
              id="website"
              label="Website / Facebook Page"
              margin="normal"
              fullWidth
              onChange={this.handleChange}
              value={this.state.website}
            />
          </CardContent>
          <CardActions style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="raised"
              style={{
                backgroundColor: "#EF5350",
                color: "white",
                margin: "10px 10px 0px 0px"
              }}
              onClick={this.handleUpdate}
            >
              Update
            </Button>
          </CardActions>
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

export default RestaurantProfile;
