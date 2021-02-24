class Question{
    constructor(id,qText,optionA,optionB,optionC,optionD,rightOption){
        this.id = id;
        this.qText = qText;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.rightOption = rightOption
    }

    toJson(){
        let json = {
            "id":this.id,
            "qText":this.qText,
            "optionA":this.optionA,
            "optionB":this.optionB,
            "optionC":this.optionC,
            "optionD":this.optionD,
            "rightOption":this.rightOption
        };
        return JSON.stringify(json)
    }

    static fromJson(jsonData){
        let id = jsonData.id;
        let qText = jsonData.question_text;
        let optionA = jsonData.option_a;
        let optionB = jsonData.option_b;
        let optionC = jsonData.option_c;
        let optionD = jsonData.option_d;
        let right_option = jsonData.right_option;

        return new Question(id,qText,optionA,optionB,optionC,optionD,right_option)
    }
}


class QuestionOnExam extends Question{
    constructor(id,qText,optionA,optionB,optionC,optionD,rightOption,studentOption){
        super(id,qText,optionA,optionB,optionC,optionD,rightOption)
        this.studentOption = studentOption
    }

    evaluate(){
        if(this.studentOption==undefined){
            return false
        }
        else{
            if(this.studentOption == this.rightOption){
                return true
            }
            else{
                return false
            }
        }
        
    }
}



module.exports = {Question,QuestionOnExam}