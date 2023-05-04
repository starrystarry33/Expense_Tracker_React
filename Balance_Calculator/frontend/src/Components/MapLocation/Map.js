import { GoogleMap, InfoWindowF, MarkerF } from '@react-google-maps/api';
import Geocode from "react-geocode";
import { dateFormat } from '../../utils/dateFormat';
import React, { useEffect,useState } from 'react';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import './Map.scss';
import IncomeItem from './IncomeItem';

function Map() {
    const {incomes, expenses, getIncomes, getExpenses } = useGlobalContext()

    const [position, setPosition] = useState({lat: 42.3600825, lng: -71.0588801}) //marker and map center position
    const [data, setData] = useState(incomes)              //selected transaction
    const [info, setInfo] = useState('')                   //marker details
    const [checked ,setChecked] = useState([true,false])   //income or expense list

    useEffect(() => {
        getIncomes()
        getExpenses()
        setPosition({lat: 42.3600825, lng: -71.0588801})
        setData(incomes)
        setChecked([true,false])
        const info = {
            title:'',
            amount:'',
            date:'',
            category:'',
            description:'',
            type:''
        }
        setInfo(info)
    }, [])

    //Geocode is used to tranfer address name to longitude and latitude
    Geocode.setApiKey("AIzaSyB_27lWXeJoFzJPhiUVMGSNaNMXke2Mpjo");
    Geocode.setLanguage("en");
    Geocode.setLocationType("GEOMETRIC_CENTER");

    //when clicked item, set info
    const itemClicked = (params) => {
        const [ title, amount, date, category, description, type, location] = params
        Geocode.fromAddress(location).then((response) => {setPosition(response.results[0].geometry.location)})
        const info = {
            title:title,
            amount:amount,
            date:date,
            category:category,
            description:description,
            type:type
        }
        setInfo(info)
    }

    //when click radio, change list
    const radioClicked = (e) => {
        if(e.target.value === 'income'){
            setData(incomes)
            setChecked([true,false])
        } 
        else{
            setData(expenses)
            setChecked([false,true])
        }
    }


    const[map, setMap] = useState(/** @type google.maps.Map */ (null));
    
    //set info window to show details
    const [isOpen, setOpen] = useState(false)
    const handleToggleOpen = () => {
        setOpen(true)
    }
    const handleToggleClose = () => {
        setOpen(false)
    }

  return (
    <div>
      <InnerLayout>
        <h1>LOCATION</h1>
        <div className="map-container">
            <div className="incomes">
                <div className='selectBar'>
                    <input type="radio" class='radio-type' name="type" checked={checked[0]} value="income" onClick={e =>radioClicked(e)}/>Income
                    <input type="radio" class='radio-type' name="type" checked={checked[1]} value="expense" onClick={e =>radioClicked(e)}/>Expense
                    {data.map((income) => {
                        const {_id, title, amount, date, category, description, type, location} = income;
                        return <IncomeItem
                            key={_id}
                            title={title} 
                            description={description} 
                            amount={amount} 
                            date={date} 
                            type={type}
                            category={category} 
                            location={location}
                            indicatorColor="var(--color-green)"
                            itemClicked={itemClicked}
                        />
                    })}
                </div>
            </div>
            <div className='map'>
                <GoogleMap center={position} zoom={15} mapContainerStyle={{width:'100%', height:'100%'}} onLoad={(map) =>setMap(map)}>
                    <MarkerF position={position} onClick={handleToggleOpen} />
                    {isOpen &&
                    <InfoWindowF position={position} onCloseClick={handleToggleClose} >
                        <div>
                            <p>title: {info.title}</p>
                            <p>amount: {info.amount}</p>
                            <p>date: {dateFormat(info.date)}</p>
                            <p>category: {info.category}</p>
                            <p>description: {info.description}</p>
                            <p>type: {info.type}</p>
                        </div>
                    </InfoWindowF>
                    }
                </GoogleMap>
            </div>
        </div>
      </InnerLayout>
    </div>
  );
}

export default Map;