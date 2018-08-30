import React from "react";
import PropTypes from "prop-types";
import { Draggable } from "react-beautiful-dnd";
import {
  ListItem,
  RootRef,
  Icon,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";

const ServerRatingListItem = ({ rangeName, index }) => {
  return (
    <Draggable draggableId={`${rangeName}_id`} index={index}>
      {({ innerRef, draggableProps, dragHandleProps }) => {
        return (
          <RootRef rootRef={innerRef}>
            <ListItem
              divider
              disableGutters
              style={{ ...draggableProps.style }}
              {...draggableProps}
              {...dragHandleProps}
            >
              <ListItemIcon>
                <Icon color="disabled">reorder</Icon>
              </ListItemIcon>
              <ListItemText>{rangeName}</ListItemText>
            </ListItem>
          </RootRef>
        );
      }}
    </Draggable>
  );
};

ServerRatingListItem.propTypes = {
  rangeName: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired
};

export default ServerRatingListItem;
