import React from 'react';
import styled from 'styled-components';

const StyledHandle = styled.div`
  position: absolute;
  margin-left: -11px;
  margin-top: -9px;
  z-index: 2;
  width: 24px;
  height: 24px;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
  background-color: #ff3d00;
`;

const Handle = ({
  domain: [min, max],
  handle: { id, value, percent },
  getHandleProps
}) => {
  return (
    <StyledHandle
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      style={{
        left: `${percent}%`
      }}
      {...getHandleProps(id)}
    />
  );
}

export default Handle;