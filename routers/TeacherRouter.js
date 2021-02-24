const express = require('express');
const { Exam } = require('../models/ExamModel');
const { Question } = require('../models/QuestionModel');
const PostgresDBC = require('../PostgresDBC');



const router = express.Router();

// TEACHER PAGE & TEACHER PROCESS CONTROLLER
// OGRETMEN SAYFASINDAKI TUM ISLEMLER BURADAN YAPILIR




router.get("/dashboard",checkAuthenticated,async (req,res)=>{
    let val =  await req.user
    res.render("Teacher/TeacherDashboardView.ejs",{user:val})
})


router.get("/examlist",checkAuthenticated,async (req,res)=>{
    let val =  await req.user
    let exams = await PostgresDBC.getExams(val.id)
    res.render("Teacher/TeacherExamListView.ejs",{user:val,exams:exams})
})


router.get("/createxam",checkAuthenticated, async (req,res)=>{
    let val =  await req.user
    res.render("Teacher/TeacherPrepareExamView.ejs",{user:val})
})

router.post("/:id/delete",checkAuthenticated, async (req,res)=>{
    PostgresDBC.deleteExam(req.params.id)
    res.redirect("../examlist")
})

router.post("/:id/release",checkAuthenticated, async (req,res)=>{
    PostgresDBC.releaseExam(req.params.id)
    res.redirect("../examlist")
})


router.post("/createxam",checkAuthenticated, async (req,res)=>{
   
   
    let val =  await req.user
   
    quesionList = []
    
    let exam = await new Exam("",req.body.examname,req.body.startdate,req.body.enddate,val.id,false,"")
    console.log()
    for (let i = 0; i < req.body.questioncounter; i++) {
        let q = new  Question("",req.body['textarea'+(i+1)],req.body['qa'+(i+1)],req.body['qb'+(i+1)],req.body['qc'+(i+1)],req.body['qd'+(i+1)],req.body['ta'+(i+1)])
        //console.log(q)
        quesionList.push(q)        
    }
    PostgresDBC.createExam(exam,quesionList)
    //PostgresDBC.createQuestion(quesionList,exam.id)

    res.render("Teacher/TeacherSuccessView.ejs",{user:val})
})


router.get("/points",checkAuthenticated,async (req,res)=>{
    let val =  await req.user

    var list = await PostgresDBC.getStudentPoints()
    res.render("Teacher/TeacherPointView.ejs",{user:val,points:list})
})



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
        if(val.role==1){
            console.log("buraya takıldı")
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
       if(user.role!=0){
        res.redirect("../student/dashboard")
        console.log("userrole 0 ")
       }
       else{
        res.redirect("../teacher/dashboard")
        console.log("userrole 1 ")
       }

    }
           
    next()

}
*/





module.exports = router;




