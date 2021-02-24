const express = require('express')
const PostgresDBC = require("../PostgresDBC.js")
const uuid = require('uuid')
const router = express.Router();

// Uye Kayit Ekrani Controller


router.get("/",checkNotAuthenticated,(req,res)=>{
    res.render("SignupView.ejs",{err : false})
})

router.post("/",(req,res)=>{

    let fname = req.body.firstName;
    let lname = req.body.lastName;
    let userno = req.body.userNo;
    let password = req.body.password;
    let usertype = req.body.userType;
    let muid = uuid.v4()
    PostgresDBC.createNewUser(userno,fname,lname,password,usertype,muid).then(a=>{
        if(a){
            res.render("SuccessView.ejs")
        }
        else{
            res.render("SignupView.ejs",{err:false})
        }
    })
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
    console.log(user)
       if(user.role==0){
        res.redirect("../student/dashboard")
        console.log("userrole 0 ")
       }
       else{
        res.redirect("../teacher/dashboard")
        console.log("userrole 1 cuk ")
       }

    }
           
    next()

}




module.exports = router;