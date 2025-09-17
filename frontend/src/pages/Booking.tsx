import { useQuery } from "@tanstack/react-query"
import * as apiClient from "../api-client"
import BookingForm from "../forms/BookingForm/BookingForm"
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailSummary from "../components/BookingDetailSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";


const Booking = () => {

    
    const search = useSearchContext()
    const {hotelId} = useParams()

    const [numberOfNight, setNumberOfNight] = useState<number>(0)

    const {stripePromise} = useAppContext()

    useEffect(() => {

        if(search.checkIn && search.checkout) {

            const nights = Math.abs(search.checkout.getTime() - search.checkIn.getTime()) / (1000 * 60 * 60 * 24)

            setNumberOfNight(Math.ceil(nights))
        }
    },[search.checkIn, search.checkout])

    const {data : hotel} = useQuery({
        queryKey: ["fetchHotelById"],
        queryFn : () => apiClient.fetchHotelById(hotelId as string),
        enabled : !!hotelId
    })

    const {data : currentUser } = useQuery({
        queryKey :["fetchCurrentUser"],
        queryFn : apiClient.fetchCurrentUser
    })

    const {data : paymentIntentData} = useQuery({
        queryKey :["createPaymentIntent"],
        queryFn : () => apiClient.createPaymentIntent(hotelId as string, numberOfNight.toString()),
        enabled : !!hotelId && numberOfNight > 0
    })

    if(!hotel)
        return <></>

    return(
        <>
            <div className="grid md:grid-cols-[1fr_2fr]">
                <BookingDetailSummary 
                    checkIn= {search.checkIn}
                    checkOut= {search.checkout}
                    adultCount = {search.adultCount}
                    childCount = {search.childCount}
                    numberOfNights = {numberOfNight}
                    hotel = {hotel}
                    />
                { currentUser && paymentIntentData &&
                (
                    <Elements stripe = {stripePromise} options = {{
                        clientSecret : paymentIntentData.clientSecret
                    }}>
                        <BookingForm currentUser = {currentUser} paymentIntent={paymentIntentData} />
                    </Elements>
                )
                }
            </div>
        </>
    )
}

export default Booking