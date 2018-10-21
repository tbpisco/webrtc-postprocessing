'use strict'

class App {

    constructor(){

        this.view = [];

        this.containerElement = document.querySelector("#container");

        ImageLoader.load("images/color.jpg")
                         .then((image) => {this.setupViews(image)})
                         .catch((error) => {this.logError(error)});
    }

    setupViews(element){

        this.view.push(new WebGLView(element, {w:640/2, h:480/2}, this.containerElement, "channel-red"));
        this.view.push(new WebGLView(element, {w:640/2, h:480/2}, this.containerElement, "channel-green"));
        this.view.push(new WebGLView(element, {w:640/2, h:480/2}, this.containerElement, "channel-blue"));

        this.initVideo();
    }

    initVideo(){

        var webRTCVideo = new WebRTCVideoView(document.querySelector("#container"));
        webRTCVideo.connect()
            .then((video) => {this.updateViewsTexture(video)})
            .catch((error) => {this.logError(error)});

    }

	updateViewsTexture(video){
        this.view.forEach((element) => element.updateTexture(video));
    }

    logError(error){
        alert(error);
    }

}

(function(global) {

  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }
  
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
  
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }
  
      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    }
  }

  window.addEventListener("DOMContentLoaded", startApp);
  function startApp() {
    var app = new App();
    window.removeEventListener("DOMContentLoaded", startApp);
  }

})(window);

var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();

