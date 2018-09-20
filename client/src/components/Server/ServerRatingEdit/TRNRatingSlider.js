import React from 'react';
import MultiPointSlider from '../../UI/MultiPointSlider/MultiPointSlider';
import PropTypes from 'prop-types';

const TRNRatingEditSlider = props => {
  const onSlide = values => {
    const range = values.map((value, index) => {
      const min = index === 0 ? 0 : values[index - 1] + 1;
      const max = value;
      return { min, max };
    });
    const updatedRolesRating = [...props.rolesRating].map(
      (roleRating, index) => {
        return {
          ...roleRating,
          range: range[index]
        };
      }
    );
    props.onChange(updatedRolesRating);
  };

  return (
    <MultiPointSlider
      {...props}
      values={props.rolesRating.map(roleRating => roleRating.range.max)}
      onChange={onSlide}
      onUpdate={onSlide}
      domain={[0, 5000]}
    />
  );
};

TRNRatingEditSlider.propTypes = {
  onChange: PropTypes.func,
  rolesRating: PropTypes.array
};

export default TRNRatingEditSlider;
