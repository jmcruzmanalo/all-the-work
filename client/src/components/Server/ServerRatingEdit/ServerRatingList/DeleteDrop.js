import React from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
// import {
//   Paper,
//   Icon,
//   withTheme,
//   RootRef,
//   Typography,
//   Grid
// } from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import withTheme from '@material-ui/core/styles/withTheme';
import RootRef from '@material-ui/core/RootRef';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';

const DropArea = styled(Paper)`
  height: 50px;
  box-sizing: content-box;
  padding: 12px 24px 12px;
  transition: 0.2s;
  position: relative;
`;

const Grid100 = styled(Grid)`
  height: 100%;
`;

const FadingText = styled(Typography)`
  transition: 0.2s;
`;

const DeleteDrop = ({ dragWarn, theme }) => {
  const renderDropArea = (
    { innerRef, droppableProps, placeholder },
    { isDraggingOver }
  ) => {
    return (
      <RootRef rootRef={innerRef}>
        <DropArea
          {...droppableProps}
          style={{
            backgroundColor: isDraggingOver ? theme.palette.error.dark : ''
          }}
        >
          <Grid100 container alignItems={'center'} justify={'space-between'}>
            <Grid item>
              <FadingText
                style={{ opacity: isDraggingOver ? 0 : 1 }}
                color="textSecondary"
              >
                {dragWarn
                  ? 'This will remove the role on the discord server on "Submit"'
                  : 'Drag here to delete'}
              </FadingText>
            </Grid>
            <Grid item>
              <Icon color={isDraggingOver ? 'action' : 'disabled'}>delete</Icon>
            </Grid>
          </Grid100>
          {placeholder}
        </DropArea>
      </RootRef>
    );
  };

  return (
    <Droppable droppableId="rating-list-delete-drop-area">
      {renderDropArea}
    </Droppable>
  );
};

DeleteDrop.propTypes = {
  innerRef: PropTypes.any,
  droppableProps: PropTypes.any,
  placeholder: PropTypes.any,
  theme: PropTypes.object.isRequired,
  dragWard: PropTypes.bool
};

export default withTheme()(DeleteDrop);
