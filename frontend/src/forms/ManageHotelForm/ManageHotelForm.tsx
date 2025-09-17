import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypesSection from "./TypesSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestSection from "./GuestSection";
import ImageSection from "./ImageSection";
import { useEffect } from "react";

export type HotelFormData = {
    name : string;
    city : string;
    country : string;
    description : string;
    type : string;
    pricePerNight : number;
    starRating : number;
    facilities : string[];
    imageFiles : FileList;
    imageUrls : string[];
    adultCount : number;
    childCount : number;
}

export type HotelType = {
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

};

type Props = {
    hotel?: HotelType,
    onSave : (HotelFormData : FormData) => void
    isPending : boolean
}

const ManageHotelForm = ({ hotel, onSave, isPending } : Props) => {

    const formMethods = useForm<HotelFormData>()
    const { handleSubmit, reset } = formMethods

    useEffect(() => {
        reset(hotel)
    }, [hotel, reset])

    const onSubmit = handleSubmit((formDataJSON : HotelFormData) => {
        const formData = new FormData

        if(hotel) {
            formData.append("hotelId", hotel._id)
        }

        formData.append("name",formDataJSON.name)
        formData.append("adultCount",formDataJSON.adultCount.toString())
        formData.append("childCount",formDataJSON.childCount.toString())
        formData.append("city",formDataJSON.city)
        formData.append("country",formDataJSON.country)
        formData.append("description",formDataJSON.description)
        formData.append("pricePerNight",formDataJSON.pricePerNight.toString())
        formData.append("starRating",formDataJSON.starRating.toString())
        formData.append("type",formDataJSON.type)

        formDataJSON.facilities.forEach((facility, index) => {
            formData.append(`facilities[${index}]`, facility)
        })

        if(formDataJSON.imageUrls) {
            formDataJSON.imageUrls.forEach((url, index) => {
                formData.append(`imageUrls[${index}]`, url)
            })
        }

        Array.from(formDataJSON.imageFiles).forEach((imageFile) => {
            formData.append(`imageFiles`, imageFile)
        })


        onSave(formData)


        console.log(formDataJSON)

    })
    return(
        <FormProvider {...formMethods}>
            <form className="flex flex-col gap-10" onSubmit={onSubmit}>
                <DetailsSection />
                <TypesSection />
                <FacilitiesSection />
                <GuestSection />
                <ImageSection />
                <span className="flex justify-end">
                    <button type="submit" 
                    disabled = {isPending}
                    className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500 ">Save</button>
                </span>
            </form>
        </FormProvider>

    )
}

export default ManageHotelForm