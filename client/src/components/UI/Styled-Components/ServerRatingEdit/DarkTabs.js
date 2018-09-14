import Tabs from '@material-ui/core/Tabs';
import styled from 'styled-components';

const DarkTabs = styled(Tabs)`
  && {
    padding-left: 12px;
    padding-right: 12px;
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

export default DarkTabs;
