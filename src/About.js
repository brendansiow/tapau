import React, { Component } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Icon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography
} from "@material-ui/core";
import firebase from "./firebase";
const db = firebase.firestore();

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteDialog: false,
      feedbackItem: [],
      name: "",
      feedback: "",
      deleteItemid: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }
  componentDidMount() {
    this.props.setTitle("About");
    db.collection("feedback").onSnapshot(querySnapshot => {
      var feedbackitem = [];
      querySnapshot.forEach(doc => {
        feedbackitem.push({
          id: doc.id,
          name: doc.data().name,
          feedback: doc.data().feedback
        });
      });
      this.setState({ feedbackItem: feedbackitem });
    });
  }
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    db.collection("feedback")
      .add({
        name: this.state.name,
        feedback: this.state.feedback
      })
      .then(doc => {
        this.setState({
          snackBarMsg: "Your Feedback is submitted !!",
          snackBarBtn: "Okay !!",
          snackbarIsOpen: !this.state.snackbarIsOpen
        });
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
    this.setState({
      name: "",
      feedback: ""
    });
  };
  deleteConfirm = itemid => {
    this.setState({
      deleteDialog: true,
      deleteItemid: itemid
    });
  };

  handleDelete = e => {
    e.preventDefault();
    this.setState({ deleteDialog: false });
    db.collection("feedback")
      .doc(this.state.deleteItemid)
      .delete()
      .then(() => {
        this.setState({
          snackBarMsg: "Your Feedback is deleted !!",
          snackBarBtn: "Okay !!",
          snackbarIsOpen: !this.state.snackbarIsOpen
        });
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
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
        <h2 style={{ textAlign: "center" }}>
          <Icon style={{ fontSize: "30px", lineHeight: "1.3", color: "grey" }}>
            code
          </Icon>{" "}
          with <Icon style={{ lineHeight: "1.3", color: "red" }}>favorite</Icon>{" "}
          by Tapau
        </h2>
        <Typography variant="caption" style={{ textAlign: "center",paddingBottom:"20px" }}>
          Tapau v1.4
        </Typography>
        <a href="https://github.com/walaoehh/tapau" style={{ display:"block", height:"32px", width:"32px",margin:"auto"}} >
        <span
        style={{
          display:"inline-block",
          backgroundImage: "url('img/GitHub-Mark-32px.png')",
          height:"32px",
          width:"32px",
  
        }}
      >
      </span>
      </a>
        <Card style={{ marginTop: "20px", padding: "15px 20px 15px 20px" }}>
          <form onSubmit={this.handleSubmit}>
            <CardContent>
              <h3 style={{ margin: "0px", textAlign: "center" }}>
                Leave your feedback down below!
              </h3>
              <TextField
                required
                fullWidth
                label="Name"
                id="name"
                onChange={this.handleChange}
                value={this.state.name}
                margin="normal"
              />
              <TextField
                required
                fullWidth
                multiline
                label="Your feedback"
                id="feedback"
                rows="3"
                onChange={this.handleChange}
                value={this.state.feedback}
              />
            </CardContent>
            <CardActions>
              <Button
                type="submit"
                variant="raised"
                style={{
                  backgroundColor: "#EF5350",
                  color: "white",
                  width: "-webkit-fill-available"
                }}
              >
                Submit
              </Button>
            </CardActions>
          </form>
        </Card>
        <Card style={{ marginTop: "20px", padding: "15px 20px 15px 20px" }}>
          <h2 style={{ margin: "0px" }}>Feedback from users:</h2>
          <List>
            {this.state.feedbackItem.map(item => {
              return (
                <ListItem key={item.id}>
                  <ListItemText primary={item.name + " : " + item.feedback} />
                  <ListItemSecondaryAction>
                    <IconButton
                      variant="raised"
                      aria-label="Delete"
                      onClick={() => this.deleteConfirm(item.id)}
                    >
                      <Icon style={{ color: "#ef5350" }}>highlight_off</Icon>
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Card>
        <Dialog
          open={this.state.deleteDialog}
          onClose={evt => this.setState({ deleteDialog: false })}
        >
          <DialogTitle>{"Delete this feedback?"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to proceed?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={evt => this.setState({ deleteDialog: false })}
              color="primary"
            >
              No
            </Button>
            <Button onClick={this.handleDelete} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
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
export default About;
