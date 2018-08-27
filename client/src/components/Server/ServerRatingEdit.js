import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import styled from 'styled-components';
import { setActiveServer } from '../../actions/actions';
import MultiPointSlider from '../UI/MultiPointSlider/MultiPointSlider';
import Container from '../UI/Container';
import trnRatingEditSlider from './trnRatingEditSlider';
import { Button, Input, InputLabel, FormControl, List, ListItem } from '@material-ui/core';

const MarginedContainer = styled.div`
  margin-top: 20px;
`;

class ServerRatingEdit extends Component {


  state = {
    addIsDisabled: false
  }

  constructor(props) {
    super(props);
    this.serverId = props.match.params.serverId;
  }

  // TODO: This might need to be moved to componentWillReceiveProps
  componentDidMount() {
    this.props.setActiveServer(this.serverId);
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.trnRange || !props.trnRangeNames) return state;
    return {
      ...state,
      addIsDisabled: props.trnRangeNames.includes(props.newRatingName)
    };
  }

  addRating() {
    // For now use the index to link the two arrays. Since there will need to be functionality to swap the names with a range.

    const updatedNames = (this.props.trnRangeNames) ? [...this.props.trnRangeNames] : [];
    updatedNames.unshift(this.props.newRatingName);

    const updatedRange = (this.props.trnRange) ? [...this.props.trnRange] : [];
    updatedRange.unshift({
      min: 0,
      max: 100
    });

    this.props.change('trnRangeNames', updatedNames);
    this.props.change('trnRange', updatedRange);
    this.props.change('newRatingName', '');
  }

  renderNewRatingInput(props) {
    return (
      <FormControl>
        <InputLabel>New Rating Name</InputLabel>
        <Input {...props.input} />
      </FormControl>
    );
  }

  render() {
    console.log('Render Method');
    return (
      <Container>
        <form onSubmit={this.props.handleSubmit(() => console.log('Form submitted'))}>
          <p style={{ marginBottom: 50 }}>Server I.D. -  {this.serverId}</p>
          <Field
            name="trnRange"
            component={(props) => {
              const TRNSlider = trnRatingEditSlider(MultiPointSlider);
              return (
                <TRNSlider
                  {...props}
                  values={(this.props.trnRange) ? this.props.trnRange : []}
                  onChange={(range) => props.input.onChange(range)} />
              );
            }}
          />
          <MarginedContainer>

            {/* <List>
              {this.state.rangeNames.map((name) => {
                return <ListItem key={name}>{name}</ListItem>
              })}
            </List> */}

            <Field
              name="newRatingName"
              value={this.props.newRatingName}
              component={this.renderNewRatingInput}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={() => this.addRating()}
              style={{ marginLeft: 20 }}
              disabled={!this.props.newRatingName || this.state.addIsDisabled}
            >
              Add Rating Range
          </Button>
          </MarginedContainer>
        </form>
      </Container>
    );
  }
}


const selector = formValueSelector('serverRatingEdit');

function mapStateToProps(state) {
  return {
    trnRangeNames: selector(state, 'trnRangeNames'),
    trnRange: selector(state, 'trnRange'),
    newRatingName: selector(state, 'newRatingName'),
  }
}

ServerRatingEdit = reduxForm({
  form: 'serverRatingEdit'
})(ServerRatingEdit);

ServerRatingEdit = connect(
  mapStateToProps, {
    setActiveServer,
    change
  }
)(ServerRatingEdit);

export default ServerRatingEdit;
