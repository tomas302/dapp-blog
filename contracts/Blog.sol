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
    event postPublished(string _ipfsHash);

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

    function setOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    function setHomePage(string memory _ipfsHash) public onlyOwner {
        homeIpfsHash = _ipfsHash;
    }

    function newPost(string memory _ipfsHash) public onlyOwner {
        posts.push(_ipfsHash);
        emit postPublished(_ipfsHash);
    }

    function removePost(uint index) public onlyOwner returns (string memory) {
        require(index < posts.length && index > 0, "Index out of bounds");
        string memory element = posts[index];
        for (uint i = index; i < posts.length - 1; i++) {
            posts[index] = posts[index + 1];
        }
        delete posts[posts.length - 1];
        posts.length--;
        return element;
    }

    function withdrawDonations() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }
}