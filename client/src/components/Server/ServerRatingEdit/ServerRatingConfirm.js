import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import FormHelperText from '@material-ui/core/FormHelperText';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import CenteredAbsolute from '../../UI/CenteredAbsoluteContainer';
import Padded from '../../UI/Padded';

class ServerRatingConfirm extends PureComponent {
  state = {
    promptIsOpen: false,
    showPassword: false,
    password: ''
  };

  togglePrompt = () => {
    this.setState({
      ...this.state,
      promptIsOpen: !this.state.promptIsOpen
    });
  };

  onKeyEnter = e => {
    if (e.keyCode === 13 && this.state.password) {
      e.preventDefault();
      this.confirm();
    }
  };

  confirm = () => {
    this.props.onConfirm(this.state.password);
  };

  passwordChange = event => {
    this.setState({
      ...this.state,
      password: event.target.value
    });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  render() {
    return (
      <Fragment>
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={this.togglePrompt}
        >
          Save
        </Button>
        <Modal open={this.state.promptIsOpen} onClose={this.togglePrompt}>
          <CenteredAbsolute>
            <Paper>
              <Padded padding={24} paddingTop={12} paddingBottom={12}>
                <FormControl>
                  <InputLabel htmlFor="adornment-password">
                    Enter password
                  </InputLabel>
                  <Input
                    id="adornment-password"
                    type={this.state.showPassword ? 'text' : 'password'}
                    value={this.state.password}
                    onChange={this.passwordChange}
                    onKeyDown={this.onKeyEnter}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={this.handleClickShowPassword}
                          onMouseDown={this.handleMouseDownPassword}
                        >
                          {this.state.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText id="weight-helper-text">
                    This was sent by the bot along with the link.
                  </FormHelperText>
                </FormControl>
                <br />
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  type="button"
                  fullWidth={true}
                  onClick={this.confirm}
                  disabled={!this.state.password}
                >
                  Save
                </Button>
              </Padded>
            </Paper>
          </CenteredAbsolute>
        </Modal>
      </Fragment>
    );
  }
}

ServerRatingConfirm.propTypes = {
  onConfirm: PropTypes.func.isRequired
};

export default ServerRatingConfirm;
