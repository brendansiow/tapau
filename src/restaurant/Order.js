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
  Button
} from "@material-ui/core";
import firebase from "../firebase";
const db = firebase.firestore();
class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderlist: []
    };
  }
  componentDidMount() {
    this.props.setTitle("My Order");
    db.collection("order")
      .where("restid", "==", this.props.loginuser.uid)
      .onSnapshot(orders => {
        var orderlist = [];
        orders.forEach(order => {
          db.collection("user")
            .where("uid", "==", order.data().custid)
            .get()
            .then(cust => {
              cust.forEach(eachcust => {
                console.log(order.data())
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
                    !order.data().acceptedTime || order.data().acceptedTime === ""
                      ? ""
                      : new Date(order.data().acceptedTime.seconds * 1000),
                  collectTime:
                    !order.data().collectTime || order.data().collectTime === ""
                      ? ""
                      : new Date(order.data().collectTime.seconds * 1000),
                  preparedTime:
                    !order.data().preparedTime || order.data().preparedTime === ""
                      ? ""
                      : new Date(order.data().preparedTime.seconds * 1000),
                  activeStep: 1
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
  StatusSection = order => {
    if (order.collectTime) {
      return (
        <span style={{ color: "#28a745" }}>
          Order is collected by customer.
        </span>
      );
    } else if (order.preparedTime) {
      return <span style={{ color: "#28a745" }}>Order is ready.</span>;
    } else if (order.acceptedTime) {
      return (
        <span style={{ color: "#17a2b8" }}>Preparing order...</span>
      );
    } else {
      return <span style={{ color: "dimgrey" }}>Waiting to be accept...</span>;
    }
  };
  ButtonSection = order => {
    if (order.collectTime) {
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
  updateAccept = order => event => {
    db.collection("order")
      .doc(order.orderid)
      .update({
        acceptedTime: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(result => {
        console.log(result);
      });
  };
  updateReady= order => event => {
    db.collection("order")
    .doc(order.orderid)
    .update({
      preparedTime: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(result => {
      console.log(result);
    });
  }
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
      </div>
    );
  }
}

export default Order;
