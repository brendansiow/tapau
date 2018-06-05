import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import registerServiceWorker from "./registerServiceWorker";
const theme = createMuiTheme({
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: ["Circular Std Book","Circular Std Medium"].join(",")
  }
});
function RootApp() {
  return (
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  );
}
ReactDOM.render(<RootApp />, document.getElementById("root"));
registerServiceWorker();
