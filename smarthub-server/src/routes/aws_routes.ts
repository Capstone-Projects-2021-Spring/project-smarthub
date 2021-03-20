import express from 'express' ;
const { getFile, getKeyList } = require('../aws/amazon_s3');

const routes = express.Router({
	mergeParams: true
});

routes.post('/get_file', async (req : any, res : any) => {

  const key = req.body.key;

  console.log("Get File Called. key: " + key);

  const response = await getFile(key);
  return res.status(200).json({ video: response });
});

routes.post('/get_key_list', async (req : any, res : any) => {

  const accountName = req.body.user_email;
  const profileName = req.body.profile_name;

  console.log("Get Key List Called. accountName: " + accountName + " profileName: " + profileName);

  const response = await getKeyList(accountName, profileName);

  return res.status(200).json({ keyList: response });
});

module.exports = {
	routes,
};
