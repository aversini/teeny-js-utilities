const { uniqueId } = require("lodash");
const { performance, PerformanceObserver } = require("perf_hooks");
const TeenyLogger = require("teeny-logger");
const logger = new TeenyLogger({
  boring: process.env.NODE_ENV === "test",
});

class Performance {
  constructor() {
    this.perfData = {};
    this.perfObserver = new PerformanceObserver((items) => {
      items.getEntries().forEach((entry) => {
        this.perfData.duration = entry.duration;
      });
    });
    this.perfObserver.observe({ buffer: true, entryTypes: ["measure"] });
  }

  start() {
    if (!this.startMarkerName) {
      this.startMarkerName = uniqueId();
      performance.mark(this.startMarkerName);
    } else {
      logger.error("Performance.start() can only be called once");
    }
  }

  stop() {
    if (!this.startMarkerName) {
      logger.error(
        "Performance.stop() can only be called once after Performance.start()"
      );
    } else {
      this.stopMarkerName = uniqueId();
      performance.mark(this.stopMarkerName);
      performance.measure(
        "internal",
        this.startMarkerName,
        this.stopMarkerName
      );
      this.startMarkerName = null;
      this.stopMarkerName = null;
    }
  }

  get results() {
    return this.perfData;
  }
}

module.exports = Performance;
