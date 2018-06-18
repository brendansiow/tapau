import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { BrowserRouter as Router } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
const theme = createMuiTheme({
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: ["Circular Std Medium"].join(",")
  }
});
function RootApp() {
  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <App />
      </Router>
    </MuiThemeProvider>
  );
}
ReactDOM.render(<RootApp />, document.getElementById("root"));
registerServiceWorker();
