import React, { Component } from 'react';
import MultiPointSlider from '../UI/MultiPointSlider/MultiPointSlider';

class SquadRatingEdit extends Component {

  state = {}

  constructor(props) {
    super(props);
    this.squadId = props.match.params.squadId;
  }

  render() {
    return (
      <div>
        Squad Rating Edit here {this.squadId}

        <div style={{ margin: "10%", height: 120, width: "80%" }} >
          <MultiPointSlider />
        </div>
      </div>
    );
  }
}

export default SquadRatingEdit;