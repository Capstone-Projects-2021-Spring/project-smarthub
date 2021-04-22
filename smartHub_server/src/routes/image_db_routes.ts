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

	// Loop through images to check their expiration dates, and update signed URL is required.
	for(let i = 0; i < images.length; i++) {
		// Current date.
		const current_date: Date = new Date();
		// Expired date in database.
		const expired_date: Date = new Date(images[i].date_expired);
		// Compare current to expired date.
		if(current_date >= expired_date) {
			// Extend expired date by approximately one week.
			expired_date.setSeconds(expired_date.getSeconds() + 600000);
			// Generate a new signed URL.
			const newLink = await generateSignedURL(images[i].aws_s3_key);
			// Update the image link and expiration date.
			const image = await Images.updateImageLink(images[i].image_id, newLink, expired_date.toISOString());
		}
	}

	const newImages = await Images.getImages(imageType, profileId);

	return res.status(200).json({newImages});
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
