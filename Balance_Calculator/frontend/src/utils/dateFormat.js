import moment from 'moment'

// Set Format for date
export const dateFormat = (date) =>{
    return moment(date).format('MM/DD/YYYY')
}