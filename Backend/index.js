import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/healthify", {
    useNewUrlParser: true,
    useUnifiedTopology: true,

})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)


//Routes
app.post("/login", async (req, res)=> {
    const { email, password} = req.body
    const user = await User.findOne({email: email});
    // User.findOne({ email: email}, (err, user) => {
    if(user){
        if(password === user.password ) {
            res.send({message: "Login Successfull", user: user})
        } else {
            res.send({ message: "Password didn't match"})
        }
    } else {
        res.send({message: "User not registered"})
    }
    // })
}) 

app.post("/register", async (req, res)=> {
    
    const { name, email, password} = req.body
    const user = await User.findOne({email: email});
    
    if (user){
        res.send({message: "User already registerd"})   
    }
    else{
        const user = new User({
            name,
            email,
            password
        })
        await user.save()
        res.send( { message: "Successfully Registered, Please login now." });
    }

    
}) 

app.listen(9002,() => {
    console.log("BE started at port 9002")
})