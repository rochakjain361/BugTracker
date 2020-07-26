import React ,{ Component } from "react";
import axios from 'axios'
import { Button } from 'semantic-ui-react';
import './styles.css';
import logo from '../../mediafiles/LogoBig.png'
import { client_id } from "../../constants";

axios.defaults.xsrfCookieName = 'BUGTRACKER_CSRFTOKEN';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

class Login extends Component {
    state = {
        logged_in: false,
        response_recieived: false
    }

    redirect() {
        window.location = `https://internet.channeli.in/oauth/authorise/?client_id=${client_id}&redirect_uri=http://localhost:3000/onlogin/&state=Success`
    }
    
    render(){
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

export default Login;