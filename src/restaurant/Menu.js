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
  Icon,
  CardHeader,
  IconButton,
  Switch,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemSecondaryAction,
  InputAdornment
} from "@material-ui/core";
import firebase from "../firebase";
const db = firebase.firestore();
class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      createmenu: "",
      openAddFood: false,
      openDeleteFood: false,
      foodname: "",
      foodprice: "",
      snackbarIsOpen: false,
      menu: [],
      selectedMenu: "",
      foodlist: [],
      selectedFoodDelete: ""
    };
  }
  componentDidMount() {
    this.props.setTitle("My Menu");
    try {
      db.collection("menu")
        .where("rid", "==", this.props.loginuser.restaurant)
        .onSnapshot(menus => {
          var menu = []; // capture each menu
          menus.forEach(eachmenu => {
            menu.push({
              id: eachmenu.id,
              menuname: eachmenu.data().menuname,
              visibility: eachmenu.data().visibility,
              foodlist: []
            });
          });
          this.setState({ menu: menu });
        });

      db.collection("food")
        .where("rid", "==", this.props.loginuser.restaurant)
        .onSnapshot(foods => {
          var foodlist = [];
          foods.forEach(food => {
            foodlist.push({
              foodid: food.id,
              menuid: food.data().mid,
              foodname: food.data().foodname,
              foodprice: food.data().foodprice
            });
          });
          this.setState({ foodlist: foodlist });
        });
    } catch (error) {
      console.log(this.props.loginuser);
      console.log(error);
    }
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
    if (this.state.menu.length >= 3) {
      this.setState({
        snackBarMsg: "You can only have 3 menu!",
        snackBarBtn: "Okay!!",
        snackbarIsOpen: !this.state.snackbarIsOpen
      });
    } else {
      this.setState({
        open: true
      });
    }
  };
  handleClose = () => {
    this.setState({
      open: false,
      createmenu: ""
    });
  };
  openAddFoodDialog = name => event => {
    this.setState({
      openAddFood: true,
      selectedMenu: name
    });
  };
  handleCloseFoodDialog = () => {
    this.setState({
      openAddFood: false,
      foodname: "",
      foodprice: ""
    });
  };
  handleOpenDeleteFood = name => event => {
    this.setState({
      openDeleteFood: true,
      selectedFoodDelete: name
    });
  };
  handleCloseDeleteFood = () => {
    this.setState({
      openDeleteFood: false
    });
  };
  handleRequestClose = e => {
    this.setState({
      snackbarIsOpen: false
    });
  };
  createMenu = e => {
    this.handleClose();
    e.preventDefault();
    db.collection("menu")
      .add({
        rid: this.props.loginuser.restaurant,
        menuname: this.state.createmenu,
        visibility: true
      })
      .then(doc => {
        this.setState({
          snackBarMsg: "Menu Created !",
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
        db.collection("menu")
          .doc(name)
          .update({
            visibility: !doc.visibility
          })
          .then(() => {
            if (doc.visibility) {
              this.setState({
                snackBarMsg: "Your menu is invisible !",
                snackBarBtn: "Okay !!",
                snackbarIsOpen: !this.state.snackbarIsOpen
              });
            } else {
              this.setState({
                snackBarMsg: "Your menu is visible !",
                snackBarBtn: "Okay !!",
                snackbarIsOpen: !this.state.snackbarIsOpen
              });
            }
          })
          .catch(function(error) {
            console.error("Error editing document: ", error);
          });
      }
    });
  };
  handleDelete = e => {
    db.collection("menu")
      .doc(e)
      .delete()
      .then(() => {
        this.setState({
          snackBarMsg: "Your menu is deleted !",
          snackBarBtn: "Okay !!",
          snackbarIsOpen: !this.state.snackbarIsOpen
        });
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
  };
  AddFood = e => {
    e.preventDefault();
    this.handleCloseFoodDialog();
    db.collection("food")
      .add({
        rid: this.props.loginuser.restaurant,
        mid: this.state.selectedMenu,
        foodname: this.state.foodname,
        foodprice: Number(
          Math.round(this.state.foodprice + "e2") + "e-2"
        ).toFixed(2)
      })
      .then(() => {
        this.setState({
          snackBarMsg: "Your food is added to the menu !",
          snackBarBtn: "Okay !!",
          snackbarIsOpen: !this.state.snackbarIsOpen
        });
      });
  };
  DeleteFood = () => {
    this.handleCloseDeleteFood();
    db.collection("food")
      .doc(this.state.selectedFoodDelete)
      .delete()
      .then(() => {
        this.setState({
          snackBarMsg: "Your food is deleted !",
          snackBarBtn: "Okay !!",
          snackbarIsOpen: !this.state.snackbarIsOpen
        });
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });
  };
  render() {
    return (
      <div style={{ paddingTop: "60px" }}>
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
        {this.state.menu.map(item => {
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
              <CardContent style={{ paddingTop: "0px" }}>
                <Button
                  style={{
                    fontSize: "18px",
                    textTransform: "none",
                    color: "grey",
                    padding: "0"
                  }}
                  onClick={this.openAddFoodDialog(item.id)}
                >
                  <Icon style={{ color: "#ef5350" }}>add</Icon>
                  Add Item
                </Button>
                <List>
                  {this.state.foodlist.map(food => {
                    return item.id === food.menuid ? (
                      <div key={food.foodid}>
                        <ListItem
                          button
                          onClick={this.handleOpenDeleteFood(food.foodid)}
                        >
                          <ListItemText primary={food.foodname} />
                          <ListItemSecondaryAction>
                            {food.foodprice}
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                      </div>
                    ) : null;
                  })}
                </List>
              </CardContent>
            </Card>
          );
        })}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <form onSubmit={this.createMenu}>
            <DialogTitle id="form-dialog-title">Create Menu</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter your restaurant menu name :
              </DialogContentText>
              <TextField
                required
                autoFocus
                margin="dense"
                id="createmenu"
                inputProps={{
                  autoComplete: "off",
                  pattern: "[^-\\s][a-zA-Z\\s]+[a-zA-Z]+$",
                  title:
                    "Menu name can only contains a-z,A-Z, and space between!"
                }}
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
              <Button type="submit" color="primary">
                Create
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <Dialog
          open={this.state.openAddFood}
          onClose={this.handleCloseFoodDialog}
          aria-labelledby="form-dialog-title"
        >
          <form onSubmit={this.AddFood}>
            <DialogTitle id="form-dialog-title">Add Food to Menu</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter your food details :
              </DialogContentText>
              <TextField
                required
                autoFocus
                margin="dense"
                id="foodname"
                label="Food Name"
                inputProps={{
                  autoComplete: "off",
                  pattern: "[^-\\s][a-zA-Z\\s]+[a-zA-Z]+$",
                  title:
                    "Food name can only contains a-z,A-Z, and space between!"
                }}
                onChange={this.handleChange}
                value={this.state.foodname}
                fullWidth
              />
              <TextField
                required
                type="number"
                margin="dense"
                id="foodprice"
                label="Food Price"
                onChange={this.handleChange}
                value={this.state.foodprice}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">RM</InputAdornment>
                  )
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseFoodDialog} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Add
              </Button>
            </DialogActions>
          </form>
        </Dialog>
        <Dialog
          open={this.state.openDeleteFood}
          onClose={this.handleCloseDeleteFood}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Delete Food</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this food?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDeleteFood} color="primary">
              Cancel
            </Button>
            <Button color="primary" onClick={this.DeleteFood}>
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

export default Menu;
