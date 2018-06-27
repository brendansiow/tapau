import React, { Component } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Icon,
  Button,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress
} from "@material-ui/core";
import axios from "axios";
import firebase from "../firebase";
const db = firebase.firestore();
class CustViewMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expansionPanelOpen: false,
      menu: [],
      foodlist: [],
      cart: [],
      total: "0.00",
      ordering: false
    };
  }
  componentDidMount() {
    db.collection("restaurant")
      .doc(this.props.match.params.restid)
      .get()
      .then(doc => {
        this.props.setTitle(doc.data().name);
        this.setState({
          restaurant: doc.data()
        });
      })
      .catch(function(error) {
        console.log(error);
      });
    //get menu
    db.collection("menu")
      .where("rid", "==", this.props.match.params.restid)
      .where("visibility", "==", true)
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
      .where("rid", "==", this.props.match.params.restid)
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
  }
  addtoCart = (foodid, foodname, foodprice) => event => {
    var tempcart = this.state.cart;
    var countflag = 0;
    tempcart.forEach(food => {
      if (food.foodid === foodid) {
        food["count"] = food.count + 1;
        countflag = 1;
      }
    });
    if (countflag === 0) {
      tempcart.push({
        foodid: foodid,
        foodname: foodname,
        foodprice: foodprice,
        count: 1
      });
    }
    this.setState({
      cart: tempcart,
      total: Number(
        Math.round(
          parseFloat(this.state.total) + parseFloat(foodprice) + "e2"
        ) + "e-2"
      ).toFixed(2)
    });
  };
  addOrder = () => {
    this.setState({
      ordering: true
    });
    db.collection("order")
      .add({
        custid: this.props.loginuser.uid,
        restid: this.state.restaurant.uid,
        foodlist: this.state.cart,
        total: this.state.total,
        orderTime: firebase.firestore.FieldValue.serverTimestamp(),
        acceptedTime: "",
        preparedTime: "",
        collectTime: "",
        cancelledTime: "",
        cancelSide: ""
      })
      .then(result => {
        var notiToken = [];
        db.collection("user")
          .where("uid", "==", this.state.restaurant.uid)
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
                        title: "You have a new order !",
                        body: "From " + this.props.loginuser.name,
                        icon: "img/logo/logo72.png",
                        click_action:
                          "https://tapau.tk/rest/myorder#" + result.id
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
        this.props.history.push("/cust/mytapau#" + result.id);
      });
  };
  render() {
    return (
      <div style={{ paddingTop: "60px", paddingBottom: "70px" }}>
        {this.state.menu.map(item => {
          return (
            <Card
              raised
              style={{ marginTop: "10px", padding: "0px 20px 15px 20px" }}
              key={item.id}
            >
              <CardHeader
                title={<h3 style={{ margin: "0" }}>{item.menuname}</h3>}
              />
              <CardContent style={{ paddingTop: "0px" }}>
                <List>
                  {this.state.foodlist.map(food => {
                    return item.id === food.menuid ? (
                      <div key={food.foodid}>
                        <ListItem
                          button
                          onClick={this.addtoCart(
                            food.foodid,
                            food.foodname,
                            food.foodprice
                          )}
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
        <ExpansionPanel
          style={{
            width: "100%",
            bottom: "0",
            position: "fixed",
            backgroundColor: "#04ad4a"
          }}
        >
          <ExpansionPanelSummary
            expandIcon={<Icon style={{ color: "white" }}>expand_less</Icon>}
            style={{ color: "white" }}
          >
            {this.state.cart.length > 0 ? (
              <Badge
                badgeContent={this.state.cart.length}
                color="error"
                style={{ margin: "5px" }}
              >
                <Icon style={{ color: "white", fontSize: "25px" }}>
                  shopping_cart
                </Icon>
              </Badge>
            ) : (
              <Icon style={{ color: "white", fontSize: "25px", margin: "5px" }}>
                shopping_cart
              </Icon>
            )}
            <h3 style={{ margin: "8px", paddingLeft: "10px" }}>
              {"Total : RM" + this.state.total}
            </h3>
          </ExpansionPanelSummary>

          <ExpansionPanelDetails
            style={{
              color: "white",
              paddingTop: "0px",
              backgroundColor: "#018c3b",
              display: "block"
            }}
          >
            {this.state.cart.length > 0 ? (
              <div>
                <List
                  style={{
                    paddingTop: "0px",
                    maxHeight: 200,
                    overflow: "auto"
                  }}
                >
                  {this.state.cart.map(food => {
                    return (
                      <ListItem
                        key={food.foodid}
                        style={{ paddingBottom: "0px" }}
                      >
                        <ListItemText
                          style={{
                            color: "white",
                            minWidth: "120px",
                            flex: "none",
                            maxWidth: "170px",
                            textOverflow: "ellipsis",
                            overflow: "hidden"
                          }}
                          disableTypography
                          primary={food.foodname}
                        />
                        <span>x {food.count}</span>
                        <ListItemSecondaryAction style={{ paddingTop: "12px" }}>
                          {food.foodprice}
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    style={{
                      color: "white",
                      margin: "10px 10px 0px 0px"
                    }}
                    onClick={() => {
                      this.setState({
                        cart: [],
                        total: "0.00"
                      });
                    }}
                  >
                    Clear Cart
                    <Icon
                      style={{
                        color: "white",
                        fontSize: "20px",
                        marginLeft: "5px"
                      }}
                    >
                      remove_shopping_cart
                    </Icon>
                  </Button>
                  <Button
                    style={{ color: "white", margin: "10px 10px 0px 0px" }}
                    onClick={this.addOrder}
                  >
                    Order
                    <Icon
                      style={{
                        color: "white",
                        fontSize: "25px",
                        marginLeft: "5px"
                      }}
                    >
                      send
                    </Icon>
                  </Button>
                </div>
              </div>
            ) : (
              <h2
                style={{
                  margin: "0",
                  paddingTop: "20px",
                  textAlign: "center"
                }}
              >
                Your cart is empty
              </h2>
            )}
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <Dialog
          open={this.state.ordering}
          fullWidth
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle style={{ textAlign: "center" }}>
            Placing your order...
          </DialogTitle>
          <DialogContent style={{ textAlign: "center" }}>
            <CircularProgress
              style={{ color: "#ef5350" }}
              size={50}
              thickness={5}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default CustViewMenu;
