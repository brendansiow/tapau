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
  Grid
} from "@material-ui/core";
import firebase from "../firebase";
const db = firebase.firestore();
class Tapau extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderlist: [],
      steps: [
        "Order made",
        "Order is accepting by restaurant",
        "Food is preparing by the restaurant",
        "Tapau is ready to be collected"
      ]
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
              <StepLabel>{label + "\n"}</StepLabel>
            </Step>
          );
        }

      case 1:
        if (order.acceptedTime) {
          return (
            <Step key={index}>
              <StepLabel>
                {label +
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
              <StepLabel>{label + "\n"}</StepLabel>
            </Step>
          );
        }
      case 2:
        if (order.preparedTime) {
          return (
            <Step key={index}>
              <StepLabel>
                {label +
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
              <StepLabel>{label + "\n"}</StepLabel>
            </Step>
          );
        }
      case 3:
        if (order.collecTime) {
          return (
            <Step key={index}>
              <StepLabel>
                {label +
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
              <StepLabel>{label + "\n"}</StepLabel>
            </Step>
          );
        }
      default:
        return <div />;
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
              backgroundColor: "#ef5350",
              color: "white"
            }}
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
      </div>
    );
  }
}

export default Tapau;
