import express from 'express';
import { AudioController } from '../controllers/AudioController';

const routes = express.Router({
	mergeParams: true
});

const controller = new AudioController();

module.exports = {
	routes,
	controller
};
