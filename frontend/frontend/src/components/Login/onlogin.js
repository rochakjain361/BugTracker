import React ,{ Component } from "react";
import axios from 'axios';
import {Redirect} from 'react-router-dom'
import queryString from 'query-string';
import MyPage from "../MyPage/index";
import './styles.css';

class OnLogin extends Component{
    state = {
        user_found: false,
        got_response: false,
        access_token: ""
    }
    
    componentDidMount(){
        let url = this.props.location.search;
        console.log(url)
        let params = queryString.parse(url)
        
        if(!this.state.got_response){
            axios({ 
                method:'post',
                url: "http://127.0.0.1:8000/appusers/onlogin/",
                headers:{
                    'Content-Type':'application/json',
                },
                withCredentials: true,
                data:{
                    code: params['code']
                }
            }).then((response) => {
                console.log(response)
                
                if(response.data["Status"] === "User Created"){
                    this.setState({
                        user_found: true,
                        got_response: true,
                        access_token: response.data["access_token"],
                    });
                    sessionStorage.clear()
                    sessionStorage.setItem('access_token', this.state.access_token)
                }
                else if(response.data["Status"] === "User not in IMG"){
                    this.setState({
                        ...this.state,
                        user_found: false,
                        got_response: true
                    })
                }
                else if(response.data["Status"] === "User Exists"){
                    this.setState({
                        user_found: true,
                        got_response: true,
                        access_token: response.data["access_token"]
                    })
                    sessionStorage.clear()
                    sessionStorage.setItem('access_token', this.state.access_token)
                }
                console.log(this.state)
            })
        }
    }

    render(){
        let access_token = this.state.user_found ? this.state.access_token : sessionStorage.getItem('access_token')
        if(this.state.got_response || !(sessionStorage.length == 0)){
            if(this.state.user_found || !(sessionStorage.length == 0)){
                return(<MyPage access_token = {access_token}/>)
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