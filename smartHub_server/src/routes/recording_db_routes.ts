import express from 'express' ;
const Recordings = require('../db/recordings');
const { storeRecording, generateSignedURL } = require('../aws/amazon_s3');

const routes = express.Router({
	mergeParams: true
});

routes.post("/getRecordings", async (req: any, res: any) => {

  const profileId = req.body.profile_id;
  const recordingType = req.body.recording_type;

  const recordings = await Recordings.getRecordings(recordingType, profileId);

	return res.status(200).json({recordings});
});

module.exports = {
	routes
};
