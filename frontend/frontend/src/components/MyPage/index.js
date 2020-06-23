import React, { Component } from 'react'
import Avatar from 'react-avatar';
import axios from 'axios'
import logo from '../../mediafiles/LogoSmall.png'
import './styles.css'
import { Menu, Segment, Header, Container, Grid, Image} from 'semantic-ui-react'
import 'moment-timezone';
import Moment from 'react-moment';

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
       activeItem : 'reportedIssues'
    };
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick = (e, { name }) => {
    e.preventDefault()
    this.setState({ activeItem : name})
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
          user_data: response.data["user_data"],   
        })
      }
    })

    console.log(this.props.access_token)

    axios({
      method:'get',
      url: 'http://127.0.0.1:8000/appusers/test/',
      withCredentials: true
    }).then((response) => {
      console.log(response.data)
    })
  }

  render(){
    const { activeItem } = this.state
    let issues;
    console.log(this.state.user_data.pk)
    sessionStorage.setItem('pk', this.state.user_data.pk);
    if(this.state.activeItem === 'reportedIssues'){
      var rptd_issues = Array(this.state.reported_issues)[0]
      console.log(rptd_issues)
      issues=(<div>
        <Segment color='violet'>
          <Segment.Group raised>
        {rptd_issues.map(issues =>{
          var assigned_to;
          if(Array(issues.assigned_to)[0] == null){
            assigned_to = 'Assigned to no one'
          }
          else{
            assigned_to = Array(issues.assigned_to)[0].username
          }
          return(  
            <Segment key={issues.id}>
              <h4>
              <Grid columns={2}>
                <Grid.Row>
                  <Grid.Column>
                    Project:{issues.project.name}
                  </Grid.Column>
                  <Grid.Column>
                    Assigned To: {assigned_to}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    Issues Title: {issues.title}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              </h4>
            </Segment>
          )})}
            </Segment.Group>
        </Segment>
        </div>)
    }

    else if(this.state.activeItem === 'assignedIssues'){
      var asgnd_issues = Array(this.state.assigned_issues)[0]
      console.log(asgnd_issues)
      issues=(<div>
        <Segment color='green'>
          <Segment.Group raised>
        {asgnd_issues.map(issue =>{
          var reported_by;
          if(Array(issue.reported_by)[0] == null){
            reported_by = 'No One Reported this'
          }
          else{
            reported_by = Array(issue.reported_by)[0].username
          }
          return(
            <Segment key={issue.pk}>
              <h4>
              <Grid columns={2}>
                <Grid.Row>
                  <Grid.Column>
                    Project:{issue.project.name}
                  </Grid.Column>
                  <Grid.Column>
                    Reported By: {reported_by}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    Issues Title: {issue.title}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              </h4>
            </Segment>
          )})}
          </Segment.Group>
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
                    <Image
                    floated='left'
                    circular>
                          <Avatar name={this.state.user_data.first_name} color='crimson'/>
                    </Image>
                    <p>
                    <Header>
                    {this.state.user_data["username"]}
                    </Header>
                    Enrollment No: {this.state.user_data["enrNo"]}<br></br>
                    User-Role: {this.state.user_data["user_role"]}
                    </p>
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
                              Created:
                              <Moment fromNow>
                                {projects.created_at}
                              </Moment>
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
