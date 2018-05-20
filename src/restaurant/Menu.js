import React, { Component } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  DialogTitle,
  Snackbar,
  Card,
  CardContent,
  CardActions,
  Icon,
  CardHeader,
  IconButton,
  Switch
} from "material-ui";
import firebase from "../firebase";
const db = firebase.firestore();
class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      createmenu: "",
      snackbarIsOpen: false,
      menu: []
    };
  }
  componentDidMount() {
    this.props.setTitle("My Menu");
    db.collection("menu")
      .where("rid", "==", this.props.loginuser.restaurant)
      .onSnapshot(querySnapshot => {
        var menu = [];
        querySnapshot.forEach(doc => {
          menu.push({
            id: doc.id,
            menuname: doc.data().menuname,
            visibility: doc.data().visibility
          });
        });
         this.setState({ menu: menu })
      })
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
  openDialog = () => {
    this.setState({
      open: true
    });
  };
  handleClose = () => {
    this.setState({
      open: false
    });
  };
  handleRequestClose = e => {
    this.setState({
      snackbarIsOpen: false
    });
  };
  createMenu = () => {
    db
      .collection("menu")
      .add({
        rid: this.props.loginuser.restaurant,
        menuname: this.state.createmenu,
        visibility: true
      })
      .then(doc => {
        this.setState({
          snackBarMsg: "Menu Created !!",
          snackBarBtn: "Okay !!",
          open: false,
          snackbarIsOpen: !this.state.snackbarIsOpen,
          createmenu: ""
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
  handleCheck = name => event => {
    var menu = this.state.menu;
    menu.forEach(doc => {
      if (doc.id === name) {
        doc.visibility = !doc.visibility;
      }
    });
    this.setState({ menu: menu });
  };
  handleDelete = e => {
    db
      .collection("menu")
      .doc(e)
      .delete()
      .then(() => {
        this.setState({
          snackBarMsg: "Your Menu is deleted !!",
          snackBarBtn: "Okay !!",
          snackbarIsOpen: !this.state.snackbarIsOpen,
          menu: []
        });
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
  };
  render() {
    return (
      <div style={{ paddingTop: "60px" }}>
        {this.state.menu.length === 0 ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="raised"
              style={{
                backgroundColor: "#EF5350",
                color: "white",
                margin: "10px 10px 0px 0px"
              }}
              onClick={this.openDialog}
            >
              Create Menu
            </Button>
          </div>
        ) : (
          this.state.menu.map(item => {
            return (
              <Card
                raised
                style={{ marginTop: "10px", padding: "0px 20px 15px 20px" }}
                key={item.id}
              >
                <CardHeader
                  action={
                    <div>
                      <Switch
                        checked={item.visibility}
                        value={item.id}
                        onChange={this.handleCheck(item.id)}
                      />
                      <IconButton onClick={() => this.handleDelete(item.id)}>
                        <Icon style={{ color: "#ef5350" }}>delete</Icon>
                      </IconButton>
                    </div>
                  }
                  title={<h3 style={{ margin: "0" }}>{item.menuname}</h3>}
                />
                <CardActions>
                  <IconButton style={{ marginLeft: "auto",fontSize:"20px" }}>
                    <Icon style={{ color: "#ef5350" }}>add</Icon>
                    Add
                  </IconButton>
                </CardActions>
              </Card>
            );
          })
        )}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create Menu</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter your restaurant menu name :
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="createmenu"
              label="Menu Name"
              onChange={this.handleChange}
              value={this.state.createmenu}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.createMenu} color="primary">
              Create
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

export default Menu;
