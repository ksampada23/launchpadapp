import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import image from './img/background0.png';
import image1 from './img/background2.png';
import Calendar from 'react-calendar';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import DateTimePicker from 'react-datetime-picker';

function App() {
  const [backgroundImage, setBackgroundImage] = useState(false);
  const [view, setView] = useState(false);
  const [hidden, setDisplay] = useState(false);

  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

  const [ eventName, setEventName ] = useState("");
  const [ eventDescription, setEventDescription ] = useState("");

  const session = useSession(); // tokens, when session exists we have a user
  const supabase = useSupabaseClient(); // talk to supabase!
  const { isLoading } = useSessionContext();

  

  if(isLoading) {
    return <></>
  }

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      }
    });
    if(error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function createCalendarEvent() {
    console.log("Creating calendar event");
    const event = {
      'summary': eventName,
      'description': eventDescription,
      'start': {
        'dateTime': start.toISOString(), // Date.toISOString() ->
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone // America/Los_Angeles
      },
      'end': {
        'dateTime': end.toISOString(), // Date.toISOString() ->
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone // America/Los_Angeles
      }
    }
    await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        'Authorization':'Bearer ' + session.provider_token // Access token for google
      },
      body: JSON.stringify(event)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      alert("Event created, check your Google Calendar!");
    });
  }

  console.log(session);
  console.log(start);
  console.log(end);
  console.log(eventName);
  console.log(eventDescription);


  return (
    <>
  
      <div className="background">
    
        <img
          style={{
            backgroundSize: 'contain',
            minHeight: '100vh',
            maxWidth: '185vh',
          }}
          src={backgroundImage ? image1 : image}
          alt=""
        />

        {!hidden && (
        <h1 className = "title">FUTURE TITLE NAME</h1>
        )}
        
        {!hidden && view && (
        <Calendar className = "calendar" ></Calendar>

        )}

        {!hidden && (
          <button
            className="input"
            onClick={() => {
              setBackgroundImage(true);
              setDisplay(true);
            }}
          >
            INPUT
          </button>
        )}

        {!hidden && (
          <button className="switch" onClick={() => {
            setView(!view);
          }}>
            SWITCHVIEW
          </button>
        )}


        {hidden && (
          <button
            className="exit"
            onClick={() => {
              setBackgroundImage(false);
              setDisplay(false);
            }}
          >
            X
          </button>
        )}

        {hidden && (
          <button className="confirm" onClick={() => {}}>
            CONFIRM
          </button>
        )}
        
        {hidden && (
        <div className = "events">
          {session ?
            <>
              <h2 className = "intro">Hello, {session.user.email} !</h2>
              <p className = "text" >Please enter your reminder's start time</p>
              <DateTimePicker onChange={setStart} value={start} />
              <p className = "text" >Please enter your reminder's end time</p>
              <DateTimePicker onChange={setEnd} value={end} />
              <p className = "text" >Please enter your reminder's name</p>
              <input type="text" onChange={(e) => setEventName(e.target.value)} />
              <p className = "text" >Please enter your reminder's link</p>
              <input type="text" onChange={(e) => setEventDescription(e.target.value)} />
              
              <button className = "createEvent" onClick={() => createCalendarEvent()}>Create Calendar Event</button>
         
              <button className = "signOut" onClick={() => signOut()}>Sign Out</button>

            
            </>
            :
            <>
              <button onClick={() => googleSignIn()}>Sign In With Google</button>
            </>
          }
        </div>
        )}

      </div>
       
    </>
  );
}

export default App;
