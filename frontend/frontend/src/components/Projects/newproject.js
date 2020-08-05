import React, {Component} from "react";
import logo from '../../mediafiles/LogoSmall.png'
import { Container, Header, Segment, Form, Radio,  Input, Dropdown, Button, Message, Menu, Responsive, Icon, Sidebar, Loader} from "semantic-ui-react";
import './styles.css'
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import qs from 'qs'
import { API_URL, SITE_URL } from "../../constants";

class newProject extends Component{
    constructor(props){
        super(props)
        this.state = { 
            name: '',
            wiki: '',
            status: 1,
            members: [],
            users_available: [],
            projectsMade: [],
            projectNameError: false,
            right_menu_visible: false,
        }
        this.statusChange = this.statusChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        axios({
            method: 'get',
            url: `${API_URL}appusers/`
        }).then((response) => {
            if(response.statusText === "OK"){
                this.setState({
                    ...this.state,
                    users_available: response.data
                })
                console.log(this.state)
            }
            console.log(this.state.users_available)
            console.log(sessionStorage.getItem('pk'))
            for(let i = 0; i<this.state.users_available.length; i++){
                if(this.state.users_available[i].pk == sessionStorage.getItem('pk')){
                    console.log('This is working')
                    var array = [...this.state.users_available]
                    array.splice(i, 1)
                    this.setState({
                        ...this.state,
                        users_available: array
                    })
                    console.log(this.state.users_available)
                }
            }
        })
        axios({
            method: 'get',
            url: `${API_URL}project/`
        }).then((res) => {
            console.log(res.data)
            this.setState({
                ...this.state,
                projectsMade: res.data,
            })
        })
    }
    handleSubmit = event => {
        if(this.state.name !== "" && this.state.wiki !== "" && this.state.members.length !== 0){
                axios({
                method: 'get',
                url: `${API_URL}project/add_project`,
                params: {
                    name: this.state.name,
                    wiki: this.state.wiki,
                    status: this.state.status,
                    members: this.state.members,
                    code: sessionStorage.getItem('access_token') 
                },
                paramsSerializer: params => {
                    return qs.stringify(params)
                }            
    
            }).then((response) => {
                if(response.data.Status == 'Project Created'){
                    alert('Project Created')
                    window.location = `${SITE_URL}onlogin/`
                }
                else{
                    alert('User not Authenticated or is disabled')
                    window.location = `${SITE_URL}`
                }
            })
            
        }
        else{
            alert('Form Incomplete. Fill Again')
            window.location.reload(false);
        }
    }

    statusChange = (event, data) => {

        this.setState({
            ...this.state,
            status: data.value
        })
    }
    render(){
        const {status} = this.state
        return(
            <div>
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
                <Button primary href={`${SITE_URL}onlogin`}>
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
            <a href={`${SITE_URL}onlogin`}>
          <img src={logo} height="60px" width="60px" style={{marginTop: 4, marginLeft: 30}}/>
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
              <Menu.Item as='a' href={`${SITE_URL}onlogin`}>
              Back To My Page
              </Menu.Item>
                </Sidebar>
                
                <Sidebar.Pusher>
                <Container>
                    <Segment vertical>
                        <div style={{marginTop: 20}}>
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
                                onChange={(event, data) =>{
                                    var sorted = this.state.projectsMade.map(project => {
                                        return project.name.toLowerCase()
                                    })
                                        if(sorted.includes(data.value.toLowerCase())){
                                            this.setState({
                                                ...this.state,
                                                name: "",
                                                projectNameError: true
                                            })
                                        }
                                        else{
                                            this.setState({
                                                ...this.state,
                                                name: data.value,
                                                projectNameError: false
                                            })
                                        }
                                }}
                                />
                                <br/>
                                <Message
                                error
                                visible={this.state.projectNameError}
                                header={this.state.projectNameError && "Name Not Available"}
                                content={this.state.projectNameError && "This project Name is already being taken, this name is not available."}
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
                                <Menu stackable text>
                                    <Menu.Item>
                                    <Form.Field
                                        control={Radio}
                                        label='Under Development'
                                        value={1}
                                        checked={status == 1} 
                                        onChange={this.statusChange}
                                    />
                                    </Menu.Item>
                                    <Menu.Item>
                                    <Form.Field
                                        control={Radio}
                                        label='Testing'
                                        value={2}
                                        checked={status == 2}
                                        onChange={this.statusChange}
                                    />
                                    </Menu.Item>
                                    <Menu.Item>
                                    <Form.Field
                                        control={Radio}
                                        label='Released'
                                        value={3}
                                        checked={status == 3}
                                        onChange={this.statusChange}
                                    /> 
                                    </Menu.Item>
                                </Menu>
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
                                onChange={(event, data) =>{
                                    var sorted = this.state.projectsMade.map(project => {
                                        return project.name.toLowerCase()
                                    })
                                        if(sorted.includes(data.value.toLowerCase())){
                                            this.setState({
                                                ...this.state,
                                                name: "",
                                                projectNameError: true
                                            })
                                        }
                                        else{
                                            this.setState({
                                                ...this.state,
                                                name: data.value,
                                                projectNameError: false
                                            })
                                        }
                                }}
                                />
                                <br/>
                                <Message
                                error
                                visible={this.state.projectNameError}
                                header={this.state.projectNameError && "Name Not Available"}
                                content={this.state.projectNameError && "This project Name is already being taken, this name is not available."}
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
                                <Menu stackable text>
                                    <Menu.Item>
                                    <Form.Field
                                        control={Radio}
                                        label='Under Development'
                                        value={1}
                                        checked={status == 1} 
                                        onChange={this.statusChange}
                                    />
                                    </Menu.Item>
                                    <Menu.Item>
                                    <Form.Field
                                        control={Radio}
                                        label='Testing'
                                        value={2}
                                        checked={status == 2}
                                        onChange={this.statusChange}
                                    />
                                    </Menu.Item>
                                    <Menu.Item>
                                    <Form.Field
                                        control={Radio}
                                        label='Released'
                                        value={3}
                                        checked={status == 3}
                                        onChange={this.statusChange}
                                    /> 
                                    </Menu.Item>
                                </Menu>
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

export default newProject;