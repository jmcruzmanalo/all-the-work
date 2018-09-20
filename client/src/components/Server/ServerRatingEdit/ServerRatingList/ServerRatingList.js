import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';
import ServerRatingListItem from './ServerRatingListItem';
import RootRef from '@material-ui/core/RootRef';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ListItemText from '@material-ui/core/ListItemText';
import Padded from '../../../UI/Padded';

export const ServerRatingListContext = createContext();

const ServerRatingList = ({ rolesRating }) => {
  console.log(rolesRating);

  const listRangeNames = [...rolesRating]
    .reverse()
    .map(({ name }, index) => (
      <ServerRatingListItem
        key={`${index}-rating-list-item`}
        rangeName={name}
        index={index}
      />
    ));

  const listRange = [...rolesRating]
    .reverse()
    .map(({ range: { min, max } }, index) => (
      <ListItem key={index} divider>
        <ListItemText>
          {min} - {max}
        </ListItemText>
      </ListItem>
    ));

  const renderList = ({ innerRef, droppableProps, placeholder }) => {
    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="baseline"
        spacing={24}
      >
        <Grid item xs={6}>
          <Paper>
            <Padded padding={24}>
              <Typography variant="title">Roles</Typography>
              <RootRef rootRef={innerRef}>
                <List {...droppableProps}>
                  {listRangeNames}
                  {placeholder}
                </List>
              </RootRef>
            </Padded>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <Padded padding={24}>
              <Typography variant="title">Rating</Typography>
              <List>{listRange}</List>
            </Padded>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  return (
    <Droppable droppableId={'rating-list-droppable'}>{renderList}</Droppable>
  );
};

ServerRatingList.propTypes = {
  rolesRating: PropTypes.array.isRequired,
  innerRef: PropTypes.any,
  droppableProps: PropTypes.any,
  placeholder: PropTypes.any
};

export default ServerRatingList;
