import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import ListItem from '@material-ui/core/ListItem';
import RootRef from '@material-ui/core/RootRef';
import Icon from '@material-ui/core/Icon';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import { ServerRatingListContext } from './ServerRatingList';

const ListItemPositioned = styled(ListItem)`
  && {
    top: inherit !important;
    left: inherit !important;
  }
`;

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
          {({ onRangeNameEdit }) => {
            const item = (
              <ListItemPositioned divider disableGutters {...draggableProps}>
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
              </ListItemPositioned>
            );

            return <RootRef rootRef={innerRef}>{item}</RootRef>;
          }}
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
