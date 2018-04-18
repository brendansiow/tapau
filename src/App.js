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
  BrowserRouter as Router
} from 'react-router-dom';
import firebase from './firebase';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      loginuser: '',
      title: ''
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          loginuser: user
        })
      }else{
        this.setState({
          loginuser: ''
        })
      }
    });
  }
  setTitle(title) {
    this.setState({
      title: title
    })
  }
  render() {
    return (
      <div>
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
              <div
                tabIndex={0}
                role="button"
                style={{ width: "250px" }}
              >
                <List style={{ backgroundColor: "#ef5350" }}>
                  <ListItem>
                    <ListItemText style={{ color: "white", fontSize: "23px" }} primary="Welcome to Tapau" disableTypography />
                  </ListItem>
                </List>
                <Divider />
                <List
                  onClick={() => this.setState({ open: false })}
                  onKeyDown={() => this.setState({ open: false })}
                >
                  <Link to="/" style={{ textDecoration: "none" }}>
                    <ListItem button>
                      <ListItemText style={{ color: "black", fontSize: "20px" }} primary="Home" disableTypography />
                    </ListItem>
                  </Link>
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
                  <Link to="/about" style={{ textDecoration: "none" }}>
                    <ListItem button>
                      <ListItemText style={{ color: "black", fontSize: "20px" }} primary="About" disableTypography />
                    </ListItem>
                  </Link>
                </List>
              </div>
            </Drawer>
            <Route exact path="/" render={() => <Home setTitle={this.setTitle.bind(this)} loginuser={this.state.loginuser} />} />
            <Route path="/register" render={() => <Register setTitle={this.setTitle.bind(this)}/>} />
            <Route path="/about" render={() => <About setTitle={this.setTitle.bind(this)} />} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
