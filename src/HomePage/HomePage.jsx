import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../_actions';
import { Row, Col, Button } from 'react-bootstrap';


class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedFile: null,
            serverIndex: 0,
            files: [],
            servers: []
        };

        axios.get('http://localhost:8081/servers')
            .then(response => {
                this.setState({ servers: response.data,
                                serverIndex: response.data[0] });
                // const serverIndex = this.state.servers[Math.floor(Math.random() * this.state.servers.length)];
                console.log('Server Index: ', this.state.serverIndex);
                let query = {
                    username: this.props.user.username,
                }
                axios.get('http://localhost:' + this.state.serverIndex + '/files?username=' + query.username)
                    .then(response => {
                        this.setState({ files: response.data });
                    })
                    .catch(error => {
                        console.log('Error: ', error);
                    });
            })
            .catch(error => {
                console.log('Error: ', error);
            });
    }

    handleSeverChange = (event) => {
        this.setState({
            serverIndex: event.target.value
        });
    }

    handleChange = (event) => {
        this.setState({
            selectedFile: event.target.value
        });
    }

    render() {
        const { user, users } = this.props;
        return (
            <div className="container">
                    <div className="row">
                        <div className="col">
                            <h1>Hi {user.firstName}!</h1>
                            <p>Choose a server</p>
                            <select onChange={this.handleSeverChange}>
                                {console.log('Server Index: ', this.state.serverIndex)}
                                {this.state.servers.map((server, index) =>
                                    <option key={index} value={server}>{server}</option>
                                )}
                            </select>
                            <p>Below is a list of files available to you:</p>
                            {console.log('Files yaha: ', this.state.files)}
                            <div onChange={this.handleChange}>
                                {
                                    this.state.files.map((file) => (
                                        <div>
                                            <input type="radio" key={file.fileName} value={file.fileName} name="file"/>
                                            <label> { file.fileName } </label>
                                        </div>
                                    ))
                                }
                                {console.log('Selected File: ', this.state.selectedFile)}
                                {/* {this.state.files.map(file => <li key={file.fileName}>
                                    {file.fileName}
                                </li>
                                )} */}
                            </div>
                        </div>
                    </div>
                    <Row className="mx-0">
                        <Button as={Col} variant="primary">Upload</Button>{'  '}
                        <Button as={Col} variant="info" className="mx-2">Download</Button>{'  '}
                        <Button as={Col} variant="success">Delete</Button>
                    </Row>

                    <br />
                    <div className='row'>
                        <p>
                            <Link to="/login">Logout</Link>
                        </p>
                    </div>
                </div>
        );
    }
}

function mapState(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return { user, users };
}

const actionCreators = {
    getUsers: userActions.getAll
}

const connectedHomePage = connect(mapState, actionCreators)(HomePage);
export { connectedHomePage as HomePage };