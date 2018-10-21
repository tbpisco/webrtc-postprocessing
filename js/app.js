'use strict'

class App {

    constructor(){

        this.view = [];

        ImageLoader.load("images/color.jpg")
                         .then((image) => {this.setupViews(image)})
                         .catch(this.logError);

    }

    setupViews(element){

        this.view.push(new WebGLView(element, {w:640/2, h:480/2}, document.body, "channel-red"));
        this.view.push(new WebGLView(element, {w:640/2, h:480/2}, document.body, "channel-green"));
        this.view.push(new WebGLView(element, {w:640/2, h:480/2}, document.body, "channel-blue"));

        this.initVideo();
    }

    initVideo(){

        var webRTCVideo = new WebRTCVideoView(document.querySelector("#container"));
        webRTCVideo.connect()
            .then((video) => {this.updateViewsTexture(video)})
            .catch(this.logError);

    }

	updateViewsTexture(video){
        this.view.forEach((element) => element.updateTexture(video));
    }

    logError(error){
        console.log(error);
    }

}

(function(global) {
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

