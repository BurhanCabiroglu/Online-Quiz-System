const Role = Object.freeze({student:0,teacher:1})

Role.student

class Account{
    constructor(id,firstname,surname,password,role,token){
        this.id = id
        this.firstname = firstname
        this.surname = surname
        this.password = password
        this.role = role
        this.token = token
    }
    toJson(){
        let json = {
            "id":this.id,
            "firstname":this.firstname,
            "surname":this.surname,
            "password":this.password,
            "role":this.role,
            "token":this.token
        };
        return JSON.stringify(json)
    }

    static fromJson(jsonData){
        //jsonData = JSON.parse(jsonData)
        const id = jsonData.id
        const firstname = jsonData.firstname
        const surname = jsonData.surname
        const password =jsonData.password
        const role = jsonData.role_id
        const token = jsonData.token


        return new Account(id,firstname,surname,password,role,token)
    }
}


module.exports = {Account,Role}