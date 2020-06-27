import React, { Component } from "react";
import axios from 'axios'
import logo from '../../mediafiles/LogoSmall.png'
import { Container, Header, Segment, Grid, Card, Button, Image, Menu, Label, Popup, Modal, Dropdown, Form, Icon, Message, Input} from "semantic-ui-react";
import './styles.css'
import Avatar from "react-avatar"; 
import Moment from "react-moment";
import { Editor } from '@tinymce/tinymce-react';
import qs from 'qs';
import {Redirect} from 'react-router-dom'

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
        newStatus: '',
        wiki: '',
        users_available: [],
        new_members: [],
        delete_project_name: '',
        }
        this.statusUpdateSubmit = this.statusUpdateSubmit.bind(this)
        this.DescriptionChangeSubmit = this.DescriptionChangeSubmit.bind(this)
        this.AddMoreTeamMembers = this.AddMoreTeamMembers.bind(this)
        this.deleteProjectSubmit = this.deleteProjectSubmit.bind(this)    
    }; 

    handleItemClick = (e, { name }) => {
      e.preventDefault()
      this.setState({ activeItem : name})
    }
        
    componentDidMount(){
        let id = this.props.match.params.id
        console.log(id)
        axios(
          {
            method:'get',
            url: `http://127.0.0.1:8000/project/${id}/`,
            withCredentials: true
        }).then((response) =>{
            console.log(response)
            if(response.statusText === "OK"){
                this.setState({
                    ...this.state,
                    project: response.data,
                    project_creator : response.data.creator,
                    project_members: response.data.members,
                    got_response: true
                })
            }
            console.log(this.state)
        })

        axios({
          method:'get',
          url: `http://127.0.0.1:8000/project/${id}/issues/`,
          withCredentials: true
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
        
        axios({
          method:'get',
          url: 'http://127.0.0.1:8000/appusers/',
          withCredentials: true
        }).then((res) => {
          if(res.statusText === "OK"){
            this.setState({
              ...this.state,
              users_available: res.data
            })
          }
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
    StatusUpdateMenu(currentStatus){
      if(currentStatus == 1){
        return([
          {
            key: '2',
            text: 'Testing',
            value: '2'
          },
          {
            key: '3',
            text: 'Released',
            value: '3'
          }   
        ])
      }
      else if(currentStatus == 2){
        return([
          {
            key: '3',
            text: 'Released',
            value: '3'
          } 
        ])
      }
      else if(currentStatus == 3){
        return([])
      }
    }

    statusUpdateSubmit(){
      console.log(this.state)
      console.log(this.state.newStatus)

      axios({
        method: 'get',
        url: `http://127.0.0.1:8000/project/${this.state.project.id}/status_update/`,
        params : {
          status : this.state.newStatus
        }
      }).then((response) => {
        console.log(response)
      })

      this.refreshpage();
      }

    DescriptionChangeSubmit(){
      console.log(this.state.wiki)

      axios({
        method: 'get',
        url: `http://127.0.0.1:8000/project/${this.state.project.id}/wiki_update/`,
        params: {
          wiki: this.state.wiki
        }
      }).then((response) => {
        console.log(response)
      })

      this.refreshpage();

    }

    AddMoreTeamMembers(){
      console.log(this.state.new_members)
      console.log(this.state.project.id)
      axios({
        method: 'get',
        url: `http://127.0.0.1:8000/project/${this.state.project.id}/add_team_members/`,
        params: {
          add_members: this.state.new_members
        },
        paramsSerializer: params => {
          return qs.stringify(params)
      } 
      }).then((res) => {
        console.log(res)
      })

      this.refreshpage();
    }

    deleteProjectSubmit(){
      console.log(this.state.delete_project_name)
      if(this.state.delete_project_name === this.state.project.name){
        axios({
          method: 'get',
          url: `http://127.0.0.1:8000/project/${this.state.project.id}/delete_project/`
        })
        return(<Redirect to='/onlogin/'/>)
      }
    }

    refreshpage(){
      window.location.reload(false);
    }

    bugTag(tag){
      if(tag == 1){
        return(
          <Button
            color='yellow'
            content='Bug'
            icon='bug'
            size='mini'
            circular
            style={{marginLeft: 20}}
            />
        ) 
      }
      else if(tag == 2){
        return(
        <Button
            color='violet'
            content='Enhancement'
            icon='hashtag'
            size='mini'
            circular
            style={{marginLeft: 20}}
            />
        )
      }
      else if(tag == 3){
        return(
        <Button
            color='brown'
            content='UI/UX'
            icon='mobile'
            size='mini'
            circular
            style={{marginLeft: 20}}
            />
        )
      }
    }

    handleData(data) {
      let result = JSON.parse(data);
      console.log(result);
    }

    render(){
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
      const {activeItem} = this.state
      let status;
      if(this.state.project.status == 1){
        status=(' Under Development')
      }
      else if(this.state.project.status == 2){
        status=('Testing')
      }
      else{
        status=('Released')
      }

      let issues;

      let tag;

      if(this.state.activeItem === 'Open'){
        issues=(<Segment color='red'>
            {this.state.project_issues.map(issues =>{
              if(issues.bug_status === 1 || issues.bug_status === 2){
              return(
                <Segment vertical>
                <h3>
                  <Icon name='exclamation circle' color='red'/>
                  <Header as='a' href={"http://localhost:3000/issues/" + issues.pk} >
                  {issues.title}
                  </Header>
                  {this.bugTag(issues.tag)}
                </h3>
                <div style={{marginLeft: 25}}>
              #{issues.pk} opened <Moment fromNow>{issues.created_at}</Moment> by <Popup trigger={<span>{issues.reported_by.username}</span>}>
                <Card>
                <Card.Content>
                            <Image
                            floated='right'
                            circular
                            >
                               {avatar(issues.reported_by.display_picture, issues.reported_by.username)}
                            </Image>
                            <Card.Header as='h4'>{issues.reported_by.username}</Card.Header>
                            <Card.Meta>Enrollment No: {issues.reported_by.enrNo}</Card.Meta>
                            <Card.Meta>Email: {issues.reported_by.email}</Card.Meta>
                            <div style={{color: '#DC143C' }}>{issues.reported_by.is_disabled ? 'Disabled' : ''}</div>
                            </Card.Content> 
                </Card>
              </Popup>
              </div>
                </Segment>
              )}
            })}
        </Segment>)
      }

      if(this.state.activeItem === 'Closed'){
        issues=(<Segment color='green'>
            {this.state.project_issues.map(issues =>{
              if(issues.bug_status === 3){
              return(
                <Segment vertical>
                <h3>
                <Icon name='check circle' color='green'/>
                <Header as='a' href={"http://localhost:3000/issues/" + issues.pk}>
                  {issues.title}
                  </Header>
                  {this.bugTag(issues.tag)}
                </h3>
                <div style={{marginLeft: 25}}>
                #{issues.pk} opened <Moment fromNow>{issues.created_at}</Moment> by <Popup trigger={<span>{issues.reported_by.username}</span>}>
                <Card>
                <Card.Content>
                            <Image
                            floated='right'
                            circular
                            >
                               {avatar(issues.reported_by.display_picture, issues.reported_by.username)}
                            </Image>
                            <Card.Header as='h4'>{issues.reported_by.username}</Card.Header>
                            <Card.Meta>Enrollment No: {issues.reported_by.enrNo}</Card.Meta>
                            <Card.Meta>Email: {issues.reported_by.email}</Card.Meta>
                            <div style={{color: '#DC143C' }}>{issues.reported_by.is_disabled ? 'Disabled' : ''}</div>
                            </Card.Content> 
                </Card>
              </Popup>
              </div>
                </Segment>
              )}
            })}
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
                <Modal
                trigger={<Button floated='right' inverted color='red'>
                    <Icon name='delete'/> Delete Project
                  </Button>}
                  basic small
                >
                  <Header icon='browser' content='Do you really want to this Project?'/>
                  <Modal.Content>
                    <h4>
                  Once you delete a project, there is no going back. Please be certain.
                  This action <i><u>cannot</u></i> be undone. This will permanently delete the <i><u>{this.state.project.name}</u></i> project, 
                  wiki, issues, comments and will remove the members. Please type <i><u>{this.state.project.name}</u></i> to confirm.
                  </h4>
                  </Modal.Content>
                  <br/>
                  <Form onSubmit={this.deleteProjectSubmit}>
                  <Input 
                    fluid
                    placeholder='Project Name' 
                    onChange={(event, data) =>{
                      this.setState({
                        ...this.state,
                        delete_project_name: data.value,
                      })
                      console.log(this.state)
                    }}
                  />
                  <br/><br/>
                  <Button type='submit' color='red' inverted floated='right'>
                    <Icon name='checkmark'/> Submit and Delete the Project
                  </Button>
                  </Form>
                </Modal>
                </Header>
                </div>
                </Segment>
                <Segment vertical>
                  <Container>
                    <Grid divided='vertically'>
                      <Grid.Row columns={2}>
                        <Grid.Column>
                          <h4>
                            Creator: {this.state.project_creator.username}
                          </h4>
                        </Grid.Column>
                        <Grid.Column>
                          <Modal 
                          trigger={<Header as='h4'
                          color='blue'
                          ><Popup
                            trigger={ <div> Status : {this.statusLabel(this.state.project.status)} {status}</div>}
                            inverted
                            >
                              Update the Status here 
                            </Popup>
                          </Header>}
                          basic
                          size='small'
                          >
                            <Header icon='browser' content='Updating the project status'/>
                            <Modal.Content>
                              Update the project status by selecting one of the options from below:
                              <br/><br/>
                              <Form onSubmit={this.statusUpdateSubmit}>
                                <Dropdown
                                  placeholder='Select the new Project Status'
                                  selection
                                  search
                                  options={this.StatusUpdateMenu(this.state.project.status)}
                                  onChange={(event, data)=>{
                                    this.setState({
                                      ...this.state,
                                      newStatus : data.value
                                    })
                                  }
                                  }
                                />
                                <Button  type='submit' color='green' inverted floated='right'>
                                  <Icon name='checkmark'/> Submit
                                </Button>
                              </Form>
                            </Modal.Content> 
                          </Modal>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                    <p>
                      <h4>Description: 
                        <Modal
                        trigger={<Button size='mini' icon='info circle' content='Change Description' style={{ marginLeft: 25}}/>}
                        basic small
                        >

                          <Header icon='browser' content='Change the Project Description Here'/>
                          <Form onSubmit={this.DescriptionChangeSubmit}>
                          <Form.Field>
                                <Editor
                                    init={{
                                        height: 200,
                                        menubar: false,
                                    }}
                                    value={this.state.wiki}
                                    onEditorChange={(event) => {
                                        this.setState({
                                            ...this.state,
                                            wiki: event
                                        })
                                    }
                                    }
                                    apiKey="m7w1230xevfu875oarb6yfdxqdy4ltar34fuddlol5mowpde"
                                    />
                            </Form.Field>
                            <Button  type='submit' color='green' inverted floated='right'>
                                  <Icon name='checkmark'/> Submit
                                </Button>
                            </Form>
                        </Modal>
                        <div dangerouslySetInnerHTML={{ __html: this.state.project.wiki }} />
                        </h4>
                    </p>
                    <p>
                      <h4>
                        Team Members:
                        <Modal
                        trigger={<Button size='mini' icon='add' content='Alter the Team Members' style={{ marginLeft: 25}}
                        />
                        }
                        basic small
                        >
                          <Header icon='browser' content='Alter the Team Members here'/>
                          <Form onSubmit={this.AddMoreTeamMembers}>
                            <Dropdown 
                              placeholder='Members' 
                              fluid 
                              multiple
                              search
                              selection 
                              options={this.state.users_available.map(user => {
                                return{
                                    "key": user.pk,
                                    "text": user.username,
                                    "value": user.pk
                                }
                              })}
                              onChange={(event, data) => {
                                console.log(data.value)
                                this.setState({
                                    new_members: data.value
                                })
                              }}
                            />
                            <br/><br/>
                            <Button  type='submit' color='green' inverted floated='right'>
                                  <Icon name='checkmark'/> Submit
                                </Button>
                          </Form>
                          <br/><br/>
                          <Modal.Content>
                          <Message
                              basic
                              inverted
                              warning
                              header='Note: The team of previous members will be reseted'
                              list={[
                                'Note that the team of previous members will be erased, so make sure that you re-add them too in order to have them retained or if you want to kick them out of the project you can neglect them.',
                              ]}
                            />
                          </Modal.Content>
                        </Modal>
                      </h4>
                    </p>
                    <Card.Group>
                      {this.state.project_members.map(members => {
                        return(
                        <Popup 
                        trigger={<Card>
                          <Card.Content>
                            <Image
                            floated='right'
                            circular
                            >
                               {avatar(members.display_picture, members.username)}
                            </Image>
                            <Card.Header as='h4'>{members.username}</Card.Header>
                            <Card.Meta>Enrollment No: {members.enrNo}</Card.Meta>
                            <Card.Meta>Email: {members.email}</Card.Meta>
                            <div style={{color: '#DC143C' }}>{members.is_disabled ? 'Disabled' : ''}</div>
                            </Card.Content>
                            </Card>}
                            >
                              {(members.pk == this.state.project_creator.pk) ? 'Creator' : 'Member'}
                            </Popup>
                        )
                       })}
                      </Card.Group>
                      <h4>
                      Created <Moment fromNow>{this.state.project.created_at}</Moment>
                      </h4>
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