import React, { Component } from "react";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
  Icon,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions
} from "@material-ui/core";
import QRCode from "qrcode.react";
import axios from "axios";
import firebase from "../firebase";
const db = firebase.firestore();
class Tapau extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderlist: [],
      steps: [
        "Order made",
        "Order is waiting to be accepted",
        "Food is preparing by the restaurant",
        "Tapau is ready to be collected"
      ],
      open: false,
      tempOrder: "",
      openCancelDialog: false
    };
  }
  componentDidMount() {
    this.props.setTitle("My Tapau");
    db.collection("order")
      .where("custid", "==", this.props.loginuser.uid)
      .onSnapshot(orders => {
        var orderlist = [];
        orders.forEach(order => {
          db.collection("restaurant")
            .where("uid", "==", order.data().restid)
            .get()
            .then(rest => {
              rest.forEach(eachrest => {
                var activeStep;
                if (
                  order.data().collectTime ||
                  !order.data().collectTime === ""
                ) {
                  activeStep = 4;
                } else if (
                  order.data().preparedTime ||
                  !order.data().preparedTime === ""
                ) {
                  activeStep = 3;
                } else if (
                  order.data().acceptedTime ||
                  !order.data().acceptedTime === ""
                ) {
                  activeStep = 2;
                } else {
                  activeStep = 1;
                }
                orderlist.push({
                  orderid: order.id,
                  custid: order.data().custid,
                  restid: order.data().restid,
                  restname: eachrest.data().name,
                  restcontact: eachrest.data().contactno,
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
                    !order.data().collectTime || order.data().collectTime === ""
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
                  cancelSide: order.data().cancelSide,
                  activeStep: activeStep
                });
              });
              orderlist.sort(function(a, b) {
                return new Date(b.orderTime) - new Date(a.orderTime);
              });
              this.setState({
                orderlist: orderlist
              });
            });
        });
      });
  }
  section = (label, order, index) => {
    switch (index) {
      case 0:
        if (order.orderTime) {
          return (
            <Step key={index}>
              <StepLabel>
                {label +
                  "\n" +
                  order.orderTime.getHours() +
                  ":" +
                  order.orderTime.getMinutes()}
              </StepLabel>
            </Step>
          );
        } else {
          return (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        }

      case 1:
        if (order.cancelledTime) {
          return(
          <Step key={index}>
              <StepLabel error>
                {"Order is cancel!" +
                  "\n" +
                  order.cancelledTime.getHours() +
                  ":" +
                  order.cancelledTime.getMinutes()}
              </StepLabel>
            </Step>
          )
        } else if (order.acceptedTime) {
          return (
            <Step key={index}>
              <StepLabel>
                {"Order is accepted" +
                  "\n" +
                  order.acceptedTime.getHours() +
                  ":" +
                  order.acceptedTime.getMinutes()}
              </StepLabel>
            </Step>
          );
        } else {
          return (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        }
      case 2:
        if (order.preparedTime) {
          return (
            <Step key={index}>
              <StepLabel>
                {"Food is prepared" +
                  "\n" +
                  order.preparedTime.getHours() +
                  ":" +
                  order.preparedTime.getMinutes()}
              </StepLabel>
            </Step>
          );
        } else {
          return (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        }
      case 3:
        if (order.collectTime) {
          return (
            <Step key={index}>
              <StepLabel>
                {"Tapau is collected" +
                  "\n" +
                  order.collectTime.getHours() +
                  ":" +
                  order.collectTime.getMinutes()}
              </StepLabel>
            </Step>
          );
        } else {
          return (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        }
      default:
        return <div />;
    }
  };
  ButtonSection = order => {
    if(order.cancelledTime){
      return (
        <ExpansionPanelActions style={{justifyContent:"center"}}>
         {order.cancelSide === "cust" ? (
         <Typography variant="subheading">You cancelled this order</Typography>
         ):(
           <Typography variant="subheading">The restaurant cancelled this order</Typography>
          )}
        </ExpansionPanelActions>
      );
    }else if (order.collectTime) {
      return null;
    } else if (order.preparedTime) {
      return (
        <ExpansionPanelActions>
          <Button
            variant="raised"
            style={{
              backgroundColor: "#ef5350",
              color: "white"
            }}
            onClick={this.openDialog(order)}
          >
            Collect Order
          </Button>
        </ExpansionPanelActions>
      );
    } else if (order.acceptedTime) {
      return (
        <ExpansionPanelActions>
          <Button disabled variant="raised">
            Collect Order
          </Button>
        </ExpansionPanelActions>
      );
    } else {
      return (
        <ExpansionPanelActions>
          <Button
            variant="raised"
            style={{
              backgroundColor: "#dc3545",
              color: "white"
            }}
            onClick={this.CancelDialog(order)}
          >
            Cancel Order
          </Button>
          <Button disabled variant="raised">
            Collect Order
          </Button>
        </ExpansionPanelActions>
      );
    }
  };
  handleClose = () => {
    this.setState({
      open: false
    });
  };
  openDialog = order => event => {
    this.setState({
      tempOrder: order,
      open: true
    });
  };
  CancelDialog = order => event => {
    this.setState({
      openCancelDialog: true,
      tempOrder: order
    });
  };
  handleCloseCancelDialog = () => {
    this.setState({
      tempOrder: "",
      openCancelDialog: false
    });
  };
  updateCancel = () => {
    db.collection("order")
      .doc(this.state.tempOrder.orderid)
      .update({
        cancelledTime: firebase.firestore.FieldValue.serverTimestamp(),
        cancelSide: "cust"
      })
      .then(result => {
        var notiToken = [];
        db.collection("user")
          .where("uid", "==", this.state.tempOrder.restid)
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
                          this.props.loginuser.name +
                          " cancelled the order placed !",
                        icon: "img/logo/logo72.png",
                        click_action: "https://tapau.tk/cust/mytapau"
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
        {this.state.orderlist.map(order => (
          <ExpansionPanel key={order.orderid}>
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
                    {order.restname + " "}
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
                paddingBottom: "0px"
              }}
            >
              <Stepper
                style={{ padding: "0" }}
                activeStep={order.activeStep}
                alternativeLabel
              >
                {this.state.steps.map((label, index) =>
                  this.section(label, order, index)
                )}
              </Stepper>
              <h3 style={{ marginBottom: "0" }}>Food Ordered:</h3>
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
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>Your QRCode to collect Tapau</DialogTitle>
          <DialogContent>
            <QRCode
              value={this.state.tempOrder.orderid}
              size={1000}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"H"}
              style={{ width: "100%", height: "100%" }}
            />
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.openCancelDialog}
          onClose={this.handleCloseCancelDialog}
          fullWidth
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>Cancel Tapau</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to cancel your food order?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseCancelDialog} color="primary">
              No
            </Button>
            <Button onClick={this.updateCancel} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Tapau;
