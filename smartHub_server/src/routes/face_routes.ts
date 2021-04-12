import express from 'express' ;
const Faces = require('../db/faces');
const Images = require('../db/images');
const { storeImage, generateSignedURL } = require('../aws/amazon_s3');
const youauth = require('youauth');

const recognizer = new youauth.FaceRecognizer();

const routes = express.Router({
	mergeParams: true
});

/*
    Use: Adds a face to the faces table, as well as adding the image to images table.
    Params: dataURI, imageName, profileId.
*/
routes.post("/addFaceImage", async (req: any, res: any) => {

		const dataURI: string = req.body.data_uri;
		const name: string = req.body.image_name;
		const profileId: number = req.body.profile_id;

		const accountName: string = req.body.user_email;
		const profileName: string = req.body.profile_name;
		const componentName: string = req.body.component_name;

		const tensor = await recognizer.loadImage(dataURI);
		const detections = await recognizer.detect(tensor);

		if(detections.length === 0) {
			return res.status(500).send("No faces detected!");
		}
		else if (detections.length !== 1) {
			return res.status(500).send("Too many faces detected!");
		}

		const refImages = [dataURI];
		const labels = [name];

		const labeledFaceDescriptors = await recognizer.labelDescriptors(labels, refImages);

		console.log(labeledFaceDescriptors);

		// Add image face data to faces table.
		Faces.addFace(name, JSON.stringify(labeledFaceDescriptors), profileId).then( (face: any) => {
			if(!face) {
					return res.status(500).json({message: "Unable to insert face."});
				}
		}).catch( (err: any) => {
				console.log(err);
				return res.status(500).json({message: err});
		});

		const obj = await storeImage(accountName, profileName, componentName, dataURI);

		const imageLink = await generateSignedURL(obj.key);

		Images.addImage(name, imageLink, 1, obj.key, profileId).then( (image: any) => {
				if(!image) {
					return res.status(500).json({message: "Unable to insert image."});
				}
		}).catch( (err: any) => {
				console.log(err);
				return res.status(500).json({message: err});
		});

		return res.status(200).send("Image Successfully Uploaded.");
});

module.exports = {
	routes
};
