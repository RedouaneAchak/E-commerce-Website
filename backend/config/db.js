const mongoose = require('mongoose');
const db_Uri = process.env.DATABASE_URI;
const connectdb= async()=>{
    if (!db_Uri){
        throw new Error("Database URI is not defined in environment variables");
        error.exit(1);
    }
    try{
        await mongoose.connect(dbUri,{useNewUrlParser: true, useUnifiedTopology: true,})
        console.log(`database connected successfully on ${conn.connection.host}`);
    }
    catch(err){
        console.error("Database connection failed:", err);
        throw err;
    }
}
module.exports=connectdb;