import React from 'react';
import styled from 'styled-components';

const AlignmentIndicator = styled.div`
  position: absolute;
  margin-top: 15px;
  margin-left: -0.5px;
  width: 1px;
  height: 8px;
  background-color: silver;
`;

const NumberIndicator = styled.div`
  position: absolute;
  margin-top: 25px;
  font-size: 10px;
  text-align: center;
`;

const Track = ({ tick, count }) => {
  return (
    <div>
      <AlignmentIndicator
        style={{
          left: `${tick.percent}%`,
        }}
      />
      <NumberIndicator
        style={{
          marginLeft: `${-(100 / count) / 2}%`,
          width: `${100 / count}%`,
          left: `${tick.percent}%`,
        }}
      >
        {tick.value}
      </NumberIndicator>

    </div>
  );
};

export default Track;