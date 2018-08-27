import React, { Component } from 'react';


export default (MultiPointSlider) => {

  class TRNRatingEditSlider extends Component {
    render() {
      const originalChange = this.props.onChange;
      return (
        <MultiPointSlider
          {...this.props}
          values={this.props.values.map((v) => v.max)}
          onChange={(values) => {
            const range = values.map((value, index) => {
              const min = (index === 0) ? 0 : values[index - 1] + 1;
              const max = value;
              return { min, max }
            });
            originalChange(range);
          }}
          domain={[0, 5000]}
        />
      );
    }

  }

  return TRNRatingEditSlider;
};