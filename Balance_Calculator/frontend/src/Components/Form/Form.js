import React, { useState,useRef } from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { plus } from '../../utils/Icons';
import {Autocomplete} from '@react-google-maps/api';


function Form() {
    const {addIncome, error, setError, inputState, setInputState,locationRef, clearInput,editing, updateIncome} = useGlobalContext()
    

    const { title, amount, date, category,description,location } = inputState;

    //when input is changed
    const handleInput = name => e => {
        setInputState({...inputState, [name]: e.target.value})
        setError('')
    }

    //when ad button is clicked
    const handleSubmit = e => {
        e.preventDefault()
        if(editing === '')     //if editing is empty, add a new income
            addIncome(inputState)
        else                  //if editing is not empty, update this income
            updateIncome()
        clearInput()           //clear input field
    }

    //when location input is changed
    const handleAutoComplete = (place) =>{
        setInputState({...inputState, ['location']: locationRef.current.value})
    }


    return (
        <FormStyled onSubmit={handleSubmit}>
            {error && <p className='error'>{error}</p>}
            <div className="input-control">
                <input 
                    type="text" 
                    value={title}
                    name={'title'} 
                    placeholder="Income Title"
                    onChange={handleInput('title')} required
                />
            </div>
            <div className="input-control">
                <input value={amount}  
                    type="text" 
                    name={'amount'} 
                    placeholder={'Income Amount'}
                    onChange={handleInput('amount')} required
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
                    <option value=""  disabled >Select Option</option>
                    <option value="salary">Salary</option>
                    <option value="freelancing">Freelancing</option>
                    <option value="investments">Investments</option>
                    <option value="stocks">Stocks</option>
                    <option value="bitcoin">Bitcoin</option>
                    <option value="bank">Bank Transfer</option>  
                    <option value="youtube">Youtube</option>  
                    <option value="other">Other</option>  
                </select>
            </div>
            <div className="input-control">
                <textarea name="description" required value={description} placeholder='Add a description for this income' id="description" cols="30" rows="2" onChange={handleInput('description')}></textarea>
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
        </FormStyled>
    )
}


const FormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.0rem;
    input, textarea, select{
        font-family: inherit;
        font-size: 18px;
        outline: none;
        border: none;
        padding: .5rem 1rem;
        border-radius: 8px;
        border: 2px solid #fff;
        background: #fbf6f9;
        resize: none;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        color: rgba(34, 34, 96, 0.9);
        &::placeholder{
            color: rgba(34, 34, 96, 0.4);
        }
    }
    .input-control{
        input{
            width: 100%;
        }
    }

    .selects{
        display: flex;
        justify-content: flex-end;
        select{
            width: 100%;
            color: rgba(34, 34, 96, 0.4);
            &:focus, &:active{
                color: rgba(34, 34, 96, 1);
            }
        }
    }

    .submit-btn{
        button{
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        }
    }
`;
export default Form