import React, {Component} from 'react'
import axios from 'axios';
import logo from '../../mediafiles/LogoSmall.png'
import {Grid, Container, Header, Image, Segment, Label, Card, Popup, Button} from 'semantic-ui-react'
import Avatar from 'react-avatar'
import './styles.css'
import 'moment-timezone';
import Moment from 'react-moment';

class Projects extends Component {
    constructor(props){
        super(props)

        this.state = {
            user_data: [],
            projects: [],
            ongoing_projects: [],
        }
    };   
    
    componentDidMount(){
        axios({
            method:'get',
            url: `http://127.0.0.1:8000/appusers/my_page/?code=${sessionStorage.getItem('access_token')}`,
            withCredentials: true,
          }).then((response) => {
            console.log(response)
            if(response.statusText === "OK"){
              this.setState({
                ...this.state,
                projects: response.data["projects"],
                user_data: response.data["user_data"], 
              })
            }
          })

        axios({
            method:'get',
            url: 'http://127.0.0.1:8000/project/',
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
        
          var User_Role;
          if(this.state.user_data["user_role"] == 1){
            User_Role = 'Normal User'
          }
      
          else if(this.state.user_data["user_role"] == 2){
            User_Role = 'Admin'
          }
        return (
            <div>
               <div className="ui fixed inverted menu">
                    <div className="ui container">
                    <a href="http://localhost:3000/onlogin">
          <img src={logo} height="60px" width="60px" style={{marginTop: 4}}/>
           </a> 
            <h2 className="header item">
            <a href="http://localhost:3000/onlogin">
                BugTracker
                </a>
            </h2>
            <div className="right menu">
              <div className="item">
                <Button primary href={"http://localhost:3000/onlogin"}>
                  Back To My Page
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
             <Container>
                <Grid columns={2}>
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
                            <Header as='a' href={"http://localhost:3000/projects/" + projects.id} color='blue'>
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
                               {avatar(projects.creator.display_picture, projects.creator.username)}
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
            </div>
        )
    }
}

export default Projects
