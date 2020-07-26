import React ,{ Component } from "react";
import axios from 'axios';
import {Redirect} from 'react-router-dom'
import queryString from 'query-string';
import MyPage from "../MyPage/index";
import './styles.css';
import { API_URL } from '../../constants' 

axios.defaults.xsrfCookieName = 'BUGTRACKER_CSRFTOKEN';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

class OnLogin extends Component{
    state = {
        user_found: false,
        got_response: false,
        access_token: ""
    }
    
    componentDidMount(){
        let url = this.props.location.search;
        let params = queryString.parse(url)
        console.log(params)
        if(!this.state.got_response){
            axios({
                method:'get',
                url: `${API_URL}appusers/onlogin/?code=${params['code']}`,
                withCredentials: true
            }).then((response) => {
                console.log(response)
                
                if(response.data["status"] === "User Created"){
                    this.setState({
                        user_found: true,
                        got_response: true,
                        access_token: response.data["access_token"],
                    });
                    console.log(this.state)
                }
                else if(response.data["status"] === "User not in IMG"){
                    this.setState({
                        ...this.state,
                        user_found: false,
                        got_response: true
                    })
                }
                else if(response.data["status"] === "User Exists"){
                    this.setState({
                        user_found: true,
                        got_response: true,
                        access_token: response.data["access_token"]
                    })
                    console.log(this.state)
                }
            })
        }
    }

    render(){
        if(this.state.got_response){
            if(this.state.user_found){
                return(<MyPage />)
            }
            else {
                alert("You must be an IMG member to use this app");
                return (<Redirect to ="/" exact/>)
            }
        }
        else{
            return(
                <div className="center-container">
                        <div className="ui active inverted dimmer">
                            <div className="ui large text loader">Loading</div>
                        </div>
                </div>
            )
        }
    }
}

export default OnLogin