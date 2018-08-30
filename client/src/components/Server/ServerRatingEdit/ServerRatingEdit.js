import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Field,
  reduxForm,
  formValueSelector,
  change,
  getFormSyncErrors
} from "redux-form";
import styled from "styled-components";
import { Grid, Typography } from "@material-ui/core";
import { setActiveServer } from "../../../actions/actions";
import Container from "../../UI/Container";
import TRNRatingSlider from "./TRNRatingSlider";
import ServerRatingAdd from "./ServerRatingAdd";
import { DragDropContext } from "react-beautiful-dnd";
import ServerRatingList from "./ServerRatingList/ServerRatingList";
import DeleteDrop from "./ServerRatingList/DeleteDrop";

const MarginedContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

class ServerRatingEdit extends Component {
  state = {
    dragIsActive: false
  };

  constructor(props) {
    super(props);
    this.serverId = props.match.params.serverId;
  }

  // TODO: This might need to be moved to componentWillReceiveProps
  componentDidMount() {
    this.props.setActiveServer(this.serverId);
  }

  addRating() {
    // For now use the index to link the two arrays. Since there will need to be functionality to swap the names with a range.

    let shouldUpdate = true;

    const updatedNames = this.props.trnRangeNames
      ? [...this.props.trnRangeNames]
      : [];
    updatedNames.unshift(this.props.newRatingName);

    const updatedRange = this.props.trnRange ? [...this.props.trnRange] : [];
    updatedRange.unshift({
      min: 0,
      max: 100
    });
    if (updatedRange.length > 1) {
      if (updatedRange[1].max <= 100) {
        shouldUpdate = false;
      } else {
        updatedRange[1] = {
          ...updatedRange[1],
          min: 101
        };
      }
    }

    if (shouldUpdate) {
      this.props.change("trnRangeNames", updatedNames);
      this.props.change("trnRange", updatedRange);
      this.props.change("newRatingName", "");
    }
  }

  renderTRNRatingEditSlider(props) {
    return (
      <TRNRatingSlider
        {...props}
        values={props.trnRange ? props.trnRange : []}
        onChange={range => props.input.onChange(range)}
      />
    );
  }

  onDragRatingStart() {
    this.setState({
      ...this.state,
      dragIsActive: true
    });
  }

  onDragRatingEnd(dragResult) {
    this.setState({
      ...this.state,
      dragIsActive: false
    });

    if (!dragResult.destination) return;

    const reorderedNames = Array.from(this.props.trnRangeNames).reverse();
    const [removed] = reorderedNames.splice(dragResult.source.index, 1);
    reorderedNames.splice(dragResult.destination.index, 0, removed);
    reorderedNames.reverse();
    this.props.change("trnRangeNames", reorderedNames);
  }

  render() {
    return (
      <Container>
        {/* Enter should not submit the form for now */}
        <form
          onSubmit={this.props.handleSubmit(() =>
            console.log("Form submitted")
          )}
        >
          <MarginedContainer>
            <Typography variant="title">
              Server I.D. - {this.serverId}
            </Typography>
          </MarginedContainer>
          <Field
            name="trnRange"
            component={this.renderTRNRatingEditSlider}
            trnRange={this.props.trnRange}
          />
          <MarginedContainer>
            <DragDropContext
              onDragStart={this.onDragRatingStart.bind(this)}
              onDragEnd={this.onDragRatingEnd.bind(this)}
            >
              <ServerRatingList
                range={this.props.trnRange}
                rangeNames={this.props.trnRangeNames}
              />

              <Grid
                container
                direction="row"
                justify="center"
                spacing={24}
                alignItems="center"
              >
                <Grid item xs={6}>
                  <Field
                    name="newRatingName"
                    value={this.props.newRatingName}
                    component={ServerRatingAdd}
                    formErrors={this.props.formErrors}
                    onAddClick={() => this.addRating()}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DeleteDrop dragIsActive={this.state.dragIsActive} />
                </Grid>
              </Grid>
            </DragDropContext>
          </MarginedContainer>
        </form>
      </Container>
    );
  }
}

ServerRatingEdit = reduxForm({
  validate,
  form: "serverRatingEdit"
})(ServerRatingEdit);

ServerRatingEdit = connect(
  mapStateToProps,
  mapDispatchToProps
)(ServerRatingEdit);

ServerRatingEdit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      serverId: PropTypes.string.isRequired
    })
  }),
  handleSubmit: PropTypes.func,
  trnRangeNames: PropTypes.array,
  trnRange: PropTypes.array,
  newRatingName: PropTypes.string,
  formErrors: PropTypes.shape({
    trnRange: PropTypes.string,
    newRatingName: PropTypes.string
  }),
  change: PropTypes.func,
  setActiveServer: PropTypes.func
};

const selector = formValueSelector("serverRatingEdit");
const errorSelector = getFormSyncErrors("serverRatingEdit");

function mapStateToProps(state) {
  return {
    trnRangeNames: selector(state, "trnRangeNames"),
    trnRange: selector(state, "trnRange"),
    newRatingName: selector(state, "newRatingName"),
    formErrors: errorSelector(state)
  };
}

function mapDispatchToProps() {
  return {
    setActiveServer,
    change
  };
}

function validate({ trnRange, trnRangeNames, newRatingName }) {
  const errors = {};

  if (Array.isArray(trnRangeNames) && trnRangeNames.includes(newRatingName)) {
    errors["newRatingName"] = `This role already exists yafuq`;
  }

  if (
    Array.isArray(trnRange) &&
    trnRange.length > 0 &&
    trnRange[0].max === 100
  ) {
    errors["trnRange"] = `Move the latest range before adding another yafuq`;
    errors[
      "newRatingName"
    ] = `Can't add another role because one is still set to 100`;
  }

  return errors;
}

export default ServerRatingEdit;
