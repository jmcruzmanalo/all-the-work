import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

class ServerRatingPasswordInput extends PureComponent {
  state = {
    showPassword: false
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  render() {
    const { error, input } = this.props;
    const { value } = input;

    const endAdornment = (
      <InputAdornment position="end">
        <IconButton
          aria-label="Toggle password visibility"
          onClick={this.handleClickShowPassword}
          onMouseDown={this.handleMouseDownPassword}
        >
          {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    );

    let helperText;
    // console.log(this.props.error);
    if (error && value) {
      helperText = <FormHelperText>Invalid password</FormHelperText>;
    } else if (!error && value) {
      helperText = <FormHelperText>Ya ya ya ya, gucci gucci</FormHelperText>;
    } else {
      helperText = (
        <FormHelperText>
          This was sent by the bot along with the link.
        </FormHelperText>
      );
    }

    return (
      <Fragment>
        <FormControl error={error}>
          <InputLabel htmlFor="adornment-password">Enter password</InputLabel>
          <Input
            id="adornment-password"
            type={this.state.showPassword ? 'text' : 'password'}
            {...input}
            onKeyDown={this.onKeyEnter}
            endAdornment={endAdornment}
          />
          {helperText}
        </FormControl>
      </Fragment>
    );
  }
}

ServerRatingPasswordInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  error: PropTypes.bool,
  input: PropTypes.object.isRequired
};

export default ServerRatingPasswordInput;
