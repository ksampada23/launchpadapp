import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import image from './img/background0.png';
import image1 from './img/background1.png';
import Calendar from 'react-calendar';





function App() {
  const [backgroundImage, setBackgroundImage] = useState(false);
  const [view, setView] = useState(false);
  const [hidden, setDisplay] = useState(false);




  return (
    <>
    
    

      <div class="background">
    
        <img
          style={{
            backgroundSize: 'contain',
            minHeight: '100vh',
            maxWidth: '185vh',
          }}
          src={backgroundImage ? image1 : image}
          alt=""
        />
        
        {!hidden && view && (
        <Calendar className = "calendar" ></Calendar>

        )}

        {!hidden && (
          <button
            class="input"
            onClick={() => {
              setBackgroundImage(true);
              setDisplay(true);
            }}
          >
            INPUT
          </button>
        )}

        {!hidden && (
          <button class="switch" onClick={() => {
            setView(!view);
          }}>
            SWITCHVIEW
          </button>
        )}


        {hidden && (
          <button
            class="exit"
            onClick={() => {
              setBackgroundImage(false);
              setDisplay(false);
            }}
          >
            X
          </button>
        )}

        {hidden && (
          <button class="confirm" onClick={() => {}}>
            CONFIRM
          </button>
        )}
      </div>
       
    </>
  );
}

export default App;
