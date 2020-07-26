import React, {Component, useState} from 'react';
import axios from 'axios';
import logo from '../../mediafiles/LogoSmall.png'
import { Container, Header, Segment, Form, Radio,  Input, Dropdown, Button, Message, Menu, Responsive, Icon, Sidebar } from "semantic-ui-react";
import { Editor } from "@tinymce/tinymce-react";

import './styles.css'
import qs from 'qs'
import { SITE_URL, API_URL } from '../../constants';
import queryString from 'qs';

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
            file: [],
            issueId: '',
            tagsAvailable: [],
        }
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.statusChange = this.statusChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.issueNameHandler = this.issueNameHandler.bind(this); 
    }

    componentDidMount(){
        let url = this.props.location.search;
        let params = queryString.parse(url)
        console.log(params['?project'])
        if(params){
            this.setState({
                ...this.state,
                project: params['?project']
            })
        }
        axios({
            method: 'get',
            url: `${API_URL}project/`
        }).then((response)=> {
            this.setState({
                ...this.state,
                projects_available: response.data
            })
            console.log(this.state)
        })

        axios({
            method: 'get',
            url: `${API_URL}tags/`
        }).then((res) => {
            this.setState({
                ...this.state,
                tagsAvailable : res.data
            })
        })
    }
    handleSubmit = event => {
        event.preventDefault();
        console.log(this.state);
        axios({
            method: 'get',
            url: `${API_URL}issues/add_issue/`,
            params: {
                title: this.state.title,
                description: this.state.description,
                bug_status: this.state.bug_status,
                project: this.state.project,
                tags: this.state.tag 
            },
            paramsSerializer: params => {
                return qs.stringify(params)
            }
        }).then((response)=> {
            console.log(response.data.Id)
            if(response.data.Status == 'New Issue Added'){
                for (var i = 0; i < this.state.file.length; i++){
                    const uploadData = new FormData();
                uploadData.append('issue', response.data.Id)
                uploadData.append('image', this.state.file[i], this.state.file[i].name)
        
                fetch(`${API_URL}issue_images/`, {
                    method: 'POST',
                    body: uploadData
                }).then(res => console.log(res))
                }
                alert('New Issue Added')
                window.location = `${SITE_URL}mypage`
            }
            else{
                alert('User not Authenticated or is disabled')
                window.location = SITE_URL
            }
        })
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

        console.log(data.value)
        this.setState({
            ...this.state,
            title: data.value
        })
        //console.log(this.state)
    }

    render(){
        const {bug_status} = this.state
        let url = this.props.location.search;
        let params = queryString.parse(url)
        console.log(params)
        return(
            <div>
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
              <Button primary href={`${SITE_URL}project/add`}>
                Add New Project
                </Button>
              </div>
              <div className="item">
                <Button primary href={`${SITE_URL}mypage`}>
                Back to My Page
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
              <Menu.Item as='a' href={`${SITE_URL}project/add`}>
                Add New project
              </Menu.Item>
              <Menu.Item as='a' href={`${SITE_URL}mypage`}>
              Back To My Page
              </Menu.Item>
                </Sidebar>
            <Sidebar.Pusher>
            <Container>
                    <Segment vertical>
                        <div style={{marginTop: 20}}>
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
                                        selector: 'textarea',
                                        menubar: true,
                                        width: '100%',
                                        height: 200,
                                        plugins: [
                                          'advlist autolink lists charmap print preview anchor',
                                          'searchreplace visualblocks code fullscreen ',
                                          'insertdatetime table paste code help wordcount'
                                        ],
                                        toolbar:
                                          'undo redo | formatselect | bold italic backcolor | \
                                          alignleft aligncenter alignright alignjustify | \
                                          bullist numlist | removeformat | help',
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
                            <Form.Field>
                                <h3>Upload Images for this issue</h3>
                            <input type="file" name="filename" onChange={(event) => {
                                this.setState({
                                ...this.state,
                                file: [...this.state.file, event.target.files[0]] 
                            })
                            console.log(this.state.file)
                            alert( this.state.file.length + 1 + ' Image/s Uploaded till now ')
                            }} accept="image/png, image/jpeg"/>
                            </Form.Field>
                            <h3>
                            <Form.Group inline style={{marginTop: -10}}>
                                <label>Bug Status</label>
                                <Menu stackable text>
                                    <Menu.Item>
                                    <Form.Field
                                        control={Radio}
                                        label='Pending'
                                        value={1}
                                        checked={bug_status == 1} 
                                        onChange={this.statusChange}
                                    />
                                    </Menu.Item>
                                    <Menu.Item>
                                    <Form.Field
                                        control={Radio}
                                        label='To be Discussed'
                                        value={2}
                                        checked={bug_status == 2}
                                        onChange={this.statusChange}
                                    />
                                    </Menu.Item>
                                    <Menu.Item>
                                    <Form.Field
                                        control={Radio}
                                        label='Resolved'
                                        value={3}
                                        checked={bug_status == 3}
                                        onChange={this.statusChange}
                                    />
                                    </Menu.Item>
                                </Menu>
                            </Form.Group>
                            </h3>
                            <h3>Project</h3>
                            {params['?name'] != null ? <Dropdown
                            disabled
                            placeholder={params['?name']}/> : <Dropdown 
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
                            />}
                            <br/>
                            <h3>Tag</h3>
                            <Dropdown
                            placeholder='Select the Tag'
                            fluid
                            multiple
                            search
                            selection
                            options={this.state.tagsAvailable.map(tag => {
                                return{
                                    "key": tag.id,
                                    "icon": tag.icon,
                                    "text": tag.tagName,
                                    "value": tag.id
                                }
                            })}
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
            </Sidebar.Pusher>
            </Sidebar.Pushable>
                </Responsive>
                <Responsive minWidth={768}>
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
                                        selector: 'textarea',
                                        menubar: true,
                                        width: '100%',
                                        height: 200,
                                        plugins: [
                                          'advlist autolink lists charmap print preview anchor',
                                          'searchreplace visualblocks code fullscreen ',
                                          'insertdatetime table paste code help wordcount'
                                        ],
                                        toolbar:
                                          'undo redo | formatselect | bold italic backcolor | \
                                          alignleft aligncenter alignright alignjustify | \
                                          bullist numlist | removeformat | help',
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
                            <Form.Field>
                                <h3>Upload Images for this issue</h3>
                            <input type="file" name="filename" onChange={(event) => {
                                this.setState({
                                ...this.state,
                                file: [...this.state.file, event.target.files[0]] 
                            })
                            console.log(this.state.file)
                            alert( this.state.file.length + 1 + ' Image/s Uploaded till now ')
                            }} accept="image/png, image/jpeg"/>
                            </Form.Field>
                            <h3>
                            <Form.Group inline style={{marginTop: -10}}>
                                <label>Bug Status</label>
                                <Menu stackable text>
                                    <Menu.Item>
                                    <Form.Field
                                        control={Radio}
                                        label='Pending'
                                        value={1}
                                        checked={bug_status == 1} 
                                        onChange={this.statusChange}
                                    />
                                    </Menu.Item>
                                    <Menu.Item>
                                    <Form.Field
                                        control={Radio}
                                        label='To be Discussed'
                                        value={2}
                                        checked={bug_status == 2}
                                        onChange={this.statusChange}
                                    />
                                    </Menu.Item>
                                    <Menu.Item>
                                    <Form.Field
                                        control={Radio}
                                        label='Resolved'
                                        value={3}
                                        checked={bug_status == 3}
                                        onChange={this.statusChange}
                                    />
                                    </Menu.Item>
                                </Menu>
                            </Form.Group>
                            </h3>
                            <h3>Project</h3>
                            {params['?name'] != null ? <Dropdown
                            disabled
                            placeholder={params['?name']}/> : <Dropdown 
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
                            />}
                            <br/>
                            <h3>Tag</h3>
                            <Dropdown
                            placeholder='Select the Tag'
                            fluid
                            multiple
                            search
                            selection
                            options={this.state.tagsAvailable.map(tag => {
                                return{
                                    "key": tag.id,
                                    "icon": tag.icon,
                                    "text": tag.tagName,
                                    "value": tag.id
                                }
                            })}
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
                </Responsive>
            </div>
        )
    }
}

export default newIssue;