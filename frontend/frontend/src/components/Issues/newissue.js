import React, {Component} from 'react';
import axios from 'axios';
import logo from '../../mediafiles/LogoSmall.png'
import { Container, Header, Segment, Form, Radio,  Input, Dropdown, Button, Message } from "semantic-ui-react";
import { Editor } from "@tinymce/tinymce-react";
import './styles.css'
import qs from 'qs'

class newIssue extends Component{
    constructor(props){
        super(props)
        this.state = { 
            title: '',
            description: '',
            bug_status: 1,
            reported_by: [],
            project: [],
            tag:[],
            projects_available: [],
        }
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.statusChange = this.statusChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.issueNameHandler = this.issueNameHandler.bind(this);
    }

    componentDidMount(){
        axios({
            method: 'get',
            url: 'http://127.0.0.1:8000/project/'
        }).then((response)=> {
            this.setState({
                ...this.state,
                projects_available: response.data
            })
            console.log(this.state)
        })
    }

    handleSubmit = event => {
        event.preventDefault();
        console.log(this.state);

        axios({
            method: 'get',
            url: 'http://127.0.0.1:8000/issues/add_issue/',
            params: {
                title:this.state.title,
                description: this.state.description,
                bug_status: this.state.bug_status,
                project: this.state.project,
                tag: this.state.tag 
            },
            paramsSerializer: params => {
                return qs.stringify(params)
            }
        }).then((response)=> {
            console.log(response)
        })

        /*
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/issues/',
            withCredentials: "true",
            data:{ 
                title: this.state.title,
                description: this.state.description,
                bug_status: this.state.bug_status,
                reported_by: this.state.reported_by,
                assigned_to: null,
                project: this.state.project,
                tag: this.state.tag
            } 
        }).then((response) => {
            console.log(response)
        })
        */
    }

    handleDropdownChange = (event, data) => {
        console.log(data.value)
        console.log(parseInt(sessionStorage.getItem('pk')))
        this.setState({
            ...this.state,
            project: data.value,
            reported_by: parseInt(sessionStorage.getItem('pk'))
        })
        //console.log(this.state)
    }

    statusChange = (event, data) => {
        console.log(data.value)
        this.setState({
            ...this.state,
            bug_status: data.value
        })
        //console.log(this.state)
    }

    issueNameHandler = (event, data) => {

        axios({
            url: '',
            method: 'get'
        })


        console.log(data.value)
        this.setState({
            ...this.state,
            title: data.value
        })
        //console.log(this.state)
    }

    render(){
        const {bug_status} = this.state
        const TagsForDropdown = [
            {
                key: 1,
                text: 'Bug',
                value: 1
            },
            {
                key: 2,
                text: 'Enhancement',
                value: 2
            },
            {
                key: 3,
                text: 'UI/UX Improvement',
                value: 3
            }
        ]
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
                                        Add New Project
                                    </button>
                                </div>
                                <div className="item">
                                    <button class="ui primary button">
                                        Back to My Page
                                    </button>
                                </div>
                            </div>
                    </div>
                </div>
                <Container>
                    <Segment vertical>
                        <div className = 'bodyContent'>
                            <Header as="h2">
                                ADD NEW ISSUE
                            </Header>
                        </div>
                    </Segment>
                    <Segment vertical>
                        <Form onSubmit={this.handleSubmit} >
                            <Form.Field>
                                <h3><label>Issue Name</label></h3>
                                <Input
                                id='issue_name' 
                                fluid
                                placeholder='Project Name' 
                                onChange={this.issueNameHandler}
                                />
                            </Form.Field>
                            <Form.Field>
                                <h3><label>Issue Description</label></h3>
                                <Editor
                                    init={{
                                        height: 200,
                                        menubar: false,
                                    }}
                                    value={this.state.wiki}
                                    onEditorChange={(event) => {
                                        console.log(event)
                                        this.setState({
                                            ...this.state,
                                            description: event
                                        })
                                    }
                                    }
                                    apiKey="m7w1230xevfu875oarb6yfdxqdy4ltar34fuddlol5mowpde"
                                    />
                            </Form.Field>
                            <h3>
                            <Form.Group inline>
                                <label>Bug Status</label>
                                    <Form.Field
                                        control={Radio}
                                        label='Pending'
                                        value={1}
                                        checked={bug_status == 1} 
                                        onChange={this.statusChange}
                                    />
                                    <Form.Field
                                        control={Radio}
                                        label='To be Discussed'
                                        value={2}
                                        checked={bug_status == 2}
                                        onChange={this.statusChange}
                                    />
                                    <Form.Field
                                        control={Radio}
                                        label='Resolved'
                                        value={3}
                                        checked={bug_status == 3}
                                        onChange={this.statusChange}
                                    />
                            </Form.Group>
                            </h3>
                            <h3>Project</h3>
                            <Dropdown 
                            placeholder='Select the Project in which the Issue is found'  
                            search
                            fluid
                            selection
                            options={this.state.projects_available.map(project => {
                                return{
                                    "key": project.id,
                                    "text": project.name,
                                    "value": project.id
                                }
                            })} 
                            onChange={this.handleDropdownChange}
                            />
                            <br/>
                            <h3>Tag</h3>
                            <Dropdown
                            placeholder='Select the Tag'
                            fluid
                            search
                            selection
                            options={TagsForDropdown}
                            onChange={(event, data) => {
                                this.setState({
                                    tag: data.value
                                })
                                console.log(this.state)
                            }
                            }
                            />
                            <br/>
                            <Button type='submit'>
                                Submit
                            </Button>
                        </Form>
                    </Segment>
                </Container>
            </div>
        )
    }
}

export default newIssue;