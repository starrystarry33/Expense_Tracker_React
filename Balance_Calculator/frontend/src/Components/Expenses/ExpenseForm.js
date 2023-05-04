import React, { useState,useRef } from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { plus } from '../../utils/Icons';
import './ExpenseForm.scss'
import {Autocomplete } from '@react-google-maps/api';


function ExpenseForm() {
    const {addExpense, error, setError, inputState, setInputState, locationRef, editing, clearInput, updateExpense} = useGlobalContext()

    const { title, amount, date, category,description,location } = inputState;


    //when input changed
    const handleInput = name => e => {
        setInputState({...inputState, [name]: e.target.value})
        setError('')
    }

    //when add button is clicked
    const handleSubmit = e => {
        e.preventDefault()
        if(editing === '')           //if editing is empty, add a new expense
            addExpense(inputState)
        else                      //if editing is empty, update this expense
            updateExpense()
        clearInput()          //clear input field
    }

    //when location input is changed
    const handleAutoComplete = async () =>{
        setInputState({...inputState, ['location']: locationRef.current.value})
    }

    return (
        <form className='expense-form' onSubmit={handleSubmit}>
            {error && <p className='error'>{error}</p>}
            <div className="input-control">
                <input 
                    type="text" 
                    value={title}
                    name={'title'} 
                    placeholder="Expense Title"
                    onChange={handleInput('title')}
                />
            </div>
            <div className="input-control">
                <input value={amount}  
                    type="text" 
                    name={'amount'} 
                    placeholder={'Expense Amount'}
                    onChange={handleInput('amount')} 
                />
            </div>
            <div className="input-control">
                <DatePicker 
                    id='date'
                    placeholderText='Enter A Date: MM/DD/YYYY'
                    selected={date}
                    dateFormat="MM/dd/yyyy"
                    onChange={(date) => {
                        setInputState({...inputState, date: date})
                    }}
                />
            </div>
            <div className="selects input-control">
                <select required value={category} name="category" id="category" onChange={handleInput('category')}>
                    <option value="" disabled >Select Option</option>
                    <option value="education">Education</option>
                    <option value="groceries">Groceries</option>
                    <option value="health">Health</option>
                    <option value="subscriptions">Subscriptions</option>
                    <option value="takeaways">Takeaways</option>
                    <option value="clothing">Clothing</option>  
                    <option value="travelling">Travelling</option>  
                    <option value="other">Other</option> 
                </select>
            </div>
            <div className="input-control">
                <textarea name="description" required value={description} placeholder='Add a description for this spend' id="description" cols="30" rows="2" onChange={handleInput('description')}></textarea>
            </div>
            <div className="input-control">
                <Autocomplete onPlaceChanged={handleAutoComplete}>
                    <input 
                        type="text" 
                        value={location}
                        name={'location'} 
                        placeholder="Location"
                        onChange={handleInput('location')}
                        ref={locationRef} required
                    />
                </Autocomplete>
            </div>
            <div className="submit-btn">
                <Button 
                    name={'Add'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'#3a3a3a'}
                    color={'#fff'}
                />
            </div>
        </form>
    )
}


const ExpenseFormStyled = styled.form`
    
`;
export default ExpenseForm