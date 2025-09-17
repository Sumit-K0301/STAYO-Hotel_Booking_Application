import express, { Request, Response } from "express"
import multer from "multer"
import cloudinary from "cloudinary"
import Hotel, { HotelType } from "../model/hotel.model"
import verifyToken from "../middleware/auth"
import { check } from "express-validator"

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({
    storage : storage,
    limits : {
        fileSize : 5 * 1024 * 1024
    }
})

router.post("/", [
    check("name", "Name is required").isString(),
    check("city", "City is required").isString(),
    check("country", "Country is required").isString(),
    check("description", "Description is required").isString(),
    check("type", "Type is required").isString(),
    check("pricePerNight", "Price per Night is required and It must be a number").isDecimal(),
    check("facilities", "Facilities is required").isArray(),
], 
verifyToken, 
upload.array("imageFiles", 6), 
async(req : Request, res : Response) => {
    try {
        const imageFiles = req.files as Express.Multer.File[]
        const newHotel : HotelType = req.body

        const imageUrls = await uploadImages(imageFiles)

        newHotel.imageUrls = imageUrls
        newHotel.lastUpdated = new Date()
        newHotel.userId = req.userId

        const hotel = new Hotel(newHotel)
        await hotel.save()

        res.status(201).json({hotel : `${hotel}`})

    }

    catch (error) {
        console.log("Error creating Hotels : ", error)
        res.status(500).json({message : "Something went wrong"})

    }

})

router.get("/", verifyToken, async(req : Request, res : Response) => {
    try {
        const hotels = await Hotel.find({userId : req.userId})

        res.json(hotels)

    }

    catch (error) {
        res.status(500).json({message : "Error fetching Hotels"})
    }
})

router.get("/:id", verifyToken, async(req : Request, res : Response) => {
    const id = req.params.id.toString()
    try {
        const hotels = await Hotel.findOne({
            _id : id,
            userId : req.userId})

        res.json(hotels)

    }

    catch (error) {
        res.status(500).json({message : "Error fetching Hotels"})
    }
})

router.put("/:hotelId", verifyToken, upload.array("imageFiles"), async(req : Request, res : Response) => {
    try {
        const updatedHotel : HotelType = req.body
        updatedHotel.lastUpdated = new Date()

        const hotel = await Hotel.findOneAndUpdate({_id : req.params.hotelId,
            userId : req.userId
        }, updatedHotel, {new : true})

        if(!hotel) {
            res.status(500).json({message : "Hotel not Found"})
        }

        else {
            const files = req.files as Express.Multer.File[]

            const updatedImageUrls = await uploadImages(files)

            hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls) || []] 

            await hotel.save()

            res.status(201).json({hotel : `${hotel}`})
        }
    }
    catch(error) {
        res.status(500).json({message : "Error updating Hotels"})
    }
})


async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64")
        let dataURI = "data:" + image.mimetype + ";base64," + b64

        const res = await cloudinary.v2.uploader.upload(dataURI)

        return res.url
    })

    const imageUrls = await Promise.all(uploadPromises)
    return imageUrls
}


export default router