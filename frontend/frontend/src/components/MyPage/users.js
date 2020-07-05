import React, {Component} from "react";
import axios from "axios";
import logo from '../../mediafiles/LogoSmall.png'
import { Container, Segment, Header, Card, Image, CardContent, Button, Modal, Icon, Responsive, Menu, Sidebar } from "semantic-ui-react";
import './styles.css'
import Avatar from "react-avatar";

class Users extends Component{
    constructor(props) {
        super(props);
        this.state = {
            users: [],    
        }
        
        this.RoleUpgrade = this.RoleUpgrade.bind(this)
        this.Enable_DisableUser_Upgrade = this.Enable_DisableUser_Upgrade.bind(this)
    }
    
    
    componentDidMount(){
        axios({
            method: 'get',
            url: 'http://127.0.0.1:8000/appusers/'
        }).then((response) => {
            console.log(response.data)
            this.setState({
                users: response.data
            })
        })
    }

    RoleUpgrade(id, current_role){
        console.log(id, current_role)

        var new_role = (current_role == 1) ? 2 : 1 ;
        console.log(new_role)

        axios({
            method: 'get',
            url: `http://127.0.0.1:8000/appusers/${id}/convert_role/`,
            params: {
                new_role: new_role
            }            
        }).then((res) => {
            if(res.data.Status == 'Role Upgraded'){
                alert('Role Upgraded')
                this.refreshpage()
            }
            else if(res.data.Status == 'User is not an Admin'){
                alert('Invalid Request user is not an admin.')
                window.location = 'http://localhost:3000/onlogin/'
            }
            else if(res.data.Status == 'User is disabled'){
                alert('Admins disabled you :`(')
                window.location = 'http://localhost:3000/'
            }
            else if(res.data.Status == 'User not Authenticated'){
                alert('You are not authenticated. Re-Login')
                window.location = 'http://localhost:3000/'
            }
        })
    }

    Enable_DisableUser_Upgrade(id, is_disabled){
        console.log(id, is_disabled)
        var new_status = (is_disabled) ? 0 : 1;

        axios({
            method: 'get',
            url: `http://127.0.0.1:8000/appusers/${id}/disable_user/`,
            params: {
                is_disabled: new_status 
            }
        }).then((res) => {
            if(res.data.status == 'User Status Changed'){
                alert('User Status Changed')
                this.refreshpage()
            }
            else{
                alert('User not eligible to perform this action')
                window.location = 'http://localhost:3000/onlogin/'
            }
        })
    }

