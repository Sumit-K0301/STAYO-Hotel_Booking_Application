import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client"
import {loadStripe, type Stripe} from "@stripe/stripe-js"

type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
}

type AppContext = {
    showToast : (toastMessage: ToastMessage) => void 
    isLoggedIn : boolean
    stripePromise : Promise<Stripe | null>
}
const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY as string || ""

const AppContext = React.createContext<AppContext | undefined>(undefined)

const stripePromise = loadStripe(STRIPE_PUB_KEY as string)

export const AppContextProvider = ({children} : {children : React.ReactNode}) => {
   const [toast, setToast] = useState<ToastMessage | undefined>(undefined)

   const {isSuccess } = useQuery({
    queryKey :["validateToken"], 
    queryFn : apiClient.validateToken, 
    retry : false
   })
    return(
        <AppContext.Provider value = {
            {
                showToast: (toastMessage) => {
                    setToast(toastMessage)
                },
                isLoggedIn: isSuccess,
                stripePromise
            }
        }>
            {toast && (
                <Toast 
                message={toast.message} 
                type={toast.type} 
                onClose={ () => setToast(undefined)}
                />)}
            {children}
        </AppContext.Provider>
    )

}

export const useAppContext = () => {
    const context = useContext(AppContext)
    return context as AppContext
}