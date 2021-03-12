var AWS = require('aws-sdk');
var config = require('./config.json')

//credential validation
try{
    AWS.config.setPromisesDependency();
    AWS.config.update({
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        region: 'us-east-1' 
    });
}catch(e){
    console.log('Error: ' + e);
}

//s3 object to interact with physical s3 on aws
const s3 = new AWS.S3();

//accountName is a folder and profileName is a subFolder in accountName
module.exports.createFolder = async function (accountName : String, profileName : String){
    const response = await s3.putObject({
        Bucket: 'sh-video-storage',
        Key: accountName + "/" + profileName + "/"
    }).promise();
    console.log("Folder creation was successful");
    return response;
};
