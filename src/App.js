import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'react-bootstrap';
import { authContext } from './AzureAd';

class App extends Component {
  render() {

    let userName = undefined;

    let user = authContext.getCachedUser();
    if (user) {
      console.log("authenticated user: ", user);
      userName = user.profile.name;
    } else {
      console.log("not authenticated");

      // force login...
      //authContext.login();
    }

    let login = () => {
      authContext.login();
    };

    let logout = () => {
      authContext.logOut();

      // tell server to logout.
      // required if server cache the login status in session.
      // not required if server clear the login status after request is completed.
      fetch("your logout page...", {
        method: 'POST'
      });
    };

    let fetchCall = () => {
      console.log('request fetch api call...');

      // Acquire token for Files resource.
      authContext.acquireToken(authContext.config.clientId, function(error, token) {
        console.log('api callback...');

        // Handle ADAL Errors.
        if (error) {
          alert('ADAL error occurred: ' + error);
          return;
        }

        if (!token) {
          alert('No token!');
          //return;
        }
        console.log('token:', token);

        // Standard headers
        let myHeader = new Headers({
            'Accept': 'application/json;charset=UTF-8',
            'Content-Type': 'application/json;charset=UTF-8'
        });

        // Add AAD token to header
        if (token) {
          myHeader.append('Authorization', 'Bearer ' + token);
          console.log('add auth token to header');
        }

        let url = 'your api url...';
        fetch(url, {
          method: 'GET',
          headers: myHeader
        }).then((response) => {
          console.log('response.status', response.status);
          console.log('response.body', response.body);
          response.json().then((json) => {
            console.log('JSON', json);
          });
        }).catch(function(err) {
          console.log('Fetch Error: ', err);
        });
      });

      console.log('leave fetch api call...');
    };

    let content = undefined;
    if (userName) {
      content = (
        <div>
          <div>{userName}</div>
          <Button bsStyle="default" onClick={logout}>Logout</Button>
          <Button bsStyle="primary" onClick={fetchCall}>Fetch Call</Button>
        </div>
      );
    } else {
      content = (
        <div>
          <Button bsStyle="primary" onClick={login}>Login</Button>
        </div>
      );
    }

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {content}
      </div>
    );
  }
}

export default App;
