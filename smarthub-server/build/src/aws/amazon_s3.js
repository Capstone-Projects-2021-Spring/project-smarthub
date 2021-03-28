"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var AWS = require('aws-sdk');
var config = require('./config.json');
//credential validation
try {
    AWS.config.setPromisesDependency();
    AWS.config.update({
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        region: 'us-east-1'
    });
}
catch (e) {
    console.log('Error: ' + e);
}
//s3 object to interact with physical s3 on aws
const s3 = new AWS.S3();
//accountName is a folder and profileName is a subFolder in accountName
module.exports.createFolder = function (accountName, profileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield s3.putObject({
            Bucket: 'sh-video-storage',
            Key: accountName + "/" + profileName + "/"
        }).promise();
        console.log("Folder creation was successful");
        return response;
    });
};
