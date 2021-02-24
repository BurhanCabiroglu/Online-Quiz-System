const express = require('express')
const PostgresDBC = require("../PostgresDBC.js")
const uuid = require('uuid')

const passport = require('passport')


const router = express.Router();



// Üye Giris Ekranı Controller
router.get('/',checkNotAuthenticated,(req,res,next)=>{
    res.render("LoginView.ejs",{pass:true})
})

router.get('../',(req,res,next)=>{
    res.redirect("/")
})



router.post("/",passport.authenticate('local',{
    failureRedirect:"./login",
    failureFlash:true
    
}),(req,res)=>{
    if(req.user.role==0){
        res.redirect("./student/")
    }
    else{
        res.redirect("./teacher/")
    }
})



function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
       return next()
    }
    res.redirect("./login")
    
}


async function checkNotAuthenticated(req,res,next){
    
    let val = await req;
    let user = await req.user
    if(val.isAuthenticated()){
    //console.log(user)
       if(user.role==0){
        res.redirect("./student/")
        console.log("userrole 0 login")
       }
       else{
        res.redirect("./teacher/")
        console.log("userrole 1 login ")
       }

    }
    
    next()

}


module.exports = router