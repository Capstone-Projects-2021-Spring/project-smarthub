var ws281x = require('rpi-ws281x');

//Standard strip configuration
var config = {
    leds:300,
    dma: 10,
    brightness: 150,
    gpio: 18,
    type: 'grb'
}

class LightController {

    constructor(){}

    public lights(randomize: boolean, redR: number, greenG: number, blueB: number){

        ws281x.configure(config);
        function run() {
            var pixels = new Uint32Array(config.leds);
            var red = redR, green = greenG, blue = blueB;
            var color = (green << 16) | (red << 8) | blue;
            //var color = blue << 16;
            for (var i = 0; i < config.leds; i++){
                if(randomize){
                    pixels[i] = Math.random() *color;
                }else{
                    pixels[i]=color;
                }
                // console.log(pixels[i]);
                ws281x.render(pixels);
            }
        }
        run();
    }

    public themes(themeType: String){

        ws281x.configure(config);

        if(themeType === 'halloween'){
            this.halloweenTheme();
        }else if(themeType === 'christmas'){
            this.christmasTheme();
        }
    }

    public halloweenTheme() {
        this.setColor(300, (95 << 16) | (247 << 8) | 28, (25 << 16) | (25 << 8) | 25, (134 << 16) | (243 << 8) | 31)
    }

    public christmasTheme() {
        this.setColor(300, (179 << 16) | (0 << 8) | 44, (255 << 16) | (255 << 8) | 255, (0 << 16) | (179 << 8) | 12)
    }

    public setColor(ledCount: number, color1: number, color2: number, color3: number){
        var pixels = new Uint32Array(ledCount);
        var led = 0
        while(led != ledCount){
            pixels[led] = color1;
            ws281x.render(pixels);
            led++;
            pixels[led] = color2;
            ws281x.render(pixels);
            led++;
            pixels[led]=color3;
            ws281x.render(pixels);
            led++;
            pixels[led]=color2;
            ws281x.render(pixels);
            led++;
        }
    }
}

export { LightController };
