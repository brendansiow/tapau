import React, { Component } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from "@material-ui/core";
import firebase from "../firebase";
const db = firebase.firestore();
class ViewRest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurant: [],
      menu: [],
      foodlist: []
    };
  }
  componentDidMount() {
    //get this restaurant details
    db
      .collection("restaurant")
      .doc(this.props.match.params.restid)
      .get()
      .then(doc => {
        this.setState({
          restaurant: doc.data()
        });
        this.props.setTitle(this.state.restaurant.name);
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    //get menu
    db
      .collection("menu")
      .where("rid", "==", this.props.match.params.restid)
      .where("visibility","==",true)
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

    db
      .collection("food")
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
  render() {
    return (
      <div style={{ paddingTop: "60px" }}>
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
                        <ListItem button>
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
      </div>
    );
  }
}

export default ViewRest;
