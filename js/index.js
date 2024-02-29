/*
data.txt data sequence
1.exam details
2.student attendance
3.total students taking the course exam
4.total barred students
5.total present students (might be [])
*/

var exam;
var totalStudents;
var barredStudents;
var presentStudents;
var inviVenueAss;
var totalStudByVenue;
var nullStudents;

window.onload = function () {
    //read file
    fetch('plan_B/data.txt')
    .then(r => r.text())
    .then(t => {
        // data format: json
        exam = Object.values(JSON.parse(t))[0];
        totalStudents = Object.values(JSON.parse(t))[2];
        barredStudents = Object.values(JSON.parse(t))[3]
        presentStudents = Object.values(JSON.parse(t))[4];
        inviVenueAss = Object.values(JSON.parse(t))[7];
        totalStudByVenue = Object.values(JSON.parse(t))[8];
        nullStudents = Object.values(JSON.parse(t))[9];

        addCard();
        drawAttendanceChart();
        drawInviStudChart();

        
    }); 
}

//update card
function addCard() {

    //ALWAYS CHECK YOUR DATA
    console.log(exam)
    console.log(totalStudents)

    //exam flag: to tell whether there's exam on today or not
    let examCount = 0;

    let card = document.createElement('div')
    card.classList.add('card')
    let cardBox = document.getElementsByClassName('cardBox')[0];
    let cardContents = "";

    for(var i = 0; i < exam.length; i++){
        //card details
        let course = exam[i].course;
        let examDate = exam[i].date;
        let startTime = exam[i].startTime;
        startTime = startTime.slice(0,2) + ":" + startTime.slice(2,4);
        let endTime = exam[i].endTime;
        endTime = endTime.slice(0,2) + ":" + endTime.slice(2,4);
        let venue = exam[i].venue;

        //convert time into string, then into milliseconds, then compare it
        //add zero to number
        Number.prototype.pad = function(digits){
            for(var n = this.toString(); n.length < digits; n = 0 + n);
            return n;
          }
        //date format: YYYY-MM-DD//
        //current time
        let now = new Date();
        let nowDateStr = 
        now.getFullYear().toString() + "-" + 
        (now.getMonth() + 1).pad(2) + "-" + 
        now.getDate().pad(2);
        
        card = document.createElement('div')
        card.classList.add('card')
        cardBox = document.getElementsByClassName('cardBox')[0];                                

        //check whether the exam is on today
        if(examDate === nowDateStr){
            cardContents= `
            <div>
                <div class="cardName">Today's Exam</div>
                <div id="${course}_course">${course}</div>
                <div id="${course}_duration">
                    <div id="${course}_startTime">${startTime}</div>
                    &#x21E8;
                    <div id="${course}_endTime">${endTime}</div>
                </div>
                <div id="${course}_venue">${venue}</div>
            </div>
            <div class="iconBx">
                <ion-icon name="document-text-outline"></ion-icon>
            </div>
            `
            card.innerHTML = cardContents;
            cardBox.append(card);
            examCount += 1;
        }else if((examDate.slice(8,10) - nowDateStr.slice(8,10) == 1) && 
                examDate.slice(0,7) == nowDateStr.slice(0,7)){
            //check whether exam is on tmr
            cardContents= `
            <div>
                <div class="cardName">Tomorrow's Exam</div>
                <div id="${course}_course">${course}</div>
                <div id="${course}_duration">
                    <div id="${course}_startTime">${startTime}</div>
                    &#x21E8;
                    <div id="${course}_endTime">${endTime}</div>
                </div>
                <div id="${course}_venue">${venue}</div>
            </div>
            <div class="iconBx">
                <ion-icon name="document-text-outline"></ion-icon>
            </div>
            `
            card.innerHTML = cardContents;
            cardBox.append(card);
            examCount += 1;
        }
    }
    //if there's no exam today
    if(examCount == 0){
        card = document.createElement('div')
        card.classList.add('card')
        cardBox = document.getElementsByClassName('cardBox')[0];

        cardContents=`
        <div>
            <div 
            style="margin-top: 25px;
                    margin-left: 10px;">
                <div id="_course"
                style="font-size: 21px;">
                    No Recent Exam
                </div>    
            </div>
        </div>
        `
        cardBox.style.margin = "0px";
        card.innerHTML = cardContents;
        cardBox.append(card);
    }
}

