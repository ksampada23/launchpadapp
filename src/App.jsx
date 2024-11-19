import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import image from './img/background0.png';
import image1 from './img/background3.png';
import me from './img/ME.png';
import Calendar from 'react-calendar';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import DateTimePicker from 'react-datetime-picker';


function App() {
  const [backgroundImage, setBackgroundImage] = useState(false);
  const [view, setView] = useState(false);
  const [hidden, setDisplay] = useState(false);
  const [about, setAbout] = useState(false);
  const [resources, setResources] = useState(false);
  const [events, setEvents] = useState([]);


  const date = new Date();
  const CurrentDate = date.getMonth() + 1 +"/" + date.getDate() + "/" + date.getFullYear();

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM'; 
  hours = hours % 12; 
  hours = hours ? hours : 12; 
  minutes = minutes < 10 ? '0' + minutes : minutes; 
  const Time = hours + ":" + minutes + " " + ampm;
  
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());

  const [ eventName, setEventName ] = useState("");
  const [ eventDescription, setEventDescription ] = useState("");
  const [ displayLink, setDisplayLink ] = useState(false);
  

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
          className = "mainIMG"
          style={{
            backgroundSize: 'contain',
            minHeight: '100vh',
            maxWidth: '185vh',
          }}
          src={backgroundImage ? image1 : image}
          alt=""
        />
        
        {!hidden && !about && !resources &&(
          <div className="displayedLink">
            {displayLink && (
            eventDescription.includes("youtube.com") || eventDescription.includes("youtu.be") ? (
          <>
          <iframe
            width="800"
            height="452"
            src={
              eventDescription.includes("watch?v=")
                ? eventDescription.replace("watch?v=", "embed/")
                : eventDescription.replace("youtu.be/", "www.youtube.com/embed/")
            }
            title="YouTube Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onError={() => alert("Embedding is restricted for this video. Opening in YouTube.")}
          ></iframe>
          <p>
            If the video doesn't play, click{" "}
            <a href={eventDescription} target="_blank" rel="noopener noreferrer">
              here to view on YouTube.
            </a>
          </p>
        </>
        ) : (
        <p>{eventDescription}</p>
        )
        )}
        </div>
      )}


        {!hidden && !about && !resources && (
        <button id="about" className = "styleButton"
        onClick={() => {
          setBackgroundImage(true);
          setAbout(true);
        }} >ABOUT</button>
        )}

        {!hidden && !about && !resources && (
        <button id="resources" className = "styleButton"
        onClick={() => {
          setBackgroundImage(true);
          setResources(true);
        }}> RESOURCES</button>
        )}

        {!hidden && !about && !resources && (
        <h1 className = "title">MINDFUL MOMENTS</h1>
        )}
        
        {!hidden && view && !about && !resources && (
        <Calendar className="calendar"  ></Calendar>
        )}

        {!hidden && !view && !about && !resources && (
        <div id = "time">
          <h1 >Current Date: </h1>
          <h2>{CurrentDate}</h2>
          <h1>Time: </h1>
          <h2>{Time}</h2>

        </div>
        )}

        {!hidden && !about && !resources && (
          <button
            id="input"
            className = "styleButton"
            onClick={() => {
              setBackgroundImage(true);
              setDisplay(true);
            }}
          >
            INPUT
          </button>
        )}

        {!hidden && !about && !resources && (
          <button id="switch" className = "styleButton" 
          onClick={() => {
            setView(!view);
          }}>
            SWITCH VIEW
          </button>
        )}


        {(hidden || about || resources) && (
          <button
            id="exit" 
            className = "styleButton"
            onClick={() => {
              setBackgroundImage(false);
              setDisplay(false);
              setAbout(false);
              setResources(false);
            }}
          >
            X
          </button>
        )}

        {hidden && (
          <button id="confirm" className = "styleButton" onClick={() => createCalendarEvent()}>
            CONFIRM
          </button>
        )}
        
        {hidden && (
        <div className = "events">
          {session ?
            <>
              <h2 className = "intro" >Hello, {session.user.email} !</h2>
              <div className = "textWrapper">
                <div className = "chooseTimings">
                  <div className = "starting">
                    <h1 className = "text" >Please enter your reminder's start time</h1>
                    <p className ="times">{start.toString()}</p>
                    <DateTimePicker className="datepicker" onChange={setStart} value={start} />
                  </div>
                  <div className = "ending">
                    <h1 className = "text" >Please enter your reminder's end time</h1>
                    <p className ="times">{end.toString()}</p>
                    <DateTimePicker onChange={setEnd} value={end} />
                  </div>
                </div>
                  
                <div className ="inputText">
                  <h1 className="reminderName">Please enter your reminder's name</h1>
                  <input className="reminderName" type="text" id = "inputName" onChange={(e) => setEventName(e.target.value)} />
                  <h1 className="reminderLink" >Please enter your reminder's link</h1>
                  <input className="reminderLink" id ="inputLink" onChange={(e) => {setEventDescription(e.target.value); setDisplayLink(true)}} />
                </div>
              </div>
              
              <button id="signOut" className = "styleButton" onClick={() => signOut()}>Sign Out</button>

            </>
            :
            <>
              <button className = "styleButton" onClick={() => googleSignIn()}>Sign In With Google</button>
            </>
          }
        </div>
        )}

        {about && (
          <div className = "about">
            <h1 id="titleABOUT">A LITTLE BIT ABOUT ME...</h1>
            
            
            <h1 id="name" >Kallakuru Saanvi Sampada</h1>
           
            <img id="me" width="300" height="420" src= {me}></img>

            <div className="extraTEXT">
            
              <h2 id="description" >
                <i>
                Introduction
                </i>
              </h2>
              <p>
                Hi everyone! My name is Saanvi Sampada and I am currently a freshman at Purdue University majoring in Computer Science along with Mathematics. 
                I am a home grown Hoosier, born and raised in Indiana, coding has been a huge passion of mine throughout my life and this is one of my first 
                personal projects!
              </p>

              <a id="links" href='https://www.linkedin.com/in/kallakuru-sampada-71280a230/'>Feel free to connect with me on LinkedIn!</a>

              <p></p>
              <a id="links" href='https://github.com/ksampada23'>Check out my other projects on GitHub!</a>
              <p></p>
              <h2 id="app" >
                <i>
                Description
                </i>
              </h2>
              <p>
                For this application I utlized React with the languages of HTML, Javascript, and CSS along with VS Code. I also used Supabase with the Google 
                API to connect the calendar and make events.
               
              </p>
              <p>Acknowledgements</p>
              <p> &rarr; <a href="https://www.youtube.com/watch?app=desktop&v=tgcCl52EN84&ab_channel=CooperCodes">Video Tutorial of Google API Implementation</a></p>
              <p> &rarr; <a href="https://www.npmjs.com/package/react-calendar">React Calendar</a></p>
            </div>

            <div className="inspoTEXT">
              <h2>
                <i>
                  Inspiration
                </i>
              </h2>
              <p>
              Currently, dementia affects 55 million people worldwide and over 60% of these people live in low to middle-income class families, meaning they are unable 
              to afford 24-hour personal caregivers. Growing up both my parents worked in skilled nursing home facilities which specialize in long-term care, witnessing 
              first-hand the difficulties faced by patients who are forced to live on their own due to financial constraints. I wanted to help those suffering from early 
              and middle-stage dementia in this situation through innovating an app where loved ones can implement daily reminders along with videos  These reminders can 
              range from morning activities such as eating breakfast and taking showers to completing cognitive puzzles and taking important medicines.  By utilizing 
              this app, patients can hopefully prolong living independently with their loved ones. 
              </p>

            </div>

          </div>
          
        )}

        {resources && (
          <div className="resources">
            <h1 id="titleRESOURCES">RESOURCES</h1> 
            <h2 id="videoIntro">
              <i>
                Helpful Videos
              </i>
            </h2>
            <iframe id ="video"
            width="400" height="226" 
            src="https://www.youtube.com/embed/QzkcSyae_nU" 
            title="Six Tips to Help Manage Behavior Changes in Alzheimer&#39;s Disease" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
            </iframe>

            <iframe id="video1"
            width="400" height="226" 
            src="https://www.youtube.com/embed/9Y6LCpL8HUU" 
            title="Purposeful activities for dementia: Alzheimer&#39;s Australia VIC" f
            rameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" 
            allowfullscreen>
            </iframe>

            <div className="websites">

              <h2 id="websitesIntro">
                <i>
                Helpful Websites
                </i>
              </h2>

              
              <p> <a id="AARP" href="https://www.aarp.org/caregiving/dementia-caregiving-guide/?cmp=KNC-DMP-CG-Caregiving-Dementia-Care-Nonbrand-62943-GOOG-Dementia-Caregiving-Guide-Exact-Exact-NonBrand&gad_source=1&gclid=Cj0KCQiAouG5BhDBARIsAOc08RRHBD-a4PLns9X1w7NGzkDYeiGeNBcgxL4qpEOCPKR4AHM09jBAXoAaAm29EALw_wcB&gclsrc=aw.ds">
              AARP Dementia Caregiving Guide
              </a> </p>

              <p id ="websiteText">
              This guide was created by the AARP, American Association of Retired Persons, and works to help those who know someone or are taking care of 
              someone who is suffering from dementia. It features a variety of resources including additional articles, videos, and available strategies  
              for caregivers. 

              </p>

              <p> <a id="Alzheimers" href="https://www.alzheimers.org.uk/get-support/help-dementia-care/understanding-supporting-person-dementia">
              Alzheimers Society
              </a> </p>

              <p id ="websiteText1">
              This article was created by the Alzheimers Society and works to provide loved ones with a better understanding of what dementia is and how 
              to continue to support someone with the condition. Not only does it explain the disease, but also throughly talks through the changes that
              come with it in various places such as relationships, behavior, and identity. 

              </p>
            </div>
          </div>
        )}





      </div>
       
    </>
  );
}

export default App;
