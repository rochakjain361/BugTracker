import React, { Component } from 'react'
//import { Grid, Placeholder, Segment } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { getCurrentUser } from '../../actions/getCurrentUserProfile'
import axios from 'axios'

class MyPage extends Component{
  constructor(props) {
    super(props);

    this.state = {
       got_response: false,
       data: []    
    };
  }

  componentDidMount() {
    axios({
      method:'post',
      url: 'http://127.0.0.1:8000/appusers/my_page/',
      headers:{
        'Content-Type':'application/json',
      },
      withCredentials: true,
      data:{
        access_token: this.props.access_token
      }
    }).then((response) => {
      console.log(response)
    })
  }

  render(){
    return(
      <div>
        You are on my page.
      </div>
    )
  }
}

export default MyPage;
