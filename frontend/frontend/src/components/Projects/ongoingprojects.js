import React, {Component} from 'react'
import axios from 'axios';
import logo from '../../mediafiles/LogoSmall.png'
import {Grid, Container, Header} from 'semantic-ui-react'
import Avatar from 'react-avatar'
import './styles.css'
import 'moment-timezone';
import Moment from 'react-moment';

class Projects extends Component {
    constructor(props){
        super(props)

        this.state = {
            user_data: [],
            user_projects: [],
            ongoing_projects: [],
            got_response_1: false,
            got_response_2: false
        }
    };   
    
    componentDidMount(){
        axios({
            method:'post',
            url: 'http://127.0.0.1:8000/appusers/my_page/',
            headers:{
                'Content-Type':'application/json',
            },
            withCredentials: true,
            data:{
                access_token: sessionStorage.getItem('access_token')
            }
        }).then((response) =>{
            console.log(response)
            if(response.statusText === "OK"){
                this.setState({
                    ...this.state,
                    got_response_1: true,
                    user_data: response.data["user_data"],
                    user_projects: response.data["projects"]
                })
            }
            console.log(this.state)
        })

        axios({
            method:'get',
            url: 'http://127.0.0.1:8000/project/',
        }).then((response) => {
            console.log(response)
            if(response.statusText === "OK"){
                this.setState({
                    ...this.state,
                    got_response_2: true,
                    ongoing_projects: response.data
                })
            }
            console.log(this.state)
        })
    }
    render() {
        return (
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
                                Back to My Page
                            </button>
                        </div>
                        <div className="item">
                            <button class="ui primary button">
                                Add New Project
                            </button>
                        </div>
                        <div className="item">
                            <button class="ui primary button">
                                Add New Issue
                            </button>
                        </div>
                    </div>
                </div>
             </div> 
             <div className="userinfo">
             <Container>
                <Grid columns={2}>
                 <Grid.Row>
                     <Grid.Column>
                <div className="ui red segments fluid card">
                  <div className="ui red segment">
                    <Grid columns={2}>
                      <Grid.Column>
                        <Avatar name={this.state.user_data.first_name} round={true} color={'crimson'}/>
                      </Grid.Column>
                      <Grid.Column>  
                    <div className="content">
                      <h3>
                      Name: {this.state.user_data["username"]}<br></br>
                      EnrNo: {this.state.user_data["enrNo"]}<br></br>
                      User-Role: {this.state.user_data["user_role"]}<br></br>
                      </h3>
                    </div>
                    </Grid.Column>
                    </Grid>
                    </div>
                    <div className="ui orange inverted segment">
                      <h3>Ongoing Projects</h3>
                      <div className="ui segments">
                        {this.state.ongoing_projects.map(projects =>{
                          return(
                          <div className="ui segment" key={projects.id}>
                            <h4 className="ui content left">
                              <p>{projects.name}</p>
                            </h4>
                            <h4 className="ui content right">
                            <p>
                                Created:
                                <Moment fromNow>
                                {projects.created_at}
                                </Moment>
                            </p>
                            </h4>
                          </div>
                          )
                        } 
                        )}
                      </div>
                    </div>
                </div>
                </Grid.Column>
                <Grid.Column>
                    
                    <Header as='h1' color='green'>
                        PROJECTS
                    </Header>
                    
                    <div className="ui segment inverted green">
                        {this.state.ongoing_projects.map(projects =>{
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
                </Grid.Column>
                </Grid.Row>
            </Grid>
            </Container>
            </div>
            </div>
        )
    }
}

export default Projects
