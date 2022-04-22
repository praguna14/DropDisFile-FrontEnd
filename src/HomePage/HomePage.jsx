import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../_actions';
import { Row, Col, Button } from 'react-bootstrap';


class HomePage extends React.Component {
    componentDidMount() {
        this.props.getUsers();
    }

    render() {
        const files = [
            {
                name: 'file1',
                size: '1.2 MB',
                type: 'text/plain'
            },
            {
                name: 'file2',
                size: '1.2 MB',
                type: 'text/plain'
            },
        ]

        const { user, users } = this.props;
        return (
            <div className="container">
                    <div className="row">
                        <div className="col">
                            <h1>Hi {user.firstName}!</h1>
                            <p>Below is a list of files available to you:</p>
                            <ul>
                                {files.map(file => <li key={file.name}>
                                    <Link to={`/files/${file.name}`}>{file.name}</Link>
                                </li>
                                )}
                            </ul>
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