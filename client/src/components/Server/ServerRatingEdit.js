import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { setActiveServer } from '../../actions/actions';
import MultiPointSlider from '../UI/MultiPointSlider/MultiPointSlider';
import Container from '../UI/Container';

class ServerRatingEdit extends Component {

  state = {}

  constructor(props) {
    super(props);
    this.serverId = props.match.params.serverId;
  }

  // TODO: This might need to be moved to componentWillReceiveProps
  componentDidMount() {

    this.props.setActiveServer(this.serverId);
  }

  render() {
    return (
      <Container>
        <form onSubmit={this.props.handleSubmit(() => console.log('Form submitted'))}>
          <p>Server I.D. -  {this.serverId}</p>
          <Field name="trnRange" component={MultiPointSlider} />
        </form>
      </Container>
    );
  }
}

function mapStateToProps() {
  return {}
}

export default reduxForm({
  form: 'serverRatingEdit'
})(connect(mapStateToProps, {
  setActiveServer
})(ServerRatingEdit));
