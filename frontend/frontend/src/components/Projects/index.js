import React, {Component} from 'react'
import { connect } from 'react-redux'
import {requestProjects} from '../../actions/projects'

class Projects extends Component {
    render(){
        const {projects} = this.props;
        return(
            <div>
                {projects.data}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        projects: state.requestProjects
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        requestProjects: () => {
            dispatch(requestProjects());
        }
    }
}