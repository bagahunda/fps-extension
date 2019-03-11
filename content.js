class FPS {
  constructor() {
    this.width = 160;
    this.height = 60;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.classList.add("fps-ext");
    this.canvas.width = 160;
    this.canvas.height = 60;
    this.ctx.font = "bold 26px Arial";

    this.startTime = 0;
    this.currentTime = 0;
    this.allFps = [];

    this.hidden = true;

    this.playing = false;

    this.perf = performance || Date;

    document.body.appendChild(this.canvas);

    this.canvas.addEventListener("click", () => {
      this.playPause();
    });
  }

  toggle() {
    this.hidden = !this.hidden;
    if (!this.hidden) {
      this.loop();
      this.canvas.classList.add("is-visible");
    } else {
      this.canvas.classList.remove("is-visible");
    }
  }

  loop() {
    if (this.hidden || !this.playing) {
      return;
    }
    var that = this;
    window.requestAnimationFrame(function() {
      that.draw();
      that.loop();
    });
  }

  add(x) {
    this.allFps.unshift(x);
    this.allFps = this.allFps.slice(0, this.width);
  }

  draw() {
    var currentFps = this.getFPS();
    this.add(currentFps);

    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = "#000000";

    for (var i = 0; i <= this.width; i++) {
      this.ctx.fillRect(i, 0, 1, 60 - this.allFps[i]);
    }

    this.ctx.fillText(currentFps + " fps", 21, 51);

    this.ctx.fillStyle = "#ffffff";

    for (var i = 0; i <= this.width; i++) {
      this.ctx.fillRect(i, 60 - this.allFps[i], 1, 1);
    }

    this.ctx.fillText(currentFps + " fps", 20, 50);
  }

  getFPS() {
    this.frame++;
    var d = this.perf.now();
    this.currentTime = (d - this.startTime) / 1000;
    var result = Math.floor(this.frame / this.currentTime);
    if (this.currentTime > 1) {
      this.startTime = this.perf.now();
      this.frame = 0;
    }
    return result;
  }

  playPause() {
    this.playing = !this.playing;
    if (this.playing) {
      this.loop();
    }
  }
}
var fps = new FPS();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "clicked_browser_action") {
    fps.toggle();
    fps.playPause();
  }
});
