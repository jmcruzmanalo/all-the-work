import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import styled from "styled-components";
import Landing from "./Landing";
import ServerRatingEdit from "./Server/ServerRatingEdit/ServerRatingEdit";

const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

const MainAppDiv = styled.div`
  height: 100%;
  background-color: ${props => props.backgroundColor};
`;

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <MainAppDiv backgroundColor={theme.palette.background.default}>
          <BrowserRouter>
            <div>
              <Route path="/" component={Landing} exact />
              <Route
                path="/servers/:serverId/edit-ratings"
                component={ServerRatingEdit}
                exact
              />
            </div>
          </BrowserRouter>
        </MainAppDiv>
      </MuiThemeProvider>
    );
  }
}

export default App;
