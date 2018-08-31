import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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

const StyledTextField = styled(TextField)`
  && input {
    padding: 0px;
  }
`;

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
                  <StyledTextField
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
