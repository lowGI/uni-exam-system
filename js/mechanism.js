//check sign out -> session storage
//get staff details

//get staff details
if(sessionStorage.getItem("staffId") == null && sessionStorage.getItem("password") == null){
    alert("Session Timeout! Please Login Again...");
    window.location.href = "login.html";
}else{
    document.getElementsByTagName("span")[1].innerHTML = sessionStorage.getItem("name");
}

function showUserDetails(){
    //store user info to session storage: prevent logout renavigate
    let staffId = sessionStorage.getItem("staffId");
    let name = sessionStorage.getItem("name");
    let password = sessionStorage.getItem("password");
    let message = "Staff ID :      " + staffId + "\n" +
                "Username :  " + name + "\n" +
                "Password :   " + password;
    alert(message)
}

function signOut(){
    sessionStorage.clear();
}
