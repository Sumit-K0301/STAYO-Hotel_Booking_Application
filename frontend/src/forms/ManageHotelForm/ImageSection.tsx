import { useFormContext } from "react-hook-form"
import type { HotelFormData } from "./ManageHotelForm"
import type React from "react"

const ImageSection = () => {
    const { register, formState : {errors}, watch, setValue} = useFormContext<HotelFormData>()

    const existingImageUrls = watch("imageUrls")
    const HandleDelete = (event : React.MouseEvent<HTMLButtonElement, MouseEvent>,
        imageUrl : string
    ) => {
        event.preventDefault()
        setValue("imageUrls", existingImageUrls.filter((url) => url !== imageUrl))

    }

    return(
        <div>
            <h2 className="text-2xl font-bold mb-3">Images</h2>
            <div className="border rounded p-4 flex flex-col gap-4">

                {existingImageUrls && (
                    <div className="grid grid-cols-6 gap-4">
                        {existingImageUrls.map((url) => (
                            <div className="relative group">
                                <img src = {url} className= "min-h-full object-cover" />
                                <button className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold" onClick={(event) => HandleDelete(event,url)}>Delete</button>
                            </div>
                            
                        ))}
                    </div>
                )}

                <input type="file" multiple accept = "image/*" className="w-full text-gray-700 font-normal" {...register("imageFiles", {
                    validate : (imageFiles) => {
                        if(imageFiles.length + (existingImageUrls?.length || 0)=== 0)
                            return "At least one image file must be uploaded"

                        if(imageFiles.length + (existingImageUrls?.length || 0) > 6)
                            return "Total number of files can not be more than 6"

                        return true
                    }
                })}></input>

            </div>
            {errors.imageFiles &&(<span className="text-red-500 font-bold">{errors.imageFiles.message}</span>)}

        </div>

    )
}

export default ImageSection