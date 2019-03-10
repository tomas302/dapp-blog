import React, { Component } from "react";
import { DrizzleProvider } from "drizzle-react";
import { LoadingContainer } from "drizzle-react-components";
import { BrowserRouter, Route } from 'react-router-dom';

import "./App.css";

import Blog from "./containers/blog";

import drizzleOptions from "./drizzleOptions";

// check this out -> https://truffleframework.com/docs/drizzle/react/react-integration

class App extends Component {
  render() {
    return (
      <DrizzleProvider options={drizzleOptions}>
        <LoadingContainer>
          <BrowserRouter>
            <Route path="/" component={Blog}/>
          </BrowserRouter>
        </LoadingContainer>
      </DrizzleProvider>
    );
  }
}

export default App;
