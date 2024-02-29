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
var schedule
var flag = false;

window.onload = function () {
    //read file
    fetch('plan_B/data.txt')
    .then(r => r.text())
    .then(t => {
        // data format: json
        schedule = Object.values(JSON.parse(t))[0];
        createTable()
    });
}

function createTable(){
    
    for(var i = 0; i < schedule.length; i++){
        
        //get the details from schedule
        let course = schedule[i].course;
        let title = schedule[i].title;
        let examDate = schedule[i].date;
        let startTime = schedule[i].startTime;
        startTime = startTime.slice(0,2) + ":" + startTime.slice(2,4);
        let endTime = schedule[i].endTime;
        endTime = endTime.slice(0,2) + ":" + endTime.slice(2,4);
        let venue = schedule[i].venue;

        let row = document.createElement('tr');
        let body = document.getElementsByTagName('tbody')[0];

        rowContents = 
        `
        <td>${course}</td>
        <td>${title}</td>
        <td>${examDate}</td>
        <td>${startTime}</td>
        <td>${endTime}</td>
        <td>${venue}</td>
        `
        row.innerHTML = rowContents;
        body.append(row);
    } 
}



