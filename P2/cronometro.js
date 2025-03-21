class Crono {
    constructor(display) {
        this.display = display;
        this.reset();
    }

    tic() {
        const now = performance.now();
        const elapsed = now - this.startTime;
        this.cent = Math.floor((elapsed % 1000) / 10);
        this.seg = Math.floor((elapsed / 1000) % 60);
        this.min = Math.floor(elapsed / 60000);

        this.display.innerHTML = 
            this.min.toString().padStart(2, '0') + ":" + 
            this.seg.toString().padStart(2, '0') + ":" + 
            this.cent.toString().padStart(2, '0');
    }

    start() {
        if (!this.timer) {
            this.startTime = performance.now() - this.getElapsedMilliseconds();
            this.timer = setInterval(() => this.tic(), 10);
        }
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    reset() {
        this.stop();
        this.startTime = performance.now();
        this.cent = 0;
        this.seg = 0;
        this.min = 0;
        this.display.innerHTML = "00:00:00";
    }

    getElapsedMilliseconds() {
        return (this.min * 60000) + (this.seg * 1000) + (this.cent * 10);
    }

    getTime() {
        return this.getElapsedMilliseconds() / 1000;
    }
}