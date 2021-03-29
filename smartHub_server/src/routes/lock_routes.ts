import express from 'express';
import {spawn} from 'child_process';
import * as socketio from 'socket.io';
import { LockController } from '../controllers/LockController';

const PORT = 4000;
const lock = new LockController();

const routes = express.Router({
	mergeParams: true
});

// Could incorporate puppeteer into VideoController. Or if puppeteer has compability issues, we use commands.

routes.post("/lock", async (req: any, res: any) => {
	console.log("Hit lock route");
	let status = lock.lock();
	return res.status(200).send({message: status});
});

routes.post("/unlock", async (req: any, res: any) => {
	console.log("Hit unlock route");
	let status = lock.unlock(req.body.lockTimeout);
	return res.status(200).send({message: status});
});

module.exports = {
	routes
};
