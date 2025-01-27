(function() {
    window.stt = window.stt || {};
    window.stt.timesheetHandler = function() {
        return {
            timeSheetEntries: [],
            exportFrom: '',
            exportTill: '',

            init() {
                const currentDate = new Date();
                const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() +1, 0);
                this.exportFrom = firstDayOfMonth.toLocaleString('sv').substring(0, 10);
                this.exportTill = lastDayOfMonth.toLocaleString('sv').substring(0, 10);
                this.timeSheetEntries =
                    JSON.parse(localStorage.getItem('stt.entries') || '[]')
                    .filter(entry => (
                        (entry.start.substring(0, 10) >= this.exportFrom)
                        && (entry.finish.substring(0, 10) <= this.exportTill)));
            },

            formatDate(dateStr) {
                const dt = !dateStr ? new Date() : new Date(dateStr);
                return dt.toLocaleString('sv'); // smart hack to get the desired format
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

            getCreatedAt() {
                return this.formatDate();
            },

            getTotals() {
                const totals = {};
                this.timeSheetEntries.forEach(entry => {
                    if (!totals[entry.project]) {
                        totals[entry.project] = 0;
                    }
                    totals[entry.project] += entry.duration;
                });
                const result = [];
                Object.keys(totals).sort().forEach(key => {
                    result.push({ project: key, total: totals[key] });
                })
                return result;
            },
        }
    }
})()
