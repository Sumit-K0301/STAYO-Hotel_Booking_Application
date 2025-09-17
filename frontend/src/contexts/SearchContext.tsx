import React, { useContext, useState } from "react";

type SearchContext = {
    destination : string;
    checkIn: Date; 
    checkout: Date;
   adultCount: number;
   childCount: number;
   hotelId: string;
   saveSearchValues : (destination : string,
    checkIn: Date,
    checkout: Date,
   adultCount: number,
   childCount: number) => void
}

type SearchContextProviderProps = {
    children : React.ReactNode
}

const SearchContext = React.createContext<SearchContext | undefined>(undefined)

export const SearchContextProvider = ({children} : SearchContextProviderProps ) => {

    
    const [destination, setDestination] = useState<string>(
        () => sessionStorage.getItem("destination") || ""
    )
    const [checkIn, setCheckIn] = useState<Date>(
        () => new Date(sessionStorage.getItem("checkIn") || new Date().toISOString())
    )
    const [checkout, setCheckOut] = useState<Date>(
        () => new Date(sessionStorage.getItem("checkout") || new Date().toISOString())
    )
    const [adultCount, setAdultCount] = useState<number>(
        () => parseInt(sessionStorage.getItem("adultCount") || "1")
    )
    const [childCount, setChildCount] = useState<number>(
        () => parseInt(sessionStorage.getItem("childCount") || "1")
    )
    const [hotelId, setHotelId] = useState<string>(
        () => sessionStorage.getItem("hotelId") || ""
    )

    const saveSearchValues = (destination : string,
    checkIn: Date,
    checkout: Date,
    adultCount: number,
    childCount: number,
    hotelId?:string) => {
    setDestination(destination)
    setCheckIn(checkIn)
    setCheckOut(checkout)
    setAdultCount(adultCount)
    setChildCount(childCount)

    if(hotelId)
        setHotelId(hotelId)

    sessionStorage.setItem("destination",destination)
    sessionStorage.setItem("checkIn",checkIn.toISOString())
    sessionStorage.setItem("checkout",checkout.toISOString())
    sessionStorage.setItem("adultCount",adultCount.toString())
    sessionStorage.setItem("childCount",childCount.toString())

    if(hotelId)
        sessionStorage.setItem("hotelId",hotelId)

   }
    return(
        <SearchContext.Provider value = {{
            destination,
            checkIn,
            checkout,
            adultCount,
            childCount,
            saveSearchValues,
            hotelId
            }}>
            {children}
        </SearchContext.Provider>
    )
}

export const useSearchContext = () => {
    const context = useContext(SearchContext)
    return context as SearchContext
}