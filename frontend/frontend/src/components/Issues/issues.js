import React, { Component } from "react";
import WebSocketInstance from '../../WebSocket'
import logo from '../../mediafiles/LogoSmall.png'
import { Redirect } from 'react-router-dom';
import { Segment, Header, Button, Label, Card, Popup, Modal, Dropdown, Form, Icon } from "semantic-ui-react";
import axios from 'axios';
import 'moment-timezone';
import Moment from 'react-moment';
import "./styles.css";
import { Editor } from "@tinymce/tinymce-react";

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
        } 

        this.waitForSocketConnection(() => {
            WebSocketInstance.initCommentUser(sessionStorage.getItem('access_token'));
            WebSocketInstance.addCallbacks(this.setComments.bind(this), this.addComment.bind(this));
            WebSocketInstance.fetchComments()
        })

        this.AssignIssueSubmit = this.AssignIssueSubmit.bind(this)
    }
    
    componentDidMount(){
        let id = this.props.match.params.id
        //console.log(id)
        WebSocketInstance.connect(id) 
        axios({
            method:'get',
            url: `http://127.0.0.1:8000/issues/${id}/`
        }).then((response) => {
            //console.log(response)
            if(response.statusText == 'OK'){
                this.setState({
                    ...this.state,
                    issue: response.data,
                    project_members: response.data.project.members
                })
            }
        })

        axios({
            method:'get',
            url: `http://127.0.0.1:8000/issue_images/get_image_url/?issue=${id}`,
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
        console.log(this.state.issue)
        var bug_status;
        if(this.state.issue.bug_status == 1){
            bug_status = (
                <Button
                color='red'
                content='Bug Status'
                label={{ basic: true, color: 'red', pointing: 'left', content: 'Pending' }}
              />
            )
        }
        else if(this.state.issue.bug_status == 2){
            bug_status = (
                <Button
                color='orange'
                content='Bug Status'
                label={{ basic: true, color: 'orange', pointing: 'left', content: 'To be discussed' }}
              />
            )
        }
        else if(this.state.issue.bug_status == 3){
            bug_status = (
                <Button
                color='green'
                content='Bug Status'
                label={{ basic: true, color: 'green', pointing: 'left', content: 'Resolved' }}
              />
            )
        }
        var tag;

        if(this.state.issue.tag == 1){
            tag = (
                <Button
                color='yellow'
                content='Bug'
                icon='bug'/>
            )
        }

        if(this.state.issue.tag == 2){
            tag = (
                <Button
                color='violet'
                content='Enhancement'
                icon='hashtag'/>
            )
        }

        if(this.state.issue.tag == 3){
            tag = (
                <Button
                color='brown'
                content='UI/UX'
                icon='mobile'/>
            )
        }

        //console.log(this.state)
        return(<div>
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
        <div className="ui container">
            <Segment vertical>
            <div className="bodyContent">
                <Header as="h2">Project: {project_name} </Header>
                <Header as="h1">Issue: {this.state.issue.title}</Header>
                <div>
                {bug_status}        
                {tag}
                </div>
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
                <Label color='orange' ribbon>
                    <h4>{rep_user_name} commented on this issue <Moment fromNow>{this.state.issue.created_at}</Moment></h4>
                </Label>
                    <h4> <div dangerouslySetInnerHTML={{ __html: this.state.issue.description }} /></h4>
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
    </div>
        )
    }

}

export default IssueComments