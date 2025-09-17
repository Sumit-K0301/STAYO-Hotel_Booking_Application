import mongoose from "mongoose"

const connectDB = async() => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.DB_CONNECTION_STRING}`)
        console.log("Database Connected")
    }

    catch(error){
        console.log("DB Connection Error : ", error)
        process.exit(1)
    }
}

export default connectDB