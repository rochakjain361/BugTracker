import React, { Component } from "react";
import axios from 'axios'
import logo from '../../mediafiles/LogoSmall.png'
import { Container, Header, Segment, Grid, Card, Button, Image, Menu, Label, Popup, Modal, Dropdown, Form, Icon, Message, Input, Responsive, Sidebar} from "semantic-ui-react";
import './styles.css'
import Avatar from "react-avatar"; 
import Moment from "react-moment";
import { Editor } from '@tinymce/tinymce-react';
import qs from 'qs';
import { Redirect } from "react-router-dom";
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
        if(response.data.Status == 'Status Updated'){
          alert('Status Updated')
          this.refreshpage();
        }
        else if(response.data.Status == 'User not an Admin or the project Creator or in the team'){
          alert('You are not Admin/Project-Team Members. You cannot change the status')
          this.refreshpage();
        }
        else{
          alert('User not Authenticated or is disabled')
          window.location = 'http://localhost:3000/'
        }
      })
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
        if(response.data.Status == 'Wiki Updated'){
          alert('Wiki Updated')
          this.refreshpage();
        }
        else if(response.data.Status == 'User not an Admin or the project Creator or in the team'){
          alert('You are not an Admin or the project Creator or in the team')
          this.refreshpage();
        }
        else{
          alert('User not Authenticated or is disabled')
          window.location = 'http://localhost:3000/'
        }
      })
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
        if(res.data.Status == 'More Team Members Added'){
          alert('Team Altered')
          this.refreshpage();
        }
        else if(res.data.Status == 'User not an Admin or the project Creator'){
          alert('Team not Changed. You cannot change the team')
          this.refreshpage();
        }
        else{
          alert('User not Authenticated or is disabled')
          window.location = 'http://localhost:3000/'
        }
      })
    }

    deleteProjectSubmit(){
      //console.log(this.state.delete_project_name)
      if(this.state.delete_project_name === this.state.project.name){
        axios({
          method: 'get',
          url: `http://127.0.0.1:8000/project/${this.state.project.id}/delete_project/`
        }).then((res) => {
          if(res.data.Status == 'Project Deleted'){
            alert('Project Deleted')
            window.location = "http://localhost:3000/onlogin"
          }
          else if(res.data.Status == 'User not an Admin or the project Creator'){
            alert('You cannot delete this project')
            this.refreshpage();
          }
          else{
            alert('User not Authenticated or is disabled')
            window.location = 'http://localhost:3000/'
          }
        })
      }
    }

    refreshpage(){
      window.location.reload(false);
    }

    handleData(data) {
      let result = JSON.parse(data);
      console.log(result);
    }

    tagColor(color){
      if(color == 1){
        return('red')
      }
      else if(color == 2){
        return('orange')
      }
      else if(color == 3){
        return('yellow')
      }
      else if(color == 4){
        return('olive')
      }
      else if(color == 5){
        return('green')
      }
      else if(color == 6){
        return('teal')
      }
      else if(color == 7){
        return('blue')
      }
      else if(color == 8){
        return('violet')
      }
      else if(color == 9){
        return('purple')
      }
      else if(color == 10){
        return('pink')
      }
      else if(color == 11){
        return('brown')
      }
      else if(color == 12){
        return('grey')
      }
      else if(color == 13){
        return('black')
      }
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
      let issues_res

      let tag;

      if(this.state.activeItem === 'Open'){
        issues_res = (<Segment color='red'>
        {this.state.project_issues.map(issues =>{
          if(issues.bug_status === 1 || issues.bug_status === 2){
          return(
            <Segment vertical>
            <h3>
              <Icon name='exclamation circle' color='red'/>
              <Header as='a' href={"http://localhost:3000/issues/" + issues.pk}>
              {issues.title}
              <span style={{marginLeft: 5}}/>
              {issues.tags.map(tag =>{
                return(
                  <span>
                    <Label icon={tag.icon} content={tag.tagName} color={this.tagColor(tag.color)} href={'http://localhost:3000/tags/' + tag.id}/>
                </span>)
              })}
              </Header>
              <span/>

            </h3>
            <div style={{marginLeft: 25}}>
                #{issues.pk} opened <Moment fromNow>{issues.created_at}</Moment> by <Popup trigger={<span><b>{issues.reported_by.username}</b></span>}>
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
          <br/><br/>
                  Assigned To: {issues.assigned_to == null ? 'Not assigned till now' :<Popup
                  trigger ={<b>{issues.assigned_to.username}</b>}
                  >
                    <Card>
                      <Card.Content>
                        <Image
                        floated='right'
                        circular
                        >
                           {avatar(issues.assigned_to.display_picture, issues.assigned_to.username)}
                        </Image>
                        <Card.Header as='h4'>{issues.assigned_to.username}</Card.Header>
                        <Card.Meta>Enrollment No: {issues.assigned_to.enrNo}</Card.Meta>
                        <Card.Meta>Email: {issues.assigned_to.email}</Card.Meta>
                        <div style={{color: '#DC143C' }}>{issues.assigned_to.is_disabled ? 'Disabled' : ''}</div>
                        </Card.Content> 
            </Card>
                    </Popup>}
          </div>
            </Segment>
          )}
        })}
    </Segment>)


        issues=(<Segment color='red'>
            {this.state.project_issues.map(issues =>{
              if(issues.bug_status === 1 || issues.bug_status === 2){
              return(
                <Segment vertical>
                <h3>
                  <Icon name='exclamation circle' color='red'/>
                  <Header as='a' href={"http://localhost:3000/issues/" + issues.pk}>
                  {issues.title}
                  <span style={{marginLeft: 5}}/>
                  {issues.tags.map(tag =>{
                    return(
                      <span>
                        <Label icon={tag.icon} content={tag.tagName} color={this.tagColor(tag.color)} href={'http://localhost:3000/tags/' + tag.id}/>
                    </span>)
                  })}
                  </Header>
                  <span/>

                </h3>
                <div style={{marginLeft: 25}}>
                <Grid columns={2}>
                    <Grid.Column>
                    #{issues.pk} opened <Moment fromNow>{issues.created_at}</Moment> by <Popup trigger={<span><b>{issues.reported_by.username}</b></span>}>
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
                    </Grid.Column>
                    <Grid.Column>
                      Assigned To: {issues.assigned_to == null ? 'Not assigned till now' :<Popup
                      trigger ={<b>{issues.assigned_to.username}</b>}
                      >
                        <Card>
                          <Card.Content>
                            <Image
                            floated='right'
                            circular
                            >
                               {avatar(issues.assigned_to.display_picture, issues.assigned_to.username)}
                            </Image>
                            <Card.Header as='h4'>{issues.assigned_to.username}</Card.Header>
                            <Card.Meta>Enrollment No: {issues.assigned_to.enrNo}</Card.Meta>
                            <Card.Meta>Email: {issues.assigned_to.email}</Card.Meta>
                            <div style={{color: '#DC143C' }}>{issues.assigned_to.is_disabled ? 'Disabled' : ''}</div>
                            </Card.Content> 
                </Card>
                        </Popup>}
                    </Grid.Column>
                  </Grid>
              </div>
                </Segment>
              )}
            })}
        </Segment>)
      }

      if(this.state.activeItem === 'Closed'){
        issues_res=(<Segment color='green'>
        {this.state.project_issues.map(issues =>{
          if(issues.bug_status === 3){
          return(
            <Segment vertical >
            <h3>
            <Icon name='check circle' color='green'/>
            <Header as='a' href={"http://localhost:3000/issues/" + issues.pk}>
              {issues.title}
              <span style={{marginLeft: 5}}/>
              {issues.tags.map(tag =>{
                return(
                  <span>
                    <Label icon={tag.icon} content={tag.tagName} color={this.tagColor(tag.color)} href={'http://localhost:3000/tags/' + tag.id}/>
                </span>)
              })}
              </Header>
              <span/>
            </h3>
            <div style={{marginLeft: 25}}>
                #{issues.pk} opened <Moment fromNow>{issues.created_at}</Moment> by <Popup trigger={<span><b>{issues.reported_by.username}</b></span>}>
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
          <br/><br/>
                Assigned To: <Popup trigger={<span><b>{issues.assigned_to ? issues.assigned_to : 'Not assigned till now'}</b></span>}>
                    {issues.assigned_to? <Card>
                      <Card.Content>
                        <Image
                        floated='right'
                        circular
                        >
                           {avatar(issues.assigned_to.display_picture, issues.assigned_to.username)}
                        </Image>
                        <Card.Header as='h4'>{issues.assigned_to.username}</Card.Header>
                        <Card.Meta>Enrollment No: {issues.assigned_to.enrNo}</Card.Meta>
                        <Card.Meta>Email: {issues.assigned_to.email}</Card.Meta>
                        <div style={{color: '#DC143C' }}>{issues.assigned_to.is_disabled ? 'Disabled' : ''}</div>
                        </Card.Content> 
                    </Card> : 'Nothing to see here'}
                    </Popup>
          </div>
            </Segment>
          )}
        })}
    </Segment>)


        issues=(<Segment color='green'>
            {this.state.project_issues.map(issues =>{
              if(issues.bug_status === 3){
              return(
                <Segment vertical >
                <h3>
                <Icon name='check circle' color='green'/>
                <Header as='a' href={"http://localhost:3000/issues/" + issues.pk}>
                  {issues.title}
                  <span style={{marginLeft: 5}}/>
                  {issues.tags.map(tag =>{
                    return(
                      <span>
                        <Label icon={tag.icon} content={tag.tagName} color={this.tagColor(tag.color)} href={'http://localhost:3000/tags/' + tag.id}/>
                    </span>)
                  })}
                  </Header>
                  <span/>
                </h3>
                <div style={{marginLeft: 25}}>
                  <Grid columns={2}>
                    <Grid.Column>
                    #{issues.pk} opened <Moment fromNow>{issues.created_at}</Moment> by <Popup trigger={<span><b>{issues.reported_by.username}</b></span>}>
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
                    </Grid.Column>
                    <Grid.Column>
                    Assigned To: <Popup trigger={<span><b>{issues.assigned_to ? issues.assigned_to : 'Not assigned till now'}</b></span>}>
                        {issues.assigned_to? <Card>
                          <Card.Content>
                            <Image
                            floated='right'
                            circular
                            >
                               {avatar(issues.assigned_to.display_picture, issues.assigned_to.username)}
                            </Image>
                            <Card.Header as='h4'>{issues.assigned_to.username}</Card.Header>
                            <Card.Meta>Enrollment No: {issues.assigned_to.enrNo}</Card.Meta>
                            <Card.Meta>Email: {issues.assigned_to.email}</Card.Meta>
                            <div style={{color: '#DC143C' }}>{issues.assigned_to.is_disabled ? 'Disabled' : ''}</div>
                            </Card.Content> 
                        </Card> : 'Nothing to see here'}
                        </Popup>
                    </Grid.Column>
                  </Grid>
              </div>
                </Segment>
              )}
            })}
        </Segment>)
      }
      return(
            <div>
              <Responsive minWidth={768}>
              <div className="ui fixed inverted menu">
                <div className="ui container">
                <img src={logo} height="60px" width="60px" style={{marginTop: 4}}/>
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
              </Responsive>
              <Responsive maxWidth={768}>
              <Menu fixed inverted>
            <Container>
            <a href="http://localhost:3000/onlogin">
          <img src={logo} height="60px" width="60px" style={{marginTop: 4, marginLeft: 30}}/>
           </a> 
           <h2 className="header item">
            <a href="http://localhost:3000/onlogin">
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
              <Menu.Item as='a' href={"http://localhost:3000/projects"}>
                Browse Projects
              </Menu.Item>
              <Menu.Item as='a' href={"http://localhost:3000/project/add"}>
                Add New Project
              </Menu.Item>
              <Menu.Item as='a' href={"http://localhost:3000/issue/add"}>
                Add New Issue
              </Menu.Item>
            </Sidebar>
            <Sidebar.Pusher>
            <Container>
                <Segment vertical>
                  <div style={{marginTop: 20}}>
                <Header as='h2'>
                  Project: {this.state.project.name}
                </Header>
                </div>
                </Segment>
                <Segment vertical>
                  <Container>
                    <Modal
                trigger={<Button inverted color='red'>
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
                          <h4>
                            Creator: {this.state.project_creator.username}
                          </h4>
                    <Modal 
                          trigger={<Header as='h4' style={{marginTop: -5}}
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
                  <Grid columns={2}>
                    <Grid.Row>
                      <Grid.Column>
                        <h3>
                          Ongoing Issues:
                        </h3>
                      </Grid.Column>
                      <Grid.Column>
                        <Menu widths={2} inverted size='mini'>
                          <Menu.Item
                          name = 'Open' 
                          active = { activeItem === 'Open'}
                          onClick={this.handleItemClick}
                          color = {color[0]}>
                            <h5>Open</h5>
                          </Menu.Item>
                          <Menu.Item
                           name='Closed'
                           active = { activeItem === 'Closed'}
                           onClick={this.handleItemClick}
                           color = {color[1]}>
                             <h5>Closed</h5>
                          </Menu.Item>
                        </Menu>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                  {issues_res}
                </Segment>
              </Container>
              </Sidebar.Pusher>
              </Sidebar.Pushable>
              </Responsive>
              <Responsive minWidth={768}>
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
              </Responsive>
              </div>
            )
    }
}

export default ProjectDetails;