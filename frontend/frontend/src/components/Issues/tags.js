import React, { Component } from "react";
import axios from "axios";
import { Button, Segment, Label, Header, Popup, Card, Icon, Image, Grid} from "semantic-ui-react";
import logo from '../../mediafiles/LogoSmall.png'
import "./styles.css";
import Moment from 'react-moment';
import Avatar from 'react-avatar';

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
            url: `http://127.0.0.1:8000/tags/${id}/tag_issues/`
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
            url: `http://127.0.0.1:8000/tags/${id}/`
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
                                       <Header as='a' href={"http://localhost:3000/issues/" + issue.pk}>
                                         {issue.title}
                                         <span style={{marginLeft:20}}/>
                                         {issue.tags.map(tag =>{
                                           return(
                                             <span>
                                               <Label icon={tag.icon} content={tag.tagName} color={this.tagColor(tag.color)} href={`http://localhost:3000/tags/${tag.id}`}/>
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
                                           trigger={<b><a href={'http://localhost:3000/projects/' + issue.project.id}>{issue.project.name}</a></b>}
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
        </div>)
    }
}
export default Tags