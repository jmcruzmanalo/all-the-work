import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';

const AbsoluteLoader = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
`;

export default AbsoluteLoader;
