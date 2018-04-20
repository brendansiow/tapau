import React, { Component } from 'react';
import Home from './Home';
import About from './About';
import Register from './Register';
import {
  IconButton,
  AppBar,
  Typography,
  Toolbar,
  List,
  Drawer,
  Divider,
  ListItem,
  ListItemText,
  Icon
} from 'material-ui';
import {
  Route,
  Link,
  BrowserRouter as Router,
  Redirect
} from 'react-router-dom';
import firebase from './firebase';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      loginuser: '',
      title: '',
      isAuthenticating: true,
      isLoggingOut:false,
      loggedOut: false
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          loginuser: user,
          isAuthenticating: false
        })
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
      isLoggingOut:true
    })
    firebase.auth().signOut().then(() => {
      this.setState({
        snackBarMsg: "Logout Successfully !!",
        snackBarBtn: "Okay !!",
        snackbarIsOpen: !this.state.snackbarIsOpen,
        loggedOut: true,
        isLoggingOut:false
      })
    }).catch(function (error) {
      console.log(error)
    });
  }
  render() {
    if (this.state.isAuthenticating) {
      return null;
    }
    if(this.isLoggingOut){
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
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    <ListItem button>
                      <ListItemText style={{ color: "black", fontSize: "20px" }} primary="Login/Sign Up" disableTypography />
                    </ListItem>
                  </Link>
                ) : (
                    <div>
                      <Link to="/restaurants" style={{ textDecoration: "none" }}>
                        <ListItem button>
                          <ListItemText style={{ color: "black", fontSize: "20px" }} primary="Restaurants" disableTypography />
                        </ListItem>
                      </Link>
                      <Link to="/mytapau" style={{ textDecoration: "none" }}>
                        <ListItem button>
                          <ListItemText style={{ color: "black", fontSize: "20px" }} primary="My Tapau" disableTypography />
                        </ListItem>
                      </Link>
                      <Link to="/myprofile" style={{ textDecoration: "none" }}>
                        <ListItem button>
                          <ListItemText style={{ color: "black", fontSize: "20px" }} primary="My Profile" disableTypography />
                        </ListItem>
                      </Link>
                    </div>
                  )}
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
          <HomeRoute exact path="/" setTitle={this.setTitle.bind(this)} loginuser={this.state.loginuser}/>
          <Route path="/login" render={() => <Home setTitle={this.setTitle.bind(this)} loginuser={this.state.loginuser} />} />
          <Route path="/register" render={() => <Register setTitle={this.setTitle.bind(this)} />} />
          <Route path="/about" render={() => <About setTitle={this.setTitle.bind(this)} />} />
        </div>
      </Router>
    );
  }
}
const HomeRoute = ({ ...rest }) => (
  <Route {...rest} render={(props) =>
    rest.loginuser ? (
      <About {...props} {...rest} />
    ) : (
        <Redirect to={{ pathname: "/login" }} />
      )}
  />
);
// const CustRoute = () =>(

// );
// const RestRoute = () =>(

// );
export default App;
