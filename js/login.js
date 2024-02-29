/*
data.txt data sequence
1.exam details
2.student attendance
3.total students taking the course exam
4.total barred students
5.total present students (might be [])
6. invi id name handle course
7. invi id and password
*/

var iDetails

fetch('plan_B/data.txt')
    .then(r => r.text())
    .then(t => {
        // get the data from file
        iDetails = Object.values(JSON.parse(t))[6];
    });

function onSubmit(){
    let loginFlag = false;
    //get data from manual input
    var staffId= document.getElementById("staffId").value;
    var password =  document.getElementById("password").value;

    //check staff id and pass => cannot be empty and incorrect!
    for(let i = 0; i < iDetails.length; i++){
        if(staffId == iDetails[i].staffid && password == iDetails[i].password){
          alert("Hi " + iDetails[i].name + "! Welcome Back.");
          sessionStorage.setItem("staffId", staffId);
          sessionStorage.setItem("password", password);
          sessionStorage.setItem("name", iDetails[i].name);
          window.location.href = "index.html";
          loginFlag = true;
          break;
        }
    }

    if(!loginFlag){
        if(staffId == "" && password ==""){
            alert("Please fill in ALL the fields");
        }else if(staffId == ""){
            alert("Please fill in the STAFF ID field");
        }else if (password == ""){
            alert("Please fill in the PASSWORD field");
        }else{
            alert("INVALID USER");
        }
    }
}

function showRandom(){
    let index = Math.floor(Math.random() * 100);
    let randID = iDetails[index].staffid;
    let randPassword = iDetails[index].password;

    document.getElementsByClassName("hiddenText")[0].innerHTML = 
    "id: " + randID + "<br/>pswd: " + randPassword;
}