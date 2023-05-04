import React, {useState, useMemo} from 'react'
import styled from "styled-components";
import bg from './img/bg.png'
import {MainLayout} from './styles/Layouts'
import Orb from './Components/Orb/Orb'
import Navigation from './Components/Navigation/Navigation'
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income'
import Expenses from './Components/Expenses/Expenses';
import News from './Components/News/News';
import { useGlobalContext } from './context/globalContext';
import Weather from './Components/Weather/Weather';
import Visualization from './Components/Visualization/Visualization';
import CurrencyCalculator from './Components/CurrencyCalculator/CurrencyCalculator';

import Map from './Components/MapLocation/Map';
import { useJsApiLoader } from '@react-google-maps/api';

function App() {
  const [active, setActive] = useState(1)

  const global = useGlobalContext()
  // console.log(global);

  //load google map api
  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyB_27lWXeJoFzJPhiUVMGSNaNMXke2Mpjo',
    libraries:['places','geometry','geocoding'],
  })
  if(!isLoaded){
      console.log("Google Map Api connection error")
  }

  // Menu at MainLayout
  const displayData = () => {
    console.log("Active:", active);
    switch(active){
      case 1:
        return <Dashboard />
      case 2:
        return <Income />
      case 3: 
        return <Expenses />
      case 4:
        return <Weather />
      case 5: 
        return <News />
      case 6:
        return <Map />
      case 7:
        return <Visualization />;
      case 8:
        return <CurrencyCalculator />; 
      default: 
        return <Dashboard />
    }
  }

  // Background
  const orbMemo = useMemo(() => {
    return <Orb />
  },[])

  return (
    <AppStyled bg={bg} className="App">
      {orbMemo}
      <MainLayout>
        <Navigation active={active} setActive={setActive} />
        <main>
          {displayData()}
        </main>
      </MainLayout>
    </AppStyled>
  );
}

// Main page css
const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
  position: relative;
  main{
    flex: 1;
    background: #D8D4F0;
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar{
      width: 0;
    }
  }
`;

export default App;
