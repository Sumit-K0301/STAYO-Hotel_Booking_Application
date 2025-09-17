import { useFormContext } from "react-hook-form"
import type { HotelFormData } from "./ManageHotelForm"

const GuestSection = () => {
    const { register, formState : {errors} } = useFormContext<HotelFormData>()
    return(
        <div>
            <h2 className="text-2xl font-bold mb-3">Guests</h2>
            <div className="flex flex-row gap- 10 bg-gray-300">

                <div className="flex flex-col flex-1 py-10 px-3">
                    <label className="text-sm text-gray-700 font-semibold">
                    Adults 
                    </label>

                    <input type = "number" min = {1} className="bg-white rounded" {...register("adultCount", {
                        required : "This field is required"
                    })}></input> 

                    {errors.adultCount &&(<span className="text-red-500 font-bold text-sm">{errors.adultCount.message}</span>)}

                </div>

                

                <div className="flex flex-col flex-1 py-10 px-3">
                    <label className="text-sm text-gray-700 font-semibold">
                    Children 
                    </label>

                    <input type = "number" min = {0} className="bg-white rounded"{...register("childCount", {
                        required : "This field is required"
                    })}></input>

                    {errors.childCount &&(<span className="text-red-500 font-bold text-sm">{errors.childCount.message}</span>)}
                </div>

                
            </div>
            
        </div>

    )
}

export default GuestSection