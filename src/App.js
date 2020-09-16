import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Admin from './pages/admin';

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Switch>
            <Route path="/adminpage">
              <Admin />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

function Home() {
  return <h2>Home</h2>;
}

export default App;
