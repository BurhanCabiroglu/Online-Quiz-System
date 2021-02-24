
function logout(){
     
        var form = document.createElement("form")
        form.setAttribute("method", "post"); 
        form.setAttribute("action", "./logout");  
        var fn = document.createElement("button"); 
        fn.setAttribute("type", "submit"); 
        
        form.appendChild(fn)
        document.getElementsByTagName("body")[0].appendChild(form)
        fn.click()
}
  
      
var logoutBtn = document.getElementById("logoutBtn")

logoutBtn.addEventListener("click",logout)
      
console.log("running")