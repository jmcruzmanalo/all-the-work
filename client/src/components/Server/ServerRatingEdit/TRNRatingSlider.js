import React from 'react';
import MultiPointSlider from '../../UI/MultiPointSlider/MultiPointSlider';
import PropTypes from 'prop-types';

const TRNRatingEditSlider = props => {
  return (
    <MultiPointSlider
      {...props}
      values={props.values.map(v => v.max)}
      onChange={values => {
        const range = values.map((value, index) => {
          const min = index === 0 ? 0 : values[index - 1] + 1;
          const max = value;
          return { min, max };
        });
        props.onChange(range);
      }}
      onUpdate={values => {
        const range = values.map((value, index) => {
          const min = index === 0 ? 0 : values[index - 1] + 1;
          const max = value;
          return { min, max };
        });
        props.onChange(range);
      }}
      domain={[0, 5000]}
    />
  );
};

TRNRatingEditSlider.propTypes = {
  onChange: PropTypes.func,
  values: PropTypes.array
};

export default TRNRatingEditSlider;
