import React from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import {
  ListItem,
  RootRef,
  Icon,
  ListItemIcon,
  ListItemText,
  TextField
} from '@material-ui/core';
import { ServerRatingListContext } from './ServerRatingList';

const ServerRatingListItem = ({ rangeName, index }) => {
  return (
    <Draggable draggableId={`${index}_id`} index={index}>
      {({ innerRef, draggableProps, dragHandleProps }) => (
        <ServerRatingListContext.Consumer>
          {({ onRangeNameEdit }) => (
            <RootRef rootRef={innerRef}>
              <ListItem divider disableGutters {...draggableProps}>
                <ListItemIcon {...dragHandleProps}>
                  <Icon color="disabled">reorder</Icon>
                </ListItemIcon>
                <ListItemText>
                  <TextField
                    InputProps={{
                      disableUnderline: true
                    }}
                    value={rangeName}
                    onChange={event =>
                      onRangeNameEdit(event.target.value, index)
                    }
                  />
                </ListItemText>
              </ListItem>
            </RootRef>
          )}
        </ServerRatingListContext.Consumer>
      )}
    </Draggable>
  );
};

ServerRatingListItem.propTypes = {
  rangeName: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired
};

export default ServerRatingListItem;
