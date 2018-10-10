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
import {
  getServerEditPasswordStatus,
  getServerId,
  getRequesterDiscordId,
  getErrorMessage
} from '../../redux/selectors';
import styled from 'styled-components';
import qs from 'querystring';
import clone from 'clone';
import has from 'lodash/has';
import Typography from '@material-ui/core/Typography';
import Tab from '@material-ui/core/Tab';
import withTheme from '@material-ui/core/styles/withTheme';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import SwipeableViews from 'react-swipeable-views';
import {
  setActiveServer,
  setRequesterDiscordId,
  submitServerRatingEdit,
  checkServerRolesRatingEditPassword
} from '../../redux/modules/server';
import Container from '../../components/UI/Container';
import TRNRatingSlider from '../../components/Server/ServerRatingEdit/TRNRatingSlider';
import ServerRatingAdd from '../../components/Server/ServerRatingEdit/ServerRatingAdd';
import { DragDropContext } from 'react-beautiful-dnd';
import ServerRatingList, {
  ServerRatingListContext
} from '../../components/Server/ServerRatingEdit/ServerRatingList/ServerRatingList';
import DeleteDrop from '../../components/Server/ServerRatingEdit/ServerRatingList/DeleteDrop';
import ErrorMessage from '../../components/UI/ErrorMessage';
import Padded from '../../components/UI/Padded';
import AbsoluteLoader from '../../components/UI/Styled-Components/ServerRatingEdit/AbsoluteLoader';
import DarkTabs from '../../components/UI/Styled-Components/ServerRatingEdit/DarkTabs';
import ServerRatingPasswordInput from '../../components/Server/ServerRatingEdit/ServerRatingPasswordInput';

const MarginedContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

// Index based
export const RATING_TYPE = ['TRN Rating', 'Kill/Death Ratio'];

class ServerRatingEdit extends Component {
  state = {
    dragIsActive: false,
    dragWarn: false,
    serverId: null,
    requesterDiscordId: null,
    currentPassword: ''
  };

  constructor(props) {
    super(props);

    this.state.currentPassword = props.password;
  }

  // TODO: This might need to be moved to componentWillReceiveProps
  componentDidMount() {
    const { match, location } = this.props;
    this.props.setActiveServer(match.params.serverId);
    if (location.search) {
      const parsedQueryString = qs.parse(location.search.replace('?', ''));
      this.props.setRequesterDiscordId(parsedQueryString.requesterDiscordId);
    }

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
  }

