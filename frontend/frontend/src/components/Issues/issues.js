import React, { Component } from "react";
import WebSocketInstance from '../../WebSocket'
import logo from '../../mediafiles/LogoSmall.png'
import { Redirect } from 'react-router-dom';
import { Segment, Header, Button, Label, Card, Popup, Modal, Dropdown, Form, Icon, Input, Responsive, Sidebar, Menu, Container, Feed, FeedContent} from "semantic-ui-react";
import axios from 'axios';
import 'moment-timezone';
import Moment from 'react-moment';
import "./styles.css";
import { Editor } from "@tinymce/tinymce-react";
import { SITE_URL, API_URL } from "../../constants";

class IssueComments extends Component{
    constructor(props){
        super(props)

        this.state = {
            comment : '',
            comments : [],
            issue : [],
            images: [],
            project_members: [],
            assignee: '',
            tags: [],
            delete_issue_name: '',
        } 

        this.waitForSocketConnection(() => {
            WebSocketInstance.initCommentUser(sessionStorage.getItem('access_token'));
            WebSocketInstance.addCallbacks(this.setComments.bind(this), this.addComment.bind(this));
            WebSocketInstance.fetchComments()
        })

        this.AssignIssueSubmit = this.AssignIssueSubmit.bind(this)
        this.closeIssue = this.closeIssue.bind(this)
        this.deleteIssueSubmit = this.deleteIssueSubmit.bind(this)
    }
    
    componentDidMount(){
        let id = this.props.match.params.id
        //console.log(id)
        WebSocketInstance.connect(id) 
        axios({
            method:'get',
            url: `${API_URL}issues/${id}/`
        }).then((response) => {
            //console.log(response)
            if(response.statusText == 'OK'){
                this.setState({
                    ...this.state,
                    issue: response.data,
                    project_members: response.data.project.members,
                    tags: response.data.tags
                })
            }
        })

        axios({
            method:'get',
            url: `${API_URL}issue_images/get_image_url/?issue=${id}`,
        }).then((response) => {
            //console.log(response.data.data)
            if(response.statusText == 'OK'){
                for(var i = 0; i < response.data.data.length; i++){
                    this.setState({
                        ...this.state,
                        images: [ ...this.state.images, response.data.data[i].image]   
                    })
                }
            }
        })
        
    }

    waitForSocketConnection(callback) {
        const component = this;
        setTimeout(
            function(){
                if(WebSocketInstance.state() === 1){
                    //console.log('Connection is made');
                    callback();
                    return;
                }
                else{
                    //console.log("Waiting for connection..");
                    component.waitForSocketConnection(callback);
                }
            }, 100);
    }

    addComment(comment) {
        this.setState({
            comments : [...this.state.comments, comment]
        })
    }

    setComments(comments){
        this.setState({
            comments : comments.reverse()
        });
        //console.log('Set Comments')
    }

    commentChangeHandler = (event) => {
        this.setState({
            comment : event
        });
    }

    sendCommentHandler = (e, comment) => {
        const messageObject = {
            from : sessionStorage.getItem('access_token'),
            text : comment
        }
        WebSocketInstance.newComment(messageObject, this.props.match.params.id)
        e.preventDefault();
    }
    
    AssignIssueSubmit(){
        console.log(this.state.assignee)

        let id = this.props.match.params.id

        axios({
            method: 'get',
            url: `${API_URL}issues/${id}/assign/?memberId=${this.state.assignee}`
        }).then((res) =>{
            if(res.data.Response == 'User Assigned'){
                alert('User Assigned to this Issue')
                this.refreshpage();
            }  
            else if(res.data.Response == 'User not a team Member' || res.data.Response == 'User not an Admin or the project creator'){
                alert('You can`t assign this issue to anyone')
                this.refreshpage();
            }
            else{
                alert('User not authenticated or is disabled.')
                window.location = SITE_URL 
            }
        })
    }

    closeIssue(){

        let id = this.props.match.params.id

        axios({
            method: 'get',
            url: `${API_URL}issues/${id}/close_issue/`
        }).then((res) => {
            if(res.data.Response == 'Issue Closed'){
                alert('Issue Closed')
                this.refreshpage();
            }
            else if(res.data.Response == 'User cannot close this issue'){
                alert('You cannot close this issue')
                this.refreshpage();
            }
            else{
                alert('User not authenticated or is disabled.')
                window.location = SITE_URL 
            }
        })
    }

