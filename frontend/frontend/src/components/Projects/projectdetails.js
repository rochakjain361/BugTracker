import React, { Component } from "react";
import axios from 'axios'
import logo from '../../mediafiles/LogoSmall.png'

class ProjectDetails extends Component{
    constructor(props){
        super(props)
    
    this.state = {                                  
        project: [],
        got_response: false
        }
    };   
        
    componentDidMount(){
        let id = this.props.match.params.id
        console.log(id)
        axios({
            method:'get',
            url: `http://127.0.0.1:8000/project/${id}/`,
        }).then((response) =>{
            console.log(response)
            if(response.statusText === "OK"){
                this.setState({
                    project: response.data,
                    got_response: true
                })
            }
            console.log(this.state)
        })
    }
    render(){
        return(
            <div>
                <div className="ui fixed inverted menu">
          <div className="ui container">
          <img src={logo} height="69px" width="69px"/>
            <h2 className="header item">
              BugTracker 
            </h2> 
            <div className="right menu">
              <div className="item">
                <button class="ui primary button">
                  Browse Projects
                </button>
              </div>
              <div className="item">
              <button class="ui primary button">
                Add New Projects
              </button>
              </div>
              <div className="item">
              <button class="ui primary button">
                Add New Issues
              </button>
              </div>
              </div>
            </div>
        </div>
            </div>
            )
    }
}

export default ProjectDetails;