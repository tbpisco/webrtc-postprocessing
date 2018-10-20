class WebRTCVideoView {

    constructor(holder){

        this.create(holder);

    }

    create(holder){

       this.view = document.createElement("video");
       this.view.setAttribute("autoplay", "true");
       this.view.id = "videoElement";
       holder.appendChild(this.view);

    }

    connect(){
        return new Promise((resolve, reject) => {
            this.view.onloadedmetadata = function(){ 
                resolve(this.view);
            }.bind(this);
    
            if (navigator.mediaDevices.getUserMedia) { 
    
                navigator.mediaDevices.getUserMedia({video: true})
                .then(this.addStream.bind(this))
                .catch(this.reject);
            }
        });
    }

    addStream(stream){
        this.view.srcObject = stream;
    }

}