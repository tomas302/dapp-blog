import Blog from "./contracts/Blog.json";

const options = {
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:9545",
    },
  },
  contracts: [ Blog ],
  events: {
    Blog: ["postPublished"],
  },
  polls: {
    accounts: 1500,
  },
};

export default options;
