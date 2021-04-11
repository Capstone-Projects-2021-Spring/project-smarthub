import fs from 'fs';
var AWS = require('aws-sdk');
require('dotenv').config();
import * as dotenv from 'dotenv';
const path:string = './.env';
dotenv.config({path});
const envVars = process.env;

import { v4 as uuidv4 } from 'uuid';

//credential validation
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

//s3 object to interact with physical s3 on aws
const s3 = new AWS.S3({signatureVersion: 'v4'});

//userEmail is a folder and profileName is a subFolder in userEmail, the last param is either the images or video folder
module.exports.createFolder = async function (accountName : String, profileName: String, componentName: String){
    const response = await s3.putObject({
        Bucket: envVars.S3_BUCKET,
        Key: (accountName + "/" + profileName + "/" + componentName + "/").replace(/\s/g, "_"),
    }).promise();
    console.log("Folder creation was successful");
    return response;
};

module.exports.uploadVideo = async function (accountName : String, profileName : String, componentName: String, filePath : any) {

  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: envVars.S3_BUCKET,
    Key: (accountName + "/" + profileName + "/" + componentName + "/" + "vid_" + new Date()).replace(/\s/g, "_"),
    Body: fileContent,
    ContentType: "video/webm"
  };

  const response = await s3.upload(params).promise();

  console.log("File Upload Complete.");

  return response;
};

module.exports.uploadImage = async function (accountName : String, profileName : String, componentName: String, filePath : any) {

  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: envVars.S3_BUCKET,
    Key: (accountName + "/" + profileName + "/" + componentName + "/" + "img_" + new Date()).replace(/\s/g, "_"),
    Body: fileContent,
    ContentType: "image/png"
  };

  const response = await s3.upload(params).promise();

  console.log("File Upload Complete.");

  return response;
};

async function getFile (key: String) {

  key = key.replace(/\s/g, "_");

  const signedUrlExpireSeconds: any = 60 * 10080;

  const params = {
    Bucket: envVars.S3_BUCKET,
    Key: key,
    Expires: signedUrlExpireSeconds
  };

  const response = await s3.getSignedUrl('getObject', params);

  return response;
}

module.exports.storeImage = async function storeImage (accountName : String, profileName : String, componentName: String, dataURI: String) {

  var buf = Buffer.from(dataURI.replace(/^data:image\/\w+;base64,/, ""), 'base64');

  const key = (accountName + "/" + profileName + "/" + componentName + "/" + "img_" + uuidv4()).replace(/\s/g, "_");

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

module.exports.storeImageByPath = async function storeImageByPath (accountName: string, profileName: string, componentName: string, filePath: string) {

  const fileContent = fs.readFileSync(filePath);

  const key = (accountName + "/" + profileName + "/" + componentName + "/" + "img_" + uuidv4()).replace(/\s/g, "_");

  const params = {
    Bucket: envVars.S3_BUCKET,
    Key: key,
    Body: fileContent,
    ContentType: "image/png"
  };

  const response = await s3.upload(params).promise();

  console.log("File V2 Path Upload Complete.");

  return response;
}

module.exports.generateSignedURL = async function generateSignedURL (key: String) {

  key = key.replace(/\s/g, "_");

  const signedUrlExpireSeconds: any = 60 * 10080;

  const params = {
    Bucket: envVars.S3_BUCKET,
    Key: key,
    Expires: signedUrlExpireSeconds
  };

  const response = await s3.getSignedUrl('getObject', params);

  return response;
}

module.exports.deleteFile = async function deleteFile (key: String) {

  key = key.replace(/\s/g, "_");

  const params = {
    Bucket: envVars.S3_BUCKET,
    Key: key
  };

  const response = await s3.deleteObject(params).promise();

  return response;
}

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
     newPair["url"] = await getFile(allKeys[i]);

     keyUrlPairs[i] = newPair;

  }

  return keyUrlPairs;
};
