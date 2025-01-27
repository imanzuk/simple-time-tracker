(function() {
    window.stt = window.stt || {};
    window.stt.projectListHandler = function() {
        return {
            timeSheetEntries: [],
            projects: [],
            selectedProject: '',
            elapsedTime: '00:00:00',
            intervalId: null,
            isTimerRunning: false,
            startedAt: null,
            stoppedAt: null,
            timer: null,
            memo: '',
            trackMemoChange: false,

            init() {
                this.projects = JSON.parse(localStorage.getItem('stt.projects') || '[]');
                this.timeSheetEntries = JSON.parse(localStorage.getItem('stt.entries') || '[]');
                this.$watch('projects', value => {
                    localStorage.setItem('stt.projects', JSON.stringify(value));
                });
                this.$watch('timeSheetEntries', value => {
                    localStorage.setItem('stt.entries', JSON.stringify(value));
                });
                this.timer = new SimpleTimer();
            },

            addTimeSheetEntry(project, start, finish, duration, memo) {
                if (!project || !start || !finish || !duration) return;
                this.timeSheetEntries.push({ project, start, finish, duration, memo: memo || '(N/A)' });
            },

            hideModal() {
                if (this.isTimerRunning) {
                    if (!confirm('Closing this window will stop the timer. Are you sure?')) {
                        return;
                    }
                }
                const elapsedTime = this.timer.getTimeElapsed();
                this.isTimerRunning = false;
                this.timer.stop();
                this.stoppedAt = new Date();
                this.addTimeSheetEntry(
                    this.selectedProject, this.startedAt, this.stoppedAt, elapsedTime / 1000, this.memo);
                this.updateElapsedTime();
                closeModal(this.$refs.trackingModal);
            },

            handleKeyUp(event) {
                if (event.key !== "Enter") return;
                if (this.projects.indexOf(event.target.value) > -1) {
                    alert('Project already exists.');
                    return;
                }
                this.projects.push(event.target.value);
                event.target.value = '';
            },

            handleListItemClick(event) {
                const spanEl = (event.target.nodeName === 'SPAN') ? event.target : event.target.querySelector('span');
                if (!spanEl) return;
                this.selectedProject = spanEl.innerText;
                this.startedAt = null;
                this.memo = '';
                toggleModal(this.$refs.trackingModal);
            },

            handleMemoChange(event) {
                if (!this.trackMemoChange) return;
                const lastEntry = this.timeSheetEntries[this.timeSheetEntries.length -1];
                const prevMemo = lastEntry.memo;
                lastEntry.memo = event.target.value;
                console.debug('memo updated', prevMemo, lastEntry.memo);
            },

            preventClosingByKeyboard(event) {
                if (event.key !== 'Escape') return;
                event.preventDefault();
            },

            startTimer() {
                if (this.isTimerRunning) return;
                this.isTimerRunning = true;
                this.timer.reset();
                this.timer.start();
                this.startedAt = (new Date(this.timer.startTime));
                this.intervalId = setInterval(() => {
                    this.updateElapsedTime();
                }, 1000);
                this.trackMemoChange = false;
            },

            startedAtFormatted() {
                if (!this.startedAt) return '—';
                return this.startedAt.toLocaleString('sv'); // smart hack to get the desired format
            },

            stopTimer() {
                if (!this.isTimerRunning) return;
                const elapsedTime = this.timer.getTimeElapsed();
                this.isTimerRunning = false;
                this.timer.stop();
                this.stoppedAt = new Date();
                clearInterval(this.intervalId);
                this.trackMemoChange = true;
                this.addTimeSheetEntry(
                    this.selectedProject, this.startedAt, this.stoppedAt, elapsedTime / 1000, this.memo);
            },

            formatDuration(elapsedSeconds) {
                const dt = new Date(Date.UTC(0, 0, 0, 0,0, elapsedSeconds));
                const hours = dt.getUTCHours();
                const hoursStr = ((hours < 10) ? '0' : '') + hours;
                const minutes = dt.getUTCMinutes();
                const minutesStr = ((minutes < 10) ? '0' : '') + minutes;
                const seconds = dt.getUTCSeconds();
                const secondsStr = ((seconds < 10) ? '0' : '') + seconds;
                return `${hoursStr}:${minutesStr}:${secondsStr}`;
            },

            updateElapsedTime() {
                this.elapsedTime = this.formatDuration(this.timer.getTimeElapsed() / 1000);
            },
        }
    }
})()
