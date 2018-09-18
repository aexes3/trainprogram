$(document).ready(function () {
    /*FireBase
    ==============================================================*/
      // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB6BUGf-MEBlV7Bz5-nKWZgPNGHfW8DU2E",
    authDomain: "train-app-2.firebaseapp.com",
    databaseURL: "https://train-app-2.firebaseio.com",
    projectId: "train-app-2",
    storageBucket: "train-app-2.appspot.com",
    messagingSenderId: "54665152759"
  };
  firebase.initializeApp(config);

    //Reference database
    database = firebase.database();

    /*Global letiables
    ==============================================================*/
    let trainName = '';
    let dest = '';
    let firstTrainTime = '';
    let freq = '';

    //Conversion letiable
    let firstTimeConverted = '';
    let diffTime = '';
    let tRemainder;
    let tMinutesTillTrain;
    let nextTrain;

    //Data reference
    let trainNameData = '';
    let destData = '';
    let arrivalData = '';
    let freqData = '';
    let minutesAwayData = '';

//testing
    let clickCounter = 0;

        $("#test-button").on('click', function () {
            clickCounter++;
            database.ref().set({
                clickcount: clickCounter

            });
            console.log(clickCounter);
        });

    /*Functions
    ==============================================================*/
    //When Submit button is clicked.....
    $('#submit-button').on('click', function (event) {
        event.preventDefault();
        //Get input info
        trainName = $('#trainName').val().trim();
        dest = $('#dest').val().trim();
        firstTrainTime = $('#firstTrainTime').val().trim();
        freq = $('#freq').val().trim();

        //Removed input info 
        $('#trainName').val('');
        $('#dest').val('');
        $('#firstTrainTime').val('');
        $('#freq').val('');

        //Conversion
        //Convert to HH:MM
        firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
        //Converts the firsTimeCover object into string

        // Current Time
        let currentTime = moment();
        diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Time apart (remainder)
        tRemainder = diffTime % freq;

        // Minute Until Train
        tMinutesTillTrain = freq - tRemainder;

        // Next Train
        nextTrain = moment().add(tMinutesTillTrain, "minutes");
        nextTrainFormat = moment(nextTrain).format('hh:mm');

        database.ref('/trainSchedule').push({
            trainName: trainName,
            destination: dest,
            arrival: nextTrainFormat,
            minutesAway: tMinutesTillTrain,
            frequency: freq
        });
    });

    database.ref('/trainSchedule').on('child_added', function (snap) {
        //Testing
        trainNameData = snap.val().trainName;
        destData = snap.val().destination;
        arrivalData = snap.val().arrival;
        freqData = snap.val().frequency;
        minutesAwayData = snap.val().minutesAway;

        //Data array
        let dataArray = [trainNameData, destData, freqData, arrivalData, minutesAwayData];
        let newTr = $('<tr>');
        for (let i = 0; i < dataArray.length; i++) {
            let newTd = $('<td>');
            newTd.text(dataArray[i]);
            newTd.appendTo(newTr);
        }
        $('.table').append(newTr);
    });
});// End of line