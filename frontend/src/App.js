import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import './App.css';
import { useState } from 'react';

function App() {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [signedIn, setSignedIn] = useState(false)
  

  const responseError = (errResponse) => {
    console.log(errResponse);
  }

  const responseGoogle = (response) => {
    console.log(response);
    const { code } = response;
    axios.post('/api/create-tokens', { code })
    .then(response => {
      console.log(response.data);
      setSignedIn(true);
    })
    .catch(error => {
      console.log(error.message);
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    axios.post('/api/create-event', { summary, description, location, startDateTime, endDateTime })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.log(error.message);
    })
  }

  return (
    <div>
      <div className="App">
        <h1>Google Calendar API</h1>  
        <div>
          { 
            !signedIn ? 
            <GoogleLogin 
              clientId='1047388141440-qtrqho9465qrsn4t7igej0umdcq0dug8.apps.googleusercontent.com'
              buttonText='Sign in & Authorize Calendar'
              onSuccess={responseGoogle}
              onFailure={responseError}
              cookiePolicy={'single_host_origin'}
              //This is import to get refresh token
              responseType='code'
              accessType='offline'
              scope='openid email profile https://www.googleapis.com/auth/calendar'
            /> 
            :
            <div>
              <form onSubmit={handleSubmit} style={{marginTop:30}}>
                <label htmlFor='summary'>Summary</label>
                <br />
                <input type="text" id="summary" value={summary} onChange={e => setSummary(e.target.value)}/>
                <br />
                <label htmlFor='description'>Description</label>
                <br />
                <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)}/>
                <br />
                <label htmlFor='location'>Location</label>
                <br />
                <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)}/>
                <br />
                <label htmlFor='startDateTime'>Start Date</label>
                <br />
                <input type="datetime-local" id="description" value={startDateTime} onChange={e => setStartDateTime(e.target.value)}/>
                <br />
                <label htmlFor='endDateTime'>End Date</label>
                <br />
                <input type="datetime-local" id="endDateTime" value={endDateTime} onChange={e => setEndDateTime(e.target.value)}/>
                <br />
                <button type="submit" style={{marginTop: 20}}>Create Event</button>
              </form>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
