// PASSPORT JS (YETKILENDIRME ISLEMI STRATEJISI) STRATEGY
// KULLANICININ SIFRE VE KULLANICI ID ISLEMLERI SORGULANIR. EGER ESLESME OLUR ISE YETKILENDIRME SAGLANIR.

const LocalStrategy = require('passport-local').Strategy

const PostgresDBC = require("./PostgresDBC")




function initialize(passport){
    const authenticateUser = async (userno,password,done) => {
        var user = false
        try{
            user  = await PostgresDBC.passportControl(userno,password)
        }
        catch(e){
            return done(null,false,{message:false})
        }
       

       if(user==false){
            return done(null,false,{message:false})
        }
        else{
            return done(null,user)
        }
        
    }
    passport.use(new LocalStrategy({usernameField:'userno'},authenticateUser))
    passport.serializeUser((user,done)=>{done(null,user.id)})
    passport.deserializeUser((id,done)=>{
        return done(null,PostgresDBC.idtoUser(id))
    })
    
}







module.exports = initialize;