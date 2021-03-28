import express from 'express';
import { LightController } from '../controllers/LightController';

const light = new LightController();

const routes = express.Router({
	mergeParams: true
});


routes.post("/lights",  (req: any,res: any) => {
    if(req.body.themeType === 'halloween' || req.body.themeType === 'christmas'){
        light.themes(req.body.themeType);
    }else{
        light.lights(req.body.randomize, req.body.red, req.body.green, req.body.blue);
    }
    res.status(200).send("The lights have been configured.")
    //purposal kill the server pm2 will auto restart it, do this to reset config
    //process.exit(1);
})

module.exports = {
	routes
};
