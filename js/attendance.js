/*
data.txt data sequence
1.exam details
2.student attendance
3.total students taking the course exam
4.total barred students
5.total present students (might be [])
*/
var exam;
var student
var flag = false;

window.onload = function () {
    //read file
    fetch('plan_B/data.txt')
    .then(r => r.text())
    .then(t => {
        // data format: json
        exam = Object.values(JSON.parse(t))[0];
        student = Object.values(JSON.parse(t))[1];
        createTable();
    }); 
}

function createTable(){

    for(let i = 0; i < student.length; i++){
        //get the details from schedule
        let id = student[i].indexNo;
        let name = student[i].studentName;
        let programme = student[i].programmeCode;
        let venue = student[i].venue;
        let seatNo = student[i].seat;
        let course = student[i].course;
        let status = student[i].status;
        let statusTag;
        
        //define status tag
        if(status == "Present"){
            statusTag = "present";
        }else if(status == "Barred"){
            statusTag = "barred";
        }else{
            statusTag = updateStatusTag(course, exam);
        }
        
        let row = document.createElement('tr');
        let body = document.getElementsByTagName('tbody')[0];

        rowContents = 
        `
        <td>${id}</td>
        <td>${name}</td>
        <td>${programme}</td>
        <td>${venue}</td>
        <td>${seatNo}</td>
        <td>
            <div class="attendance">
                <div class="course">
                    <div class="status-${statusTag}">${course}</div>
                </div> 
            </div>
        </td>
        `
        row.innerHTML = rowContents;
        body.append(row);
        
    } 
}

function updateStatusTag(course, exam){
    let statusTag;
    let examDate;
    let endTime; 

    //get the end time of the course exam
    for(let i = 0; i < exam.length; i++){
        if(exam[i].course == course){
            examDate = exam[i].date;
            endTime = exam[i].endTime;
            break;
        }
    }
    //date format: YYYY-MM-DD//
    //get current date and time in milliseconds
    let now = new Date();
    now = now.getTime();

    //get exam date and time in milliseconds
    let examDateTime = new Date(
        examDate.slice(0,4),parseInt(examDate.slice(5,7)) - 1,
        examDate.slice(8,10),endTime.slice(0,2),
        endTime.slice(2,4),0,0);

    examDateTime = examDateTime.getTime();

    if(examDateTime >= now){
        statusTag = "pending";
    }else{
        statusTag = "absent";
    }
    return statusTag;
}

var coll = document.getElementsByClassName("collSearchBtn");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}

function updateInputStatus(checkbox){
    //check which checkbox is clicked
    let search;
    //1 = course
    if(checkbox == 1){
        //check whether the input text is enabled or disabled
        search = document.getElementById("searchCourse");
        let disabled = search.disabled;
        //if it is disabled, enable it, and vice versa
        if(disabled){
            search.disabled = false;
        }else{
            search.disabled = true;
            //clear the fields in the input text
            search.value = "";
        }
    }else if(checkbox == 2){
        //check whether the input text is enabled or disabled
        search = document.getElementById("searchIndexNo");
        let disabled = search.disabled;
        //if it is disabled, enable it, and vice versa
        if(disabled){
            search.disabled = false;
        }else{
            search.disabled = true;
            //clear the fields in the input text
            search.value = "";
        }
    }else if(checkbox == 3){
        //check whether the input text is enabled or disabled
        search = document.getElementById("searchProgramme");
        let disabled = search.disabled;
        //if it is disabled, enable it, and vice versa
        if(disabled){
            search.disabled = false;
        }else{
            search.disabled = true;
            //clear the fields in the input text
            search.value = "";
        }
    }else{
        alert("Something went wrong...Error at checkbox");
    }

    //if nothing is selected, submit button is disabled
    let searchCourse = document.getElementById("searchCourse").disabled;
    let searchIndex = document.getElementById("searchIndexNo").disabled;
    let searchProgramme = document.getElementById("searchProgramme").disabled;

    if(!searchCourse || !searchIndex || !searchProgramme){
        document.getElementById("searchBtn").disabled = false;
    }else{
        document.getElementById("searchBtn").disabled = true;
    }

}

