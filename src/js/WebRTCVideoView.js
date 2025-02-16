export class WebRTCVideoView {
	constructor(holder) {
		this.create(holder);
	}

	create(holder) {
		this.view = document.createElement('video');
		this.view.setAttribute('autoplay', 'true');
		this.view.id = 'videoElement';
		holder.appendChild(this.view);
	}

	connect() {
		return new Promise((resolve, reject) => {
			this.view.onloadedmetadata = function () {
				this.view.play();
				resolve(this.view);
			}.bind(this);

			if (navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
				navigator.mediaDevices
					.getUserMedia({ video: { width: 320, height: 240 } })
					.then(this.addStream.bind(this))
					.catch(() => reject('Webcam not found, please, check your hardware and try again.'));
			} else {
				reject('Please try from another device.');
			}
		});
	}

	addStream(stream) {
		if ('srcObject' in this.view) {
			this.view.srcObject = stream;
		} else {
			this.view.src = window.URL.createObjectURL(stream);
		}
	}
}
