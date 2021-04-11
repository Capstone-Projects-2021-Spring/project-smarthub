import express from 'express' ;
const Images = require('../db/images');
const { storeImage, generateSignedURL, deleteFile } = require('../aws/amazon_s3');

const routes = express.Router({
	mergeParams: true
});

routes.post("/getImages", async (req: any, res: any) => {

  const profileId = req.body.profile_id;
  const imageType = req.body.image_type;

  const images = await Images.getImages(imageType, profileId);

  console.log(images);

	return res.status(200).json(images);
});

routes.post("/deleteImage", async (req: any, res: any) => {

  const imageName = req.body.image_name;
  const profileId = req.body.profile_id;
  const imageType = req.body.image_type;

  const images = await Images.getImages(imageType, profileId);

  let key;

  for(var i = 0; i < images.length; i++) {
    if(images[i].image_name === imageName) {
      key = images[i].aws_s3_key;
      break;
    }
  }

  const deleteResponse = await Images.deleteImage(imageName, profileId);

  console.log(deleteResponse);

  const response = await deleteFile(key);

	return res.status(200).send("Image Successfully Deleted.");
});

module.exports = {
	routes
};
