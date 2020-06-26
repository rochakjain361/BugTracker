import React, {Component} from "react";
import axios from "axios";
import logo from '../../mediafiles/LogoSmall.png'
import { Container, Segment, Header, Card, Image, CardContent, Button, Modal, Icon } from "semantic-ui-react";
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
                                this.refreshpage()
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
                                this.refreshpage();
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
                        this.refreshpage();
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
                        this.refreshpage();
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
            </div>
        )
    }

}

export default Users;