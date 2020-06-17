import React, { Component } from "react";
import axios from 'axios'
import logo from '../../mediafiles/LogoSmall.png'
import { Container, Header, Segment, Grid, Card, Button, Image, Menu } from "semantic-ui-react";
import './styles.css'
import Avatar from "react-avatar"; 
import Moment from "react-moment";

const color = ['red', 'green']

class ProjectDetails extends Component{
    constructor(props){
        super(props)
    
    this.state = {                                  
        project: [],
        project_members: [],
        project_creator: [],
        got_response: false,
        project_issues: [],
        activeItem: 'Open',
        wsdata: [],
        }
    }; 

    handleItemClick = (e, { name }) => {
      e.preventDefault()
      this.setState({ activeItem : name})
    }
        
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
                    ...this.state,
                    project: response.data,
                    got_response: true
                })
            }
            console.log(this.state)
        })

        axios({
          method:'get',
          url: `http://127.0.0.1:8000/project/${id}/team/`,
        }).then((response) => {
          console.log(response)
          if(response.statusText === "OK"){  
              this.setState({
                ...this.state,
                project_creator: response.data['creator'],
                project_members: response.data['members']
              })
            }
            console.log(this.state)
        })

        axios({
          method:'get',
          url: `http://127.0.0.1:8000/project/${id}/issues/`,
        }).then((response) => {
          console.log(response)
          if(response.statusText === "OK"){
            this.setState({
              ...this.state,
              project_issues: response.data
            })
          }
          console.log(this.state)
        })      
    }

    handleData(data) {
      let result = JSON.parse(data);
      console.log(result);
    }

    render(){
      const {activeItem} = this.state
      let status;
      if(this.state.project.status == 1){
        status=(
          <p>
            <h3>
              Status: Under Development
            </h3> 
          </p>
        )
      }
      else if(this.state.project.status == 2){
        status=(
          <p>
            <h3>
              Status: Testing Phase
            </h3> 
          </p>
        )
      }
      else{
        status=(
          <p>
            <h3>
              Status: Released
            </h3> 
          </p>
        )
      }

      let issues;

      if(this.state.activeItem === 'Open'){
        issues=(<Segment color='red'>
          <Segment.Group raised>
            {this.state.project_issues.map(issues =>{
              if(issues.bug_status === 1){
              return(
                <Segment>
                <h3>
                  {issues.title}
                </h3>
                </Segment>
              )}
            })}
          </Segment.Group>
        </Segment>)
      }

      if(this.state.activeItem === 'Closed'){
        issues=(<Segment color='green'>
          <Segment.Group raised>
            {this.state.project_issues.map(issues =>{
              if(issues.bug_status === 2|| issues.bug_status === 3 ){
              return(
                <Segment>
                <h3>
                  {issues.title}
                </h3>
                </Segment>
              )}
            })}
          </Segment.Group>
        </Segment>)
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
              <Container>
                <Segment vertical>
                  <div className = 'bodyContent'>
                <Header as='h1'>
                  Project: {this.state.project.name}
                </Header>
                </div>
                </Segment>
                <Segment vertical>
                  <Container>
                    <p>
                      <h3>Description: {this.state.project.wiki}</h3>
                    </p>
                    {status}
                    <p>
                      <h3>
                        Creator: {this.state.project_creator.username}
                      </h3>
                    </p>
                    <p>
                      <h3>
                        Team Members:
                      </h3>
                    </p>
                    <Card.Group>
                      {this.state.project_members.map(members => {
                        return(<Card>
                        <Card.Content>
                          <Image
                          floated='left'
                          circular
                          >
                          <Avatar name={this.state.project_creator.first_name} color='crimson'/>
                          </Image>
                          <Card.Header>{members.username}</Card.Header>
                          <Card.Meta>Enrollment No: {members.enrNo}</Card.Meta>
                          <Card.Meta>Email: {members.email}</Card.Meta>
                          </Card.Content>
                          </Card>)
                       })}
                      </Card.Group>
                  </Container>
                </Segment>
                <Segment vertical>
                  <Grid columns={4}>
                    <Grid.Row>
                      <Grid.Column>
                        <h3>
                          Ongoing Issues:
                        </h3>
                      </Grid.Column>
                      <Grid.Column>
                        <Menu widths={2} inverted>
                          <Menu.Item
                          name = 'Open' 
                          active = { activeItem === 'Open'}
                          onClick={this.handleItemClick}
                          color = {color[0]}>
                            <h4>Open</h4>
                          </Menu.Item>
                          <Menu.Item
                           name='Closed'
                           active = { activeItem === 'Closed'}
                           onClick={this.handleItemClick}
                           color = {color[1]}>
                             <h4>Closed</h4>
                          </Menu.Item>
                        </Menu>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  {issues}
                </Segment>
              </Container>
              </div>
            )
    }
}

export default ProjectDetails;