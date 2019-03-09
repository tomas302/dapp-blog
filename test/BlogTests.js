const Blog = artifacts.require("./Blog.sol");

contract("Blog", accounts => {
    it("...should save the deploying address as the owner of the blog", async () => {
        // Wait for the contract to be deployed
        const blog = await Blog.deployed();

        const owner = await blog.owner();
        
        assert.equal(owner, accounts[0],
            "The account that deployed the contract isn't the owner");
    });
});