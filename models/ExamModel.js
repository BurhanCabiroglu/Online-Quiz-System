const uuid = require("uuid")

class Exam{
    constructor(id,name,startDate,endDate,prepared_id,isReleased,url){
        this.id = id
        this.name = name
        this.startDate = startDate
        this.endDate = endDate
        this.prepared_id = prepared_id
        this.isReleased = isReleased
        if(url!=NaN){
            this.url = url
        }
        else{
            this.url = uuid.v4()
        }
        
    }
    toJson(){
        let json = {
            "id":this.id,
            "name":this.name,
            "start_date":this.startDate,
            "end_date":this.endDate,
            "prepared_id":this.prepared_id,
            "release":this.isReleased,
            "url":this.url
        };
        return JSON.stringify(json)
    }


    static fromJson(jsonData){
        jsonData = JSON.parse(jsonData)
        let id = jsonData.id;
        let name = jsonData.name;
        let startDate = jsonData.startDate;
        let endDate = jsonData.endDate;
        let prepared_id = jsonData.prepared_id;
        let isReleased = jsonData.release;
        let url = jsonData.url;

        return new Exam(id,name,startDate,endDate,prepared_id,isReleased,url)

    }
}

class TakingExam extends Exam{

    constructor(id,name,startDate,endDate,prepared_id,isReleased,url,point,qList,student_id){
        super(id,name,startDate,endDate,prepared_id,isReleased,url)
        this.qList = qList;
        this.point = point;
        this.student_id = student_id
    }

    calculatePoint(){
        var res=0;
        var totalq = this.qList.length;
        console.log("totolq"+totalq)
        var sq = 0 ;
        this.qList.forEach(element => {
            if(element.evaluate()){
                sq+=1;
                console.log("döngğ:"+sq)
            }
        });
        res= sq/totalq * 100;
        this.point = res;
        return res;
    }


}


class StudentTakingExam{
    constructor(student,exam,score){
        this.student = student;
        this.exam = exam;
        this.score = score;
    }
}

module.exports = {Exam,TakingExam,StudentTakingExam}