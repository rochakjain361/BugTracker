import React, {Component} from "react";
import logo from '../../mediafiles/LogoSmall.png'
import { Container, Header, Segment, Form, Radio,  Input, Dropdown, Button } from "semantic-ui-react";
import './styles.css'
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import qs from 'qs'

class newProject extends Component{
    constructor(props){
        super(props)
        this.state = { 
            name: '',
            wiki: '',
            status: 1,
            creator: [],
            members: [],
            users_available: [],
        }
        this.statusChange = this.statusChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.projectNameHandler = this.projectNameHandler.bind(this);
    }

    componentDidMount(){
        axios({
            method: 'get',
            url: 'http://127.0.0.1:8000/appusers/'
        }).then((response) => {
            if(response.statusText === "OK"){
                this.setState({
                    ...this.state,
                    users_available: response.data
                })
                console.log(this.state)
            }
        })
    }

    readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    handleSubmit = event => {
        event.preventDefault();
        console.log(this.state);
        /*
        axios({
            url: 'http://127.0.0.1:8000/project/',
            method: "post",
            withCredentials: "true",
            data:{
                name: this.state.name,
                wiki: this.state.wiki,
                status: this.state.status,
                creator: this.state.creator,
                members: this.state.members                 
            },
            headers: {'Content-Type': 'application/json',
                      'X-CSRFToken': 'rcxDnQW5f1R3j6szjnRVirpzHOHHJQg9tA90ia6TzylArmg8SLoUGsKScKDmgWxP'   
                    },
        }).then((response) => {
            console.log(response)
        })
        */
        axios({
            method: 'get',
            url: 'http://127.0.0.1:8000/project/add_project',
            params: {
                name: this.state.name,
                wiki: this.state.wiki,
                status: this.state.status,
                creator: this.state.creator,
                members: this.state.members
            },
            paramsSerializer: params => {
                return qs.stringify(params)
            }            

        }).then((response) => {
            console.log(response);
        })
    }

    statusChange = (event, data) => {
        //console.log(data.value)

        this.setState({
            ...this.state,
            status: data.value
        })
        //console.log(this.state)
    }

    projectNameHandler = (event, data) => {
        console.log(data.value)
        this.setState({
            ...this.state,
            name: data.value
        })
        //console.log(this.state)
    }

    render(){
        const {status} = this.state
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
                                        Add New Issue
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
                                ADD NEW PROJECT
                            </Header>
                        </div>
                    </Segment>
                    <Segment vertical>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <h3><label>Project Name</label></h3>
                                <Input
                                id='project_name' 
                                fluid
                                placeholder='Project Name' 
                                onChange={this.projectNameHandler}
                                />
                            </Form.Field>
                            <Form.Field>
                                <h3><label>Project Description</label></h3>
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
                            <h3>
                            <Form.Group inline>
                                <label>Status</label>
                                    <Form.Field
                                        control={Radio}
                                        label='Under Development'
                                        value={1}
                                        checked={status == 1} 
                                        onChange={this.statusChange}
                                    />
                                    <Form.Field
                                        control={Radio}
                                        label='Testing'
                                        value={2}
                                        checked={status == 2}
                                        onChange={this.statusChange}
                                    />
                                    <Form.Field
                                        control={Radio}
                                        label='Released'
                                        value={3}
                                        checked={status == 3}
                                        onChange={this.statusChange}
                                    />
                            </Form.Group>
                            </h3>
                            <h3>Project Members</h3>
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
                                    members: data.value
                                })
                            }}
                            />
                            <br/>
                            <h3>Project Creator</h3>
                            <Dropdown
                            placeholder='Select User'
                            fluid
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
                                this.setState({
                                    creator: data.value
                                })
                            }}
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

export default newProject;