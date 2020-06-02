import React, { Component } from 'react'
//import { Grid, Placeholder, Segment } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { getCurrentUser } from '../../actions/getCurrentUserProfile'
import axios from 'axios'
import { Menu } from 'semantic-ui-react'
import logo from '../../mediafiles/LogoSmall.png'
import './styles.css'
import { Switch, Route, Link } from 'react-router-dom'
class MyPage extends Component{
  constructor(props) {
    super(props);

    this.state = {
       got_response: false,
       assigned_issues: [],
       projects: [],
       reported_isssues: [],
       user_data: []    
    };
  }

  componentDidMount() {
    axios({
      method:'post',
      url: 'http://127.0.0.1:8000/appusers/my_page/',
      headers:{
        'Content-Type':'application/json',
      },
      withCredentials: true,
      data:{
        access_token: this.props.access_token
      }
    }).then((response) => {
      console.log(response)
      if(response.statusText === "OK"){
        this.setState({
          got_response: true,
          assigned_issues: response.data["assigned_issues"],
          projects: response.data["projects"],
          reported_isssues: response.data["reported_issues"],
          user_data: response.data["user_data"]
        })
      }
      console.log(this.state)
      console.log(this.state.user_data["display_picture"])
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
        <div className="ui container">
          <div className="ui two column grid">
            <div className="column">
            <div className="userinfo">
                <div className="ui red segments fluid card">
                  <div className="ui red segment">
                    <div className="content">
                      <h3>
                      Name: {this.state.user_data["username"]}<br></br>
                      EnrNo: {this.state.user_data["enrNo"]}<br></br>
                      User-Role: {this.state.user_data["user_role"]}<br></br>
                      </h3>
                    </div>
                    </div>
                    <div className="ui orange segment">
                      <h3>Ongoing Projects</h3>
                      <div className="ui segments">
                        {this.state.projects.map(projects =>{
                          return(
                          <div className="ui segment">
                            <h4 className="ui content left">
                              <p>{projects.name}</p>
                            </h4>
                            <h4 className="ui content right">
                            <p>{projects.created_at}</p>
                            </h4>
                          </div>
                          )
                        } 
                        )}
                      </div>
                    </div>
                </div>
              </div>
            </div>
            <div className="column">
              <Switch>
                <Route path='/' component={}/>
                <Route path='/' component={}/>
              </Switch>
              <div className="issues-info">
                <div className="ui pointing menu">
                  <Link>
                  </Link>

                </div>
              </div>  
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default MyPage;
