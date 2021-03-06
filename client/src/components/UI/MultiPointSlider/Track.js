import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledTrack = styled.div`
  position: absolute;
  height: 8px;
  z-index: 1;
  background-color: #ff3d00;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.8;
`;

const Track = ({ source, target, getTrackProps }) => {
  return (
    <StyledTrack
      {...getTrackProps()}
      style={{
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`
      }}
    />
  );
};

Track.propTypes = {
  source: PropTypes.object.isRequired,
  target: PropTypes.object.isRequired,
  getTrackProps: PropTypes.func.isRequired
};

export default Track;
