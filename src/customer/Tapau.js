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
  Tooltip
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
        "Tapau is waiting to be collected"
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
                    !order.data().orderTime || order.data().acceptedTime === ""
                      ? ""
                      : new Date(order.data().acceptedTime.seconds * 1000),
                  collectTime:
                    !order.data().orderTime || order.data().collectTime === ""
                      ? ""
                      : new Date(order.data().collectTime.seconds * 1000),
                  preparedTime:
                    !order.data().orderTime || order.data().preparedTime === ""
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
  section = (label, order, index) => {
    switch (index) {
      case 0:
        return (
          <StepLabel>
            {label +
              "\n" +
              order.orderTime.getHours() +
              ":" +
              order.orderTime.getMinutes()}
          </StepLabel>
        );
      case 1:
        return (
          <StepLabel>
            {label +
              "\n" +
              order.acceptedTime.getHours() +
              ":" +
              order.acceptedTime.getMinutes()}
          </StepLabel>
        );
      case 2:
        return (
          <StepLabel>
            {label +
              "\n" +
              order.preparedTime.getHours() +
              ":" +
              order.preparedTime.getMinutes()}
          </StepLabel>
        );
      case 3:
        return (
          <StepLabel>
            {label +
              "\n" +
              order.collectTime.getHours() +
              ":" +
              order.collectTime.getMinutes()}
          </StepLabel>
        );
      default:
        return <div>HI</div>;
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
              {order.restname + " "}
              {order.orderTime.getDate() +
                "-" +
                (order.orderTime.getMonth() + 1) +
                "-" +
                order.orderTime.getFullYear()}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Stepper
                style={{ padding: "0" }}
                activeStep={order.activeStep}
                alternativeLabel
              >
                {this.state.steps.map(label => (
                  <Step key={label}>
                    <StepLabel>
                      {label +
                        "\n" +
                        order.orderTime.getHours() +
                        ":" +
                        order.orderTime.getMinutes()}
                    </StepLabel> 
                  </Step>
                ))}
              </Stepper>
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
              <div />
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
      </div>
    );
  }
}

export default Tapau;
