import fs from 'fs';
var AWS = require('aws-sdk');
const secureEnv = require('secure-env');
process.env = secureEnv({secret: 'SmartHub'});

const envVars = process.env;

// Credential validation
try{
    AWS.config.setPromisesDependency();
    AWS.config.update({
        accessKeyId: envVars.AWS_ACCESS_KEY_ID,
        secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
        region: envVars.AWS_DEFAULT_REGION
    });
}catch(e){
    console.log('Error: ' + e);
}

// S3 object to interact with physical S3 on AWS.
const s3 = new AWS.S3({signatureVersion: 'v4'});

/*
		Use: Creates a new folder (userEmail/profileName/componentName) in the S3 bucket.
		Params: user email, profile name, component name.
*/
module.exports.createFolder = async function (accountName : String, profileName: String, componentName: String){
    const response = await s3.putObject({
        Bucket: envVars.S3_BUCKET,
        Key: (accountName + "/" + profileName + "/" + componentName + "/").replace(/\s/g, "_"),
    }).promise();
    console.log("Folder creation was successful");
    return response;
};

/*
		Use: Uploads a local image file to the S3.
		Params: user email, profile name, component name, file path.
*/
module.exports.storeImageV2 = async function (accountName : String, profileName : String, componentName: String, filePath : any) {

  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: envVars.S3_BUCKET,
    Key: (accountName + "/" + profileName + "/" + componentName + "/" + "img_" + new Date()).replace(/\s/g, "_"),
    Body: fileContent,
    ContentType: "image/png"
  };

  const response = await s3.upload(params).promise();

  console.log("AWS S3: Local image uploaded.");

  return response;
};

/*
		Use: Uploads a local video file (webm) under accountName/profileName/componentName/fileName.
		Params: user email, profile name, component name, file path.
*/
module.exports.storeRecording = async function (accountName : String, profileName : String, componentName: String, filePath : any) {

  const fileContent = fs.readFileSync(filePath);

  const key = (accountName + "/" + profileName + "/" + componentName + "/" + "vid_" + new Date()).replace(/\s/g, "_");

  const params = {
    Bucket: envVars.S3_BUCKET,
    Key: key,
    Body: fileContent,
    ContentType: "video/webm"
  };

  const response = await s3.upload(params).promise();

  console.log("AWS S3: Local recording uploaded.");

  return response;
};

/*
		Use: Uploads a image dataURI under accountName/profileName/componentName/fileName (fileName is a time stamp).
		Params: user email, profile name, component name, data URI.
*/
module.exports.storeImage = async function storeImage (accountName : String, profileName : String, componentName: String, dataURI: String) {

  var buf = Buffer.from(dataURI.replace(/^data:image\/\w+;base64,/, ""), 'base64');

  const key = (accountName + "/" + profileName + "/" + componentName + "/" + "img_" + new Date()).replace(/\s/g, "_");

  const params = {
    Bucket: envVars.S3_BUCKET,
    Key: key,
    Body: buf,
    ContentType: "image/png"
  };

  const response = await s3.upload(params).promise();

  console.log("File V2 Upload Complete.");

  return response;
}

/*
		Use: Generates a signed URL for the specified file in the S3.
		Params: s3 key name.
*/
async function generateSignedURL (key: String) {

  key = key.replace(/\s/g, "_");
  // Max duration of one week for signed URLs.
  const signedUrlExpireSeconds: any = 60 * 10080;

  const params = {
    Bucket: envVars.S3_BUCKET,
    Key: key,
    Expires: signedUrlExpireSeconds
  };

  const response = await s3.getSignedUrl('getObject', params);

  return response;
}

module.exports.generateSignedURL = generateSignedURL;

/*
		Use: Delete a file in the S3.
		Params: s3 key name.
*/
module.exports.deleteFile = async function deleteFile (key: String) {

  key = key.replace(/\s/g, "_");

  const params = {
    Bucket: envVars.S3_BUCKET,
    Key: key
  };

  const response = await s3.deleteObject(params).promise();

  return response;
}

/*
		Use: Returns an array of file key names under a folder with signed urls.
		Params: user email, profile name, component name.
*/
module.exports.getKeyList = async function (accountName : String, profileName : String, componentName: String) {

  const key: string = (accountName + "/" + profileName + "/" + componentName + "/").replace(/\s/g, "_");

  const params = {
    Bucket: envVars.S3_BUCKET,
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
     newPair["url"] = await generateSignedURL(allKeys[i]);

     keyUrlPairs[i] = newPair;

  }

  return keyUrlPairs;
};
