import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Field,
  reduxForm,
  formValueSelector,
  change,
  getFormSyncErrors
} from 'redux-form';
import { getServerEditPasswordStatus } from '../../../reducers/selectors';
import styled from 'styled-components';
import qs from 'querystring';

import Typography from '@material-ui/core/Typography';
import Tab from '@material-ui/core/Tab';
import withTheme from '@material-ui/core/styles/withTheme';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import SwipeableViews from 'react-swipeable-views';
import {
  setActiveServer,
  submitServerRatingEdit,
  checkServerRolesRatingEditPassword
} from '../../../actions/actions';
import Container from '../../UI/Container';
import TRNRatingSlider from './TRNRatingSlider';
import ServerRatingAdd from './ServerRatingAdd';
import { DragDropContext } from 'react-beautiful-dnd';
import ServerRatingList, {
  ServerRatingListContext
} from './ServerRatingList/ServerRatingList';
import DeleteDrop from './ServerRatingList/DeleteDrop';
import ErrorMessage from '../../UI/ErrorMessage';
import Padded from '../../UI/Padded';
import AbsoluteLoader from '../../UI/Styled-Components/ServerRatingEdit/AbsoluteLoader';
import DarkTabs from '../../UI/Styled-Components/ServerRatingEdit/DarkTabs';
import ServerRatingPasswordInput from './ServerRatingPasswordInput';

const MarginedContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

// Index based
const RATING_TYPE = ['TRN Rating', 'Kill/Death Ratio'];

class ServerRatingEdit extends Component {
  state = {
    dragIsActive: false,
    serverId: null,
    requesterDiscordId: null,
    currentPassword: ''
  };

  constructor(props) {
    super(props);
    this.state.serverId = props.match.params.serverId;

    if (props.location.search) {
      const parsedQueryString = qs.parse(
        props.location.search.replace('?', '')
      );

      this.state.requesterDiscordId = parsedQueryString.requesterDiscordId;
    }
    this.state.currentPassword = props.password;
  }

  // TODO: This might need to be moved to componentWillReceiveProps
  componentDidMount() {
    this.props.setActiveServer(this.state.serverId);

    if (!this.props.ratingType) {
      this.props.change('ratingType', RATING_TYPE[0]);
    } else {
      console.log(this.props.ratingType);
    }
  }

