import React from 'react';
import _ from 'lodash';
import './MaterialCheckbox.css';

const MaterialCheckbox = (props) => {
  const uniqueId = _.uniqueId('md-checkbox-');
  return (
    <div className="md-checkbox">
      <input id={uniqueId} type="checkbox" checked={props.checked} />
      <label for={uniqueId}>{props.text}</label>
    </div>
  );
}

export default MaterialCheckbox;