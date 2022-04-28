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

    handleDelete = () => {
        const query = {
            username: this.props.user.username,
            filename: this.state.selectedFile
        }
        axios.delete('http://localhost:' + this.state.serverIndex + '/delete?username=' + query.username + '&fileName=' + query.filename)
            .then(response => {
                console.log('Delete Response: ', response);
                // let files = this.state.files;
                // files.splice(files.indexOf(query.filename), 1);
                // this.setState({ files: files });
            })
            .catch(error => {
                console.log('Error: ', error);
            });
    }

    handleDownload = () => {
        const element = document.createElement('a');
        var fileSelected = this.state.files.filter(file => file.fileName === this.state.selectedFile);
        console.log('File Selected: ', fileSelected[0]);
        const file = new Blob([fileSelected[0].content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = fileSelected[0].fileName;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    hanldeUpload = () => {
        var fileName = document.getElementById('fileName').value;
        var fileContent = document.getElementById('fileContent').value;
        console.log('Naya file: ', fileName, fileContent);
        const query = {
            username: this.props.user.username,
            fileName: fileName,
            content: fileContent
        }
        axios.post('http://localhost:' + this.state.serverIndex + '/file', query)
            .then(response => {
                console.log('Upload Response: ', response);
                // this.setState({ files: this.state.files, fileName: fileName, fileContent: fileContent });
                // this.setState({ selectedFile: fileName });
                axios.get('http://localhost:' + this.state.serverIndex + '/files?username=' + query.username)
                    .then(response => {
                        this.setState({ files: response.data });
                    })
                    .catch(error => {
                        console.log('Error: ', error);
                    });
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
                            </div>
                        </div>
                    </div>
                    <Row className="mx-0">
                        <Button as={Col} variant="info" className="mx-2" onClick={this.handleDownload}>Download</Button>{'  '}
                        <Button as={Col} variant="success" onClick={this.handleDelete}>Delete</Button>
                    </Row>

                    <br/>
                    <div style={{ borderTop: "2px solid #000 ", marginLeft: 20, marginRight: 20 }}></div>
                    <br/>
                    To upload a file, please enter the following details: <br/> <br/>
                    <Row className="mx-0">
                        <input type="text" placeholder="Enter file name" id='fileName'/> <br/> <br/> 
                        <input type="text" placeholder="Enter file content" id='fileContent' /> <br/> <br/>
                        <Button as={Col} variant="primary" onClick={this.hanldeUpload}>Upload</Button>
                    </Row>
                    <br/>
                    <div style={{ borderTop: "2px solid #000 ", marginLeft: 20, marginRight: 20 }}></div>
                    <br/>
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