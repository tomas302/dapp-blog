import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PostsList from "../../containers/postsList";

import ipfs from '../../ipfs';

class Blog extends Component {
    constructor(props, context) {
        super(props);

        this.state = {
            newPostBody: '',
            newPostHash: ''
        };

        this.contracts = context.drizzle.contracts;

        this.handleNewPost = this.handleNewPost.bind(this);
        this.handleRemovePost = this.handleRemovePost.bind(this);
        this.handleNewPostBodyChange = this.handleNewPostBodyChange.bind(this);
    }

    handleNewPost = async(event) => {
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
                // Update UI
            });
        });

    };

    handleRemovePost = async (hash) => {
        if (!this.props.drizzleStatus.initialized) {
            return;
        }

        const contract = this.contracts.Blog;

        contract.methods.removePost(hash).send().then(res => {
            // Update UI
        });
    };
    
    handleNewPostBodyChange(event) {
        this.setState({
            newPostBody: event.target.value
        });
    }

    render() {
        return (
            <div>
                <PostsList
                    ipfs={ipfs}
                    handleRemovePost={this.handleRemovePost}
                />
                <form onSubmit={this.handleNewPost}>
                    <label>
                        <h2>Post's Body:</h2>
                        <textarea onChange={this.handleNewPostBodyChange} value={this.state.newPostBody} />
                    </label>
                    <label>
                        <h2>Post's IPFS Hash:</h2>
                        <input type="text" value={this.state.newPostHash} disabled />
                    </label>
                    <button type="submit">Publish</button>
                </form>
            </div>
        )
    }
}

Blog.contextTypes = {
    drizzle: PropTypes.object
}
  

export default Blog;