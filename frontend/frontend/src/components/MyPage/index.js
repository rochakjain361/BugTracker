import React, { Component } from 'react'
import Avatar from 'react-avatar';
import axios from 'axios'
import logo from '../../mediafiles/LogoSmall.png'
import './styles.css'
import { Menu, Segment, Header, Icon, Grid, Image, Dimmer, Label, Button} from 'semantic-ui-react'
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
       activeItem : 'reportedIssues',
    };
    this.handleItemClick = this.handleItemClick.bind(this);
    this.bugTag = this.bugTag.bind(this);
  }

  handleItemClick = (e, { name }) => {
    e.preventDefault()
    this.setState({ activeItem : name})
  }

  componentDidMount() {
    axios({
      method:'get',
      url: `http://127.0.0.1:8000/appusers/my_page/?code=${this.props.access_token}`,
      withCredentials: true,
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
  bugTag(tag){
    if(tag == 1){
      return(
        <Label
          color='yellow'
          icon='bug'
          size='small'
          corner='right'
          style={{marginLeft: 20}}
          />
      ) 
    }
    else if(tag == 2){
      return(
      <Label
          color='violet'
          icon='hashtag'
          size='small'
          corner='right'
          style={{marginLeft: 20}}
          />
      )
    }
    else if(tag == 3){
      return(
      <Label
          color='brown'
          icon='mobile'
          size='small'
          corner='right'
          style={{marginLeft: 20}}
          />
      )
    }
  }

  statusLabel(status){
    if(status == 1){
      return(
        <Label circular color='yellow' empty/> 
      )
    }
    else if(status == 2){
      return(
        <Label circular color='olive' empty/> 
      )
    }
    if(status == 1){
      return(
        <Label circular color='green' empty/> 
      )
    }
  }

  statusText(status){
    if(status == 1){
      return('Under Development')
    }
    else if(status == 2){
      return('Testing')
    }
    else if(status == 3){
      return('Released')
    }
  }

  UserPage(userRole){
    if(userRole == 1){
      return(
        <Button size='mini' disabled>
          Users Page
        </Button>
      )
    }
    else if(userRole == 2){
      return(
        <div>
        <Button size='mini' href="http://localhost:3000/admin/users">
          Users Page
        </Button>
        </div>
      )
    }
  }

  render(){
    console.log(this.state)
    const { activeItem } = this.state
    let issues;
    console.log(this.state.user_data.pk)
    sessionStorage.setItem('pk', this.state.user_data.pk);
    if(this.state.activeItem === 'reportedIssues'){
      var rptd_issues = Array(this.state.reported_issues)[0]
      console.log(rptd_issues)
      issues=(<div>
        <Segment color='violet'>
        {rptd_issues.map(issues =>{
          var assigned_to;
          if(Array(issues.assigned_to)[0] == null){
            assigned_to = 'Assigned to no one'
          }
          else{
            assigned_to = Array(issues.assigned_to)[0].username
          }
          return(  
            <Segment vertical key={issues.id}>
             <h3>
                <Icon name='check circle' color='green'/>
                <Header as='a' href={"http://localhost:3000/issues/" + issues.pk}>
                  {issues.title}
                  </Header>
                  {this.bugTag(issues.tag)}
                </h3>
            </Segment>
          )})}
        </Segment>
        </div>)
    }

    else if(this.state.activeItem === 'assignedIssues'){
      var asgnd_issues = Array(this.state.assigned_issues)[0]
      console.log(asgnd_issues)
      issues=(<div>
        <Segment color='green'>
        {asgnd_issues.map(issue =>{
          var reported_by;
          if(Array(issue.reported_by)[0] == null){
            reported_by = 'No One Reported this'
          }
          else{
            reported_by = Array(issue.reported_by)[0].username
          }
          return(
            <Segment vertical key={issue.pk}>
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
        </Segment>
        </div>)
    }

    var User_Role;
    if(this.state.user_data["user_role"] == 1){
      User_Role = 'Normal User'
    }

    else if(this.state.user_data["user_role"] == 2){
      User_Role = 'Admin'
    }

    const avatar = (url, firstname) => {
      if(url === ""){
          return(
              <Avatar name={firstname}/>
          )
      }
      else{
          var dp_url = 'https://internet.channeli.in/' + url;
          return( 
              <Avatar src={dp_url} />
          )
      }
    }

    return(
      <div >
        <div className="ui fixed inverted menu">
          <div className="ui container">
          <img src={logo} height="69px" width="69px"/>
            <h2 className="header item">
              BugTracker 
            </h2> 
            <div className="right menu">
              <div className="item">
                <Button primary href={"http://localhost:3000/projects"}>
                  Browse Projects
                </Button>
              </div>
              <div className="item">
                <Button primary href={"http://localhost:3000/project/add"}>
                Add New Project
                </Button>
              </div>
              <div className="item">
              <Button primary href={"http://localhost:3000/issue/add"}>
                Add New Issue
                </Button>
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
                      {avatar(this.state.user_data['display_picture'], this.state.user_data['first_name'])}
                    </Image>
                    <p>
                    <Header>
                    {this.state.user_data["username"]}
                    </Header>
                    Enrollment No: {this.state.user_data["enrNo"]}<br></br>
                    {User_Role}<br/><br/>
                    {this.UserPage(this.state.user_data.user_role)}
                    </p>
                    </div>
                    <div className="ui orange segment">
                      <Segment vertical>
                      <h3>Ongoing Projects</h3>
                      </Segment>
                        {this.state.projects.map(projects =>{
                          return(
                            <Segment vertical key={projects.id}> 
                            <Header as='a' href={"http://localhost:3000/projects/" + projects.id} color='blue'>
                              <h3>
                              {projects.name}
                              </h3>
                            </Header>
                            <br/>
                            {this.statusLabel(projects.status)}
                            {this.statusText(projects.status)}
                              <span style={{marginLeft: 10}}>
                                Created <Moment fromNow>
                                  {projects.created_at}
                                </Moment>
                              </span>
                            </Segment>
                          )
                        } 
                        )}
                      </div>
                </div>
              </div>
            </div>
            <div className="column">
              <div className='page-heading'>
                <Header as='h2'>
                  MI PÁGINA
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
