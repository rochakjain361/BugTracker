import React, { Component } from 'react'
import Avatar from 'react-avatar';
import axios from 'axios'
import logo from '../../mediafiles/LogoSmall.png'
import './styles.css'
import { Menu, Segment, Header, Icon, Grid, Image, Dimmer, Label, Button, Popup, Card, CardContent, Modal, Form, Dropdown, Input, Message, Responsive, Container, Sidebar} from 'semantic-ui-react'
import 'moment-timezone';
import Moment from 'react-moment';
import { SITE_URL, API_URL } from '../../constants';
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
       color: '',
       icon: '',
       tagName: '',
       tagsMade: [],
       sidebar_Toggle: true,
       right_menu_visible: false,
    };
    this.handleItemClick = this.handleItemClick.bind(this);
    this.tagFormSubmit = this.tagFormSubmit.bind(this);
  }

  handleItemClick = (e, { name }) => {
    e.preventDefault()
    this.setState({ activeItem : name})
  }

  componentDidMount() {
    axios({
      method:'get',
      url: `${API_URL}appusers/my_page/`,
      withCredentials: true,
    }).then((response) => {
      console.log(response)
      if(response.statusText === "OK"){
        if(response.data.Status == 'User is disabled' || response.data.Status == 'User not Authenticated'){
          alert('You are either not authenticated or disabled by the Admins. Retry Logging in again if not prossible then contact the admins.')
          window.location = SITE_URL
        }
        else{this.setState({
          got_response: true,
          assigned_issues: response.data["assigned_issues"],
          projects: response.data["projects"],
          reported_issues: response.data["reported_issues"],
          user_data: response.data["user_data"], 
        })}
      }
    })
    console.log(this.props.access_token)

    axios({
      method: 'get',
      url: `${API_URL}tags/`,
      withCredentials: true    
    }).then((res) => {
      console.log(res.data)
      this.setState({
        tagsMade: res.data,
      })
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

  UserPage(userRole){
    const colors =[
      {
        key: 1,
        text: 'red',
        value: 1,
      },
      {
        key: 2,
        text: 'orange',
        value: 2,
      },
      {
        key: 3,
        text: 'yellow',
        value: 3,
      },
      {
        key: 4,
        text: 'olive',
        value: 4,
      },
      {
        key: 5,
        text: 'green',
        value: 5,
      },
      {
        key: 6,
        text: 'teal',
        value: 6,
      },
      {
        key: 7,
        text: 'blue',
        value: 7,
      },
      {
        key: 8,
        text: 'violet',
        value: 8,
      },
      {
        key: 9,
        text: 'purple',
        value: 9,
      },
      {
        key: 10,
        text: 'pink',
        value: 10,
      },
      {
        key: 11,
        text: 'brown',
        value: 11,
      },
      {
        key: 12,
        text: 'grey',
        value: 12,
      },
      {
        key: 13,
        text: 'black',
        value: 13,
      },
    ]

    var icons =[
      {
        key: 1,
        icon: 'bug',
        text: 'bug',
        value: 'bug',
      },
      {
        key: 2,
        icon:  'chart line',
        text: 'chart line',
        value: 'chart line',
      },
      {
        key: 3,
        icon: 'question circle',
        text: 'question circle',
        value: 'question circle',
      },
      {
        key: 4,
        icon: 'arrow circle right',
        text: 'arrow circle right',
        value: 'arrow circle right',
      },
      {
        key: 5,
        icon: 'cloud download',
        text: 'cloud download',
        value: 'cloud download'
      },
      {
        key: 6,
        icon: 'sort alphabet down',
        text: 'sort alphabet down',
        value: 'sort alphabet down'
      },
      {
        key: 7,
        icon: 'sort amount up',
        text: 'sort amount up',
        value: 'sort amount up'
      },
      {
        key: 8,
        icon: 'sync alternate',
        text: 'sync alternate',
        value: 'sync alternate'
      },
      {
        key: 9,
        icon: 'expand',
        text: 'expand',
        value: 'expand'
      },
      {
        key: 10,
        icon: 'book',
        text: 'book',
        value: 'book'
      },
      {
        key: 11,
        icon: 'sitemap',
        text: 'sitemap',
        value: 'sitemap'
      },
      {
        key: 12,
        icon: 'address card outline',
        text: 'address card outline',
        value: 'address card outline'
      },
      {
        key: 13,
        icon: 'tag',
        text: 'tag',
        value: 'tag'
      },
      {
        key: 14,
        icon: 'tags',
        text: 'tags',
        value: 'tags'
      },
      {
        key: 15,
        icon: 'bookmark outline',
        text: 'bookmark outline',
        value: 'bookmark outline'
      },
      {
        key: 16,
        icon: 'code',
        text: 'code',
        value: 'code'
      },
      {
        key: 17,
        icon: 'file code',
        text: 'file code',
        value: 'file code'
      },
      {
        key: 18,
        icon: 'file text',
        text: 'file text',
        value: 'file text'
      },
      {
        key: 19,
        icon: 'shield alternate',
        text: 'shield alternate',
        value: 'shield alternate'
      },
      {
        key: 20,
        icon: 'at',
        text: 'at',
        value: 'at'
      },
      {
        key: 21,
        icon: 'comment',
        text: 'comment',
        value: 'comment'
      },
      {
        key: 22,
        icon: 'comment outline',
        text: 'comment outline',
        value: 'comment outline'
      },
      {
        key: 23,
        icon: 'comments',
        text: 'comments',
        value: 'comments'
      },
      {
        key: 24,
        icon: 'mobile alternate',
        text: 'mobile alternate',
        value: 'mobile alternate'
      },
      {
        key: 25,
        icon: 'server',
        text: 'server',
        value: 'server'
      },
      {
        key: 26,
        icon: 'bell outline',
        text: 'bell outline',
        value: 'bell outline'
      },
      {
        key: 27,
        icon: 'calendar check',
        text: 'calendar check',
        value: 'calendar check'
      },
      {
        key: 28,
        icon: 'calendar minus',
        text: 'calendar minus',
        value: 'calendar minus'
      },
      {
        key: 29,
        icon: 'edit',
        text: 'edit',
        value: 'edit'
      },
      {
        key: 30,
        icon: 'eye slash',
        text: 'eye slash',
        value: 'eye slash'
      },
      {
        key: 31,
        icon: 'align left',
        text: 'align left',
        value: 'align left'
      },
      {
        key: 32,
        icon: 'bold',
        text: 'bold',
        value: 'bold'
      },
      {
        key: 33,
        icon: 'clone',
        text: 'clone',
        value: 'clone'
      },
      {
        key: 34,
        icon: 'i cursor',
        text: 'i cursor',
        value: 'i cursor'
      },
      {
        key: 35,
        icon: 'linkify',
        text: 'linkify',
        value: 'linkify'
      },
      {
        key: 36,
        icon: 'indent',
        text: 'indent',
        value: 'indent'
      },
      {
        key: 37,
        icon: 'paragraph',
        text: 'paragraph',
        value: 'paragraph'
      },
      {
        key: 38,
        icon: 'quote right',
        text: 'quote right',
        value: 'quote right'
      },
      {
        key: 39,
        icon: 'file image',
        text: 'file image',
        value: 'file image'
      },
      {
        key: 40,
        icon: 'folder outline',
        text: 'folder outline',
        value: 'folder outline'
      },
      {
        key: 41,
        icon: 'sticky note outline',
        text: 'sticky note outline',
        value: 'sticky note outline'
      },
      {
        key: 42,
        icon: 'handshake outline',
        text: 'handshake outline',
        value: 'handshake outline'
      },
      {
        key: 43,
        icon: 'adjust',
        text: 'adjust',
        value: 'adjust'
      },
      {
        key: 44,
        icon: 'compress',
        text: 'compress',
        value: 'compress'
      },
      {
        key: 45,
        icon: 'image',
        text: 'image',
        value: 'image'
      },
      {
        key: 46,
        icon: 'info circle',
        text: 'info circle',
        value: 'info circle'
      },
      {
        key: 47,
        icon: 'lock open',
        text: 'lock open',
        value: 'lock open'
      },
      {
        key: 48,
        icon: 'paper plane',
        text: 'paper plane',
        value: 'paper plane'
      },
      {
        key: 49,
        icon: 'exclamation circle',
        text: 'exclamation circle',
        value: 'exclamation circle'
      },
      {
        key: 50,
        icon: 'exclamation',
        text: 'exclamation',
        value: 'exclamation'
      },
      {
        key: 51,
        icon: 'minus circle',
        text: 'minus circle',
        value: 'minus circle'
      },
      {
        key: 52,
        icon: 'paperclip',
        text: 'paperclip',
        value: 'paperclip'
      },
      {
        key: 53,
        icon: 'android',
        text: 'android',
        value: 'android'
      },
      {
        key: 54,
        icon: 'css3',
        text: 'css3',
        value: 'css3'
      },
      {
        key: 55,
        icon: 'js square',
        text: 'js square',
        value: 'js square'
      },
      {
        key: 56,
        icon: 'python',
        text: 'python',
        value: 'python'
      },
      {
        key: 57,
        icon: 'react',
        text: 'react',
        value: 'react'
      },
      {
        key: 58,
        icon: 'hashtag',
        text: 'hashtag',
        value: 'hashtag'
      },
    ]


    if(userRole == 1){
      return(<div>
        <Button size='mini' disabled>
          Users Page
        </Button>
        <Button size='mini' disabled icon='plus'>
          Add Issue Tags
        </Button>
      </div>
      )
    }

    else if(userRole == 2){
      return(
        <div>
        <Button size='mini' href={`${SITE_URL}admin/users`}>
          Users Page
        </Button>
        <Modal 
        trigger={<Button size='mini'>
        <Icon name='plus'/>
        Add Tags
      </Button>}
        basic small>
          <Header icon='tags' content='Add more tags in database'/>
          Tags Available: {this.state.tagsMade.map(tag => {
              return(<Label icon={tag.icon} content={tag.tagName} color={this.tagColor(tag.color)} style={{marginBottom: 5}}/>)
            })}
          <Modal.Content>
            <Form onSubmit={this.tagFormSubmit}>
              <Grid columns={2} divided>
                <Grid.Row>
                  <Grid.Column>
                  <h4>Select the Color for the Tag</h4>
              <Dropdown
              placeholder='Select the Color for the Tag'
              search
              selection
              options={colors}
              onChange={(event, data) => {
                this.setState({
                  ...this.state,
                  color: data.value
                })
                console.log('This is working')
              }}
              />
                  </Grid.Column>
                  <Grid.Column>
                  <h4>Select the Icon for the Tag</h4>
              <Dropdown
              placeholder='Select the Icon for the Tag'
              search
              selection
              options={icons}
              onChange={(event, data) =>{
                this.setState({
                  ...this.state,
                  icon : data.value
                })
              }}
              />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <br/>
              <Form.Field>
                <h4>Type the Tag Name Here</h4>
                <Input
                fluid
                placeholder='Tag Name'
                onChange={(event, data) =>{
                  var sorted = this.state.tagsMade.map(tag => {
                    return tag.tagName.toLowerCase()
                  })
                    if(sorted.includes(data.value.toLowerCase())){
                      document.getElementById("Error").innerHTML = "This Tag Name is already being taken"
                      this.setState({
                        ...this.setState({
                          ...this.state,
                          tagName: ""
                        })
                      })
                    }
                    else{
                      document.getElementById("Error").innerHTML = ""
                      this.setState({
                        ...this.setState({
                          ...this.state,
                          tagName: data.value
                        })
                      })
                    }    
                }}
                />
                <br/>
                <div id='Error'></div>
                <Button  type='submit' color='green' inverted floated='right'>
                  <Icon name='checkmark'/> Submit
                </Button>
              </Form.Field>
            </Form>
          </Modal.Content>
        </Modal>
        </div>
      )
    }
  }

  tagFormSubmit(){
    if(this.state.color !== "" && this.state.icon !== "" && this.state.tagName !== "" && this.state.user_data.user_role === 2){
      axios({
        method: 'get',
        url : `${API_URL}tags/new_tag/`,
        params: {
          tagName : this.state.tagName,
          icon: this.state.icon,
          color : this.state.color
        }
      }).then(res => {
        if(res.data.Response == 'New Tag Created'){
          alert(res.data.Response)
          window.location.reload(false);
        }
        else if(res.data.Response == 'User not Admin'){
          alert(res.data.Response)
          window.location.reload(false);
        }
        else{
          alert(res.data.Response)
          window.location = SITE_URL
        }
      })
    }
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
    const { activeItem } = this.state

    const colors =[
      {
        key: 1,
        text: 'red',
        value: 1,
      },
      {
        key: 2,
        text: 'orange',
        value: 2,
      },
      {
        key: 3,
        text: 'yellow',
        value: 3,
      },
      {
        key: 4,
        text: 'olive',
        value: 4,
      },
      {
        key: 5,
        text: 'green',
        value: 5,
      },
      {
        key: 6,
        text: 'teal',
        value: 6,
      },
      {
        key: 7,
        text: 'blue',
        value: 7,
      },
      {
        key: 8,
        text: 'violet',
        value: 8,
      },
      {
        key: 9,
        text: 'purple',
        value: 9,
      },
      {
        key: 10,
        text: 'pink',
        value: 10,
      },
      {
        key: 11,
        text: 'brown',
        value: 11,
      },
      {
        key: 12,
        text: 'grey',
        value: 12,
      },
      {
        key: 13,
        text: 'black',
        value: 13,
      },
    ]

    let issues;
    sessionStorage.setItem('pk', this.state.user_data.pk);
    sessionStorage.setItem('access_token', this.state.user_data.access_token)
    if(this.state.activeItem === 'reportedIssues'){
      var rptd_issues = Array(this.state.reported_issues)[0]
      issues=(<div>
        <Segment color='violet'>
        {rptd_issues.map(issues =>{
          return(  
            <Segment vertical key={issues.id}>
             <h3>
                {issues.bug_status == 3 ? <Icon name='check circle' color='green' /> : <Icon name='exclamation circle' color='red' />}
                <Header as='a' href={`${SITE_URL}issues/` + issues.pk}>
                  {issues.title}
                  <span style={{marginLeft:10}}/>
                  {issues.tags.map(tag =>{
                    return(
                      <span>
                        <Label icon={tag.icon} content={tag.tagName} color={this.tagColor(tag.color)} href={`${SITE_URL}tags/${tag.id}`}/>
                    </span>)
                  })}
                  </Header>
                </h3>
                  <div style={{marginLeft: 20}}>
                    This Issue is assigned to: {issues.assigned_to == null ? 'No one till now ': <Popup
                    trigger={<b>{issues.assigned_to.username}</b>}>
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
                    </Popup> }<br/>
                    The Issue was found in {<Popup
                    trigger={<b><a href={`${SITE_URL}projects/` + issues.project.id}>{issues.project.name}</a></b>}
                    >
                      <Card>
                        <Card.Content>
                        <Card.Header as='h3'>
                          {issues.project.name}
                        </Card.Header>
                    <Card.Meta>{this.statusLabel(issues.project.status)} {this.statusText(issues.project.status)}</Card.Meta>
                    <Card.Meta>{issues.project.creator.username} created this project <Moment fromNow>{issues.project.created_at}</Moment></Card.Meta>
                        </Card.Content>
                      </Card>
                      </Popup>}
                  </div>
            </Segment>
          )})}
        </Segment>
        </div>)
    }

    else if(this.state.activeItem === 'assignedIssues'){
      var asgnd_issues = Array(this.state.assigned_issues)[0]
      console.log(asgnd_issues)
      issues=(<div>
        <Segment color='violet'>
        {asgnd_issues.map(issues =>{
          return(  
            <Segment vertical key={issues.id}>
             <h3>
                {issues.bug_status == 3 ? <Icon name='check circle' color='green' /> : <Icon name='exclamation circle' color='red' />}
                <Header as='a' href={`${SITE_URL}issues/` + issues.pk}>
                  {issues.title}
                  <span style={{marginLeft:10}}/>
                  {issues.tags.map(tag =>{
                    return(
                      <span>
                        <Label icon={tag.icon} content={tag.tagName} color={this.tagColor(tag.color)} href={`${SITE_URL}tags/${tag.id}`}/>
                    </span>)
                  })}
                  </Header>
                </h3>
                  <div style={{marginLeft: 20}}>
                    This Issue is reported by: <Popup
                    trigger={<b>{issues.reported_by.username}</b>}>
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
                    </Popup> <br/>
                    The Issue was found in {<Popup
                    trigger={<b><a href={`${SITE_URL}projects/` + issues.project.id}>{issues.project.name}</a></b>}
                    >
                      <Card>
                        <Card.Content>
                        <Card.Header as='h3'>
                          {issues.project.name}
                        </Card.Header>
                    <Card.Meta>{this.statusLabel(issues.project.status)} {this.statusText(issues.project.status)}</Card.Meta>
                    <Card.Meta>{issues.project.creator.username} created this project <Moment fromNow>{issues.project.created_at}</Moment></Card.Meta>
                        </Card.Content>
                      </Card>
                      </Popup>}
                  </div>
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

    return(
      <div >
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
              <Button primary href={`${SITE_URL}projects`}>
                  Browse Projects
                </Button>
              </div>
              <div className="item">
              <Button primary href={`${SITE_URL}issue/add`}>
                Add New Issue
                </Button>
              </div>
              <div className="item">
              <Button primary href={`${SITE_URL}project/add`}>
                Add New Project
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
               <Menu.Item as='a' href={`${SITE_URL}projects`}>
                Browse Projects
              </Menu.Item>
              <Menu.Item as='a' href={`${SITE_URL}issue/add`}>
                Add New Issue
              </Menu.Item>
              <Menu.Item as='a' href={`${SITE_URL}project/add`}>
                Add New Project
              </Menu.Item>
            </Sidebar>
            <Sidebar.Pusher>
            <div className="ui container">
          <div className="ui two column stackable grid">
            <div className="column">
            <div className="userinfo">
            <Responsive as={Header} maxWidth={768}>
                  <h2 style={{marginTop: -90}}>MI PÁGINA</h2>
                </Responsive>
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
            </div>
            <div className="column">
              <div className='page-heading'>
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
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </Responsive>
        <Responsive minWidth={768}>
        <div className="ui container">
          <div className="ui two column stackable grid">
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
            </div>
            <div className="column">
              <div className='page-heading'>
                <Responsive as={Header} minWidth={768}>
                  <h2>MI PÁGINA</h2>
                </Responsive>
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
        </Responsive>
      </div>
    )
  }
}
export default MyPage;
