import React from 'react'
//import { Grid, Placeholder, Segment } from 'semantic-ui-react'
import {Component} from 'react'
import { connect } from 'react-redux'
import { requestCurrentUserProfile } from '../../actions/currentuserprofile'

class MyPage extends Component{
  componentDidMount() {
    this.props.requestCurrentUserProfile();
  }

  render() {
    const { requestCurrentUserProfile } = this.props;
    return (
      <div>
        Hello world
        {requestCurrentUserProfile.user_data}
      </div>
    );
    }
}

const mapStateToProps = (state) => {
  return {
    currentuserprofile: state.requestCurrentUserProfile,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    requestCurrentUserProfile: () => {
      dispatch(requestCurrentUserProfile());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyPage);
