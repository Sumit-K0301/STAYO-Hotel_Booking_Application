import type { BookingFormData } from "./forms/BookingForm/BookingForm";
import type { RegisterFormData } from "./pages/Register";
import type { SignInFormData } from "./pages/SignIn";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL


//Authentication

export const register  = async (formData : RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
    })

    const responseBody = await response.json()

    if(!response.ok) {
        throw new Error(responseBody.message)
    }

}

export const signIn = async (formData : SignInFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method : "POST",
        credentials : "include",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(formData)
    })

    const responseBody = await response.json()

    if(!response.ok){
        throw new Error(responseBody.message)
    }

    return responseBody;

}

export const signOut = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method : "POST",
        credentials : "include"
    })

    if(!response.ok) {
        throw new Error("Sign Out Failed")
    }
}


// Hotels

export const addMyHotel = async(hotelFormData : FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        method : "POST",
        credentials : "include",
        body : hotelFormData
    })

    if(!response.ok) {
        throw new Error("Failed to add Hotel")
    }

    return response.json()

}

// : HotelType from Backend

export type BookingType = {
     _id : string;
    userId : string;
    firstName : string;
    lastName : string;
    email : string;
    checkIn : Date,
    checkOut : Date,
    adultCount : number;
    childCount : number;
    totalCost : number;
}

type HotelType = {
    _id : string;
    userId : string;
    name : string;
    city : string;
    country : string;
    description : string;
    type : string;
    adultCount : number;
    childCount : number;
    facilities : string[];
    pricePerNight : number;
    starRating : number;
    imageUrls : string[];
    lastUpdated : Date;
    bookings : BookingType[];
};

export const fetchMyHotels = async () : Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        credentials : "include"
    })

    if(!response.ok)
        throw new Error("Error fetching Hotels")

    return response.json()
}


export const fetchMyHotelsById =  async (hotelId : string) : Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
        credentials : "include"
    })

    if(!response.ok)
        throw new Error("Error fetching Hotels")

    return response.json()
}

export const updateMyHotelById = async(hotelFormData : FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`, {
        method : "PUT",
        credentials : "include",
        body : hotelFormData
    })

    if(!response.ok) {
        throw new Error("Failed to update Hotel")
    }

    return response.json()

}

// Search

// : 

export type SearchParams = {
    destination : string;
    checkIn: string;
    checkout: string;
   adultCount: string;
   childCount: string;
   page: string;
   facilities?: string[];
   type?: string[];
   star?: string[];
   maxPrice?:string;
   sortOption?: string
}

type HotelSearchResponse = {
    data : HotelType[];
    pagination : {
        total:number;
        page:number;
        totalPages:number
    }
}

export const searchHotels = async(searchParams : SearchParams) : Promise<HotelSearchResponse> => {
    const queryParams = new URLSearchParams()

    queryParams.append("destination",searchParams.destination || "")
    queryParams.append("checkIn",searchParams.checkIn || "")
    queryParams.append("checkout",searchParams.checkout || "")
    queryParams.append("adultCount",searchParams.adultCount || "")
    queryParams.append("childCount",searchParams.childCount || "")
    queryParams.append("page",searchParams.page || "")

    searchParams.facilities?.forEach((facility) => queryParams.append("facilities", facility))
    searchParams.type?.forEach((type) => queryParams.append("type", type))
    searchParams.star?.forEach((star) => queryParams.append("star", star))
    
    queryParams.append("maxPrice",searchParams.maxPrice || "")
    queryParams.append("sortOptions",searchParams.sortOption || "")


    const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`)

    if(!response.ok)
        throw new Error("Error Searching Hotels")

    return response.json()
}

export const fetchHotels = async() : Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels`, {}
    )

    if(!response.ok)
        throw new Error("Error fetching hotels")

    return response.json()
}
export const fetchHotelById = async(hotelId : string) : Promise<HotelType>=> {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`, {

    })

    if(!response.ok)
        throw new Error("Hotel not found")

    return response.json()
}

export type UserType = {
    _id : string;
    firstName : string;
    lastName : string;
    email : string;
    password : string;
};

export const fetchCurrentUser = async() : Promise<UserType> => {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        credentials : "include"
    })

    if(!response.ok)
        throw new Error("User not Fount")

    return response.json()
}

// Bookings

export type PaymentIntentResponse = {
        paymentIntentId : string;
        clientSecret : string;
        totalCost : number
    }


export const createPaymentIntent = async (hotelId : string, numberOfNights : string) : Promise<PaymentIntentResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`, {
        method : "POST",
        credentials : "include",
        body : JSON.stringify({numberOfNights}),
        headers : {
            "Content-Type" : "application/json"
        }
    })

    if(!response.ok)
        throw new Error("Booking Failed..!")

    return response.json()
}

export const createRoomBooking = async(formData : BookingFormData) => {
    console.log(formData)
    const response = await fetch(`${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`, {
        method : "POST",
        credentials : "include",
        body : JSON.stringify(formData),
        headers : {
            "Content-Type" : "application/json"
        }
    })

    if(!response.ok)
        throw new Error("Error booking room")

}

// My Bookings

export const fetchMyBookings = async () : Promise<HotelType[]>=> {
    const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
        credentials : "include",
    })

    if(!response.ok)
        throw new Error("Unable to fetch bookings")

    return response.json()
}

// Validation Method

export const validateToken = async() => {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        credentials : "include",
    })

    if(!response.ok) {
        throw new Error("Token Invalid")
    }

    return response.json()
}

