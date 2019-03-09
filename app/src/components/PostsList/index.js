import React, { Component } from 'react';

class PostsList extends Component {
    render() {
        let posts = [];
        for (let i = 0; i < 3; i++) {
            posts.push(<li key={i}>Post {i}</li>);
        }
        return (
            <ul>
                {posts}
            </ul>
        )
    }
}

export default PostsList;