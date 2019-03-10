import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PostsList from "../../containers/postsList";

import ipfs from '../../ipfs';

class Blog extends Component {
    constructor(props, context) {
        super(props);

        this.state = {
            newPostBody: '',
            newPostHash: '',
            updatePastEvents: false
        };

        this.contracts = context.drizzle.contracts;

        this.handleNewPostBodyChange = this.handleNewPostBodyChange.bind(this);
        this.handleNewPost = this.handleNewPost.bind(this);
        this.handleRemovePost = this.handleRemovePost.bind(this);
        this.handlePastEventsUpdated = this.handlePastEventsUpdated.bind(this);
    }

    handleNewPostBodyChange(event) {
        this.setState({
            newPostBody: event.target.value
        });
    }

    handleNewPost = async (event) => {
        event.preventDefault();
        if (!this.props.drizzleStatus.initialized) {
            return;
        }

        await ipfs.add(Buffer.from(this.state.newPostBody.replace(/(?:\r\n|\r|\n)/g, "<br />"), 'utf-8'), (err, ipfsHash) => {
            this.setState({
                newPostHash: ipfsHash[0].hash
            });

            const contract = this.contracts.Blog;

            contract.methods.newPost(ipfsHash[0].hash).send().then(res => {
                this.setState({
                    updatePastEvents: true
                });
            });
        });

    };

    handleRemovePost = async (hash) => {
        if (!this.props.drizzleStatus.initialized) {
            return;
        }

        const contract = this.contracts.Blog;

        contract.methods.removePost(hash).send().then(res => {
            this.setState({
                updatePastEvents: true
            });
        });
    };

    handlePastEventsUpdated() {
        this.setState({
            updatePastEvents: false
        });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <PostsList
                    ipfs={ipfs}
                        updatePastEvents={this.state.updatePastEvents}
                        handlePastEventsUpdated={this.handlePastEventsUpdated}
                        handleRemovePost={this.handleRemovePost}
                    />
                </div>
                <div className="row">
                    <form onSubmit={this.handleNewPost}>
                        <div class="form-group">
                            <label><h2>Post's Body:</h2></label>
                            <textarea className="form-control" onChange={this.handleNewPostBodyChange} value={this.state.newPostBody} />
                        </div>
                        <div class="form-group">
                            <label><h2>Post's IPFS Hash:</h2></label>
                            <input className="form-control" type="text" value={this.state.newPostHash} disabled />
                        </div>
                        <button className="btn btn-primary" type="submit">Publish</button>
                    </form>
                </div>
            </div>
        )
    }
}

Blog.contextTypes = {
    drizzle: PropTypes.object
}


export default Blog;