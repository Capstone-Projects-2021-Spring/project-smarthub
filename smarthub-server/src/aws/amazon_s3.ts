import fs from 'fs';
var AWS = require('aws-sdk');
var config = require('./config.json');

//credential validation
try{
    AWS.config.setPromisesDependency();
    AWS.config.update({
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        region: 'us-east-2'
    });
}catch(e){
    console.log('Error: ' + e);
}

//s3 object to interact with physical s3 on aws
const s3 = new AWS.S3({signatureVersion: 'v4'});

//accountName is a folder and profileName is a subFolder in accountName
module.exports.createFolder = async function (accountName : String, profileName : String){
    const response = await s3.putObject({
        Bucket: 'sh-video-storage',
        Key: (accountName + "/" + profileName + "/").replace(/\s/g, "_"),
    }).promise();
    console.log("Folder creation was successful");
    return response;
};

module.exports.uploadFile = async function (accountName : String, profileName : String, filePath : any) {

  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: 'sh-video-storage',
    Key: (accountName + "/" + profileName + "/" + "vid_" + new Date()).replace(/\s/g, "_"),
    Body: fileContent,
    ContentType: "video/webm"
  };

  const response = await s3.upload(params).promise();

  console.log("File Upload Complete.");

  return response;
};

async function getFile (key: String) {

  key = key.replace(/\s/g, "_");

  const signedUrlExpireSeconds: any = 60 * 10080;

  const params = {
    Bucket: 'sh-video-storage',
    Key: key,
    Expires: signedUrlExpireSeconds
  };

  const response = await s3.getSignedUrl('getObject', params);

  return response;
}

module.exports.getKeyList = async function (accountName : String, profileName : String) {

  const key: string = (accountName + "/" + profileName + "/").replace(/\s/g, "_");

  const params = {
    Bucket: 'sh-video-storage',
    Prefix: key,
    ContinuationToken: null
  };

  var allKeys: any = [];

  async function listAllKeys() {

    const response = await s3.listObjectsV2(params).promise();

    var contents = response.Contents;

    for(var i = 1; i < contents.length; i++) {
      allKeys.push(contents[i].Key);
    }

    if (response.NextContinuationToken) {
      params.ContinuationToken = response.NextContinuationToken;
      await listAllKeys(); // RECURSIVE CALL
    }
  }

  await listAllKeys();

  var keyUrlPairs: any = [];

  for (var i = 0; i < allKeys.length; i++){

     var newPair: any = {};
     newPair["key"] = allKeys[i];
     newPair["url"] = await getFile(allKeys[i]);

     keyUrlPairs[i] = newPair;

  }

  return keyUrlPairs;
};
