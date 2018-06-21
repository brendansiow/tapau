import React, { Component } from "react";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
  Grid,
  Icon,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ListSubheader
} from "@material-ui/core";
import QrReader from "react-qr-reader";
import axios from "axios";
import firebase from "../firebase";
const db = firebase.firestore();
class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderlist: [],
      openQR: false,
      QRCodeOrder: "",
      openCollectDialog: false,
      openErrorDialog: false,
      activeOrder: this.props.location.hash.slice(1),
      activeOrders: [],
      completedOrders: []
    };
  }
  componentDidMount() {
    this.props.setTitle("My Order");
    db.collection("order")
      .where("restid", "==", this.props.loginuser.uid)
      .onSnapshot(orders => {
        var orderlist = [];
        var activeOrders = [];
        var completedOrders = [];
        var promisearr = [];
        orders.forEach(order => {
          promisearr.push(
            new Promise((resolve, reject) => {
              db.collection("user")
                .where("uid", "==", order.data().custid)
                .get()
                .then(cust => {
                  cust.forEach(eachcust => {
                    orderlist.push({
                      orderid: order.id,
                      custid: order.data().custid,
                      restid: order.data().restid,
                      custname: eachcust.data().name,
                      custcontact: eachcust.data().contactno,
                      total: order.data().total,
                      foodlist: order.data().foodlist,
                      orderTime:
                        !order.data().orderTime || order.data().orderTime === ""
                          ? ""
                          : new Date(order.data().orderTime.seconds * 1000),
                      acceptedTime:
                        !order.data().acceptedTime ||
                        order.data().acceptedTime === ""
                          ? ""
                          : new Date(order.data().acceptedTime.seconds * 1000),
                      collectTime:
                        !order.data().collectTime ||
                        order.data().collectTime === ""
                          ? ""
                          : new Date(order.data().collectTime.seconds * 1000),
                      preparedTime:
                        !order.data().preparedTime ||
                        order.data().preparedTime === ""
                          ? ""
                          : new Date(order.data().preparedTime.seconds * 1000),
                      cancelledTime:
                        !order.data().cancelledTime ||
                        order.data().cancelledTime === ""
                          ? ""
                          : new Date(order.data().cancelledTime.seconds * 1000),
                      cancelSide: order.data().cancelSide
                    });
                    resolve();
                  });
                });
            })
          );
        });
        Promise.all(promisearr).then(() => {
          while (orderlist.length > 0) {
            if (
              orderlist[orderlist.length - 1].cancelledTime !== "" ||
              orderlist[orderlist.length - 1].collectTime !== ""
            ) {
              completedOrders.push(orderlist.splice(orderlist.length - 1)[0]);
            } else {
              activeOrders.push(orderlist.splice(orderlist.length - 1)[0]);
            }
          }
          activeOrders.sort(function(a, b) {
            return new Date(b.orderTime) - new Date(a.orderTime);
          });
          completedOrders.sort(function(a, b) {
            return new Date(b.orderTime) - new Date(a.orderTime);
          });
          this.setState({
            activeOrders: activeOrders,
            completedOrders: completedOrders
          });
        });
      });
  }
  componentDidUpdate() {
    let anchorElement = document.getElementById(this.state.activeOrder);
    if (anchorElement) {
      anchorElement.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }
  StatusSection = order => {
    if (order.cancelledTime) {
      return <span style={{ color: "#dc3545" }}>Order is cancelled.</span>;
    } else if (order.collectTime) {
      return <span style={{ color: "#28a745" }}>Order is collected.</span>;
    } else if (order.preparedTime) {
      return <span style={{ color: "#28a745" }}>Order is ready.</span>;
    } else if (order.acceptedTime) {
      return <span style={{ color: "#17a2b8" }}>Preparing order...</span>;
    } else {
      return <span style={{ color: "dimgrey" }}>Waiting to be accept...</span>;
    }
  };
  ButtonSection = order => {
    if (order.cancelledTime) {
      return (
        <ExpansionPanelActions style={{ justifyContent: "center" }}>
          {order.cancelSide === "rest" ? (
            <Typography variant="subheading">
              You cancelled this order
            </Typography>
          ) : (
            <Typography variant="subheading">
              The customer cancelled this order
            </Typography>
          )}
        </ExpansionPanelActions>
      );
    } else if (order.collectTime) {
      return null;
    } else if (order.preparedTime) {
      return (
        <ExpansionPanelActions>
          <Button
            variant="raised"
            style={{
              backgroundColor: "#EF5350",
              color: "white"
            }}
            onClick={this.openDialog(order)}
          >
            Scan QR
          </Button>
        </ExpansionPanelActions>
      );
    } else if (order.acceptedTime) {
      return (
        <ExpansionPanelActions>
          <Button
            variant="raised"
            style={{
              backgroundColor: "#EF5350",
              color: "white"
            }}
            onClick={this.updateReady(order)}
          >
            Update status to Order is Ready
          </Button>
        </ExpansionPanelActions>
      );
    } else {
      return (
        <ExpansionPanelActions>
          <Button
            variant="raised"
            style={{
              backgroundColor: "grey",
              color: "white"
            }}
            onClick={this.updateCancel(order)}
          >
            Cancel Order
          </Button>
          <Button
            variant="raised"
            style={{
              backgroundColor: "#EF5350",
              color: "white"
            }}
            onClick={this.updateAccept(order)}
          >
            Accept Order
          </Button>
        </ExpansionPanelActions>
      );
    }
  };
  handleScan = data => {
    if (data) {
      if (data === this.state.validateOrder.orderid) {
        this.setState({
          QRCodeOrder: data,
          openQR: false,
          openCollectDialog: true
        });
      } else {
        this.setState({
          openQR: false,
          openErrorDialog: true
        });
      }
    }
  };
  handleError(err) {
    console.error(err);
  }
  handleClose = () => {
    this.setState({
      openQR: false
    });
  };
  handleCloseCollectDialog = () => {
    this.setState({
      openCollectDialog: false
    });
  };
  handleCloseErrorDialog = () => {
    this.setState({
      openErrorDialog: false
    });
  };
  openDialog = data => event => {
    this.setState({
      openQR: true,
      validateOrder: data
    });
  };
  updateAccept = order => event => {
    db.collection("order")
      .doc(order.orderid)
      .update({
        acceptedTime: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(result => {
        var notiToken = [];
        db.collection("user")
          .where("uid", "==", order.custid)
          .get()
          .then(users => {
            users.forEach(user => {
              notiToken = user.data().notiToken;
              var config = {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "key=AIzaSyAf8VujthnxpjeyZL_zki8npcxaBhH-L_4"
                }
              };
              notiToken.forEach(eachToken => {
                axios
                  .post(
                    "https://fcm.googleapis.com/fcm/send",
                    {
                      notification: {
                        title: "You order has been accepted!",
                        body: "From " + this.props.loginuser.restname,
                        icon: "img/logo/logo72.png",
                        click_action:
                          "https://tapau.tk/cust/mytapau#" + order.orderid
                      },
                      to: eachToken
                    },
                    config
                  )
                  .then(function(response) {
                    console.log(response);
                  })
                  .catch(function(error) {
                    console.log(error);
                  });
              });
            });
          });
      });
  };
  updateReady = order => event => {
    db.collection("order")
      .doc(order.orderid)
      .update({
        preparedTime: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(result => {
        var notiToken = [];
        db.collection("user")
          .where("uid", "==", order.custid)
          .get()
          .then(users => {
            users.forEach(user => {
              notiToken = user.data().notiToken;
              var config = {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "key=AIzaSyAf8VujthnxpjeyZL_zki8npcxaBhH-L_4"
                }
              };
              notiToken.forEach(eachToken => {
                axios
                  .post(
                    "https://fcm.googleapis.com/fcm/send",
                    {
                      notification: {
                        title: "You order is ready to collect!",
                        body:
                          "Please show your QRCode upon collection.From " +
                          this.props.loginuser.restname,
                        icon: "img/logo/logo72.png",
                        click_action:
                          "https://tapau.tk/cust/mytapau#" + order.orderid
                      },
                      to: eachToken
                    },
                    config
                  )
                  .then(function(response) {
                    console.log(response);
                  })
                  .catch(function(error) {
                    console.log(error);
                  });
              });
            });
          });
      });
  };
  updateCollect = () => {
    this.handleCloseCollectDialog();
    db.collection("order")
      .doc(this.state.QRCodeOrder)
      .update({
        collectTime: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(result => {
        var notiToken = [];
        db.collection("user")
          .where("uid", "==", this.state.validateOrder.custid)
          .get()
          .then(users => {
            users.forEach(user => {
              notiToken = user.data().notiToken;
              var config = {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "key=AIzaSyAf8VujthnxpjeyZL_zki8npcxaBhH-L_4"
                }
              };
              notiToken.forEach(eachToken => {
                axios
                  .post(
                    "https://fcm.googleapis.com/fcm/send",
                    {
                      notification: {
                        title: "You have collected your order!",
                        body:
                          "Thanks for choosing us! See You.From " +
                          this.props.loginuser.restname,
                        icon: "img/logo/logo72.png",
                        click_action:
                          "https://tapau.tk/cust/mytapau#" +
                          this.state.QRCodeOrder
                      },
                      to: eachToken
                    },
                    config
                  )
                  .then(function(response) {
                    console.log(response);
                  })
                  .catch(function(error) {
                    console.log(error);
                  });
              });
            });
          });
      });
  };
  updateCancel = order => event => {
    db.collection("order")
      .doc(order.orderid)
      .update({
        cancelledTime: firebase.firestore.FieldValue.serverTimestamp(),
        cancelSide: "rest"
      })
      .then(result => {
        var notiToken = [];
        db.collection("user")
          .where("uid", "==", order.custid)
          .get()
          .then(users => {
            users.forEach(user => {
              notiToken = user.data().notiToken;
              var config = {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "key=AIzaSyAf8VujthnxpjeyZL_zki8npcxaBhH-L_4"
                }
              };
              notiToken.forEach(eachToken => {
                axios
                  .post(
                    "https://fcm.googleapis.com/fcm/send",
                    {
                      notification: {
                        title: "Order is cancelled",
                        body:
                          "Sorry, we cant prepared your order right now! From: " +
                          this.props.loginuser.restname,
                        icon: "img/logo/logo72.png",
                        click_action:
                          "https://tapau.tk/cust/mytapau#" + order.orderid
                      },
                      to: eachToken
                    },
                    config
                  )
                  .then(function(response) {
                    console.log(response);
                  })
                  .catch(function(error) {
                    console.log(error);
                  });
              });
            });
          });
      });
  };
  render() {
    return (
      <div style={{ paddingTop: "60px" }}>
        <ListSubheader style={{ fontSize: "15px" }}>
          Active Orders
        </ListSubheader>
        {this.state.activeOrders.map(order => (
          <ExpansionPanel
            id={order.orderid}
            key={order.orderid}
            defaultExpanded={order.orderid === this.state.activeOrder}
          >
            <ExpansionPanelSummary
              expandIcon={
                <Icon style={{ color: "#ef5350 ", fontSize: "25px" }}>
                  expand_more
                </Icon>
              }
            >
              <Grid container spacing={24}>
                <Grid item xs={12} style={{ paddingBottom: "0" }}>
                  <Typography variant="title">
                    {order.custname + " "}
                  </Typography>
                </Grid>
                {order.orderTime && (
                  <Grid item xs={12} style={{ paddingTop: "0" }}>
                    <Typography variant="subheading">
                      {" "}
                      {order.orderTime.getDate() +
                        "-" +
                        (order.orderTime.getMonth() + 1) +
                        "-" +
                        order.orderTime.getFullYear()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              style={{
                display: "block",
                paddingTop: "0px",
                paddingBottom: "0px"
              }}
            >
              <h3 style={{ margin: "0" }}>
                Status: {this.StatusSection(order)}
              </h3>
              <h3 style={{ margin: "0" }}>Food Ordered:</h3>
              <List>
                {order.foodlist.map(food => (
                  <div key={food.foodid}>
                    <ListItem>
                      <ListItemText
                        primary={food.foodname}
                        style={{
                          minWidth: "120px",
                          flex: "none",
                          maxWidth: "170px",
                          textOverflow: "ellipsis",
                          overflow: "hidden"
                        }}
                      />
                      <span>x {food.count}</span>
                      <ListItemSecondaryAction>
                        {food.foodprice}
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </div>
                ))}
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="subheading">
                        Total Amount :
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    {order.total}
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </ExpansionPanelDetails>
            <Divider />
            {this.ButtonSection(order)}
          </ExpansionPanel>
        ))}
        <ListSubheader style={{ fontSize: "15px" }}>
          Completed Orders
        </ListSubheader>
        {this.state.completedOrders.map(order => (
          <ExpansionPanel
            id={order.orderid}
            key={order.orderid}
            defaultExpanded={order.orderid === this.state.activeOrder}
          >
            <ExpansionPanelSummary
              expandIcon={
                <Icon style={{ color: "#ef5350 ", fontSize: "25px" }}>
                  expand_more
                </Icon>
              }
            >
              <Grid container spacing={24}>
                <Grid item xs={12} style={{ paddingBottom: "0" }}>
                  <Typography variant="title">
                    {order.custname + " "}
                  </Typography>
                </Grid>
                {order.orderTime && (
                  <Grid item xs={12} style={{ paddingTop: "0" }}>
                    <Typography variant="subheading">
                      {" "}
                      {order.orderTime.getDate() +
                        "-" +
                        (order.orderTime.getMonth() + 1) +
                        "-" +
                        order.orderTime.getFullYear()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              style={{
                display: "block",
                paddingTop: "0px",
                paddingBottom: "0px"
              }}
            >
              <h3 style={{ margin: "0" }}>
                Status: {this.StatusSection(order)}
              </h3>
              <h3 style={{ margin: "0" }}>Food Ordered:</h3>
              <List>
                {order.foodlist.map(food => (
                  <div key={food.foodid}>
                    <ListItem>
                      <ListItemText
                        primary={food.foodname}
                        style={{
                          minWidth: "120px",
                          flex: "none",
                          maxWidth: "170px",
                          textOverflow: "ellipsis",
                          overflow: "hidden"
                        }}
                      />
                      <span>x {food.count}</span>
                      <ListItemSecondaryAction>
                        {food.foodprice}
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </div>
                ))}
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="subheading">
                        Total Amount :
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    {order.total}
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </ExpansionPanelDetails>
            <Divider />
            {this.ButtonSection(order)}
          </ExpansionPanel>
        ))}
        <Dialog
          open={this.state.openQR}
          onClose={this.handleClose}
          fullWidth
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>Scan QR code below</DialogTitle>
          <DialogContent>
            <QrReader
              onError={this.handleError}
              onScan={this.handleScan}
              style={{ width: "100%" }}
              showViewFinder={false}
            />
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.openErrorDialog}
          onClose={this.handleCloseErrorDialog}
          fullWidth
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle style={{ color: "red" }}>
            The QRCode is wrong!
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Your customer showed a wrong QRCode for this order!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseErrorDialog} color="primary">
              Okay
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.openCollectDialog}
          onClose={this.handleCloseCollectDialog}
          fullWidth
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>The QRCode matches!</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure your customer wish to collect the order?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseCollectDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.updateCollect} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Order;
