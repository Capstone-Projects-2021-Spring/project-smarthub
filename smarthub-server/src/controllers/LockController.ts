const Gpio = require('onoff').Gpio;
//const lock = new Gpio(17, 'out');
var lock: any;
var lockedTime: number;

class LockController {

    constructor() {
        lock = new Gpio(17, 'out');
    }

    public unlock(lockTimeout: number) {
        //Signals unlock.
        lock.writeSync(1);
        
        console.log("Unlock status after first lock: ", lock.readSync());

        //If there was a lock timeout set, wait for that time then lock.
        if(lockTimeout != 0) {
            setTimeout(this.lock, Math.abs(lockTimeout) * 1000);
            return "Unlocking for " + lockTimeout + " seconds";
        }
        else {
            return "Unlocking."
        }
        
    }

    public lock() {
        lock.writeSync(0);
        return "Locking.";
    }
}

export { LockController };