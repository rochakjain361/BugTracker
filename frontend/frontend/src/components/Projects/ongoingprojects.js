import React, {Component} from 'react'
import axios from 'axios';
import logo from '../../mediafiles/LogoSmall.png'
import {Grid, Container, Header, Image, Segment, Label, Card, Popup, Button, Responsive, Sidebar, Menu, Icon} from 'semantic-ui-react'
import Avatar from 'react-avatar'
import './styles.css'
import 'moment-timezone';
import Moment from 'react-moment';
import { API_URL, SITE_URL } from '../../constants';

class Projects extends Component {
    constructor(props){
        super(props)

        this.state = {
            user_data: [],
            projects: [],
            ongoing_projects: [],
            right_menu_visible: false,
        }
    };   
    
    componentDidMount(){
        axios({
            method:'get',
            url: `${API_URL}appusers/my_page/?code=${sessionStorage.getItem('access_token')}`,
            withCredentials: true,
          }).then((response) => {
            console.log(response)
            if(response.statusText === "OK"){
              if(response.data.Status == 'User is disabled' || response.data.Status == 'User not Authenticated'){
                alert('You are either not authenticated or disabled by the Admins. Retry Logging in again if not prossible then contact the admins.')
                window.location = API_URL
              }
              else{this.setState({
                got_response: true,
                projects: response.data["projects"],
                user_data: response.data["user_data"], 
              })}
            }
          })

        axios({
            method:'get',
            url: `${API_URL}project/`,
        }).then((response) => {
            console.log(response)
            if(response.statusText === "OK"){
                this.setState({
                    ...this.state,
                    ongoing_projects: response.data
                })
            }
            console.log(this.state)
        })
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
        if(status == 3){
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

    render() {
        const avatar = (url, firstname) => {
            if(url === ""){
                return(
                    <Avatar name={firstname} color='Crimson'/>
                )
            }
            else{
                var dp_url = 'https://internet.channeli.in/' + url;
                return( 
                    <Avatar src={dp_url} />
                )
            }
          }
        
          var User_Role;
          if(this.state.user_data["user_role"] == 1){
            User_Role = 'Normal User'
          }
      
          else if(this.state.user_data["user_role"] == 2){
            User_Role = 'Admin'
          }
        return (
            <div>
              <Responsive minWidth={768}>
              <div className="ui fixed inverted menu">
                    <div className="ui container">
                    <a href={`${SITE_URL}mypage`}>
          <img src={logo} height="60px" width="60px" style={{marginTop: 4}}/>
           </a> 
           <h2 className="header item">
            <a href={`${SITE_URL}mypage`}>
                BugTracker
                </a>
            </h2>
            <div className="right menu">
              <div className="item">
                <Button primary href={`${SITE_URL}mypage`}>
                  Back To My Page
                </Button>
              </div>
              <div className="item">
                <Button primary href={`${SITE_URL}project/add`}>
                Add New Project
                </Button>
              </div>
              <div className="item">
              <Button primary href={`${SITE_URL}issue/add`}>
                Add New Issue
                </Button>
                            </div>
                        </div>
                    </div>
                </div> 
              </Responsive>
              <Responsive maxWidth={768}>
              <Menu fixed inverted>
            <Container>
            <a href={`${SITE_URL}mypage`}>
          <img src={logo} height="60px" width="60px" style={{marginTop: 4}}/>
           </a> 
           <h2 className="header item">
            <a href={`${SITE_URL}mypage`}>
                BugTracker
                </a>
            </h2>
            </Container>
            <Menu.Item onClick={() =>{
              this.setState({
                right_menu_visible: !this.state.right_menu_visible
              })
            }}><Icon name="sidebar" size='large'/></Menu.Item>
          </Menu>
          <Sidebar.Pushable style={{marginTop : -14}}>
            <Sidebar
            as={Menu}
            animation='scale down'
            icon='labeled'
            inverted
            direction = 'top'
            onHide={() => this.setState({
              right_menu_visible: false
            })}
            vertical
            visible={this.state.right_menu_visible}
            width='thin'>
              <Menu.Item as='a' href={`${SITE_URL}mypage`}>
              Back To My Page
              </Menu.Item>
              <Menu.Item as='a' href={`${SITE_URL}project/add`}>
                Add New Project
              </Menu.Item>
              <Menu.Item as='a' href={`${SITE_URL}issue/add`}>
                Add New Issue
              </Menu.Item>
            </Sidebar>
            <Sidebar.Pusher>
            <Container>
                <Grid columns={2} stackable>
                 <Grid.Row>
                     <Grid.Column>
                     <div style={{marginTop: 30}}>
                     <Header as='h1'>
                        USER PROFILE
                    </Header>
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
                    </p>
                    </div>
                    <div className="ui orange segment">
                      <Segment vertical>
                      <h3>Ongoing Projects</h3>
                      </Segment>
                        {this.state.projects.map(projects =>{
                          return(
                            <Segment vertical key={projects.id}> 
                            <Header as='a' href={`${SITE_URL}projects/` + projects.id} color='blue'>
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
                </Grid.Column>
                <Grid.Column>
                    <div style={{marginTop: 20, marginBottom: 50}}>
                      <Header as='h1'>
                        PROJECTS
                      </Header>
                    <Segment color='green'>
                    {this.state.ongoing_projects.map(projects =>{
                          return(
                            <Segment vertical key={projects.id}> 
                            <Header as='a' href={`${SITE_URL}projects/` + projects.id} color='blue'>
                              <h3>
                              {projects.name}
                              </h3>
                            </Header>
                            <br/>
                            {this.statusLabel(projects.status)}
                            {this.statusText(projects.status)}<br/>
                            <Popup
                    trigger={<b>{projects.creator.username}</b>}>
                      <Card>
                          <Card.Content>
                            <Image
                            floated='right'
                            circular
                            >
                               {avatar(projects.creator.display_picture, projects.creator.first_name)}
                            </Image>
                            <Card.Header as='h4'>{projects.creator.username}</Card.Header>
                            <Card.Meta>Enrollment No: {projects.creator.enrNo}</Card.Meta>
                            <Card.Meta>Email: {projects.creator.email}</Card.Meta>
                            <div style={{color: '#DC143C' }}>{projects.creator.is_disabled ? 'Disabled' : ''}</div>
                            </Card.Content> 
                        </Card>
                    </Popup> started this project <Moment fromNow>
                                  {projects.created_at}
                                </Moment>
                            </Segment>
                          )
                        } 
                        )}
                    </Segment>
                    </div>
                </Grid.Column>
                </Grid.Row>
            </Grid>
            </Container>
            </Sidebar.Pusher>
            </Sidebar.Pushable>
              </Responsive>
              <Responsive minWidth={768}>
              <Container>
                <Grid columns={2} stackable>
                 <Grid.Row>
                     <Grid.Column>
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
                    </p>
                    </div>
                    <div className="ui orange segment">
                      <Segment vertical>
                      <h3>Ongoing Projects</h3>
                      </Segment>
                        {this.state.projects.map(projects =>{
                          return(
                            <Segment vertical key={projects.id}> 
                            <Header as='a' href={`${SITE_URL}projects/` + projects.id} color='blue'>
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
                </Grid.Column>
                <Grid.Column>
                    <div className='userinfo'>
                    <Header as='h1'>
                        PROJECTS
                    </Header>
                    <Segment color='green'>
                    {this.state.ongoing_projects.map(projects =>{
                          return(
                            <Segment vertical key={projects.id}> 
                            <Header as='a' href={`${SITE_URL}projects/` + projects.id} color='blue'>
                              <h3>
                              {projects.name}
                              </h3>
                            </Header>
                            <br/>
                            {this.statusLabel(projects.status)}
                            {this.statusText(projects.status)}<br/>
                            <Popup
                    trigger={<b>{projects.creator.username}</b>}>
                      <Card>
                          <Card.Content>
                            <Image
                            floated='right'
                            circular
                            >
                               {avatar(projects.creator.display_picture, projects.creator.first_name)}
                            </Image>
                            <Card.Header as='h4'>{projects.creator.username}</Card.Header>
                            <Card.Meta>Enrollment No: {projects.creator.enrNo}</Card.Meta>
                            <Card.Meta>Email: {projects.creator.email}</Card.Meta>
                            <div style={{color: '#DC143C' }}>{projects.creator.is_disabled ? 'Disabled' : ''}</div>
                            </Card.Content> 
                        </Card>
                    </Popup> started this project <Moment fromNow>
                                  {projects.created_at}
                                </Moment>
                            </Segment>
                          )
                        } 
                        )}
                    </Segment>
                    </div>
                </Grid.Column>
                </Grid.Row>
            </Grid>
            </Container>
              </Responsive>
            </div>
        )
    }
}

export default Projects
