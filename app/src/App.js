import React, { Component } from "react";
import { DrizzleProvider } from "drizzle-react";
import { LoadingContainer } from "drizzle-react-components";

import "./App.css";

import drizzleOptions from "./drizzleOptions";

// check this out -> https://truffleframework.com/docs/drizzle/react/react-integration

class App extends Component {
  render() {
    return (
      <DrizzleProvider options={drizzleOptions}>
        <LoadingContainer>
          <div>
            Here goes the app
          </div>
        </LoadingContainer>
      </DrizzleProvider>
    );
  }
}

export default App;