function onSubmit(){
    let foundFlag = false;

    //disable search button, checkboxes and all text input
    document.getElementById("searchCourse").disabled = true;
    document.getElementById("searchIndexNo").disabled = true;
    document.getElementById("searchProgramme").disabled = true;
    document.getElementById("course").disabled = true;
    document.getElementById("indexNo").disabled = true;
    document.getElementById("programme").disabled = true;
    document.getElementById("searchBtn").disabled = true;

    //check the status of checkboxes
    let isCourseChecked = document.getElementById("course").checked;
    let isIndexNoChecked = document.getElementById("indexNo").checked;
    let isProgrammeChecked = document.getElementById("programme").checked;

    //get the values in input text
    let courseInput = document.getElementById('searchCourse').value;
    let indexNoInput = document.getElementById('searchIndexNo').value;
    let programmeInput = document.getElementById('searchProgramme').value;


    //console.log(isCourseChecked)
    //console.log(isIndexNoChecked)
    //console.log(isProgrammeChecked)
    
    //if length of list
    let count = student.length;

    if(isCourseChecked && isIndexNoChecked && isProgrammeChecked){
        for(let i = 0; i < count; i++){
            //search found
            if((courseInput == student[i].course) && (indexNoInput == student[i].indexNo) && (programmeInput == student[i].programmeCode)){
                console.log("found");
                //hide the main board
                for(let j = 1; j < count + 1; j++){
                    document.getElementsByTagName("tr")[j].style.display = "none";
                }
    
                let id = student[i].indexNo;
                let name = student[i].studentName;
                let programme = student[i].programmeCode;
                let venue = student[i].venue;
                let seatNo = student[i].seat;
                let course = student[i].course;
                let status = student[i].status;
                let statusTag;
                
                //define status tag
                if(status == "Present"){
                    statusTag = "present";
                }else if(status == "Barred"){
                    statusTag = "barred";
                }else{
                    statusTag = updateStatusTag(course, exam);
                }
    
                let row = document.createElement('tr');
                let body = document.getElementsByTagName('tbody')[0];
    
                rowContents = 
                `
                <td>${id}</td>
                <td>${name}</td>
                <td>${programme}</td>
                <td>${venue}</td>
                <td>${seatNo}</td>
                <td>
                    <div class="attendance">
                        <div class="course">
                            <div class="status-${statusTag}">${course}</div>
                        </div> 
                    </div>
                </td>
                `
                row.innerHTML = rowContents;
                body.append(row);
                //if found flag will be true
                foundFlag = true;
            }
        }
    }else if(isCourseChecked && isIndexNoChecked){
        for(let i = 0; i < count; i++){
            //search found
            if((courseInput == student[i].course) && (indexNoInput == student[i].indexNo)){
                console.log("found");
                //hide the main board
                for(let j = 1; j < count + 1; j++){
                    document.getElementsByTagName("tr")[j].style.display = "none";
                }
    
                let id = student[i].indexNo;
                let name = student[i].studentName;
                let programme = student[i].programmeCode;
                let venue = student[i].venue;
                let seatNo = student[i].seat;
                let course = student[i].course;
                let status = student[i].status;
                let statusTag;
                
                //define status tag
                if(status == "Present"){
                    statusTag = "present";
                }else if(status == "Barred"){
                    statusTag = "barred";
                }else{
                    statusTag = updateStatusTag(course, exam);
                }
    
                let row = document.createElement('tr');
                let body = document.getElementsByTagName('tbody')[0];
    
                rowContents = 
                `
                <td>${id}</td>
                <td>${name}</td>
                <td>${programme}</td>
                <td>${venue}</td>
                <td>${seatNo}</td>
                <td>
                    <div class="attendance">
                        <div class="course">
                            <div class="status-${statusTag}">${course}</div>
                        </div> 
                    </div>
                </td>
                `
                row.innerHTML = rowContents;
                body.append(row);
                //if found flag will be true
                foundFlag = true;
            }
        }
    }else if(isIndexNoChecked && isProgrammeChecked){
        for(let i = 0; i < count; i++){
            //search found
            if((indexNoInput == student[i].indexNo) && (programmeInput == student[i].programmeCode)){
                console.log("found");
                //hide the main board
                for(let j = 1; j < count + 1; j++){
                    document.getElementsByTagName("tr")[j].style.display = "none";
                }
    
                let id = student[i].indexNo;
                let name = student[i].studentName;
                let programme = student[i].programmeCode;
                let venue = student[i].venue;
                let seatNo = student[i].seat;
                let course = student[i].course;
                let status = student[i].status;
                let statusTag;
                
                //define status tag
                if(status == "Present"){
                    statusTag = "present";
                }else if(status == "Barred"){
                    statusTag = "barred";
                }else{
                    statusTag = updateStatusTag(course, exam);
                }
    
                let row = document.createElement('tr');
                let body = document.getElementsByTagName('tbody')[0];
    
                rowContents = 
                `
                <td>${id}</td>
                <td>${name}</td>
                <td>${programme}</td>
                <td>${venue}</td>
                <td>${seatNo}</td>
                <td>
                    <div class="attendance">
                        <div class="course">
                            <div class="status-${statusTag}">${course}</div>
                        </div> 
                    </div>
                </td>
                `
                row.innerHTML = rowContents;
                body.append(row);
                //if found flag will be true
                foundFlag = true;
            }
        }
    }else if(isCourseChecked && isProgrammeChecked){
        console.log("course & programme")
        for(let i = 0; i < count; i++){
            //search found
            if((courseInput == student[i].course) && (programmeInput == student[i].programmeCode)){
                console.log("found");
                //hide the main board
                for(let j = 1; j < count + 1; j++){
                    document.getElementsByTagName("tr")[j].style.display = "none";
                }
    
                let id = student[i].indexNo;
                let name = student[i].studentName;
                let programme = student[i].programmeCode;
                let venue = student[i].venue;
                let seatNo = student[i].seat;
                let course = student[i].course;
                let status = student[i].status;
                let statusTag;
                
                //define status tag
                if(status == "Present"){
                    statusTag = "present";
                }else if(status == "Barred"){
                    statusTag = "barred";
                }else{
                    statusTag = updateStatusTag(course, exam);
                }
    
                let row = document.createElement('tr');
                let body = document.getElementsByTagName('tbody')[0];
    
                rowContents = 
                `
                <td>${id}</td>
                <td>${name}</td>
                <td>${programme}</td>
                <td>${venue}</td>
                <td>${seatNo}</td>
                <td>
                    <div class="attendance">
                        <div class="course">
                            <div class="status-${statusTag}">${course}</div>
                        </div> 
                    </div>
                </td>
                `
                row.innerHTML = rowContents;
                body.append(row);
                //if found flag will be true
                foundFlag = true;
            }
        }
    }else if(isCourseChecked){
        for(let i = 0; i < count; i++){
            //search found
            if((courseInput == student[i].course)){
                console.log("found");
                //hide the main board
                for(let j = 1; j < count + 1; j++){
                    document.getElementsByTagName("tr")[j].style.display = "none";
                }
    
                let id = student[i].indexNo;
                let name = student[i].studentName;
                let programme = student[i].programmeCode;
                let venue = student[i].venue;
                let seatNo = student[i].seat;
                let course = student[i].course;
                let status = student[i].status;
                let statusTag;
                
                //define status tag
                if(status == "Present"){
                    statusTag = "present";
                }else if(status == "Barred"){
                    statusTag = "barred";
                }else{
                    statusTag = updateStatusTag(course, exam);
                }
    
                let row = document.createElement('tr');
                let body = document.getElementsByTagName('tbody')[0];
    
                rowContents = 
                `
                <td>${id}</td>
                <td>${name}</td>
                <td>${programme}</td>
                <td>${venue}</td>
                <td>${seatNo}</td>
                <td>
                    <div class="attendance">
                        <div class="course">
                            <div class="status-${statusTag}">${course}</div>
                        </div> 
                    </div>
                </td>
                `
                row.innerHTML = rowContents;
                body.append(row);
                //if found flag will be true
                foundFlag = true;
            }
        }
    }else if(isIndexNoChecked){
        for(let i = 0; i < count; i++){
            //search found
            if((indexNoInput == student[i].indexNo)){
                console.log("found");
                //hide the main board
                for(let j = 1; j < count + 1; j++){
                    document.getElementsByTagName("tr")[j].style.display = "none";
                }
    
                let id = student[i].indexNo;
                let name = student[i].studentName;
                let programme = student[i].programmeCode;
                let venue = student[i].venue;
                let seatNo = student[i].seat;
                let course = student[i].course;
                let status = student[i].status;
                let statusTag;
                
                //define status tag
                if(status == "Present"){
                    statusTag = "present";
                }else if(status == "Barred"){
                    statusTag = "barred";
                }else{
                    statusTag = updateStatusTag(course, exam);
                }
    
                let row = document.createElement('tr');
                let body = document.getElementsByTagName('tbody')[0];
    
                rowContents = 
                `
                <td>${id}</td>
                <td>${name}</td>
                <td>${programme}</td>
                <td>${venue}</td>
                <td>${seatNo}</td>
                <td>
                    <div class="attendance">
                        <div class="course">
                            <div class="status-${statusTag}">${course}</div>
                        </div> 
                    </div>
                </td>
                `
                row.innerHTML = rowContents;
                body.append(row);
                //if found flag will be true
                foundFlag = true;
            }
        }
    }else if(isProgrammeChecked){
        for(let i = 0; i < count; i++){
            //search found
            if((programmeInput == student[i].programmeCode)){
                console.log("found");
                //hide the main board
                for(let j = 1; j < count + 1; j++){
                    document.getElementsByTagName("tr")[j].style.display = "none";
                }
    
                let id = student[i].indexNo;
                let name = student[i].studentName;
                let programme = student[i].programmeCode;
                let venue = student[i].venue;
                let seatNo = student[i].seat;
                let course = student[i].course;
                let status = student[i].status;
                let statusTag;
                
                //define status tag
                if(status == "Present"){
                    statusTag = "present";
                }else if(status == "Barred"){
                    statusTag = "barred";
                }else{
                    statusTag = updateStatusTag(course, exam);
                }
    
                let row = document.createElement('tr');
                let body = document.getElementsByTagName('tbody')[0];
    
                rowContents = 
                `
                <td>${id}</td>
                <td>${name}</td>
                <td>${programme}</td>
                <td>${venue}</td>
                <td>${seatNo}</td>
                <td>
                    <div class="attendance">
                        <div class="course">
                            <div class="status-${statusTag}">${course}</div>
                        </div> 
                    </div>
                </td>
                `
                row.innerHTML = rowContents;
                body.append(row);
                //if found flag will be true
                foundFlag = true;
            }
        }
    }else{
        alert("Something wen wrong...Error at search")
    }

    //if not found
    if(!foundFlag){
        //hide indicator
        document.getElementsByClassName("sideBoard")[0].style.display = "none";
        
        //hide thead
        document.getElementsByTagName("thead")[0].style.display = "none";
        
        //hide tr
        for(let j = 1; j < count + 1; j++){
            document.getElementsByTagName("tr")[j].style.display = "none";
        }
        //display error msg
        document.getElementById("notFound").innerHTML =  "&#x26A0; Result Not Found! Please Refresh Page...";
        document.getElementById("notFound").style.display = "block";
    }
}

