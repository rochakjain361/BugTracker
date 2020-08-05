import React, { Component } from "react";
import axios from "axios";
import { Button, Segment, Label, Header, Popup, Card, Icon, Image, Grid, Responsive, Menu, Container, Sidebar} from "semantic-ui-react";
import logo from '../../mediafiles/LogoSmall.png'
import "./styles.css";
import Moment from 'react-moment';
import Avatar from 'react-avatar';
import { SITE_URL, API_URL } from "../../constants";

class Tags extends Component{
    constructor(props){
        super(props)

        this.state = { 
            tag: [],
            issues: [], 
        }
    }

    componentDidMount(){
        let id = this.props.match.params.id

        axios({
            method: 'get',
            url: `${API_URL}tags/${id}/tag_issues/`,
            params:{
              code: sessionStorage.getItem('access_token') 
            }
        }).then((res) => {
            console.log(res.data)
            if(res.statusText == 'OK'){
                this.setState({
                    ...this.state,
                    issues: res.data.Response,
                })
            }
        })

        axios({
            method: 'get',
            url: `${API_URL}tags/${id}/`
        }).then((res) =>{
            console.log(res.data)
            if(res.statusText == 'OK'){
                this.setState({
                    ...this.state,
                    tag: res.data, 
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
        console.log(this.state)
        return(<div>
          <Responsive minWidth={768}>
          <div className="ui fixed inverted menu">
          <div className="ui container">
          <a href={`${SITE_URL}onlogin`}>
          <img src={logo} height="60px" width="60px" style={{marginTop: 4}}/>
           </a> 
           <h2 className="header item">
            <a href={`${SITE_URL}onlogin`}>
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
            <a href={`${SITE_URL}onlogin`}>
          <img src={logo} height="60px" width="60px" style={{marginTop: 4}}/>
           </a> 
           <h2 className="header item">
            <a href={`${SITE_URL}onlogin`}>
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
            <div className='ui container'>
            <Segment vertical>
                <div style={{marginTop: 20, marginBottom: 50}}>
                    <Header as='h2'>
                        TAG: <span>
                            <Label color={this.tagColor(this.state.tag.color)} content={this.state.tag.tagName} icon={this.state.tag.icon}/>
                        </span>
                        <Segment color={this.tagColor(this.state.tag.color)}>
                            {this.state.issues.map(issue => {
                                return(<Segment vertical key={issue.id}>
                                    <h3>
                                       {issue.bug_status == 3 ? <Icon name='check circle' color='green' /> : <Icon name='exclamation circle' color='red' />}
                                       <Header as='a' href={`${SITE_URL}issues/` + issue.pk}>
                                         {issue.title}
                                         <span style={{marginLeft:20}}/>
                                         {issue.tags.map(tag =>{
                                           return(
                                             <span>
                                               <Label icon={tag.icon} content={tag.tagName} color={this.tagColor(tag.color)} href={`${SITE_URL}tags/${tag.id}`}/>
                                           </span>)
                                         })}
                                         </Header>
                                       </h3>
                                         <div style={{marginLeft: 20}}>
                                           This Issue is assigned to: {issue.assigned_to == null ? 'No one till now ': <Popup
                                           trigger={<b>{issue.assigned_to.username}</b>}>
                                             <Card>
                                                 <Card.Content>
                                                   <Image
                                                   floated='right'
                                                   circular
                                                   >
                                                      {avatar(issue.assigned_to.display_picture, issue.assigned_to.username)}
                                                   </Image>
                                                   <Card.Header as='h4'>{issue.assigned_to.username}</Card.Header>
                                                   <Card.Meta>Enrollment No: {issue.assigned_to.enrNo}</Card.Meta>
                                                   <Card.Meta>Email: {issue.assigned_to.email}</Card.Meta>
                                                   <div style={{color: '#DC143C' }}>{issue.assigned_to.is_disabled ? 'Disabled' : ''}</div>
                                                   </Card.Content> 
                                               </Card>
                                           </Popup> }
                                           <br/>
                                           This Issue is reported by: <Popup
                    trigger={<b>{issue.reported_by.username}</b>}>
                      <Card>
                          <Card.Content>
                            <Image
                            floated='right'
                            circular
                            >
                               {avatar(issue.reported_by.display_picture, issue.reported_by.username)}
                            </Image>
                            <Card.Header as='h4'>{issue.reported_by.username}</Card.Header>
                            <Card.Meta>Enrollment No: {issue.reported_by.enrNo}</Card.Meta>
                            <Card.Meta>Email: {issue.reported_by.email}</Card.Meta>
                            <div style={{color: '#DC143C' }}>{issue.reported_by.is_disabled ? 'Disabled' : ''}</div>
                            </Card.Content> 
                        </Card>
                    </Popup>
                                           <br/>
                                             The Issue was found in {<Popup
                                           trigger={<b><a href={`${SITE_URL}projects/` + issue.project.id}>{issue.project.name}</a></b>}
                                           >
                                             <Card>
                                               <Card.Content>
                                               <Card.Header as='h3'>
                                                 {issue.project.name}
                                               </Card.Header>
                                           <Card.Meta>{this.statusLabel(issue.project.status)} {this.statusText(issue.project.status)}</Card.Meta>
                                           <Card.Meta>{issue.project.creator.username} created this project <Moment fromNow>{issue.project.created_at}</Moment></Card.Meta>
                                               </Card.Content>
                                             </Card>
                                           </Popup>} <Moment fromNow>{issue.created_at}</Moment>
                                           <br/>
                                         </div>
                                   </Segment>)
                            })}
                        </Segment>
                    </Header>
                </div>
            </Segment>
        </div>
              </Sidebar.Pusher>
              </Sidebar.Pushable>
          </Responsive>
          <Responsive minWidth={768}>
          <div className='ui container'>
            <Segment vertical>
                <div className='bodyContent'>
                    <Header as='h2'>
                        TAG: <span>
                            <Label color={this.tagColor(this.state.tag.color)} content={this.state.tag.tagName} icon={this.state.tag.icon}/>
                        </span>
                        <Segment color={this.tagColor(this.state.tag.color)}>
                            {this.state.issues.map(issue => {
                                return(<Segment vertical key={issue.id}>
                                    <h3>
                                       {issue.bug_status == 3 ? <Icon name='check circle' color='green' /> : <Icon name='exclamation circle' color='red' />}
                                       <Header as='a' href={`${SITE_URL}issues/` + issue.pk}>
                                         {issue.title}
                                         <span style={{marginLeft:20}}/>
                                         {issue.tags.map(tag =>{
                                           return(
                                             <span>
                                               <Label icon={tag.icon} content={tag.tagName} color={this.tagColor(tag.color)} href={`${SITE_URL}tags/${tag.id}`}/>
                                           </span>)
                                         })}
                                         </Header>
                                       </h3>
                                         <div style={{marginLeft: 20}}>
                                             <Grid columns={2}>
                                                 <Grid.Row>
                                                     <Grid.Column>
                                                     This Issue is assigned to: {issue.assigned_to == null ? 'No one till now ': <Popup
                                           trigger={<b>{issue.assigned_to.username}</b>}>
                                             <Card>
                                                 <Card.Content>
                                                   <Image
                                                   floated='right'
                                                   circular
                                                   >
                                                      {avatar(issue.assigned_to.display_picture, issue.assigned_to.username)}
                                                   </Image>
                                                   <Card.Header as='h4'>{issue.assigned_to.username}</Card.Header>
                                                   <Card.Meta>Enrollment No: {issue.assigned_to.enrNo}</Card.Meta>
                                                   <Card.Meta>Email: {issue.assigned_to.email}</Card.Meta>
                                                   <div style={{color: '#DC143C' }}>{issue.assigned_to.is_disabled ? 'Disabled' : ''}</div>
                                                   </Card.Content> 
                                               </Card>
                                           </Popup> }
                                                     </Grid.Column>
                                                     <Grid.Column>
                                                     This Issue is reported by: <Popup
                    trigger={<b>{issue.reported_by.username}</b>}>
                      <Card>
                          <Card.Content>
                            <Image
                            floated='right'
                            circular
                            >
                               {avatar(issue.reported_by.display_picture, issue.reported_by.username)}
                            </Image>
                            <Card.Header as='h4'>{issue.reported_by.username}</Card.Header>
                            <Card.Meta>Enrollment No: {issue.reported_by.enrNo}</Card.Meta>
                            <Card.Meta>Email: {issue.reported_by.email}</Card.Meta>
                            <div style={{color: '#DC143C' }}>{issue.reported_by.is_disabled ? 'Disabled' : ''}</div>
                            </Card.Content> 
                        </Card>
                    </Popup>
                                                     </Grid.Column>
                                                 </Grid.Row>
                                             </Grid>
                                           The Issue was found in {<Popup
                                           trigger={<b><a href={`${SITE_URL}projects/` + issue.project.id}>{issue.project.name}</a></b>}
                                           >
                                             <Card>
                                               <Card.Content>
                                               <Card.Header as='h3'>
                                                 {issue.project.name}
                                               </Card.Header>
                                           <Card.Meta>{this.statusLabel(issue.project.status)} {this.statusText(issue.project.status)}</Card.Meta>
                                           <Card.Meta>{issue.project.creator.username} created this project <Moment fromNow>{issue.project.created_at}</Moment></Card.Meta>
                                               </Card.Content>
                                             </Card>
                                           </Popup>} <Moment fromNow>{issue.created_at}</Moment>
                                         </div>
                                   </Segment>)
                            })}
                        </Segment>
                    </Header>
                </div>
            </Segment>
        </div>
          </Responsive>
        </div>)
    }
}
export default Tags