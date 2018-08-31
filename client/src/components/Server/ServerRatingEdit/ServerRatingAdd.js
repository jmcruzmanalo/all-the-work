import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Input,
  InputLabel,
  FormControl,
  FormHelperText
} from "@material-ui/core";

// TODO: Prevent Enter key from submitting the form here
const ServerRatingAdd = props => {
  return (
    <Fragment>
      <FormControl error={!!props.meta.error && !!props.input.value}>
        <InputLabel>New Rating Name</InputLabel>
        <Input autoComplete="off" {...props.input} />
        {props.meta.error &&
          props.input.value && (
            <FormHelperText>{props.meta.error}</FormHelperText>
          )}
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={() => props.onAddClick()}
        style={{ marginLeft: 20 }}
        disabled={!!props.formErrors.newRatingName}
      >
        Add Rating Range
      </Button>
    </Fragment>
  );
};

ServerRatingAdd.propTypes = {
  value: PropTypes.string,
  formErrors: PropTypes.any,
  onAddClick: PropTypes.func,
  meta: PropTypes.object,
  input: PropTypes.object
};

export default ServerRatingAdd;
