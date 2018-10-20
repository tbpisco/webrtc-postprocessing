'use strict'

class App {

    constructor(){
        this.initVideo();
    }

    initVideo(){

        var webRTCVideo = new WebRTCVideoView(document.querySelector("#container"));
        webRTCVideo.connect()
            .then((video) => {
                this.init(video);
            })
            .catch(this.useSampleImage);
    }

    useSampleImage(){

        ImageLoader.load("images/sample.jpg")
            .then((image) => {
                this.init(image);
            })
            .catch(this.logError);
    }

	init(element){

        ImageLoader.load("images/cubos.jpg")
            .then((image) => {
                self.webGLView = new WebGLView(element, image, "channel-red");
                self.webGLView = new WebGLView(element, image, "channel-green");
                self.webGLView = new WebGLView(element, image, "channel-blue");
            })
            .catch(this.logError);

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

