import styled from "styled-components";
import PropTypes from "prop-types";

const Padded = styled.div`
  position: relative;
  padding: ${({ paddingTop, padding }) => (paddingTop ? paddingTop : padding)}px
    ${({ paddingRight, padding }) => (paddingRight ? paddingRight : padding)}px
    ${({ paddingBottom, padding }) =>
      paddingBottom ? paddingBottom : padding}px
    ${({ paddingLeft, padding }) => (paddingLeft ? paddingLeft : padding)}px;
`;

Padded.propTypes = {
  padding: PropTypes.number,
  paddingTop: PropTypes.number,
  paddingRight: PropTypes.number,
  paddingBottom: PropTypes.number,
  paddingLeft: PropTypes.number
};

export default Padded;
