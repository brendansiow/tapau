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
} from "material-ui";
import firebase from "../firebase";
const db = firebase.firestore();
class ViewRest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurant: [],
      menu: []
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
      .onSnapshot(menus => {
        var menu = []; // capture each menu
        menus.forEach(eachmenu => {
          db
            .collection("menu")
            .doc(eachmenu.id)
            .collection("food")
            .onSnapshot(foods => {
              var statemenu = this.state.menu;
              var foodlist = []; //capture foodlist in each menu
              foods.forEach(food => {
                foodlist.push({
                  foodid: food.id,
                  foodname: food.data().foodname,
                  foodprice: food.data().foodprice
                });
                statemenu.forEach(eachstatemenu => {
                  if (eachstatemenu.id === eachmenu.id) {
                    eachstatemenu["foodlist"] = foodlist;
                  }
                });
              });
              this.setState({ menu: menu });
            });
          menu.push({
            id: eachmenu.id,
            menuname: eachmenu.data().menuname,
            visibility: eachmenu.data().visibility,
            foodlist: []
          });
        });
        this.setState({ menu: menu });
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
                  {item.foodlist.map(food => {
                    return (
                      <div key={food.foodid}>
                        <ListItem button>
                          <ListItemText primary={food.foodname} />
                          <ListItemSecondaryAction>
                            {food.foodprice}
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                      </div>
                    );
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
