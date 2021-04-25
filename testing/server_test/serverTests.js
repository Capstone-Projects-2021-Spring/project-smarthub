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

function testUnlosck() {

    var data = {};
    var url = "http://localhost:4000";
    data.lockTimeout = 5;

    var expectedResult = "Unlocking for " + data.lockTimeout + " seconds";
    console.log("Expects: " + expectedResult);

    axios.post(url + "/lock/unlock", data).then((response) => {
        console.log("Request Success Result: " + response.data.message);
        
        //COMPARING EXPECTED AND RECEIVED RESULTS.
        assert.strictEqual(expectedResult, response.data.message, "The resulting message did not match the expected message.");

    }).catch( (error) => {
        console.log(error);
    });

}

(() => {

    testUnlock(5, 5);
    

})();