/*
function getResultById(){
    //disable search button and text and radios
    document.getElementById("searchBtn").disabled = true;
    document.getElementById("request").disabled = true;
    document.getElementById("course").disabled = true;
    document.getElementById("student").disabled = true;
    document.getElementById("programme").disabled = true;
    document.getElementById("searchBtn").style.backgroundColor = "#D3D3D3";
    document.getElementById("request").style.backgroundColor = "#D3D3D3";

    let foundFlag = false;
    let request = document.getElementById('request').value;

    //check the request: is course or is student/candidate
    let isGetStudent = document.getElementById("student").checked;
    let isGetProgramme = document.getElementById("programme").checked;
    let isGetCourse = document.getElementById("course").checked;
    
    //if length of list
    let count = student.length;

    //error message
    let errMessage;

    if(isGetCourse){
        errMessage = "&#x26A0; Course Not Found! Please Refresh Page...";
        for(let i = 0; i < count; i++){
            //search found
            if(request == student[i].course){
                console.log("found");
                //hide the main board
                for(let j = 1; j < count + 1; j++){
                    document.getElementsByTagName("tr")[j].style.display = "none";
                }
    
                //i ?? this fcn
                //createTable(candidate,exam);
                //get the details from schedule
                let id = student[i].indexNo;
                let name = student[i].studentName;
                let programme = student[i].programmeCode;
                let course = student[i].course;
                let status = student[i].status;
                let statusTag;
                
                //define status tag
                if(status == "Present"){
                    statusTag = "present";
                }else if(status == "Barred"){
                    statusTag = "barred";
                }else{
                    statusTag = updateStatusTag(course, exam);
                }
    
                let row = document.createElement('tr');
                let body = document.getElementsByTagName('tbody')[0];
    
                rowContents = 
                `
                <td>${id}</td>
                <td>${name}</td>
                <td>${programme}</td>
                <td>
                    <div class="attendance">
                        <div class="course">
                            <div class="status-${statusTag}">${course}</div>
                        </div> 
                    </div>
                </td>
                `
                row.innerHTML = rowContents;
                body.append(row);
                //if found flag will be true
                foundFlag = true;
            }
        }
    }else if (isGetStudent){
        errMessage = "&#x26A0; Candidate Not Found! Please Refresh Page...";
        for(let i = 0; i < count; i++){
            //search found
            if(request == student[i].indexNo){
                console.log("found");
                //hide the main board
                for(let j = 1; j < count + 1; j++){
                    document.getElementsByTagName("tr")[j].style.display = "none";
                }
    
                //i ?? this fcn
                //createTable(candidate,exam);
                //get the details from schedule
                let id = student[i].indexNo;
                let name = student[i].studentName;
                let programme = student[i].programmeCode;
                let course = student[i].course;
                let status = student[i].status;
                let statusTag;
                
                //define status tag
                if(status == "Present"){
                    statusTag = "present";
                }else if(status == "Barred"){
                    statusTag = "barred";
                }else{
                    statusTag = updateStatusTag(course, exam);
                }
    
                let row = document.createElement('tr');
                let body = document.getElementsByTagName('tbody')[0];
    
                rowContents = 
                `
                <td>${id}</td>
                <td>${name}</td>
                <td>${programme}</td>
                <td>
                    <div class="attendance">
                        <div class="course">
                            <div class="status-${statusTag}">${course}</div>
                        </div> 
                    </div>
                </td>
                `
                row.innerHTML = rowContents;
                body.append(row);
                //if found flag will be true
                foundFlag = true;
            }
        }
    }else if(isGetProgramme){
        errMessage = "&#x26A0; Programme Not Found! Please Refresh Page...";
        for(let i = 0; i < count; i++){
            //search found
            if(request == student[i].programmeCode){
                console.log("found");
                //hide the main board
                for(let j = 1; j < count + 1; j++){
                    document.getElementsByTagName("tr")[j].style.display = "none";
                }
    
                //i ?? this fcn
                //createTable(candidate,exam);
                //get the details from schedule
                let id = student[i].indexNo;
                let name = student[i].studentName;
                let programme = student[i].programmeCode;
                let course = student[i].course;
                let status = student[i].status;
                let statusTag;
                
                //define status tag
                if(status == "Present"){
                    statusTag = "present";
                }else if(status == "Barred"){
                    statusTag = "barred";
                }else{
                    statusTag = updateStatusTag(course, exam);
                }
    
                let row = document.createElement('tr');
                let body = document.getElementsByTagName('tbody')[0];
    
                rowContents = 
                `
                <td>${id}</td>
                <td>${name}</td>
                <td>${programme}</td>
                <td>
                    <div class="attendance">
                        <div class="course">
                            <div class="status-${statusTag}">${course}</div>
                        </div> 
                    </div>
                </td>
                `
                row.innerHTML = rowContents;
                body.append(row);
                //if found flag will be true
                foundFlag = true;
            }
        }
    }else{
        alert("An Error Occurred. ERROR::RADIO");
    }
    
    if(!foundFlag){
        //hide indicator
        document.getElementsByClassName("sideBoard")[0].style.display = "none";
        
        //hide thead
        document.getElementsByTagName("thead")[0].style.display = "none";
        
        //hide tr
        for(let j = 1; j < count + 1; j++){
            document.getElementsByTagName("tr")[j].style.display = "none";
        }
        //display error msg
        document.getElementById("notFound").innerHTML = errMessage;
        document.getElementById("notFound").style.display = "block";
    }
}

function changePH(){
    let isGetStudent = document.getElementById("student").checked;
    let isGetProgramme = document.getElementById("programme").checked;
    let isGetCourse = document.getElementById("course").checked;
    if(isGetCourse){
        document.getElementById("request").placeholder = "Course Code";
    }else if(isGetStudent){
        document.getElementById("request").placeholder = "Candidate ID";
    }else if(isGetProgramme){
        document.getElementById("request").placeholder = "Programme Code";
    }else{
        alert("An Error Occurred. ERROR::INPUT.PLACEHOLDER");
    }
}
*/