  renderTRNRatingEditSlider(props) {
    return (
      <TRNRatingSlider
        {...props}
        rolesRating={props.trnRolesRating}
        onChange={value => props.input.onChange(value)}
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
    const updatedRolesRating = this.props.rolesRating
      ? [...this.props.rolesRating]
      : [];

    updatedRolesRating.unshift({
      name: this.props.newRatingName,
      range: {
        min: 0,
        max: 100
      },
      type: this.props.ratingType
    });

    if (updatedRolesRating.length > 1) {
      updatedRolesRating[1].range = {
        ...updatedRolesRating[1].range,
        min: 101
      };
    }

    this.props.change('rolesRating', updatedRolesRating);
    this.props.change('newRatingName', '');
  };

  onDragRatingStart = ({ source: { index: i } }) => {
    const rolesRating = clone(this.props.rolesRating, false);
    rolesRating.reverse();
    const hasId = has(rolesRating[i], 'discordRoleObject.id');
    if (hasId) {
      this.setState({
        dragIsActive: true,
        dragWarn: true
      });
    } else {
      this.setState({
        dragIsActive: true
      });
    }
  };

  onDragRatingEnd = ({ destination, source }) => {
    this.setState({
      dragIsActive: false,
      dragWarn: false
    });

    if (!destination) return;

    if (destination.droppableId === 'rating-list-delete-drop-area') {
      const r = clone(this.props.rolesRating, false).reverse();
      const removed = r.splice(source.index, 1)[0];
      this.props.change('rolesRating', r.reverse());

      if (has(removed, 'discordRoleObject.id')) {
        const removedClone = clone(this.props.removedRolesRating, false);
        removedClone.push(removed);
        this.props.change('removedRolesRating', removedClone);
      }
    } else {
      const r = clone(this.props.rolesRating, false).reverse();
      const n1 = r[source.index].name;
      const n2 = r[destination.index].name;
      r[source.index].name = n2;
      r[destination.index].name = n1;
      r.reverse();
      this.props.change('rolesRating', r);
    }
  };

  onRangeNameEdit = (value, index) => {
    const r = clone(this.props.rolesRating, false).reverse();
    r[index].name = value;
    this.props.change('rolesRating', r.reverse());
  };

  render() {
    let output;
    if (this.props.errorMessage) {
      console.log(this.props.errorMessage);
      output = <ErrorMessage>{this.props.errorMessage}</ErrorMessage>;
    } else {
      if (this.props.fetchingServerDetails) {
        output = (
          <div
            style={{
              textAlign: 'center'
            }}
          >
            <CircularProgress size={90} />
            <Typography>Fetching server details</Typography>
          </div>
        );
      } else {
        const tabIndex = this.props.ratingType
          ? RATING_TYPE.indexOf(this.props.ratingType)
          : 0;

        const trnRolesRating = this.props.rolesRating
          ? this.props.rolesRating.filter(
              roleRating => roleRating.type === this.props.ratingType
            )
          : [];

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
                    name="rolesRating"
                    component={this.renderTRNRatingEditSlider}
                    trnRolesRating={trnRolesRating}
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
                        <ServerRatingList rolesRating={trnRolesRating} />
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
                          <DeleteDrop dragWarn={this.state.dragWarn} />
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
                          (this.props.serverEditPasswordStatus !== 'VALID' &&
                            this.props.serverEditPasswordStatus !== 'LOADING')
                        }
                      />
                    </Grid>
                    <Grid item style={{ position: 'relative' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={
                          this.props.serverEditPasswordStatus !== 'VALID'
                        }
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
      }
    }

    return (
      <Container>
        <MarginedContainer>
          <Padded padding={0} paddingLeft={12} paddingRight={12}>
            <Typography variant="title">
              Discord Server I.D. - {this.props.serverId}
            </Typography>
          </Padded>
        </MarginedContainer>
        {output}
      </Container>
    );
  }
}

// TODO: Update propTypes
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
  newRatingName: PropTypes.string,
  rolesRating: PropTypes.array,
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
    fetchingServerDetails: state.server.fetchingServerDetails,
    serverId: getServerId(state),
    requesterDiscordId: getRequesterDiscordId(state),
    errorMessage: getErrorMessage(state),
    rolesRating: selector(state, 'rolesRating'),
    ratingType: selector(state, 'ratingType'),
    removedRolesRating: selector(state, 'removedRolesRating'),
    password: selector(state, 'password'),
    serverEditPasswordStatus: getServerEditPasswordStatus(state),
    newRatingName: selector(state, 'newRatingName'),
    formErrors: errorSelector(state)
  };
}

const mapDispatchToProps = {
  setActiveServer,
  setRequesterDiscordId,
  submitServerRatingEdit,
  checkServerRolesRatingEditPassword,
  change
};

function validate({ rolesRating, newRatingName }) {
  const errors = {};

  // Error if newRatingName is already entered in ratings
  const i = rolesRating.filter(roleRating => roleRating.name === newRatingName);
  if (i.length) {
    errors['newRatingName'] = `This role already exists yafuq`;
  }

  if (rolesRating.length > 0 && rolesRating[0].range.max <= 100) {
    errors[
      'newRatingName'
    ] = `Move the latest range before adding another yafuq`;
  }

  return errors;
}

ServerRatingEdit = reduxForm({
  validate,
  form: 'serverRatingEdit',
  initialValues: {
    ratingType: RATING_TYPE[0],
    rolesRating: [],
    removedRolesRating: []
  }
})(ServerRatingEdit);

ServerRatingEdit = connect(
  mapStateToProps,
  mapDispatchToProps
)(ServerRatingEdit);

export default withTheme()(ServerRatingEdit);
