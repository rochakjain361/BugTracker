import React, { Component } from 'react'
//import { Grid, Placeholder, Segment } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { getCurrentUser } from '../../actions/getCurrentUserProfile'
import axios from 'axios'
import logo from '../../mediafiles/LogoSmall.png'
import './styles.css'
import { Switch, Route, Link } from 'react-router-dom'
import { Menu, Segment, Header, Container, Grid } from 'semantic-ui-react'

const color = ['violet', 'green']

class MyPage extends Component{
  constructor(props) {
    super(props);

    this.state = {
       got_response: false,
       assigned_issues: [],
       projects: [],
       reported_issues: [],
       user_data: [],
       activeItem : 'reportedIssues',
       isToggleOn: true 
    };
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick = (e, { name }) => {
    e.preventDefault()
    this.setState({ activeItem : name, isToggleOn: !this.state.isToggleOn})
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
          reported_issues: response.data["reported_issues"],
          user_data: response.data["user_data"]
        })
      }
      console.log(this.state)
      console.log(this.state.user_data["display_picture"])
    })
  }

  render(){
    const { activeItem } = this.state
    let issues;

    if(this.state.activeItem === 'reportedIssues'){
      issues=(<div>
        <Segment color='violet' inverted>
        {this.state.reported_issues.map(issues =>{
          return(
            <h3>
            <Segment key={issues.id}>
              <Grid columns={2}>
                <Grid.Row>
                  <Grid.Column>
                    Project:{issues.project}
                  </Grid.Column>
                  <Grid.Column>
                    Assigned To: {issues.assigned_to}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    Issues Title: {issues.title}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
            </h3>
            )})}
        </Segment>
        </div>)
    }

    else if(this.state.activeItem === 'assignedIssues'){
      issues=(<div>
        <Segment color='green' inverted>
        {this.state.assigned_issues.map(issues =>{
          return(
            <h3>
            <Segment key={issues.id}>
              <Grid columns={2}>
                <Grid.Row>
                  <Grid.Column>
                    Project:{issues.project}
                  </Grid.Column>
                  <Grid.Column>
                    Reported By: {issues.reported_by}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    Issues Title: {issues.title}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
            </h3>
            )})}
        </Segment>
        </div>)
    }

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
                    <div className="ui orange inverted segment">
                      <h3>Ongoing Projects</h3>
                      <div className="ui segments">
                        {this.state.projects.map(projects =>{
                          return(
                          <div className="ui segment" key={projects.id}>
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
              <div className='page-heading'>
                <Header as='h1' color='red'>
                  MY PAGE
                </Header>
                </div> 
              <div className="issues-info">
                <Menu widths={2} inverted>
                  <Menu.Item
                    name='reportedIssues'
                    active={ activeItem === 'reportedIssues'}
                    onClick={this.handleItemClick}
                    color = {color[0]}
                  >
                    <h4>Reported Issues</h4>
                  </Menu.Item>
                  <Menu.Item 
                    name='assignedIssues'
                    active={ activeItem === 'assignedIssues'}
                    onClick={this.handleItemClick}
                    color = {color[1]}
                  >
                    <h4>Assigned Issues</h4>
                  </Menu.Item>
                </Menu>
                  {issues}                  
              </div>  
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default MyPage;
