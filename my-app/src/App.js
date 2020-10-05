import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from '@material-ui/core';
import FileChecker from './components/FileChecker';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          This tool checks for records with correct and incorrect number of fields.
        </p>
        <FileChecker />
      </header>
    </div>
  );
}

export default App;
