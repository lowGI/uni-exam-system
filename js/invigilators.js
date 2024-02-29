/*
data.txt data sequence
1.exam details
2.student attendance
3.total students taking the course exam
4.total barred students
5.total present students (might be [])
6.invigilator list
*/

var exam
var invigilators
var ciList;
var flag = false;

window.onload = function () {
    //read file
    fetch('plan_B/data.txt')
    .then(r => r.text())
    .then(t => {
        // data format: json
        exam = Object.values(JSON.parse(t))[0];
        invigilators = Object.values(JSON.parse(t))[5];
        createTable()
    }); 
}

function createTable(){

    let courseArray = [];
    //generate course list:
    for(let i = 0; i < exam.length; i++){
        courseArray.push(exam[i].course);
    }

    //create an object {"course" : "array of invi name"}
    
    let list = [];
    for(let i = 0; i < courseArray.length; i++){
        let outerArr = [];
        console.log(outerArr[0]);
        for(let j = 0; j < invigilators.length; j++){
            if(courseArray[i] === invigilators[j].course){
                let innerArr = [invigilators[j].staffid, invigilators[j].name, invigilators[j].venue];
                outerArr.push(innerArr)
            }
            //if the list reached the end, put it into dictionary
            if(j == invigilators.length - 1){
                let innerList = [courseArray[i], outerArr]
                list.push(innerList);
            }
        }
    }

    console.log(list);
    //for searching
    ciList = list;

    //write to html
    //number of courses
    for(let i = 0; i < list.length; i++){
        let course = list[i][0];
        let venue;
        //number of invigilators
        let subContents = "";
        for(let j = 0; j < list[i][1].length; j++){
            //get the details from invigilators
            let id = list[i][1][j][0];
            let name = list[i][1][j][1];
            venue = list[i][1][j][2];
            console.log(venue)
            
            //get this user
            let user;
            if(sessionStorage.getItem("name") == name){
                user =  "USER";
                subContents += 
                `<tr style="background-color:#8de02c;">
                    <td>${id}</td>
                    <td>${name}</td>
                    <td style="font-size: 15px; font-weight: bold;">${user}</td>
                </tr>
                `
            }else{
                user =  "";
                subContents += 
                `<tr>
                    <td>${id}</td>
                    <td>${name}</td>
                    <td>${user}</td>
                </tr>
                `
            }
    
        }
        let row = document.createElement('div');
        row.classList.add("tableList")
        let body = document.getElementsByClassName('mainBoard')[0];
            
        rowContents = 
        `
        <div class="tableTitle">
          <h2>${course} (${venue})</h2>
        </div>
        <table>
            <thead>
                <tr>
                    <td>Staff ID</td>
                    <td>Name</td>
                    <td></td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    ${subContents}
                </tr>
            </tbody>
        </table>
        `
        row.innerHTML = rowContents;
        body.append(row); 
    }
    
}

function getCourseById(){
    //disable search button and text
    document.getElementById("searchBtn").disabled = true;
    document.getElementById("request").disabled = true;
    document.getElementById("searchBtn").style.backgroundColor = "#D3D3D3";
    document.getElementById("request").style.backgroundColor = "#D3D3D3";

    let foundFlag = false;
    let request = document.getElementById('request').value;
    
    for(let i = 0; i < ciList.length; i++){
        //search found
        if(request == ciList[i][0]){
            console.log(ciList[0][0])
            console.log("found");
            //hide the main board
            document.getElementsByClassName("mainBoard")[0].style.display = "none";
            
            let course = ciList[i][0];
            let venue;
            //number of invigilators
            let subContents = "";
            for(let j = 0; j < ciList[i][1].length; j++){
                //get the details from invigilators
                let id = ciList[i][1][j][0];
                let name = ciList[i][1][j][1];
                venue = ciList[i][1][0][2];
                
                //get this user
                let user;
                if(sessionStorage.getItem("name") == name){
                    user =  "USER";
                    subContents += 
                    `<tr style="background-color:#8de02c;">
                        <td>${id}</td>
                        <td>${name}</td>
                        <td style="font-size: 15px; font-weight: bold;">${user}</td>
                    </tr>
                    `
                }else{
                    user =  "";
                    subContents += 
                    `<tr>
                        <td>${id}</td>
                        <td>${name}</td>
                        <td>${user}</td>
                    </tr>
                    `
                }
            }
            let row = document.createElement('div');
            row.classList.add("tableList")
            let body = document.getElementsByClassName('mainBoard')[1];
                
            rowContents = 
            `
            <div class="tableTitle">
              <h2>${course} (${venue})</h2>
            </div>
            <table>
                <thead>
                    <tr>
                        <td>Staff ID</td>
                        <td>Name</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        ${subContents}
                    </tr>
                </tbody>
            </table>
            `
            row.innerHTML = rowContents;
            body.append(row); 
            //if found flag will be true
            foundFlag = true;
        }
    }

    if(!foundFlag){
        //hide indicator
        document.getElementsByClassName("mainBoard")[0].style.display = "none";

        //display error msg
        document.getElementById("notFound").style.display = "block";
    }
}
