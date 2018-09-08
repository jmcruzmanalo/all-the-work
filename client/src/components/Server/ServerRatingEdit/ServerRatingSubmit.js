import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

class ServerRatingSubmit extends PureComponent {
  state = {
    promptIsOpen: false,
    showPassword: false
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
        <FormControl>
          <InputLabel htmlFor="adornment-password">Enter password</InputLabel>
          <Input
            id="adornment-password"
            type={this.state.showPassword ? 'text' : 'password'}
            value={this.props.value}
            onChange={this.props.onChange}
            onKeyDown={this.onKeyEnter}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={this.handleClickShowPassword}
                  onMouseDown={this.handleMouseDownPassword}
                >
                  {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText id="weight-helper-text">
            This was sent by the bot along with the link.
          </FormHelperText>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={() => {}}
          disabled={!this.props.value}
        >
          Save
        </Button>
      </Fragment>
    );
  }
}

ServerRatingSubmit.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default ServerRatingSubmit;
