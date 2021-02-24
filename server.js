/*
if (process.env.NODE_ENV !== 'Production') {
    require('dotenv')
}*/

// MAIN SERVER CONTROLLER
// TUM SERVER ISLEMLERI, ROUTING ISLEMLERININ YONETILDIGI YERDIR


const express = require('express')
const signupRouter = require("./routers/SignupRouter")
const studentRouter = require("./routers/StudentRouter")
const teacherRouter = require("./routers/TeacherRouter")
const loginRouter = require("./routers/LoginRouter")
const cookieParser = require('cookie-parser')
const passport = require('passport') 
const initializePassport = require("./passport-config");
const path = require("path")
const flash = require('express-flash')
const session = require('express-session')


const app = express(); 


initializePassport(passport)





const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json());
app.use(flash())
app.use(session({
    
    secret: "process.env.SESSION_SECRET",
    resave:false,
    saveUninitialized:true}))


app.use(passport.initialize())
app.use(passport.session(process.env.SESSION_SECRET))
app.use(express.static(path.join(__dirname,"/")))
app.set("view engine","ejs")






app.use("/teacher/",teacherRouter)
app.use("/student/",studentRouter)
app.use("/signup",signupRouter)
app.use("/login",loginRouter)

app.get("/",checkNotAuthenticated,(req,res,next)=>{
    res.redirect("/login")
})



app.use((req,res,next)=>{
    res.status(404).json({pageTitle:"Page Not Found"})
})




async function checkNotAuthenticated(req,res,next){
    let val = await req;
    let user = await req.user
    if(val.isAuthenticated()){
    //console.log(user)
       if(user.role==0){
        res.redirect("/student/dashboard")
        console.log("userrole 0 server")
       }
       else{
        res.redirect("/teacher/dashboard")
        console.log("userrole 1 server")
       }

    }
   
    next()

}


/*
app.listen(process.env.PORT||3000, 
	() => console.log("Server is running..."));

*/


app.listen(process.env.PORT||3000, () => console.log("Server is running..."));



