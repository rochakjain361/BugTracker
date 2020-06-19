import React, {Component} from "react";
import logo from '../../mediafiles/LogoSmall.png'
import { Container, Header, Segment } from "semantic-ui-react";
import './styles.css'

class newProject extends Component{
    constructor(props){
        super(props)
        this.state = { 
            name: '',
            wiki: '',
            status: '',
            creator: [],
            members: [],
        }
    }

    handleSubmit = event => {
        event.preventDefault();


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
                    <Header as="h2">
                        ADD NEW PROJECT
                    </Header>
                    </div>
                    </Segment>
                </Container>
            </div>
        )
    }
}

export default newProject;