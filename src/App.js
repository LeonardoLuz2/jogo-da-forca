import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Admin from './pages/admin';
import Home from './pages/home';

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

export default App;
