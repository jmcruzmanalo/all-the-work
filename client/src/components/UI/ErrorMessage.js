import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Paper, Grid, Icon, Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/core';

const ErrorDiv = styled(Paper)`
  padding: 20px;
  color: #fff;
  && {
    background-color: ${({ theme }) => theme.palette.error.dark};
  }
`;

const ErrorMessage = ({ children, theme }) => {
  return (
    <ErrorDiv theme={theme}>
      <Grid container alignItems="center" spacing={32}>
        <Grid item>
          <Icon>error</Icon>
        </Grid>
        <Grid item>
          <Typography variant="headline">{children}</Typography>
        </Grid>
      </Grid>
    </ErrorDiv>
  );
};

ErrorMessage.propTypes = {
  children: PropTypes.any.isRequired,
  theme: PropTypes.any.isRequired
};

export default withTheme()(ErrorMessage);
