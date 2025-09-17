import { useFormContext } from "react-hook-form";
import { hotelFacilities } from "../../config/hotelFacilities.config";
import type { HotelFormData } from "./ManageHotelForm";

const FacilitiesSection = () => {
    const { register, formState : {errors}} = useFormContext<HotelFormData>()

    return(
        <div>
            <h2 className="text-2xl font-bold mb-3">Facilities</h2>
            <div className="grid grid-cols-5 gap-3">
               {hotelFacilities.map((facility) => (
                    <label className = "text-sm font-semibold flex gap-1 text-gray-700">
                         <input type = "checkbox" value = {facility} {...register("facilities", {
                            validate : (facilities) => {
                                if(facilities && facilities.length > 0)
                                    return true
                                else
                                    return "At least one of the facilities must be selected"
                            }
                         })}></input>
                         {facility}
                     </label>
                     ))}
            </div>
            {errors.facilities &&(<span className="text-red-500 font-bold">{errors.facilities.message}</span>)}
           
            
        </div>

    )
}

export default FacilitiesSection