import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from './UserState';
import { PublicApi } from '../utils/Api';

export const TripContext = createContext();
export default function TripState({children}) {

    let user = useContext(UserContext);
    let location = useLocation();
    let navigate = useNavigate();
    const [data, setData] = useState([]);
    const [updateFlag, setUpdateFlag] = useState(false);

    const updateData = () => {
        setUpdateFlag(true);
    }

    const clearData = () => {
        localStorage.removeItem('userData');
    }
 
    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if(location.pathname.includes("/trip") && !userData){
            navigate("/");
        }
        if(user.data){
            if(userData){
                setData(JSON.parse(userData));
            } else {
                PublicApi.get("/api/v1/trip").then((res) => {
                    setData(res.data);
                    localStorage.setItem('userData', JSON.stringify(res.data));
                }).catch(() => {
                    navigate("/");
                });
            }
        }
    }, [user.data]);

    if(updateFlag){
        localStorage.setItem('userData', JSON.stringify(data));
        setUpdateFlag(false);
    }

    return (
        <TripContext.Provider value={{data, setData, updateData, clearData}}>
            {children}
        </TripContext.Provider>
    );
}

// {
//     search: "",
//     goingDate: "",
//     returnDate: "",
//     adults: 1,
//     children: 0
//     selectedSights: [],
//     budgetLevel: 0,
//     mealsToInclude: {
//         breakfast: false,
//         lunch: false,
//         dinner: false
//     },
//     mealsCost: 0,
//     stayAddress: "",
//     itinerary: {}
// }