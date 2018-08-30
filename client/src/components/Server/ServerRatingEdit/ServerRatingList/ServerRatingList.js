import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Droppable } from "react-beautiful-dnd";
import ServerRatingListItem from "./ServerRatingListItem";
import {
  RootRef,
  List,
  ListItem,
  Grid,
  Typography,
  Paper,
  withTheme,
  ListItemText
} from "@material-ui/core";
import Padded from "../../../UI/Padded";

const ServerRatingList = ({ rangeNames = [], range = [], theme }) => {
  const listRangeNames = [...rangeNames]
    .reverse()
    .map((name, index) => (
      <ServerRatingListItem
        key={`${name}_${index}`}
        rangeName={name}
        index={index}
      />
    ));

  const listRange = [...range].reverse().map(({ min, max }, index) => (
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
    <Droppable droppableId={"rating-list-droppable"}>{renderList}</Droppable>
  );
};

ServerRatingList.propTypes = {
  range: PropTypes.array,
  rangeNames: PropTypes.array,
  innerRef: PropTypes.any,
  droppableProps: PropTypes.any,
  placeholder: PropTypes.any,
  theme: PropTypes.object.isRequired
};

export default withTheme()(ServerRatingList);
