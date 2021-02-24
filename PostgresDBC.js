
const { Pool } = require('pg')
const uuid  = require('uuid')
const PostgreSql = require("pg")
const {Account,Role} = require("./models/AccountModel")
const {QuestionOnExam,Question} = require("./models/QuestionModel")
const {TakingExam,Exam,StudentTakingExam} = require("./models/ExamModel")


// DATABASE CONNECTION CONFIGURATION
// BU KONFIGURASYON DEGISTIRILEREK FARKLI VERITABANLARINA BAGLANILABILIR
var pool = new Pool({
    host: "myclouddatabase.postgres.database.azure.com",
    user:"burhan@myclouddatabase",
    password:"Main12345",
    database:"online_exam_system"
});


// DATABASE PROCESS STATIC CLASS
// TUM VERI TABANI ISLEMLERI BU SINIFTA GERCEKLESIR
class PostgresDBC{
    static async createNewUser(id,fname,lname,password,usertype){
        try {
            var res = await pool.query("INSERT INTO account(id,firstname, surname, password, role_id, token) VALUES ($1,$2,$3,$4,$5,$6)",[id,fname,lname,password,usertype,uuid.v4()])

        } catch (error) {
            return false
        }
        return true
    }
    static async passportControl(id,pass){
        try {
            var res = await pool.query("select * from account where id = $1",[id])
        } catch (error) {
            return false
        }
        if(res.rows==NaN){
            return false;
        }
        let parsword = res.rows[0].password
        
        if(parsword == pass){
            return Account.fromJson(res.rows[0])
        }
        else{
            return false;
        }
    }

    static async idtoUser(id){
        try {
            var res = await pool.query("select * from account where id = $1",[id])
        } catch (error) {
            return false
        }
        let us = Account.fromJson(res.rows[0])
        
        return us
    }

    static async getExamsForStudent(id){
        var res = false;
        var exams = []
        try{
            var res = await pool.query("select exam.id,exam.name,exam.start_date,exam.end_date, exam.prepared_id, exam.release,exam.url from exam where exam.release = true and exam.id not in(select exam_id from student_taking_exam,account where account.id = student_taking_exam.student_id and account.id=$1)",[id])
        }catch(e){
            return false
        }
        if(res!=false){
            for (let index = 0; index < res.rows.length; index++) {
                var ex =  new Exam(res.rows[index].id,
                    res.rows[index].name,
                    res.rows[index].start_date,
                    res.rows[index].end_date,
                    res.rows[index].prepared_id,
                    res.rows[index].release,
                    res.rows[index].url)
                exams.push(ex)

            }

        }
        
        return exams;
    }

    static async getExams(prepared_id){
        var res = false;
        var exams = []
        try{
            var res = await pool.query("select * from exam where prepared_id=$1",[prepared_id])
        }catch(e){
            return false
        }
        if(res!=false){
            for (let index = 0; index < res.rows.length; index++) {
                var ex =  new Exam(res.rows[index].id,
                    res.rows[index].name,
                    res.rows[index].start_date,
                    res.rows[index].end_date,
                    res.rows[index].prepared_id,
                    res.rows[index].release,
                    res.rows[index].url)
                exams.push(ex)

            }

        }
        
        return exams;

    }

    static async getQuestions(exam_id){
        var res = false
        var questions = []
        try{
            res = await pool.query("select * from question where exam_id = $1",[exam_id])
        }
        catch(e){
            return false
        }
        if(res!=false){
            res.rows.forEach(element => {
                questions.push(Question.fromJson(element))
            });
        }
       return questions;
    }

    static async getStudentPoints(){
        var res = false
        var texam = []
        try{
            res = await pool.query("select account.firstname,account.surname,exam.name,student_taking_exam.score from account,student_taking_exam,exam where student_taking_exam.exam_id = exam.id and student_taking_exam.student_id = account.id;")
        }
        catch(e){
            return false
        }
        if(res!=false){
            for (let i = 0; i < res.rows.length; i++) {
                let tex = new StudentTakingExam(res.rows[i].firstname+" "+res.rows[i].surname,res.rows[i].name,res.rows[i].score)
                texam.push(tex)   
            }
        }
       return texam;
    }

    static async createExam(exam,questionlist){
        try{
            await pool.query("insert into exam(name, start_date, end_date, prepared_id, release, url) values ($1,$2,$3,$4,$5,$6)",[exam.name,exam.startDate,exam.endDate,exam.prepared_id,exam.isReleased,uuid.v4()])
        }
        catch(e){
         return false   
        }
        finally{
            var res = await pool.query("select id from exam where name=$1",[exam.name])
            this.createQuestion(questionlist,res.rows[0].id)
        }
    }
    static async createQuestion(questionlist,id){
        try{
            console.log(id)
            for (let i = 0; i < questionlist.length; i++) {
                await this.createaq(questionlist[i],id)
            }
        }
        catch(e){
         return false   
        }
    }

    static async createaq(q,id){
        try{
            
            await pool.query("INSERT INTO question(question_text, option_a, option_b, option_c, option_d, right_option, exam_id) VALUES ($1,$2,$3,$4,$5,$6,$7)",[q.qText,q.optionA,q.optionB,q.optionC, q.optionD,q.rightOption,id])   
    
        }
        catch(e){
            return false
        }
    }

    static async deleteExam(id){
        try{
            await pool.query("delete from student_taking_exam where exam_id =$1",[id])
            await pool.query("delete from question where exam_id=$1",[id])
            await pool.query("delete from exam where id=$1",[id])
           
        }
        catch(e){
         return false   
        }
    }
    static async releaseExam(id){
        try{
            await pool.query("update exam set release=true where id=$1",[id])
        }
        catch(e){
         return false   
        }
    }
    
    static async getTakingExam(id){
        var res = false
        try{
            res = await pool.query('select * from exam where id=$1',[id])
        }
        catch(e){
            return false;
        }
        finally{
            var resa = await this.getQuestions(id)
            console.log(resa)
            var extendList = []
            for (let i = 0; i < resa.length; i++) {
                let q = new QuestionOnExam(
                    resa[i].id,
                    resa[i].qText,
                    resa[i].optionA,
                    resa[i].optionB,
                    resa[i].optionC,
                    resa[i].optionD,
                    resa[i].rightOption,
                    "");    
                extendList.push(q)
            }
            var exam = new TakingExam(
                res.rows[0].id,
                res.rows[0].name,
                res.rows[0].startDate,
                res.rows[0].endDate,
                res.rows[0].prepared_id,
                true,
                res.rows[0].url,
                0,
                extendList,
                "")
            return exam;
        }
    }

    static async takedExam(texam){ // sonnnnnnn değer
        try{
           var m = await pool.query('insert into student_taking_exam(student_id, exam_id, score) VALUES ($1,$2,$3)',[texam.student_id,texam.id,texam.point])
        }catch(e){
            return false;
        }
    }

    static async getStudentPoint(id){
        var res = false
        var texam = []
        try{
            res = await pool.query("select account.firstname, account.surname,exam.name,student_taking_exam.score from account,student_taking_exam,exam where student_taking_exam.exam_id = exam.id and student_taking_exam.student_id = account.id and account.id= $1",[id])
        }
        catch(e){
            return false
        }
        
        if(res!=false){
            for (let i = 0; i < res.rows.length; i++) {
                var tex = new StudentTakingExam((res.rows[i].firstname+" "+res.rows[i].surname),res.rows[i].name,res.rows[i].score)
                texam.push(tex)   
            }
        }
       return texam;
    }

    

}


module.exports = PostgresDBC



