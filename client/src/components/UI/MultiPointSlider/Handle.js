import React, { Component } from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import styled from "styled-components";

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

const StyledHandleTooltip = styled.div`
  position: absolute;
  height: 100%;
  width: auto;
  left: -100%;
  right: -100%;
  top: -100%;
  margin: auto;
  text-align: center;
  font-size: 10px;
  transition: 0.2s;
  opacity: 0;
  transform: translateY(50%);
`;

class Handle extends Component {
  state = {
    isActive: false
  };

  activate() {
    if (this.state.isActive) return;
    this.setState({ isActive: true });
  }

  deActivate() {
    if (!this.state.isActive) return;
    this.setState({ isActive: false });
  }

  render() {
    const {
      domain: [min, max],
      handle: { id, value, percent },
      getHandleProps
    } = this.props;

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
        onMouseEnter={() => this.activate()}
        onMouseLeave={() => this.deActivate()}
      >
        <StyledHandleTooltip
          style={
            this.state.isActive
              ? { opacity: 1, transform: "translateY(0)" }
              : { opacity: 0, transform: "translateY(50%)" }
          }
        >
          <Typography variant="caption">{value}</Typography>
        </StyledHandleTooltip>
      </StyledHandle>
    );
  }
}

Handle.propTypes = {
  domain: PropTypes.arrayOf(PropTypes.number).isRequired,
  handle: PropTypes.shape({
    id: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
    percent: PropTypes.any.isRequired
  }),
  getHandleProps: PropTypes.func.isRequired
};

export default Handle;
