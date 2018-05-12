import React, { Component } from 'react';
import Login from './Login';
import About from './About';
import Register from './Register';
import Order from './restaurant/Order';
import CustHome from './customer/CustHome';
import RestHome from './restaurant/RestHome';
import RestaurantProfile from './restaurant/RestaurantProfile';
import {
  IconButton, AppBar, Typography, Toolbar, List, Drawer, Divider, ListItem, ListItemText, Icon
} from 'material-ui';
import { Route, Link, BrowserRouter as Router, Redirect } from 'react-router-dom';
import firebase from './firebase';
const db = firebase.firestore();
db.settings({timestampsInSnapshots:true});
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      loginuser: '',
      title: '',
      isAuthenticating: true,
      isLoggingOut: false,
      loggedOut: false
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.collection("user").where("uid", "==", user.uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach(function (doc) {
              user["name"] = doc.data().name;
              user["accounttype"] = doc.data().accounttype;
            });
            this.setState({
              loginuser: user,
              isAuthenticating: false
            })
          })
          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });
      } else {
        this.setState({
          loginuser: '',
          isAuthenticating: false
        })
      }
    });
  }
  setTitle(title) {
    this.setState({
      title: title
    })
  }
  handleLogout = (e) => {
    this.setState({
      isLoggingOut: true
    })
    firebase.auth().signOut().then(() => {
      this.setState({
        snackBarMsg: "Logout Successfully !!",
        snackBarBtn: "Okay !!",
        snackbarIsOpen: !this.state.snackbarIsOpen,
        loggedOut: true,
        isLoggingOut: false
      })
    }).catch(function (error) {
      console.log(error)
    });
  }
  render() {
    if (this.state.isAuthenticating) {
      return null;
    }
    if (this.isLoggingOut) {
      return null;
    }
    return (
      <Router>
        <div>
          <AppBar position="static" style={{ backgroundColor: "#ef5350" }}>
            <Toolbar>
              <IconButton style={{ marginLeft: "-12px", marginRight: "20px" }} color="inherit" aria-label="Menu"
                onClick={() => this.setState({ open: !this.state.open })}>
                <Icon>menu</Icon>
              </IconButton>
              <Typography variant="title" color="inherit" style={{ flex: "1" }} >
                {this.state.title}
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer open={this.state.open} onClose={() => this.setState({ open: false })}>
            <div tabIndex={0} role="button" style={{ width: "250px" }}>
              <List style={{ backgroundColor: "#ef5350" }}>
                <ListItem>
                  <ListItemText style={{ color: "white", fontSize: "23px" }} primary="Welcome to Tapau" disableTypography />
                </ListItem>
              </List>
              <Divider />
              <List onClick={() => this.setState({ open: false })} onKeyDown={() => this.setState({ open: false })}>
                {!this.state.loginuser ? (
                  <Link to="/" style={{ textDecoration: "none" }}>
                    <ListItem button>
                      <ListItemText style={{ color: "black", fontSize: "20px" }} primary="Login/Sign Up" disableTypography />
                    </ListItem>
                  </Link>
                ) : [
                  this.state.loginuser.accounttype === "customer" ? (
                    <div key="customer">
                    <Link to="/" style={{ textDecoration: "none" }}>
                      <ListItem button>
                        <ListItemText style={{ color: "black", fontSize: "20px" }} primary="Home" disableTypography />
                      </ListItem>
                    </Link>
                    <Link to="/cust/mytapau" style={{ textDecoration: "none" }}>
                      <ListItem button>
                        <ListItemText style={{ color: "black", fontSize: "20px" }} primary="My Tapau" disableTypography />
                      </ListItem>
                    </Link>
                    <Link to="/cust/myprofile" style={{ textDecoration: "none" }}>
                      <ListItem button>
                        <ListItemText style={{ color: "black", fontSize: "20px" }} primary="My Profile" disableTypography />
                      </ListItem>
                    </Link>
                  </div>
                  ):(
                    <div key="restaurant">
                    <Link to="/" style={{ textDecoration: "none" }}>
                    <ListItem button>
                      <ListItemText style={{ color: "black", fontSize: "20px" }} primary="Home" disableTypography />
                    </ListItem>
                      </Link>
                    <Link to="/rest/myorder" style={{ textDecoration: "none" }}>
                    <ListItem button>
                      <ListItemText style={{ color: "black", fontSize: "20px" }} primary="My Order" disableTypography />
                    </ListItem>
                      </Link>
                      <Link to="/rest/myrestaurant" style={{ textDecoration: "none" }}>
                      <ListItem button>
                        <ListItemText style={{ color: "black", fontSize: "20px" }} primary="My Restaurant" disableTypography />
                      </ListItem>
                    </Link>
                    </div>
                  )
                ]}
                <Link to="/about" style={{ textDecoration: "none" }}>
                  <ListItem button>
                    <ListItemText style={{ color: "black", fontSize: "20px" }} primary="About" disableTypography />
                  </ListItem>
                </Link>
                {this.state.loginuser &&
                  <ListItem button onClick={this.handleLogout}>
                    <ListItemText style={{ color: "black", fontSize: "20px" }} primary="Logout" disableTypography />
                  </ListItem>
                }
              </List>
            </div>
          </Drawer>
          <HomeRoute exact path="/" setTitle={this.setTitle.bind(this)} loginuser={this.state.loginuser} />
          <GuestRoute path="/login" component={Login} setTitle={this.setTitle.bind(this)} loginuser={this.state.loginuser} />
          <GuestRoute path="/register" component={Register} setTitle={this.setTitle.bind(this)} loginuser={this.state.loginuser} />
          <RestRoute path="/rest/myorder" component={Order} setTitle={this.setTitle.bind(this)} loginuser={this.state.loginuser} />
          <RestRoute path="/rest/myrestaurant" component={RestaurantProfile} setTitle={this.setTitle.bind(this)} loginuser={this.state.loginuser} />
          <Route path="/about" render={() => <About setTitle={this.setTitle.bind(this)} />} />
        </div>
      </Router>
    );
  }
}
const HomeRoute = ({ ...rest }) => (
  <Route {...rest} render={(props) =>
    rest.loginuser ? [
      rest.loginuser.accounttype === "customer" ? (
        <CustHome key="custhome" {...props} {...rest} />
      ):(
        <RestHome key="resthome" {...props} {...rest} />
      )
     ] : (
        <Login {...props} {...rest} />
      )
  } />
);
const GuestRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) =>
    rest.loginuser ? (
      <Redirect to={{ pathname: "/" }} />
    ) : (
        <Component {...props} {...rest} />
      )}
  />
);
// const CustRoute = ({ component: Component, ...rest }) => (
//   <Route {...rest} render={(props) =>
//     rest.loginuser ? [
//       rest.loginuser.accounttype === "customer" ? (
//         <Component key="customer" {...props} {...rest} />
//       ):(
//         <Redirect key="restaurant" to={{ pathname: "/" }} />
//       )
//      ] : (
//       <Redirect to={{ pathname: "/" }} />
//       )
//   } />
//  );
 const RestRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) =>
    rest.loginuser ? [
      rest.loginuser.accounttype === "restaurant" ? (
        <Component key="restaurant" {...props} {...rest} />
      ):(
        <Redirect key="customer" to={{ pathname: "/" }} />
      )
     ] : (
      <Redirect to={{ pathname: "/" }} />
      )
  } />
 );
export default App;
