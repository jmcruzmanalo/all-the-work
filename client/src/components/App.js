import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Landing from './Landing';
import ServerRatingEdit from './Server/ServerRatingEdit';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <Route path="/" component={Landing} exact />
            <Route path="/servers/:serverId/edit-ratings" component={ServerRatingEdit} exact />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