//create bar chart
//attendance percentage
function drawAttendanceChart() {
    //set the data
    let dataArray = [];
    let count = totalStudents.length

    //configure present/pending/absent array first -> this a bit troublesome
    let presentArray = new Array(count).fill(0)
    let pendingArray = new Array(count).fill(0)
    let absentArray = new Array(count).fill(0)

    //define present course
    for(let i = 0; i < count; i++){
        for(let j = 0; j < presentStudents.length; j++){
            if(totalStudents[i].course == presentStudents[j].course){
                presentArray[i] = presentStudents[j].count;
            }
        }
    }

    //date format: YYYY-MM-DD//
    //get current date and time in milliseconds
    let now = new Date();
    now = now.getTime();
    //set absent and pending array/data
    for(let i = 0; i < count; i++){
        let examDate = nullStudents[i].examDate;
        console.log(examDate)
        
        let endTime = nullStudents[i].endTime;
        //get exam date and time in milliseconds
        let examDateTime = new Date(
        examDate.slice(0,4),parseInt(examDate.slice(5,7)) - 1,
        examDate.slice(8,10),endTime.slice(0,2),
        endTime.slice(2,4),0,0);
        examDateTime = examDateTime.getTime();

        console.log(examDateTime)

        if(examDateTime >= now){
            pendingArray[i] = nullStudents[i].count;
        }else{
            absentArray[i] = nullStudents[i].count;
        }

    }

    console.log(pendingArray)
    console.log(absentArray)
    
    for(let i = 0; i < count; i++){
        let yAxis = totalStudents[i].course;
        let innerArray = [yAxis,
                        pendingArray[i],
                        presentArray[i],
                        absentArray[i],
                        barredStudents[i].count,
                        presentArray[i] / pendingArray[i]];
        dataArray.push(innerArray);
    }
  
    // data
    var data = anychart.data.set(dataArray);
    
    // map data
    var firstData = data.mapAs({x: [0], value: [1]});
    var secondData = data.mapAs({x: [0], value: [2]});
    var thirdData = data.mapAs({x: [0], value: [3]});
    var fourthData = data.mapAs({x: [0], value: [4]});
    var fifthData = data.mapAs({x: [0], value: [5]});
    
    // chart type
    var chart = anychart.column();

    // turn on chart animation
    chart.animation(true);

    // create scale for line series and extraYAxis
    // it force line series to not stuck with over series
    var scale = anychart.scales.linear();
    scale.minimum(0).maximum(100).ticks({ interval: 25 });

    var extraYAxis = chart.yAxis(1);
    extraYAxis.orientation('right').scale(scale);
    extraYAxis.labels().padding(0, 0, 0, 5);

    // setup axis to append '%' symbol to label values
    extraYAxis.labels().format('{%Value}%');

    // set data
    var series1 = chart.column(firstData);
    series1.name("Pending");
    var series2 = chart.column(secondData);
    series2.name("Present");
    var series3 = chart.column(thirdData);
    series3.name("Absent");
    var series4 = chart.column(fourthData);
    series4.name("Barred");
    // create line series and set scale for it
    var series5 = chart.line(fifthData);
    series5.name("Present Percentage");
    series5.yScale(scale).markers(true);
     
    //original axis
    //var xAxis = chart.xAxis();
    //xAxis.title("Course");
    //var yAxis = chart.yAxis();
    //yAxis.title("Count");
    
    // legend settings
    var legend = chart.legend();
    legend.titleSeparator(true);
    // enable legend
    legend.enabled(true);
    // set legend position
    legend.position("center");
    // set legend align
    legend.align("center");
    // set items layout
    legend.itemsLayout("horizontal"); 
    
    // draw chart
    chart.container("attChart");
    chart.draw();
    
};

// create pieChart
function drawInviStudChart() {

    //set the data
    let dataArray = [];
    let count = inviVenueAss.length
    
    for(let i = 0; i < count; i++){
        let yAxis = "\t" + inviVenueAss[i].venue + "\n" + inviVenueAss[i].date + "\n" + 
                inviVenueAss[i].starttime + "-" + inviVenueAss[i].endtime;
        let innerArray = [yAxis,
                        inviVenueAss[i].count,
                        totalStudByVenue[i].count,
                        (totalStudByVenue[i].count / inviVenueAss[i].count)];
        dataArray.push(innerArray);
    }

    var dataSet = anychart.data.set(dataArray);

      // map data for the first series, take x from the zero column and value from the first column of data set
      var firstSeriesData = dataSet.mapAs({ x: 0, value: 1 });

      // map data for the second series, take x from the zero column and value from the second column of data set
      var secondSeriesData = dataSet.mapAs({ x: 0, value: 2 });

      // map data for the third series, take x from the zero column and value from the third column of data set
      var thirdSeriesData = dataSet.mapAs({ x: 0, value: 3 });

      // create column chart
      var chart = anychart.column();

      // turn on chart animation
      chart.animation(true);

      // force chart scale to stuck series values
      chart.yScale().stackMode('value');

      // create scale for line series and extraYAxis
      // it force line series to not stuck with over series
      var scale = anychart.scales.linear();
      scale.minimum(0).maximum(10).ticks({ interval: 2 });

      // create extra axis on the right side of chart
      // and set scale for it
      var extraYAxis = chart.yAxis(1);
      extraYAxis.orientation('right').scale(scale);
      extraYAxis.labels().padding(0, 0, 0, 5);

      // create first series with mapped data
      var series1 = chart.column(firstSeriesData);
      series1.name("Invigilator");

      // create second series with mapped data
      var series2 = chart.column(secondSeriesData);
      series2.name("Student");

      //chart.crosshair(true);

      // create line series and set scale for it
      var lineSeries = chart.line(thirdSeriesData);
      lineSeries.yScale(scale).markers(true);
      lineSeries.name("Invigilator to Student Ratio")

      // legend settings
      var legend = chart.legend();
      legend.titleSeparator(true);
      // enable legend
      legend.enabled(true);
      // set legend position
      legend.position("top");
      // set legend align
      legend.align("center");
      // set items layout
      legend.itemsLayout("horizontal"); 

      // set container id for the chart
      chart.container('inviStudChart');

      // initiate chart drawing
      chart.draw();
}