    refreshpage(){
        window.location.reload(false);
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

        const UserRole = (role) => {
            if(role == 1){
                return('Normal User')
            }
            else if(role == 2){
                return('Admin')
            }
        }

        const UserRoleUpgrade = (id, role) =>{
            if(role == 1){
                //console.log(id, role)
                return(
                    <Modal
                        trigger={ <Button basic color='green'>
                        Promote to Admin
                    </Button>}
                        size='small'
                        basic
                    >
                        <Header icon='browser' content=' Confirmation for Promoting the User'/>
                        <Modal.Content>
                            <h3>Are you sure you want to promote this User to Admin?</h3>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='green' basic inverted onClick={() => {
                                this.RoleUpgrade(id, role);
                                }}>
                                <Icon name='checkmark' />Yes!    
                            </Button>
                        </Modal.Actions>
                    </Modal>
                   
                )
            }
            else if(role == 2){
                //console.log(id, role)
                return(
                    <Modal
                        trigger={<Button basic color='red'>
                                    Demote to Normal
                                </Button>}
                        basic
                        size='small'>
                        <Header icon='browser' content='Confirmation for Demoting the user'/>
                        <Modal.Content>
                            <h3>Are you sure you want to demote this User back to Normal?</h3>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button basic color='green' onClick={() => {
                                this.RoleUpgrade(id, role);
                            }}>
                                <Icon name='checkmark' />Yes!    
                            </Button>
                        </Modal.Actions>
                    </Modal>
                )
            }
        } 

        const Enable_Disable_User = (id, is_disabled) => {
            if(is_disabled){
               return(
                <Modal
                trigger={ <Button basic color='green'>
                Enable User
            </Button>}
                basic
                size='small'
            >
                <Header icon='browser' content='Confirmation for Enalbing the User'/>
                <Modal.Content>
                    <h3>Are you sure you want to enable this User?</h3>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic color='green' inverted onClick={() => {
                        this.Enable_DisableUser_Upgrade(id, is_disabled);
                    }}>
                        <Icon name='checkmark'/>Yes!    
                    </Button>
                </Modal.Actions>
            </Modal>
               ) 
            }
            if(!is_disabled){
                return(
                    <Modal
                trigger={ <Button basic color='red'>
                Disable User
            </Button>}
                basic
                size='small'
            >
                <Header icon='browser' content='Confirmation for Disabling the user'/>
                <Modal.Content>
                    <h3>Are you sure you want to Disable this user?</h3>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic color='green' inverted onClick={() => {
                        this.Enable_DisableUser_Upgrade(id, is_disabled);
                    }}>
                        <Icon name='checkmark'/>Yes!    
                    </Button>
                </Modal.Actions>
            </Modal>
                ) 
             }
        }

        //const 

        return(
            <div>
                 <Responsive minWidth={768}>
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
                        <Header as="h3">
                            MODO ADMINISTRADOR
                        </Header>
                        <Header as="h2">
                            APP USERS
                        </Header>
                        </div>
                    </Segment>
                    <Segment vertical style={{marginBottom: 50}}>
                        <Card.Group>
                            {this.state.users.map(user => {
                                return(
                                   <Card>
                                       <Card.Content>
                                            <Image
                                            floated='right'
                                            circular>
                                                {avatar(user['display_picture'], user['username'])}
                                            </Image>
                                            <Card.Header>
                                                {user.username}
                                            </Card.Header>
                                            <Card.Meta>
                                                {UserRole(user.user_role)} <br/>
                                                {user.is_disabled ? 'Disabled' : ''}
                                            </Card.Meta> 
                                            <Card.Description>
                                                <h4>
                                               Enrollment No:- {user.enrNo} <br/>
                                               Email Id:- {user.email} <br/> 
                                               {console.log(user.is_disabled)}
                                               </h4>
                                            </Card.Description>
                                       </Card.Content>
                                       <CardContent extra>
                                           <div className='ui two buttons'>
                                               {UserRoleUpgrade(user.pk, user.user_role)}
                                               {Enable_Disable_User(user.pk, user.is_disabled)}
                                           </div>
                                       </CardContent>
                                   </Card> 
                                )
                            })}
                        </Card.Group>
                    </Segment>
                </Container>
                </Sidebar.Pusher>
                </Sidebar.Pushable>
                </Responsive>
                <Responsive minWidth={768}>
                <Container>
                    <Segment vertical>
                        <div className = 'bodyContent'>
                        <Header as="h3">
                            MODO ADMINISTRADOR
                        </Header>
                        <Header as="h2">
                            APP USERS
                        </Header>
                        </div>
                    </Segment>
                    <Segment vertical>
                        <Card.Group>
                            {this.state.users.map(user => {
                                return(
                                   <Card>
                                       <Card.Content>
                                            <Image
                                            floated='right'
                                            circular>
                                                {avatar(user['display_picture'], user['username'])}
                                            </Image>
                                            <Card.Header>
                                                {user.username}
                                            </Card.Header>
                                            <Card.Meta>
                                                {UserRole(user.user_role)} <br/>
                                                {user.is_disabled ? 'Disabled' : ''}
                                            </Card.Meta> 
                                            <Card.Description>
                                                <h4>
                                               Enrollment No:- {user.enrNo} <br/>
                                               Email Id:- {user.email} <br/> 
                                               {console.log(user.is_disabled)}
                                               </h4>
                                            </Card.Description>
                                       </Card.Content>
                                       <CardContent extra>
                                           <div className='ui two buttons'>
                                               {UserRoleUpgrade(user.pk, user.user_role)}
                                               {Enable_Disable_User(user.pk, user.is_disabled)}
                                           </div>
                                       </CardContent>
                                   </Card> 
                                )
                            })}
                        </Card.Group>
                    </Segment>
                </Container>
                </Responsive>
            </div>
        )
    }

}

export default Users;