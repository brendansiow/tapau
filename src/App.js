import React, { Component } from "react";
import Login from "./Login";
import About from "./About";
import Register from "./Register";
import Order from "./restaurant/Order";
import CustHome from "./customer/CustHome";
import RestHome from "./restaurant/RestHome";
import RestProfile from "./restaurant/RestProfile";
import Menu from "./restaurant/Menu";
import Takeaway from "./customer/Takeaway";
import CustProfile from "./customer/CustProfile";
import CustViewMenu from "./customer/CustViewMenu";
import {
  IconButton,
  AppBar,
  Typography,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemText,
  Icon,
  CircularProgress,
  Snackbar,
  SwipeableDrawer,
  Menu as MenuUI,
  ListItemSecondaryAction,
  Badge
} from "@material-ui/core";
import { Route, Link, Redirect, withRouter } from "react-router-dom";
import firebase from "./firebase";
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      loginuser: "",
      title: "",
      isAuthenticating: true,
      isLoggingOut: false,
      loggedOut: false,
      snackbarIsOpen: false,
      snackBarMsg: "",
      token: "",
      notification: [],
      anchorEl: null,
      seen: true
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      //if log in successfully, get user information
      if (user) {
        db.collection("user")
          .where("uid", "==", user.uid)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              user["name"] = doc.data().name;
              user["accounttype"] = doc.data().accounttype;
              //get and set fcm token
              if ("Notification" in window) {
                const msg = firebase.messaging();
                msg
                  .requestPermission()
                  .then(() => {
                    console.log("have permission");
                    return msg.getToken();
                  })
                  .then(token => {
                    this.setState({
                      token: token
                    });
                    //update this device token to current logged in user
                    var tokenupdate = doc.data().notiToken;
                    if (tokenupdate) {
                      if (!(tokenupdate.indexOf(token) > -1)) {
                        tokenupdate.push(token);
                      }
                    } else {
                      tokenupdate = [];
                      tokenupdate.push(token);
                    }
                    db.collection("user")
                      .doc(doc.id)
                      .update({
                        notiToken: tokenupdate
                      });
                    //delete this device token to all of the existing users
                    db.collection("user")
                      .get()
                      .then(allusers => {
                        allusers.forEach(eachuser => {
                          var notiTokenarr = eachuser.data().notiToken;
                          if (
                            notiTokenarr &&
                            eachuser.data().uid !== user.uid
                          ) {
                            var index = notiTokenarr.indexOf(token);
                            if (index !== -1) {
                              notiTokenarr.splice(index, 1);
                            }
                            db.collection("user")
                              .doc(eachuser.id)
                              .update({
                                notiToken: notiTokenarr
                              });
                          }
                        });
                      });
                  })
                  .catch(err => {
                    console.log(err);
                  });
              } else {
                this.setState({
                  notification: [{
                    title: "Your browser does not support Web Notification !",
                    body:"You will not receive any notification from now.",
                    click_action:"https://tapau.tk"
                  }],
                  snackbarIsOpen: true,
                  snackBarMsg: "Web notification not supported!",
                  seen: false
                });
              }
            });
            //if user is a restaurant owner, get restaurant id
            if (user["accounttype"] === "restaurant") {
              db.collection("restaurant")
                .where("uid", "==", user.uid)
                .get()
                .then(querySnapshot => {
                  querySnapshot.forEach(function(doc) {
                    user["restaurant"] = doc.id;
                    user["restname"] = doc.data().name;
                  });
                  this.setState({
                    loginuser: user,
                    isAuthenticating: false
                  });
                });
            } else {
              this.setState({
                loginuser: user,
                isAuthenticating: false
              });
            }
          })
          .catch(function(error) {
            console.log("Error getting documents: ", error);
          });
      } else {
        this.setState({
          loginuser: "",
          isAuthenticating: false
        });
        this.props.history.push("/");
      }
    });
    if ("Notification" in window) {
      const msg = firebase.messaging();
      msg.onMessage(payload => {
        console.log(payload);
        let notiarr = this.state.notification;
        notiarr.unshift(payload.notification);
        this.setState({
          notification: notiarr,
          snackbarIsOpen: true,
          snackBarMsg: payload.notification.title,
          seen: false
        });
      });
    }
  }
  componentWillReceiveProps(props) {
    this.unblock = this.props.history.block((location, action) => {
      if (this.state.open) {
        if (action === "POP") {
          this.setState({
            open: false
          });
          this.unblock();
          return false;
        } else {
          this.unblock();
          return true;
        }
      }
      this.unblock();
      return true;
    });
  }
  setTitle(title) {
    this.setState({
      title: title
    });
  }
  handleRequestClose = e => {
    this.setState({
      snackbarIsOpen: false
    });
  };
  handleLogout = e => {
    this.setState({
      isLoggingOut: true
    });
    firebase
      .auth()
      .signOut()
      .then(() => {
        // clear token
        db.collection("user")
          .where("uid", "==", this.state.loginuser.uid)
          .get()
          .then(querySnapshot => {
            var tokens = [];
            var uid = "";
            querySnapshot.forEach(function(doc) {
              uid = doc.id;
              tokens = doc.data().notiToken;
            });
            var index = tokens.indexOf(this.state.token);
            if (index !== -1) {
              tokens.splice(index, 1);
            }
            db.collection("user")
              .doc(uid)
              .update({
                notiToken: tokens
              });
          });
        this.setState({
          snackBarMsg: "Logout Successfully !!",
          snackBarBtn: "Okay !!",
          snackbarIsOpen: !this.state.snackbarIsOpen,
          loggedOut: true,
          isLoggingOut: false
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  handleOpenNoti = event => {
    this.setState({ anchorEl: event.currentTarget, seen: true });
  };
  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (this.state.isAuthenticating) {
      return (
        <div style={{ marginTop: "50%", textAlign: "center" }}>
          <CircularProgress
            style={{ color: "#ef5350" }}
            size={80}
            thickness={5}
          />
          <h2>Patience is a virtue...</h2>
        </div>
      );
    }
    if (this.isLoggingOut) {
      return (
        <div style={{ marginTop: "50%", textAlign: "center" }}>
          <CircularProgress
            style={{ color: "#ef5350" }}
            size={80}
            thickness={5}
          />
          <h2>Patience is a virtue...</h2>
        </div>
      );
    }
    return (
      <div>
        <AppBar position="fixed" style={{ backgroundColor: "#ef5350" }}>
          <Toolbar>
            <IconButton
              style={{ marginLeft: "-12px", marginRight: "20px" }}
              color="inherit"
              aria-label="Menu"
              onClick={() =>
                this.setState({
                  open: true
                })
              }
            >
              <Icon>menu</Icon>
            </IconButton>
            <Typography
              variant="title"
              color="inherit"
              style={{
                flex: "1",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {this.state.title}
            </Typography>
            {this.state.loginuser &&
              (this.state.notification.length > 0 && !this.state.seen ? (
                <Badge
                  badgeContent=""
                  color="primary"
                  classes={{
                    badge: "badge-position"
                  }}
                >
                  <IconButton
                    style={{ marginLeft: "5px" }}
                    color="inherit"
                    aria-label="notification"
                    onClick={this.handleOpenNoti}
                  >
                    <Icon>notifications_active</Icon>
                  </IconButton>
                </Badge>
              ) : (
                <IconButton
                  style={{ marginLeft: "5px" }}
                  color="inherit"
                  aria-label="notification"
                  onClick={this.handleOpenNoti}
                >
                  <Icon>notifications</Icon>
                </IconButton>
              ))}
          </Toolbar>
        </AppBar>
        <MenuUI
          id="notification-menu"
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleClose}
        >
          <List style={{ padding: "0px", outline: "none" }}>
            <h2
              style={{
                textAlign: "center",
                marginLeft: "20px",
                marginRight: "20px"
              }}
            >
              Notifications
            </h2>
            {this.state.notification.length < 1 && (
              <React.Fragment>
                <Divider />
                <ListItem>
                  <ListItemText
                    style={{ paddingLeft: "16px" }}
                    primary="You have no notification now !"
                  />
                </ListItem>
              </React.Fragment>
            )}
            {this.state.notification.map((noti, index) => (
              <React.Fragment key={index}>
                <Divider />
                <Link
                  key={index}
                  to={noti.click_action.substring(16, noti.click_action.length)}
                  style={{ textDecoration: "none" }}
                >
                  <ListItem button onClick={this.handleClose}>
                    <ListItemText primary={noti.title + " " + noti.body} />
                    <ListItemSecondaryAction>
                      <Icon
                        style={{
                          fontSize: "30px",
                          lineHeight: "1.2",
                          color: "#ef5350"
                        }}
                      >
                        keyboard_arrow_right
                      </Icon>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Link>
              </React.Fragment>
            ))}
          </List>
        </MenuUI>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          open={this.state.snackbarIsOpen}
          onClose={this.handleRequestClose}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          autoHideDuration={3000}
          message={<span id="message-id">{this.state.snackBarMsg}</span>}
        />
        <SwipeableDrawer
          open={this.state.open}
          onOpen={() =>
            this.setState({
              open: true
            })
          }
          onClose={() =>
            this.setState({
              open: false
            })
          }
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
        >
          <List style={{ backgroundColor: "#ef5350" }}>
            <ListItem>
              <ListItemText
                style={{ color: "white", fontSize: "23px" }}
                primary="Welcome to Tapau"
                disableTypography
              />
            </ListItem>
          </List>
          <List
            onClick={() => this.setState({ open: false })}
            onKeyDown={() => this.setState({ open: false })}
            style={{ outline: "none" }}
          >
            {!this.state.loginuser ? (
              <Link to="/" style={{ textDecoration: "none" }}>
                <ListItem button>
                  <ListItemText
                    style={{ color: "black", fontSize: "20px" }}
                    primary="Login/Sign Up"
                    disableTypography
                  />
                </ListItem>
              </Link>
            ) : (
              [
                this.state.loginuser.accounttype === "customer" ? (
                  <div key="customer">
                    <Link to="/" style={{ textDecoration: "none" }}>
                      <ListItem button>
                        <ListItemText
                          style={{ color: "black", fontSize: "20px" }}
                          primary="Home"
                          disableTypography
                        />
                      </ListItem>
                    </Link>
                    <Link to="/cust/mytapau" style={{ textDecoration: "none" }}>
                      <ListItem button>
                        <ListItemText
                          style={{ color: "black", fontSize: "20px" }}
                          primary="My Tapau"
                          disableTypography
                        />
                      </ListItem>
                    </Link>
                    <Link
                      to="/cust/myprofile"
                      style={{ textDecoration: "none" }}
                    >
                      <ListItem button>
                        <ListItemText
                          style={{ color: "black", fontSize: "20px" }}
                          primary="My Profile"
                          disableTypography
                        />
                      </ListItem>
                    </Link>
                  </div>
                ) : (
                  <div key="restaurant">
                    <Link to="/" style={{ textDecoration: "none" }}>
                      <ListItem button>
                        <ListItemText
                          style={{ color: "black", fontSize: "20px" }}
                          primary="Home"
                          disableTypography
                        />
                      </ListItem>
                    </Link>
                    <Link to="/rest/myorder" style={{ textDecoration: "none" }}>
                      <ListItem button>
                        <ListItemText
                          style={{ color: "black", fontSize: "20px" }}
                          primary="My Order"
                          disableTypography
                        />
                      </ListItem>
                    </Link>
                    <Link to="/rest/mymenu" style={{ textDecoration: "none" }}>
                      <ListItem button>
                        <ListItemText
                          style={{ color: "black", fontSize: "20px" }}
                          primary="My Menu"
                          disableTypography
                        />
                      </ListItem>
                    </Link>
                    <Link
                      to="/rest/myrestaurant"
                      style={{ textDecoration: "none" }}
                    >
                      <ListItem button>
                        <ListItemText
                          style={{ color: "black", fontSize: "20px" }}
                          primary="My Restaurant"
                          disableTypography
                        />
                      </ListItem>
                    </Link>
                  </div>
                )
              ]
            )}
            <Link to="/about" style={{ textDecoration: "none" }}>
              <ListItem button>
                <ListItemText
                  style={{ color: "black", fontSize: "20px" }}
                  primary="About"
                  disableTypography
                />
              </ListItem>
            </Link>
            {this.state.loginuser && (
              <ListItem button onClick={this.handleLogout}>
                <ListItemText
                  style={{ color: "black", fontSize: "20px" }}
                  primary="Logout"
                  disableTypography
                />
              </ListItem>
            )}
          </List>
        </SwipeableDrawer>
        <HomeRoute
          exact
          path="/"
          setTitle={this.setTitle.bind(this)}
          loginuser={this.state.loginuser}
        />
        <GuestRoute
          path="/login"
          component={Login}
          setTitle={this.setTitle.bind(this)}
          loginuser={this.state.loginuser}
        />
        <GuestRoute
          path="/register"
          component={Register}
          setTitle={this.setTitle.bind(this)}
          loginuser={this.state.loginuser}
        />
        <CustRoute
          path="/cust/restmenu/:restid"
          component={CustViewMenu}
          setTitle={this.setTitle.bind(this)}
          loginuser={this.state.loginuser}
        />
        <CustRoute
          path="/cust/mytapau"
          component={Takeaway}
          setTitle={this.setTitle.bind(this)}
          loginuser={this.state.loginuser}
        />
        <CustRoute
          path="/cust/myprofile"
          component={CustProfile}
          setTitle={this.setTitle.bind(this)}
          loginuser={this.state.loginuser}
        />
        <RestRoute
          path="/rest/myorder"
          component={Order}
          setTitle={this.setTitle.bind(this)}
          loginuser={this.state.loginuser}
        />
        <RestRoute
          path="/rest/mymenu"
          component={Menu}
          setTitle={this.setTitle.bind(this)}
          loginuser={this.state.loginuser}
        />
        <RestRoute
          path="/rest/myrestaurant"
          component={RestProfile}
          setTitle={this.setTitle.bind(this)}
          loginuser={this.state.loginuser}
        />
        <Route
          path="/about"
          render={() => <About setTitle={this.setTitle.bind(this)} />}
        />
      </div>
    );
  }
}
const HomeRoute = ({ ...rest }) => (
  <Route
    {...rest}
    render={props =>
      rest.loginuser ? (
        [
          rest.loginuser.accounttype === "customer" ? (
            <CustHome key="custhome" {...props} {...rest} />
          ) : (
            <RestHome key="resthome" {...props} {...rest} />
          )
        ]
      ) : (
        <Login {...props} {...rest} />
      )
    }
  />
);
const GuestRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      rest.loginuser ? (
        <Redirect to={{ pathname: "/" }} />
      ) : (
        <Component {...props} {...rest} />
      )
    }
  />
);
const CustRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      rest.loginuser ? (
        [
          rest.loginuser.accounttype === "customer" ? (
            <Component key="customer" {...props} {...rest} />
          ) : (
            <Redirect key="restaurant" to={{ pathname: "/" }} />
          )
        ]
      ) : (
        <Redirect to={{ pathname: "/" }} />
      )
    }
  />
);
const RestRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      rest.loginuser ? (
        [
          rest.loginuser.accounttype === "restaurant" ? (
            <Component key="restaurant" {...props} {...rest} />
          ) : (
            <Redirect key="customer" to={{ pathname: "/" }} />
          )
        ]
      ) : (
        <Redirect to={{ pathname: "/" }} />
      )
    }
  />
);
export default withRouter(App);
