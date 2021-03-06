pragma solidity ^0.5.0;

contract Blog {

    // Variables

    // This is the address of the blog owner
    address public owner;
    // String that contains the IPFS hash that points to the blog folder in IPFS
    string public homeIpfsHash;
    // Array of strings that contains the IPFS hashes of all the posts published in the blog
    string[] posts;

    // Events
    event homeChanged(string _ipfsHash);
    event postPublished(string _ipfsHash, uint blockNumber);
    event postRemoved(string _ipfsHash, uint blockNumber);

    // Modifiers

    modifier onlyOwner() {
        // Here we check that the account sending the transaction is the owner of the blog, if not we return an error message and stop execution
        require(msg.sender == owner, "You must be the blog owner to perform this action.");
        // This executes the rest of the code that the modifier wraps
        _;
    }

    // This function get called when the contract is created
    constructor() public {
        // Here we save as the blog owner the address that created the contract
        owner = msg.sender;
    }

    // this fallback is the function that is called when no other function matches the given function identifier
    // here we'll make use of it to accept donations to our blog
    function () external payable {
        
    }

    function setHomePage(string memory _ipfsHash) public onlyOwner {
        homeIpfsHash = _ipfsHash;
        emit homeChanged(_ipfsHash);
    }

    function getPostIndex(string memory _ipfsHash) internal view returns (bool, uint) {
        uint index = 0;
        bool found = false;
        for (uint i = 0; i < posts.length; i++) {
            // If the hash of the hashes it's the same, then we return the index
            if (keccak256(abi.encodePacked(posts[i])) == keccak256(abi.encodePacked(_ipfsHash))) {
                index = i;
                found = true;
                break;
            }
        }
        return (found, index);
    }

    function newPost(string memory _ipfsHash) public onlyOwner {
        (bool found, ) = getPostIndex(_ipfsHash);
        require(!found, "Post already exists, if you want to publish it again, remove it first");
        posts.push(_ipfsHash);
        emit postPublished(_ipfsHash, block.number);
    }

    function removePost(string memory _ipfsHash) public onlyOwner returns (string memory) {
        (bool found, uint index) = getPostIndex(_ipfsHash);
        require(found, "Post doesn't exist");

        // Then we remove it and shift every post after it to the left
        string memory postHashToRemove = posts[index];
        for (uint i = index; i < posts.length - 1; i++) {
            posts[index] = posts[index + 1];
        }
        delete posts[posts.length - 1];
        posts.length--;
        emit postRemoved(postHashToRemove, block.number);
        return postHashToRemove;
    }

    function withdrawDonations() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }
}