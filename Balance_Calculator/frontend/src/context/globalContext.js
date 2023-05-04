// import React, { useContext, useState, useCallback } from "react"
import React, {  useContext, useState, useCallback, useEffect, useRef } from "react";
import axios from 'axios'
import { dateFormat } from '../utils/dateFormat';
import { parseISO } from 'date-fns'; 

// Balance Calculator API URI
const BASE_URL = "http://localhost:5001/api/v1/";
// News API auth key
const NEWS_API_KEY = "apiKey=2d6ff00e0317456ea33408d024a2cc97"
// News API URI
const NEWS_URL = `https://newsapi.org/v2/top-headlines?language=en&pageSize=5&category=business&${NEWS_API_KEY}`

// const WEATHER_API_KEY = "205924f4285a40d9a96233209231604";
const WEATHER_API_KEY = "db0b09b486a19feb1860cfb78eebf35b";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast?";

// const CURRENCY_CONVERSION_API_KEY = "2qNF66Ui388KZnxtPW0vcWGqDJ5ImPH9";
// const CURRENCY_CONVERSION_URL = `https://api.apilayer.com/exchangerates_data_api/latest?access_key=${CURRENCY_CONVERSION_API_KEY}`;



const GlobalContext = React.createContext()

export const GlobalProvider = ({children}) => {

    const [incomes, setIncomes] = useState([])        //income items
    const [expenses, setExpenses] = useState([])      //expense items
    const [news, setNews] = useState([])              //news items
    const [weather, setWeather] = useState({})        //weather items
    const [weatherForecast, setWeatherForecast] = useState(null);
    const [currencies, setCurrencies] = useState([]);
    const [conversionRates, setConversionRates] = useState({});  
    const [error, setError] = useState(null)         //error staus
    const [inputState, setInputState] = useState({   //input content of forms on income/expense dashborad
        title: '',
        amount: '',
        date: '',
        category: '',
        description: '',
        loaction: '',
    })
    const [editing, setEditing] = useState()   //if editing is empty, not editing. If not empty, editing = item id
    const locationRef = useRef()

    const clearInput = () =>{
        setEditing('')
        setInputState({   
            title: '',
            amount: '',
            date: '',
            category: '',
            description: '',
            loaction: '',
        })
        locationRef.current.value = ''
    }

    //calculate incomes
    const addIncome = async (income) => {
        await axios.post(`${BASE_URL}add-income`, income)
            .catch((err) =>{
                setError(err.response.data.message)
            })
        getIncomes()
    }

    const getIncomes = async () => {        //get all incomes record from database
        const response = await axios.get(`${BASE_URL}get-incomes`)
        setIncomes(response.data)
        // console.log(response.data)
    }

    const deleteIncome = async (id) => {    //when click delete on income dashboard
        if(editing === id)
            clearInput()
        await axios.delete(`${BASE_URL}delete-income/${id}`)
        getIncomes()
    }

    const updateIncome = async () => {
        await axios.patch(`${BASE_URL}update-income/${editing}`,inputState)
        getIncomes()
    }

    const editItem = async (id,title,amount,date,category,description,location) => {  //when click edit on income dashboard
        if(editing === ''){     //start editing
            setInputState({
                title: title,
                amount: amount,
                date: parseISO(date,1),
                category: category,
                description: description,
                loaction: location,
            })
            locationRef.current.value = location
            setEditing(id)
        }
        else{                     //cancel editing
            clearInput()
        }
    }

    const totalIncome = () => {             //calculate total income
        let totalIncome = 0;
        incomes.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })

        return totalIncome;
    }


    //calculate incomes
    const addExpense = async (income) => {
        await axios.post(`${BASE_URL}add-expense`, income)
            .catch((err) =>{
                setError(err.response.data.message)
            })
        getExpenses()
    }
 
    const getExpenses = async () => {          //get expenses record from database
        const response = await axios.get(`${BASE_URL}get-expenses`)
        setExpenses(response.data)
        // console.log(response.data)
    }

    const deleteExpense = async (id) => {        //when click delete on expense dashboard
        if(editing === id)
            clearInput()
        await axios.delete(`${BASE_URL}delete-expense/${id}`)
        getExpenses()
    }

    const updateExpense = async () => {
        await axios.patch(`${BASE_URL}update-expense/${editing}`,inputState)
        getExpenses()
    }

    const totalExpenses = () => {               //calculate total expenses
        let totalIncome = 0;
        expenses.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })

        return totalIncome;
    }


    const totalBalance = () => {                //calculate balance
        return totalIncome() - totalExpenses()
    }

    const transactionHistory = () => {          //return 3 latest transactions
        const history = [...incomes, ...expenses]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

        return history.slice(0, 3)
    }

    const getNews = async () => {
        // Fed with prepaired source so that the news api doesn't lock access
        // setNews([{
        //     source: {
        //         id: null,
        //         name: 'example.publisher'
        //     },
        //     title: 'Example Title1',
        //     publishedAt: '2023.04.16',
        //     url: 'http://example.com',
        //     descript: "LoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLorem"
        // },{
        //     source: {
        //         id: null,
        //         name: 'example.publisher'
        //     },
        //     title: 'Example Title2',
        //     publishedAt: '2023.04.16',
        //     url: 'http://example.com',
        //     descript: "LoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLorem"
        // },{
        //     source: {
        //         id: null,
        //         name: 'example.publisher'
        //     },
        //     title: 'Example Title3',
        //     publishedAt: '2023.04.16',
        //     url: 'http://example.com',
        //     descript: "LoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLorem"
        // },{
        //     source: {
        //         id: null,
        //         name: 'example.publisher'
        //     },
        //     title: 'Example Title4',
        //     publishedAt: '2023.04.16',
        //     url: 'http://example.com',
        //     descript: "LoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLorem"
        // },{
        //     source: {
        //         id: null,
        //         name: 'example.publisher'
        //     },
        //     title: 'Example Title5',
        //     publishedAt: '2023.04.16',
        //     url: 'http://example.com',
        //     descript: "LoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLorem"
        // },{
        //     source: {
        //         id: null,
        //         name: 'example.publisher'
        //     },
        //     title: 'Example Title6',
        //     publishedAt: '2023.04.16',
        //     url: 'http://example.com',
        //     descript: "LoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLorem"
        // }])
        // Use axios to get the source
        const res = await axios.get(`${NEWS_URL}`,{responseType:'json'})
        // Check the result status with NewsAPI
        if (res.data.status === "ok") {
            const articles = res.data.articles
            setNews(articles)
            console.log(`Fetch news from ${NEWS_URL} successfully`)

        } else {
            console.log(`Cannot fetch news from ${NEWS_URL}`)
        }
    }

    const getWeather = useCallback(async (city) => {
        try {
          // Fetch the current weather using the city name
          const response = await fetch(
            `${WEATHER_URL}q=${city}&appid=${WEATHER_API_KEY}`
          );
          const data = await response.json();
          if (data) {
            setWeather(data);
            console.log("Fetch weather from", response.url, "successfully");
          } else {
            throw new Error("Failed to fetch weather data");
          }
        } catch (error) {
          console.log("Error fetching weather data:", error);
        }
      }, []);
      
      const getWeatherForecast = useCallback(async (city) => {
        try {
          // Fetch the 5-day forecast using the city name
          const response = await fetch(
            `${FORECAST_URL}q=${city}&appid=${WEATHER_API_KEY}`
          );
          const data = await response.json();
          if (data) {
            setWeatherForecast(data);
            console.log("Fetch weather forecast from", response.url, "successfully");
          } else {
            throw new Error("Failed to fetch weather forecast data");
          }
        } catch (error) {
          console.log("Error fetching weather forecast data:", error);
        }
      }, []);

      
      
      useEffect(() => {
        const fetchCurrenciesAndRates = async () => {
          try {
            const response = await axios.get("https://openexchangerates.org/api/currencies.json");
            const currencyKeys = Object.keys(response.data);
            setCurrencies(currencyKeys);
    
            const responseRates = await axios.get("https://openexchangerates.org/api/latest.json?app_id=eacbd5b69f33433b9ee64550fb744192");
            setConversionRates(responseRates.data.rates);
          } catch (error) {
            console.error("Error fetching currencies and rates:", error);
          }
        };
    
        if (currencies.length === 0) {
          fetchCurrenciesAndRates();
        }
      }, [currencies]);
    
      

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            news,
            getNews,
            weather,
            getWeather,
            weatherForecast,
            getWeatherForecast,
            currencies,
            setCurrencies,
            conversionRates,
            error,
            setError,
            inputState,
            setInputState,
            locationRef,
            editItem,
            clearInput,
            editing,
            updateIncome,
            updateExpense
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () =>{
    return useContext(GlobalContext)
};
