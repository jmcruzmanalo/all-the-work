import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Landing from './Landing';
import SquadRatingEdit from './Squad/SquadRatingEdit';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <Route path="/" component={Landing} exact />
            <Route path="/squad/:squadId/edit-ratings" component={SquadRatingEdit} exact />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
