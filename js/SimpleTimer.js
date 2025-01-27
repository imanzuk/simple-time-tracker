class SimpleTimer {

    constructor() {
        this.isRunning = false;
        this.startTime = 0;
        this.overallTime = 0;
    }

    _getTimeElapsedSinceLastStart() {
        if (!this.startTime) {
            return 0;
        }
        return Date.now() - this.startTime;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.startTime = Date.now();
    }

    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        this.startTime = 0;
        this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart();
    }

    reset() {
        this.overallTime = 0;
        if (this.isRunning) {
            this.startTime = Date.now();
            return;
        }
        this.startTime = 0;
    }

    getTimeElapsed() {
        if (!this.startTime) {
            return 0;
        }
        if (this.isRunning) {
            return this.overallTime + this._getTimeElapsedSinceLastStart();
        }
        return this.overallTime;
    }
}
