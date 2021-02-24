const express = require('express');
const PostgresDBC = require('../PostgresDBC');
const {TakingExam,Exam,StudentTakingExam} = require("../models/ExamModel");
const { json } = require('body-parser');

const router = express.Router();



// STUDENT PAGE & STUDENT PROCESS CONTROLLER
// STUDENT SAYFASINDAKI TUM ISLEMLER BURADAN YAPILIR


router.get("/dashboard",checkAuthenticated,async (req,res)=>{
    let val =  await req.user
    res.render("Student/StudentDashboardView.ejs",{user:val})
})

router.get("/exams",checkAuthenticated,async (req,res)=>{
    let val =  await req.user
    let exams = await PostgresDBC.getExamsForStudent(val.id)
    res.render("Student/StudentExamListView.ejs",{user:val,exams:exams})
})
router.get("/results",checkAuthenticated,async (req,res)=>{
    let val =  await req.user
    let texam = await PostgresDBC.getStudentPoint(val.id)
    console.log(texam)
    res.render("Student/StudentResultView.ejs",{user:val,results:texam})
})

router.post("/takexam/:id",checkAuthenticated,async (req,res)=>{
    //console.log(elist)
    let val =  await req.user
    var elist = await PostgresDBC.getTakingExam(req.params.id)
    ///
    res.render("./ExamScreen.ejs",{exams: elist,user:val})
})


router.post("/endexam/:id",checkAuthenticated,async (req,res)=>{
    let val = await req.user;
    let elist = await PostgresDBC.getTakingExam(req.params.id)

    let obj = JSON.parse(JSON.stringify(req.body))
 

    for (let i = 0; i < elist.qList.length; i++) {
        if(obj["group"+i]==NaN && obj["group"+i]==undefined) continue
        elist.qList[i].studentOption = obj["group"+i]
        console.log(obj["group"+i])
        
        
    }
    var point = await elist.calculatePoint()
    elist.student_id = await val.id
    console.log(point)

    
    let i = await PostgresDBC.takedExam(elist)
    //res.redirect("../results")
    res.render("Student/AfterExamView.ejs",{user:val,exams:elist})
})


router.post("/end",(req,res)=>{
    res.redirect("../results")
});



router.get("/",checkAuthenticated,(req,res,next)=>{
    res.redirect("./dashboard")
})


router.post("/logout",(req,res)=>{
    req.logOut()
    res.redirect("../")
    
})






async function checkAuthenticated(req,res,next){
    var val = await req.user;
    if(await req.isAuthenticated()){
        if(val.role=="0"){
            return next()
        }
       
    }
    res.redirect("../login")
    
}

/*
async function checkNotAuthenticated(req,res,next){
    
    let val = await req;
    let user = await req.user
    if(val.isAuthenticated()){
    console.log(user)
       if(user.role==0){
        res.redirect("../student/dashboard")
      
       }
       else{
        res.redirect("../teacher/dashboard")
       }

    }
           
    next()

}
*/

module.exports = router;

