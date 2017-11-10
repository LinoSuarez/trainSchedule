$("#submitButton").on("click", function(event) {
    event.preventDefault();
    var trainName = $("#nameVal").val().trim();
    var destination = $("#destinationVal").val().trim();
    var firstTrain = $("#firstTrainVal").val().trim();
    var freq = $("#frequencyVal").val().trim();
    pushData(trainName, destination, firstTrain, freq);
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function addElementTable(trainName, destination, firstTrainTime, freq) {

    var nextArrival = getNextArrival(freq, firstTrainTime);
    var minutes = minutesAway(nextArrival);
    var tr = $("<tr>");

    tr.append($("<td>").text(trainName));
    tr.append($("<td>").text(destination));
    tr.append($("<td>").text(freq));
    tr.append($("<td>").text(nextArrival));
    tr.append($("<td>").text(minutes));


    $("#employeeTable").append(tr);

}

function getNextArrival(freq, strtTime){
    var currentTime = moment().unix();
    var startTime = moment(strtTime, "HH:mm").unix();

    while (startTime < currentTime){
        startTime = moment.unix(startTime).add(freq, 'm').unix();
    }
    return moment.unix(startTime).format("HH:mm")
}
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}
function minutesAway(nextArrival){
    // var currentTime = moment();
    // var nextArrival = moment(nextArrival, "HH:mm");

    // var final = nextArrival.subtract(currentTime).format("mm")
    // return (final)
    // console.log(nextArrival)
    return Math.abs(moment().diff(moment(nextArrival, "HH:mm"), "minutes"))
    // return moment(nextArrival, "HH:mm").diff(moment());
    //return moment().subtract(nextArrival, 'h')
    //var myDate = new Date().toTimeString()
    //return currentTime.toHHMMSS();
    //return moment(nextArrival, "HH:mm").subtract(currentTime, 's').format("m");
}
var config = {
    apiKey: "AIzaSyAPl4_ua9X9xD-BHWESxWg0iCMCuAGtSfU",
    authDomain: "train-schedule-d5d90.firebaseapp.com",
    databaseURL: "https://train-schedule-d5d90.firebaseio.com",
    projectId: "train-schedule-d5d90",
    storageBucket: "",
    messagingSenderId: "199645563680"
  };

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();


function pushData(trainName, destination, firstTrain, freq) {
    //var monthsWorked = monthDiff(new Date(date));
    //var totalBilled = 10;


    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrain,
        frequency: freq
    })
}


database.ref().on('child_added', function(data) {
    addElementTable(data.val().trainName,
        data.val().destination,
        data.val().firstTrainTime,
        data.val().frequency);
});

function monthDiff(d1) {
    d2 = new Date();
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}