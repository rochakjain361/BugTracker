import React ,{ Component } from "react";
import { Redirect } from 'react-router-dom';
import axios from 'axios'
import { Button } from 'semantic-ui-react';
import './styles.css';
import logo from '../../mediafiles/LogoBig.png'

axios.defaults.xsrfCookieName = 'BUGTRACKER_CSRFTOKEN';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

class Login extends Component {
    state = {
        logged_in: false,
        response_recieived: false
    }

    redirect() {
        window.location ='https://internet.channeli.in/oauth/authorise/?client_id=gfZHj4O7eZKrzv8Vpgqi1s5kKWgvgyFCf5vt822c&redirect_url=http://localhost:3000/onlogin/&state=Success'
    }

    componentDidMount() {
        axios({
            url: 'http://127.0.0.1:8000/appusers/current_user/',
            method: 'get',
            withCredentials: true,
        }).then((response) => {
            console.log(response.data['Response'])
            if(response.data['Response'] === "No Current User"){
                this.setState({
                    logged_in: false,
                    response_recieived: true
                })
            }
            else{
                this.setState({
                    logged_in: true,
                    response_recieived: true
                })
            }

            console.log(this.state)
        });
    }

    render(){
        if(this.state.logged_in && this.state.response_recieived){
            return <Redirect to='/' exact/>
        }
        else{
            return(
                    <div className="center-container">
                        <div className="ui violet segment">
                        <img src={logo}/>
                        <div class="button">
                            <Button className="ui large primary button" onClick={this.redirect}>
                                Login using Omniport
                            </Button>
                        </div>
                        </div>
                    </div>    
            )
        }
    }
}

export default Login;