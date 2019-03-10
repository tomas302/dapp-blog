import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PostsList extends Component {
    constructor(props, context) {
        super(props);

        this.state = {
            posts: [],
            postsTitles: [],
            postsContent: [],
            postSelected: -1
        };

        this.contracts = context.drizzle.contracts;
        this.web3 = context.drizzle.web3;

        this.getPastEvents = this.getPastEvents.bind(this);
        this.handlePostClick = this.handlePostClick.bind(this);

        this.getPastEvents();
    }

    getPastEvents() {
        if (!this.props.drizzleStatus.initialized) {
            return;
        }
        const contract = this.contracts.Blog;
        const contractWeb3 = new this.web3.eth.Contract(contract.abi, contract.address);

        contractWeb3.getPastEvents('postPublished', { fromBlock: 0 }).then(async (res) => {
            let posts = [];
            let postsTitles = [];
            let postsContent = [];
            // reversed order to show the newest first
            for (let i = res.length - 1; i >= 0; i--) {
                let hash = res[i].returnValues._ipfsHash;
                posts.push(hash);

                // we retrieve the content of the IPFS hash and access the content
                let content = ("" + (await this.props.ipfs.get(hash))[0].content);

                var titleHtml = content.split("<br />")[0];
                var div = document.createElement("div");
                div.innerHTML = titleHtml;
                var title = div.textContent || div.innerText || "";

                postsTitles.push(title);
                postsContent.push(content);
            }

            this.setState({
                posts: posts,
                postsTitles: postsTitles,
                postsContent: postsContent
            });
        });
    }

    handlePostClick(index) {
        this.setState({
            postSelected: index
        });
    }

    render() {
        let posts = [];
        for (let i = 0; i < this.state.posts.length; i++) {
            posts.push(<li key={i}>
                <button onClick={() => this.handlePostClick(i)}>
                    {this.state.postsTitles[i]}
                </button>
                <a href={"https://ipfs.infura.io/ipfs/" + this.state.posts[i] } target="_blank" rel="noopener noreferrer">
                    See Original
                </a>
            </li>);
        }
        if (this.state.postSelected !== -1) {
            return (
                <div>
                    <button onClick={() => this.handlePostClick(-1)}>Back</button>
                    <div dangerouslySetInnerHTML={{ __html: this.state.postsContent[this.state.postSelected] }} />
                </div>
            );
        }
        return (
            <ul>
                {posts}
            </ul>
        )
    }
}

PostsList.contextTypes = {
    drizzle: PropTypes.object
}

export default PostsList;