import React, { Component } from 'react';
import { API_BASE_URL, REQUEST_HEADERS } from "../constants";
import axios from "axios";
import { Link } from "react-router-dom";
import { WikiLabels } from "../components/Wiki";
import { Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookmark} from "@fortawesome/free-solid-svg-icons";

class UserEnrolledTopicList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topics: [],
            isLoading: false,
            input: ''
        };
        this.loadUserEnrolledTopics = this.loadUserEnrolledTopics.bind(this);

    }

    loadUserEnrolledTopics() {
        const url = API_BASE_URL + `/topics/enrolled/${this.props.currentUser.id}`;
        axios.get(url, REQUEST_HEADERS).then(res => {

            this.setState({
                topics: res.data,
                isLoading: false
            })
        }).catch(err => {
            this.setState({ isLoading: false })
        });
    }

    componentDidMount() {
        this.loadUserEnrolledTopics()
    }

    render() {

        const topics = this.state.topics;

        const topicsView = topics.map((topic, topicIndex) => {
            return (
                <tr key={topicIndex}>
                    <td>{topicIndex+1}</td>
                    <td>
                        <img src={topic.imageUrl} alt="" style={{ width: '150px' }}/>
                    </td>
                    <td>{topic.title}</td>
                    <td>{topic.description}</td>
                    <td>
                        <WikiLabels wikis={topic.wikiData} />
                    </td>
                    <td>{topic.contentList.length}</td>
                    <td><Link className="btn btn-sm btn-outline-info" to={`/topic/view/${topic.id}`}>Details</Link></td>
                </tr>
            )
        });

        return (
            <React.Fragment>
                {/*<PageHeader title="Enrolled Topic List" />*/}

                <div className="row mt-5">
                    <div className="col-md-12 text-center">
                        <Link to="/explore" className="btn btn-outline-info">
                            <FontAwesomeIcon icon={faBookmark} /> Check New Courses
                        </Link>
                    </div>
                </div>

                <div className="container">
                    <div className="mt-5 mb-5">
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Short Description</th>
                                <th>Wikidata</th>
                                <th>#Learning Path</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                                {topicsView}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </React.Fragment>

        )
    }
}

export default UserEnrolledTopicList;