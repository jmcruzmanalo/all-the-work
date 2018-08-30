import React, { Component } from 'react';
import MultiPointSlider from '../../UI/MultiPointSlider/MultiPointSlider';
import PropTypes from 'prop-types';

class TRNRatingEditSlider extends Component {
  render() {
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
          this.props.onChange(range);
        }}
        domain={[0, 5000]}
      />
    );
  }
}

TRNRatingEditSlider.propTypes = {
  onChange: PropTypes.func,
  values: PropTypes.array
};

export default TRNRatingEditSlider;
