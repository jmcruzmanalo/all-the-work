import React from "react";
import PropTypes from "prop-types";
import { Droppable } from "react-beautiful-dnd";
import {
  Paper,
  Icon,
  withTheme,
  RootRef,
  Typography,
  Grid
} from "@material-ui/core";
import styled from "styled-components";

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
  opacity: ${({ shouldFade }) => (shouldFade ? 0 : 1)};
`;

const DeleteDrop = ({ onDrop, dragIsActive, theme }) => {
  const renderDropArea = (
    { innerRef, droppableProps, placeholder },
    snapshot
  ) => {
    return (
      <RootRef rootRef={innerRef}>
        <DropArea
          {...droppableProps}
          style={{
            backgroundColor: dragIsActive ? theme.palette.error.dark : ""
          }}
        >
          <Grid100 container alignItems={"center"} justify={"space-between"}>
            <Grid item>
              <FadingText shouldFade={dragIsActive} color="textSecondary">
                Drag here to delete
              </FadingText>
            </Grid>
            <Grid item>
              <Icon color={dragIsActive ? "action" : "disabled"}>delete</Icon>
            </Grid>
          </Grid100>
          {placeholder}
        </DropArea>
      </RootRef>
    );
  };

  return (
    // <Paper>
    <Droppable droppableId="rating-list-delete-drop-area">
      {renderDropArea}
    </Droppable>
    // </Paper>
  );
};

DeleteDrop.propTypes = {
  onDrop: PropTypes.func.isRequired,
  innerRef: PropTypes.any,
  droppableProps: PropTypes.any,
  placeholder: PropTypes.any,
  dragIsActive: PropTypes.bool.isRequired,
  theme: PropTypes.object.isRequired
};

export default withTheme()(DeleteDrop);
