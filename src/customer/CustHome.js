import React, { Component } from "react";
import { CardContent, Card, CardActions, Icon, Button, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import firebase from "../firebase";
const db = firebase.firestore();
class CustHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: []
    };
  }
  componentDidMount() {
    this.props.setTitle("Home");
    db.collection("restaurant").onSnapshot(querySnapshot => {
      var restaurants = [];
      querySnapshot.forEach(doc => {
        restaurants.push({
          id: doc.id,
          name: doc.data().name,
          address: doc.data().address,
          contactno: doc.data().contactno,
          website: doc.data().website
        });
      });
      this.setState({ restaurants: restaurants });
    });
  }
  render() {
    return (
      <div style={{ paddingTop: "60px" }}>
        <h2 style={{ marginTop: "10px", textAlign: "center" }}>Restaurants</h2>
        {this.state.restaurants.map(rest => {
          return (
            <Card
              raised
              style={{ marginTop: "10px", padding: "0px 20px 15px 20px" }}
              key={rest.id}
            >
              <CardContent>
                <Typography variant="title" style={{ marginTop: "10px" }}>{rest.name}</Typography>
                <p>{rest.address}</p>
                <p>Contact No: {rest.contactno}</p>
                <p>Website: {rest.website}</p>
              </CardContent>
              <CardActions
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
              <Link to={{pathname:`/cust/restmenu/${rest.id}`}} style={{ textDecoration: "none" }}>
                  <Button style={{ color: "#ef5350" }}>
                    View Food Menu
                    <Icon style={{ color: "#ef5350" }}>chevron_right</Icon>
                  </Button>
                </Link>
              </CardActions>
            </Card>
          );
        })}
      </div>
    );
  }
}
export default CustHome;
