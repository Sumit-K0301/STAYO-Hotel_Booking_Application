import express, { Request, Response } from "express"
import verifyToken from "../middleware/auth"
import Hotel, { HotelType } from "../model/hotel.model"

const router = express.Router()

router.get("/", verifyToken, async(req: Request, res:Response) => {
    try {
        const hotels = await Hotel.find({
            bookings: {$elemMatch : {userId : req.userId}}
        })

        const result = hotels.map((hotel) => {
            const userBooking = hotel.bookings.filter((booking) => booking.userId === req.userId)

            const hotelWithUserBooking : HotelType = {
                ...hotel.toObject(),
                bookings : userBooking
            } 

            return hotelWithUserBooking
        })

        res.status(200).send(result)
    }
    catch(error) {
        res.status(500).json({message : "Unable to get user bookings $$"})
    }
})

export default router