    deleteIssueSubmit(){

        let id = this.props.match.params.id

        console.log(this.state.delete_issue_name == this.state.issue.title)
        if(this.state.delete_issue_name == this.state.issue.title){
            axios({
                method: 'get',
                url: `${API_URL}issues/${id}/delete_issue/`
            }).then((res) => {
                if(res.data.Response == 'Issue Deleted'){
                    alert('Issue Deleted')
                    window.location = `${SITE_URL}onlogin`
                }
                else if(res.data.Response == 'User cannot delete this issue'){
                    alert('You cannot delete this issue')
                    this.refreshpage();
                }
                else{
                    alert('User not authenticated or is disabled.')
                    window.location = SITE_URL 
                }
            })
        }
    }

    refreshpage(){
        window.location.reload(false);
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
        var project_name;
        if(Array(this.state.issue.project)[0] != null){
            project_name = Array(this.state.issue.project)[0].name 
        }
        var rep_user_name;
        if(Array(this.state.issue.reported_by)[0] != null){
            rep_user_name = Array(this.state.issue.reported_by)[0].username
        }
        var asgn_user_name;
        if(Array(this.state.issue.assigned_to)[0] != null){
            asgn_user_name = Array(this.state.issue.assigned_to)[0].username
        }
        var bug_status;
        if(this.state.issue.bug_status == 1){
            bug_status = (
                <Button
                color='red'
                content='Bug Status'
                size='mini'
                style={{marginLeft: 12}}
                label={{ basic: true, color: 'red', pointing: 'left', content: 'Pending' }}
              />
            )
        }
        else if(this.state.issue.bug_status == 2){
            bug_status = (
                <Button
                color='orange'
                content='Bug Status'
                size='mini'
                style={{marginLeft: 12}}
                label={{ basic: true, color: 'orange', pointing: 'left', content: 'To be discussed' }}
              />
            )
        }
        else if(this.state.issue.bug_status == 3){
            bug_status = (
                <Button
                color='green'
                content='Bug Status'
                size='mini'
                style={{marginLeft: 12}}
                label={{ basic: true, color: 'green', pointing: 'left', content: 'Resolved' }}
              />
            )
        }
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
              <Menu.Item as='a' href={`${SITE_URL}project/add`}>
                Add New Project
              </Menu.Item>
              <Menu.Item as='a' href={`${SITE_URL}issue/add`}>
                Add New Issue
              </Menu.Item>
            </Sidebar>
            <Sidebar.Pusher>
            <div className="ui container">
            <Segment vertical>
            <div style={{marginTop: 20}}>
                <Segment vertical> 
                <Header as="h3">Project: {project_name} </Header>
                </Segment>
                <Header as="h2" style={{marginTop: 15}}>Issue: {this.state.issue.title}
                <Modal
                trigger={<Button floated='right' inverted color='red' size='tiny'>
                    <Icon name='delete'/> Delete Issue
                </Button>}
                basic small>
                    <Header icon='browser' content='Do you really want to this Issue?'/>
                    <Modal.Content>
                    <h4>
                    Once you delete this issue, there's no going back. Please be certain.
                    This action <i><u>cannot</u></i> be undone.This will permanently delete the <i><u>{this.state.issue.title}</u></i> issue,
                    comments and media related with it. Please type <i><u>{this.state.issue.title}</u></i> to confirm.
                    </h4>
                    </Modal.Content>
                    <br/>
                    <Form onSubmit={this.deleteIssueSubmit}>
                    <Input
                    fluid
                    placeholder='Issue Name'
                    onChange={(event, data) =>{
                        this.setState({
                            ...this.state,
                            delete_issue_name: data.value
                        })
                    }}/>
                    <br/><br/>
                        <Button type='submit' color='red' inverted floated='right'>
                            <Icon name='checkmark'/> Submit and Delete the Issue
                        </Button>
                    </Form>
                </Modal>
                </Header>
                <Header as="h2" style={{marginTop: 0}}>
                {this.state.issue.bug_status == 3 ? bug_status : <Modal
                trigger={<span>
                    <Popup
                    trigger={bug_status}
                    inverted>
                        Close this Issue
                    </Popup>
                </span>}
                basic
                size='small'>
                    <Header icon='browser' content='Closing the Issue'/>
                    <Modal.Content>
                        Are you sure you want to close this Issue? 
                        <br/><br/>
                        <Button color='green' inverted floated='right' onClick={this.closeIssue} size='tiny'>
                            <Icon name='checkmark'/> Close the Issue
                        </Button>
                    </Modal.Content>
                </Modal>}
                {this.state.tags.map(tag => {
                    return(
                        <span style={{margin: 5}}>
                        <Label icon={tag.icon} content={tag.tagName} color={this.tagColor(tag.color)} href={`${SITE_URL}tags/${tag.id}`} size='mini'/>
                    </span>
                    )
                })}

                </Header>
                <Segment vertical>
                <Header as='h4'>
                {rep_user_name} opened this issue <Moment fromNow>{this.state.issue.created_at}</Moment> 
                </Header>
                <Header as='h4'>
                Assigned To: {(asgn_user_name == null) ?
                <Modal
                trigger={
                    <span>
                        <Popup
                        trigger={<span>Assigned to No One</span>}
                        inverted>
                            Assign this Issue to a Team Member
                        </Popup>
                    </span>
                }
                basic
                size='small'
                >
                    <Header icon='browser' content='Assigning the Issue to a Team Member'/>
                    <Modal.Content>
                        Assign this Issue to a team Member of the project by selecting one of them from the list below:

                        <br/><br/>
                        <Form onSubmit={this.AssignIssueSubmit}>
                            <Dropdown
                            placeholder='Select the assignee of the issue'
                            selection
                            search
                            options={this.state.project_members.map(user => {
                                return{
                                    "key": user.pk,
                                    "text": user.username,
                                    "value": user.pk  
                                }
                            })}
                            onChange={(event, data) => {
                                console.log(data.value)
                                this.setState({
                                    ...this.state,
                                    assignee: data.value 
                                })
                                console.log(this.state.assignee)
                            }}
                            />
                             <Button  type='submit' color='green' inverted floated='right'>
                                  <Icon name='checkmark'/> Submit
                                </Button>
                        </Form>
                    </Modal.Content>
                </Modal>
                 : asgn_user_name}
                </Header>
                </Segment>
                </div>
                <div>
                </div>
            </Segment>
            <div style={{marginTop: 0, marginBottom: 20}}>
            <Feed size='large'>
                <Segment vertical>
                <Feed.Event>
                        <Feed.Content>
                            <Feed.Summary>
                            <b><u>{rep_user_name}</u></b> commented on this issue
                            <Feed.Date><Moment fromNow>{this.state.issue.created_at}</Moment></Feed.Date>
                            </Feed.Summary>
                            <Feed.Extra text>
                                <div dangerouslySetInnerHTML={{ __html: this.state.issue.description }} />
                            </Feed.Extra>
                            <br/>
                            <Feed.Extra images>
                            {this.state.images.map(image => {
                        return(<img src={'http://127.0.0.1:8000' + image} width='100%' />)
                    })}
                            </Feed.Extra>
                        </Feed.Content>
                    </Feed.Event>
                </Segment>
                    {this.state.comments.map(comment => {
                return(
                    <Segment vertical>
                        <Feed.Event>
                        <Feed.Content>
                            <Feed.Summary>
                                <u>{comment.commented_by}</u> commented on this issue 
                                <Feed.Date><Moment fromNow>{comment.created_at}</Moment></Feed.Date>
                                <Feed.Extra text>
                                <div dangerouslySetInnerHTML={{ __html: comment.comment }} />
                                </Feed.Extra>
                            </Feed.Summary>
                        </Feed.Content>
                    </Feed.Event>
                    </Segment>
                )
            })}
                </Feed>
            </div>
            <form onSubmit={(e) => this.sendCommentHandler(e, this.state.comment)} style={{marginBottom : 30}}>
                <Editor
                value={this.state.comment}
                init={{
                    height: 300,
                    menubar: true,
                    plugins: [
                        'autolink lists charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen ',
                        'insertdatetime table paste code help wordcount'
                      ],
                      toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist | removeformat | help'
                }}
                onEditorChange={this.commentChangeHandler}
                apiKey="m7w1230xevfu875oarb6yfdxqdy4ltar34fuddlol5mowpde"
                />
                <br/>
                <Button type="submit" className="submit" value="Submit" >
                    Send
                </Button>
            </form>
        </div>
                </Sidebar.Pusher>
                </Sidebar.Pushable> 
            </Responsive>
            <Responsive minWidth={768}>
            <div className="ui container">
            <Segment vertical>
            <div className="bodyContent">
                <Segment vertical> 
                <Header as="h2">Project: {project_name} </Header>
                </Segment>
                <Header as="h1">Issue: {this.state.issue.title}
                <Modal
                trigger={<Button floated='right' inverted color='red'>
                    <Icon name='delete'/> Delete Issue
                </Button>}
                basic small>
                    <Header icon='browser' content='Do you really want to this Issue?'/>
                    <Modal.Content>
                    <h4>
                    Once you delete this issue, there's no going back. Please be certain.
                    This action <i><u>cannot</u></i> be undone.This will permanently delete the <i><u>{this.state.issue.title}</u></i> issue,
                    comments and media related with it. Please type <i><u>{this.state.issue.title}</u></i> to confirm.
                    </h4>
                    </Modal.Content>
                    <br/>
                    <Form onSubmit={this.deleteIssueSubmit}>
                    <Input
                    fluid
                    placeholder='Issue Name'
                    onChange={(event, data) =>{
                        this.setState({
                            ...this.state,
                            delete_issue_name: data.value
                        })
                    }}/>
                    <br/><br/>
                        <Button type='submit' color='red' inverted floated='right'>
                            <Icon name='checkmark'/> Submit and Delete the Issue
                        </Button>
                    </Form>
                </Modal>
                </Header>
                <Header as="h2" style={{marginTop: 0}}>
                {this.state.issue.bug_status == 3 ? bug_status : <Modal
                trigger={<span>
                    <Popup
                    trigger={bug_status}
                    inverted>
                        Close this Issue
                    </Popup>
                </span>}
                basic
                size='small'>
                    <Header icon='browser' content='Closing the Issue'/>
                    <Modal.Content>
                        Are you sure you want to close this Issue? 
                        <br/><br/>
                        <Button color='green' inverted floated='right' onClick={this.closeIssue}>
                            <Icon name='checkmark'/> Close the Issue
                        </Button>
                    </Modal.Content>
                </Modal>}
                {this.state.tags.map(tag => {
                    return(
                        <span style={{margin: 5}}>
                        <Label icon={tag.icon} content={tag.tagName} color={this.tagColor(tag.color)} href={`${SITE_URL}tags/${tag.id}`}/>
                    </span>
                    )
                })}

                </Header>
                <Segment vertical>
                <Header floated='left'>
                {rep_user_name} opened this issue <Moment fromNow>{this.state.issue.created_at}</Moment> 
                </Header>
                <Header floated='right'>
                Assigned To: {(asgn_user_name == null) ?
                <Modal
                trigger={
                    <span>
                        <Popup
                        trigger={<span>Assigned to No One</span>}
                        inverted>
                            Assign this Issue to a Team Member
                        </Popup>
                    </span>
                }
                basic
                size='small'
                >
                    <Header icon='browser' content='Assigning the Issue to a Team Member'/>
                    <Modal.Content>
                        Assign this Issue to a team Member of the project by selecting one of them from the list below:

                        <br/><br/>
                        <Form onSubmit={this.AssignIssueSubmit}>
                            <Dropdown
                            placeholder='Select the assignee of the issue'
                            selection
                            search
                            options={this.state.project_members.map(user => {
                                return{
                                    "key": user.pk,
                                    "text": user.username,
                                    "value": user.pk  
                                }
                            })}
                            onChange={(event, data) => {
                                console.log(data.value)
                                this.setState({
                                    ...this.state,
                                    assignee: data.value 
                                })
                                console.log(this.state.assignee)
                            }}
                            />
                             <Button  type='submit' color='green' inverted floated='right'>
                                  <Icon name='checkmark'/> Submit
                                </Button>
                        </Form>
                    </Modal.Content>
                </Modal>
                 : asgn_user_name}
                </Header>
                </Segment>
                </div>
                <div>
                </div>
            </Segment>
            <div className='comments'>
            <Segment raised>
                <Label color='purple' ribbon size='mini'>
                    <h4>{rep_user_name} commented on this issue <Moment fromNow>{this.state.issue.created_at}</Moment></h4>
                </Label>
                    <h4> <div dangerouslySetInnerHTML={{ __html: this.state.issue.description }} /></h4>
                    <br/>
                    <Card.Group>
                    {this.state.images.map(image => {
                        return(<Card color='red' image={'http://127.0.0.1:8000' + image} header='A Snap of the Issue'/>)
                    })}
                    </Card.Group>
            </Segment>
            {this.state.comments.map(comment => {
                return(<Segment raised>
                    <Label color='blue' ribbon>
                <h4>{comment.commented_by} commented on this issue <Moment fromNow>{comment.created_at}</Moment></h4>
                    </Label>
                    <h4><div dangerouslySetInnerHTML={{ __html: comment.comment }} /></h4>
                </Segment>
                )
            })}
            </div>
            <form onSubmit={(e) => this.sendCommentHandler(e, this.state.comment)} style={{marginBottom : 30}}>
                <Editor
                value={this.state.comment}
                init={{
                    height: 300,
                    menubar: true,
                    plugins: [
                        'autolink lists charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen ',
                        'insertdatetime table paste code help wordcount'
                      ],
                      toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist | removeformat | help'
                }}
                onEditorChange={this.commentChangeHandler}
                apiKey="m7w1230xevfu875oarb6yfdxqdy4ltar34fuddlol5mowpde"
                />
                <br/>
                <Button type="submit" className="submit" value="Submit" >
                    Send
                </Button>
            </form>
            </div>
            </Responsive>
            
       
    </div>
        )
    }

}

export default IssueComments