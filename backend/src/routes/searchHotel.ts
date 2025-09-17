import express, { Request, Response } from "express"
import Hotel, { BookingType, HotelType } from "../model/hotel.model"
import { param, query, validationResult } from "express-validator";
import Stripe from "stripe"
import verifyToken from "../middleware/auth";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string)

type HotelSearchResponse = {
    data : HotelType[];
    pagination : {
        total:number;
        page:number;
        totalPages:number
    }
}

type PaymentIntentResponse = {
        paymentIntentId : string;
        clientSecret : string;
        totalCost : number
    }

const router = express.Router()

router.get("/", async (req: Request, res: Response) => {
    try{
        const hotels = await Hotel.find().sort("-lastIpdated")
        res.send(hotels)
    }
    catch(error){
        res.status(500).json({message : "Error fetching hotels"})
    }
})
router.get("/search",  async(req : Request, res : Response) => {
    try {

        const query = constructSearchQuery(req.query)

        let sortOptions = {}

        switch(req.query.sortOptions){

            case "starRating" : sortOptions = {starRating : -1}
            break

            case "pricePerNightAsc" : sortOptions = {pricePerNight : 1}
            break

            case "pricePerNightDesc" : sortOptions = {pricePerNight : -1}
            break
        }

        const pageSize = 5;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1")

        const skip = (pageNumber - 1) * pageSize

        const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize)

        const total = await Hotel.countDocuments(query)

        const response : HotelSearchResponse = {
            data : hotels,
            pagination : {
                total ,
                page : pageNumber,
                totalPages : Math.ceil(total/pageSize)
            }
        }

        res.json(response)
    }
    catch(error) {
        res.status(500).json({message : "Search Failed..!"})
    }
})

router.get("/:id", [
    param("id").notEmpty().withMessage("Hotel Id is required")
], async(req : Request, res : Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty())
        res.status(400).json({errors : errors.array()})

    const id = req.params.id.toString()

    try{
        const hotel = await Hotel.findById(id)
        res.json(hotel);
    }
    catch(error) {
        res.status(500).json({message :"Hotel is not found"})
    }
})

router.post("/:hotelId/bookings/payment-intent", verifyToken, async(req: Request, res: Response) => {

    const { numberOfNights } = req.body
    const hotelId = req.params.hotelId

    const hotel = await Hotel.findById(hotelId)
    
    if(!hotel)
       return res.status(400).json({message : "hotel not found"}) 

    const totalCost = hotel.pricePerNight * numberOfNights

    const paymentIntent = await stripe.paymentIntents.create({
        amount : totalCost * 100,
        currency : "inr",
        metadata : {
            hotelId,
            userId : req.userId
        }
    })

    if(!paymentIntent.client_secret)
       return res.status(500).json({message : "Error creating payment intent"}) 

    const response : PaymentIntentResponse = {
        paymentIntentId : paymentIntent.id,
        clientSecret : paymentIntent.client_secret.toString(),
        totalCost
    }

    res.send(response)
     
})

router.post("/:hotelId/bookings", verifyToken, async(req : Request, res : Response) => {
    try{
        const paymentIntentId = req.body.paymentIntentId
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId as string)

        if(!paymentIntent)
            return res.status(400).json({message : "Invalid Payment"})

        if(paymentIntent.metadata.hotelId !== req.params.hotelId || paymentIntent.metadata.userId !== req.userId)
            return res.status(400).json({message : "Payment Intent Mismatch"})

        if(paymentIntent.status !== "succeeded")
            res.status(400).json({message : `Payment not succeeded..! Status : ${paymentIntent.status}`})

        const newBooking : BookingType = {
            ...req.body,
            userId: req.userId
        }

        const hotel = await Hotel.findByIdAndUpdate(
            {_id : req.params.hotelId},
            {$push: {bookings : newBooking}},
        )

        if(!hotel)
            return res.status(400).json({message : "Hotel not found"})

        await hotel.save()

        res.status(200).json({message : "Payment Success"})

    }
    catch(error) {
        console.log(error)
        res.status(500).json({message : "Payment Failed..!"})
    }

})

function constructSearchQuery(queryParams : any) {
    let query : any = {}

    if(queryParams.destination)
        query.$or = [
            {city : new RegExp(queryParams.destination, "i")},
            {country : new RegExp(queryParams.destination, "i")},
        ]

    if(queryParams.adultCount)
        query.adultCount = {
            $gte : parseInt(queryParams.adultCount)
    }

    if(queryParams.childCount)
        query.childCount = {
            $gte : parseInt(queryParams.childCount)
    }

    if(queryParams.facilities)
        query.facilities = {
            $all : Array.isArray(queryParams.facilities) ? queryParams.facilities : [queryParams.facilities]
    }

    if(queryParams.type)
        query.type = {
            $in : Array.isArray(queryParams.type) ? queryParams.type : [queryParams.type]
    }

    if(queryParams.star) {

        const starRating = Array.isArray(queryParams.star) ? queryParams.star.map((star : string) => parseInt(star)) : parseInt(queryParams.star)

        query.starRating = {$in : starRating}
    }

    if(queryParams.maxPrice)
        query.pricePerNight = {
            $lte : parseInt(queryParams.maxPrice).toString()
    }

    return query
}

export default router