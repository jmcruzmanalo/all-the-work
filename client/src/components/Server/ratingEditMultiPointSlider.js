import React, { Component } from 'react';


export default (MultiPointSlider) => {
  class RatingEditMultiPointSlider extends Component {


    render() {

      const input = this.props.input;
      const x = input.onChange;
      input.onChange = (values) => {
        const range = values.map((value, index) => {
          const min = (values[index] === 0) ? 0 : values[index] + 1;
          const max = value;
          return { min, max }
        });
        x(range);
      };

      return (
        <MultiPointSlider
          {...this.props}
          input={input}
        />
      );
    }

  }

  return RatingEditMultiPointSlider;
};