var axios = require('axios');
var assert = require('assert');

function testUnlock(unlockTime, expectedUnlockTime) {
    console.log("=========================== UNLOCK TESTING ===========================");
    var data = {};
    var url = "http://localhost:4000";
    data.lockTimeout = unlockTime;

    var expectedResult = "Unlocking for " + expectedUnlockTime + " seconds";
    console.log("Expects: " + expectedResult);

    axios.post(url + "/lock/unlock", data).then((response) => {
        
        console.log("Request Success Result: " + response.data.message);
        
        //COMPARING EXPECTED AND RECEIVED RESULTS.
        assert.strictEqual(expectedResult, response.data.message, "The resulting message did not match the expected message.");

    }).catch( (error) => {
        console.log(error);
    });
}

function testStartStream(expectedResult) {
    console.log("=========================== START STREAM TESTING ===========================");
    var data = {};
    var url = "http://petepicam1234.zapto.org:4000";

    console.log("Expects: " + expectedResult);

    axios.post(url + "/video/start_stream", data).then((response) => {
        
        console.log("Request Success Result: " + response.status);
        
        //COMPARING EXPECTED AND RECEIVED RESULTS.
        assert.strictEqual(expectedResult, response.status, "The resulting status did not match the expected message.");

    }).catch( (error) => {
        console.log(error);
    });
}

function testStopStream(expectedResult) {
    console.log("=========================== START STREAM TESTING ===========================");
    var data = {};
    var url = "http://petepicam1234.zapto.org:4000";
    console.log("Expects: " + expectedResult);
    axios.post(url + "/video/stop_stream", data).then((response) => {
        
        console.log("Request Success Result: " + response.status);
        
        //COMPARING EXPECTED AND RECEIVED RESULTS.
        assert.strictEqual(expectedResult, response.status, "The resulting status did not match the expected message.");

    }).catch( (error) => {
        console.log(error);
    });
}

function testStartIntercom(expectedResult) {
    console.log("=========================== START INTERCOM TESTING ===========================");
    var data = {};
    var url = "http://petepicam1234.zapto.org:4000";
    console.log("Expects: " + expectedResult);
    axios.post(url + "/audio/start_intercom", data).then((response) => {
        
        console.log("Request Success Result: " + response.status);
        
        //COMPARING EXPECTED AND RECEIVED RESULTS.
        assert.strictEqual(expectedResult, response.status, "The resulting status did not match the expected message.");

    }).catch( (error) => {
        console.log(error);
    });
}

function testStopIntercom(expectedResult) {
    console.log("=========================== STOP INTERCOM TESTING ===========================");
    var data = {};
    var url = "http://petepicam1234.zapto.org:4000";
    console.log("Expects: " + expectedResult);
    axios.post(url + "/audio/stop_intercom", data).then((response) => {
        
        console.log("Request Success Result: " + response.status);
        
        //COMPARING EXPECTED AND RECEIVED RESULTS.
        assert.strictEqual(expectedResult, response.status, "The resulting status did not match the expected message.");

    }).catch( (error) => {
        console.log(error);
    });
}

function testToggleLights(expectedResult) {
    console.log("=========================== TOGGLE LIGHT TESTING ===========================");
    var data = {};
    data.red = 1;
    data.green = 1;
    data.blue = 1;
    data.randomize = false;
    var url = "http://johnnyspi.ddns.net:4000";
    console.log("Expects: " + expectedResult);
    axios.post(url + "/lights", data).then((response) => {
        
        console.log("Request Success Result: " + response.status);
        
        //COMPARING EXPECTED AND RECEIVED RESULTS.
        assert.strictEqual(expectedResult, response.status, "The resulting status did not match the expected message.");

    }).catch( (error) => {
        console.log(error);
    });
}

(() => {

    //testUnlock(5, 5);
    //testStartStream(200);
    //testStopStream(200);
    //testStartIntercom(200);
    //testStopIntercom(200);
    testToggleLights(200);


})();
