import express from 'express';
import { AudioController } from '../controllers/AudioController';

const routes = express.Router({
	mergeParams: true
});

const controller = new AudioController();

/*
		Use: Starts the intercom on the pi.
		Params: none
*/
routes.post("/start_intercom", (req: any, res: any) => {
	console.log("start_stream route: audio stream starting...");
	controller.startStream();
	return res.status(200).send("Intercom Starting.");
});

/*
		Use: Stops the intercom on the pi.
		Params: none
*/
routes.post("/stop_intercom", async (req: any, res: any) => {
	console.log("stop_stream route: audio stream closing...")
	controller.stopStream();
	return res.status(200).send("Intercom Closing.");
});

/*
		Use: Checks the intercom stream status.
		Params: none
*/
routes.post("/stream_check", (req: any, res: any) => {

	controller.getStreamStatus( (status: boolean) => {
		if(status) {
			return res.status(200).send({ message: "The stream is already live", streaming: status });
		}
		else {
			return res.status(200).send({ message: "The stream is not live", streaming: status });
		}
	});

});

module.exports = {
	routes,
	controller
};
