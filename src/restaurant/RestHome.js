import React, { Component } from "react";
import QrReader from "react-qr-reader";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  GridList,
  GridListTile,
  Icon
} from "@material-ui/core";
import firebase from "../firebase";
const db = firebase.firestore();
class RestHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      orderlist: [],
      openErrorDialog: false,
      activeOrder:0,
      totalOrder:0,
      totalRevenue:0,
      totalCustomer:0

    };
    this.handleScan = this.handleScan.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  componentDidMount() {
    this.props.setTitle("Home");
    db.collection("order")
      .where("restid", "==", this.props.loginuser.uid)
      .onSnapshot(orders => {
        var orderlist = [];
        var totalOrder = 0;
        var activeOrder = 0;
        var totalRevenue = 0;
        var totalCustomer = new Set();
        orders.forEach(order => {
          orderlist.push({
            orderid: order.id,
            custid: order.data().custid,
            restid: order.data().restid,
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
            cancelledTime:
              !order.data().cancelledTime || order.data().cancelledTime === ""
                ? ""
                : new Date(order.data().cancelledTime.seconds * 1000),
            cancelSide: order.data().cancelSide
          });
          if((!order.data().cancelledTime || order.data().cancelledTime === "") && (order.data().collectTime || !order.data().collectTime  === "")){
            totalOrder++;
          }
          if((!order.data().cancelledTime || order.data().cancelledTime === "") && (!order.data().collectTime || order.data().collectTime  === "")){
            activeOrder++;
          }
          if(order.data().collectTime || !order.data().collectTime ===""){
            totalRevenue = Number(
              Math.round(
                parseFloat(order.data().total) + parseFloat(totalRevenue) + "e2"
              ) + "e-2"
            ).toFixed(2)
          }
          totalCustomer.add(order.data().custid)
        });
        orderlist.sort(function(a, b) {
          return new Date(b.orderTime) - new Date(a.orderTime);
        });
        this.setState({
          orderlist: orderlist,
          totalOrder:totalOrder,
          activeOrder: activeOrder,
          totalRevenue: totalRevenue,
          totalCustomer: totalCustomer.size 
        });
      });

  }
  handleScan(data) {
    if (data) {
      var flag = false;
      this.state.orderlist.forEach(eachorder => {
        if (data === eachorder.orderid) {
          flag = true;
        }
      });
      if (flag) {
        this.handleClose();
        this.props.history.push("/rest/myorder#" + data);
      } else {
        this.handleClose();
        this.setState({
          openErrorDialog: true
        });
      }
    }
  }
  handleError(err) {
    console.error(err);
  }
  handleClose() {
    this.setState({
      open: false
    });
  }
  openDialog() {
    this.setState({
      open: true
    });
  }
  handleCloseDialog = () => {
    this.setState({
      openErrorDialog: false
    });
  };
  render() {
    return (
      <div style={{ paddingTop: "60px" }}>
        <div style={{ display: "flex", justifyContent: "center ", marginTop: "10px" }}>
          <Button
            variant="raised"
            style={{
              backgroundColor: "#EF5350",
              color: "white",
              margin: "10px 10px 0px 0px"
            }}
            onClick={this.openDialog}
          >
            Scan QR code to search Order
          </Button>
        </div>
        <h2 style={{textAlign:"center"}}>Mini Report</h2>
        <GridList
          style={{ width: 350, height: 320, margin: "auto"}}
          cellHeight={140}
          cols={2}
        >
          <GridListTile
            key={"activeOrder"}
            cols={1}
            style={{ textAlign: "center" }}
          >
            <p style={{marginBottom:"10px"}}>
              <Icon
                style={{
                  color: "#EF5350",
                  textAlign: "center",
                  fontSize: "40px"
                }}
              >
                notifications_active
              </Icon>
            </p>
            <h3 style={{marginTop:"0"}}>Active Orders</h3>
            <h2>{this.state.activeOrder}</h2>
          </GridListTile>
          <GridListTile key={"totalOrder"} cols={1} style={{ textAlign: "center" }}>
            <p style={{marginBottom:"10px"}}>
              <Icon
                style={{
                  color: "#EF5350",
                  textAlign: "center",
                  fontSize: "40px"
                }}
              >
                check_circle
              </Icon>
            </p>
            <h3 style={{marginTop:"0"}}>Completed Orders</h3>
            <h2>{this.state.totalOrder}</h2>
          </GridListTile>
          <GridListTile key={"totalRevenue"} cols={1} style={{ textAlign: "center" }}>
            <p style={{marginBottom:"10px"}}>
              <Icon
                style={{
                  color: "#EF5350",
                  textAlign: "center",
                  fontSize: "40px"
                }}
              >
                trending_up
              </Icon>
            </p>
            <h3 style={{marginTop:"0"}}>Total Revenue</h3>
            <h2>RM {this.state.totalRevenue}</h2>
          </GridListTile>
          <GridListTile key={"totalCustomer"} cols={1} style={{ textAlign: "center" }}>
            <p style={{marginBottom:"10px"}}>
              <Icon
                style={{
                  color: "#EF5350",
                  textAlign: "center",
                  fontSize: "40px"
                }}
              >
                people
              </Icon>
            </p>
            <h3 style={{marginTop:"0"}}>Total Customers</h3>
            <h2>{this.state.totalCustomer}</h2>
          </GridListTile>
        </GridList>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>Scan QR code below</DialogTitle>
          <DialogContent>
            <QrReader
              delay={0}
              onError={this.handleError}
              onScan={this.handleScan}
              style={{ width: "100%" }}
              showViewFinder={false}
            />
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.openErrorDialog}
          onClose={this.handleCloseDialog}
          fullWidth
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText>QRCode not found!</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary">
              Okay
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default RestHome;