  componentDidUpdate() {
    if (this.state.currentPassword !== this.props.password) {
      this.setState({ currentPassword: this.props.password }, () => {
        this.props.checkServerRolesRatingEditPassword();
      });
    }

    if (!this.props.ratingType) {
      this.props.change('ratingType', RATING_TYPE[0]);
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

  renderPasswordField = props => {
    return (
      <ServerRatingPasswordInput {...props} onChange={props.input.onChange} />
    );
  };

  ratingTypeChange = (event, value) => {
    this.props.change('ratingType', RATING_TYPE[value]);
  };

  addRating = () => {
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
      this.props.change('trnRangeNames', updatedNames);
      this.props.change('trnRange', updatedRange);
      this.props.change('newRatingName', '');
    }
  };

  onDragRatingStart = () => {
    this.setState({
      dragIsActive: true
    });
  };

  onDragRatingEnd = ({ destination, source }) => {
    this.setState({
      dragIsActive: false
    });

    if (!destination) return;

    if (destination.droppableId === 'rating-list-delete-drop-area') {
      const updatedRangeNames = Array.from(this.props.trnRangeNames).reverse();
      const updatedRange = Array.from(this.props.trnRange).reverse();
      updatedRangeNames.splice(source.index, 1);
      updatedRange.splice(source.index, 1);
      this.props.change('trnRangeNames', updatedRangeNames.reverse());
      this.props.change('trnRange', updatedRange.reverse());
    } else {
      const reorderedNames = Array.from(this.props.trnRangeNames).reverse();
      const [removed] = reorderedNames.splice(source.index, 1);
      reorderedNames.splice(destination.index, 0, removed);
      reorderedNames.reverse();
      this.props.change('trnRangeNames', reorderedNames);
    }
  };

  onRangeNameEdit = (value, index) => {
    const updatedNames = Array.from(this.props.trnRangeNames).reverse();
    updatedNames[index] = value;
    updatedNames.reverse();
    this.props.change('trnRangeNames', updatedNames);
  };

  render() {
    let output;
    if (!this.state.serverId) {
      output = <ErrorMessage>No Server ID defined</ErrorMessage>;
      return;
    } else if (!this.state.requesterDiscordId) {
      output = (
        <ErrorMessage>Dafuq, no requester discord ID wdym!!</ErrorMessage>
      );
      return;
    }

    const tabIndex = this.props.ratingType
      ? RATING_TYPE.indexOf(this.props.ratingType)
      : 0;

    output = (
      <div>
        <DarkTabs
          theme={this.props.theme}
          value={tabIndex}
          onChange={this.ratingTypeChange}
          indicatorColor="primary"
          fullWidth
        >
          <Tab label="TRN Rating" />
          <Tab label="Kill/Death ratio" />
        </DarkTabs>

        <SwipeableViews index={tabIndex}>
          <Padded padding={12}>
            <form
              onSubmit={this.props.handleSubmit(() => {
                this.props.submitServerRatingEdit();
              })}
            >
              <Field
                name="trnRange"
                component={this.renderTRNRatingEditSlider}
                trnRange={this.props.trnRange}
              />
              <MarginedContainer>
                <DragDropContext
                  onDragStart={this.onDragRatingStart}
                  onDragEnd={this.onDragRatingEnd}
                >
                  <ServerRatingListContext.Provider
                    value={{
                      onRangeNameEdit: this.onRangeNameEdit
                    }}
                  >
                    <ServerRatingList
                      range={this.props.trnRange}
                      rangeNames={this.props.trnRangeNames}
                    />
                  </ServerRatingListContext.Provider>

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
                        onAddClick={this.addRating}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <DeleteDrop dragIsActive={this.state.dragIsActive} />
                    </Grid>
                  </Grid>
                </DragDropContext>
              </MarginedContainer>
              <Grid container spacing={24} alignItems="baseline">
                <Grid item>
                  <Field
                    name="password"
                    component={this.renderPasswordField}
                    value={this.props.password}
                    error={
                      this.props.password &&
                      this.props.serverEditPasswordStatus !== 'VALID'
                    }
                  />
                </Grid>
                <Grid item style={{ position: 'relative' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={this.props.serverEditPasswordStatus !== 'VALID'}
                  >
                    Submit
                  </Button>
                  {this.props.serverEditPasswordStatus === 'LOADING' && (
                    <AbsoluteLoader
                      size={24}
                      className="progress-bar"
                      color="secondary"
                    />
                  )}
                </Grid>
              </Grid>
            </form>
          </Padded>
          <Padded padding={12}>
            <Typography>Not yet implemented...</Typography>
          </Padded>
        </SwipeableViews>
      </div>
    );

    return (
      <Container>
        <MarginedContainer>
          <Padded padding={0} paddingLeft={12} paddingRight={12}>
            <Typography variant="title">
              Server I.D. - {this.state.serverId}
            </Typography>
          </Padded>
        </MarginedContainer>
        {output}
      </Container>
    );
  }
}

ServerRatingEdit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      serverId: PropTypes.string.isRequired
    })
  }),
  location: PropTypes.any,
  handleSubmit: PropTypes.func,
  ratingType: PropTypes.string,
  password: PropTypes.string,
  serverEditPasswordStatus: PropTypes.string,
  trnRangeNames: PropTypes.array,
  trnRange: PropTypes.array,
  newRatingName: PropTypes.string,
  formErrors: PropTypes.shape({
    trnRange: PropTypes.string,
    newRatingName: PropTypes.string
  }),
  change: PropTypes.func,
  setActiveServer: PropTypes.func,
  submitServerRatingEdit: PropTypes.func,
  checkServerRolesRatingEditPassword: PropTypes.func,
  theme: PropTypes.object.isRequired
};

const selector = formValueSelector('serverRatingEdit');
const errorSelector = getFormSyncErrors('serverRatingEdit');

function mapStateToProps(state) {
  return {
    ratingType: selector(state, 'ratingType'),
    password: selector(state, 'password'),
    serverEditPasswordStatus: getServerEditPasswordStatus(state),
    trnRangeNames: selector(state, 'trnRangeNames'),
    trnRange: selector(state, 'trnRange'),
    newRatingName: selector(state, 'newRatingName'),
    formErrors: errorSelector(state)
  };
}

const mapDispatchToProps = {
  setActiveServer,
  submitServerRatingEdit,
  checkServerRolesRatingEditPassword,
  change
};

function validate({ trnRange, trnRangeNames, newRatingName }) {
  const errors = {};

  if (Array.isArray(trnRangeNames) && trnRangeNames.includes(newRatingName)) {
    errors['newRatingName'] = `This role already exists yafuq`;
  }

  if (
    Array.isArray(trnRange) &&
    trnRange.length > 0 &&
    trnRange[0].max === 100
  ) {
    errors['trnRange'] = `Move the latest range before adding another yafuq`;
    errors[
      'newRatingName'
    ] = `Can't add another role because one is still set to 100`;
  }

  return errors;
}

ServerRatingEdit = reduxForm({
  validate,
  form: 'serverRatingEdit'
})(ServerRatingEdit);

ServerRatingEdit = connect(
  mapStateToProps,
  mapDispatchToProps
)(ServerRatingEdit);

export default withTheme()(ServerRatingEdit);
