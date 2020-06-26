import React, {Component} from "react";
import axios from "axios";
import logo from '../../mediafiles/LogoSmall.png'
import { Container, Segment, Header, Card } from "semantic-ui-react";
import './styles.css'

class Users extends Component{
    constructor(props) {
        super(props);
        this.state = {
            users: [],    
        }
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

    render(){
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
                                    <div>
                                        {user.pk}
                                    </div>
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