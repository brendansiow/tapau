import React, { Component } from 'react';
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
  
class CustHome extends Component {
    render() {
        return (
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
                        <List onClick={() => this.setState({ open: false })}
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
            </div>
        );
    }
}

export default CustHome;