import { useMutation, useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import * as apiClient from "../api-client"
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm"
import { useAppContext } from "../contexts/AppContext"

const EditHotel = () => {
    const {hotelId} = useParams()
    const {data : hotelData} = useQuery({
        enabled : !!hotelId,
        queryKey : ["fetchMyHotelsById"],
        queryFn : () => apiClient.fetchMyHotelsById(hotelId || ""),
        
    })

    const hotel = hotelData?.[0]
    
    

    const {showToast} = useAppContext()

    const {mutate, isPending} = useMutation({
            mutationFn : apiClient.updateMyHotelById,
            onSuccess:  () => {
                showToast({
                    message: "Hotel Updated..!",
                    type: "SUCCESS"
                })
            },
            onError: () => {
                showToast({
                    message: "Hotel Updation Failed..!",
                    type: "ERROR"
                })
            }
           })


    
    const handleSave = (hotelFormData : FormData) => {
        mutate(hotelFormData)
    }       
    

    
    return(
        <>
            <ManageHotelForm hotel={hotel} onSave={handleSave} isPending={isPending} />
        </>

    )
}

export default EditHotel