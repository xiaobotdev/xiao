const tfnode = require('@tensorflow/tfjs-node');
const nsfw = require('nsfwjs');
const faceDetection = require('@tensorflow-models/face-detection');
const faceModel = faceDetection.SupportedModels.MediaPipeFaceDetector;

module.exports = class Tensorflow {
	constructor(client) {
		Object.defineProperty(this, 'client', { value: client });

		this.nsfwjs = null;
		this.faceDetector = null;
	}

	async loadNSFWJS() {
		const nsfwjs = await nsfw.load();
		this.nsfwjs = nsfwjs;
		return this.nsfwjs;
	}

	async loadFaceDetector() {
		const faceDetector = await faceDetection.createDetector(faceModel, { runtime: 'tfjs', maxFaces: 10 });
		this.faceDetector = faceDetector;
		return this.faceDetector;
	}

	async detectFaces(imgData) {
		if (Buffer.byteLength(imgData) >= 8e+6) return 'size';
		tfnode.setBackend('tensorflow');
		const image = tfnode.node.decodeImage(imgData, 3);
		tfnode.setBackend('cpu');
		const faces = await this.faceDetector.estimateFaces(image);
		tfnode.setBackend('tensorflow');
		image.dispose();
		if (!faces || !faces.length) return null;
		return faces;
	}

	async isImageNSFW(image, bool = true) {
		const img = await tfnode.node.decodeImage(image, 3);
		const predictions = await this.nsfwjs.classify(img);
		img.dispose();
		if (bool) {
			const results = [];
			results.push(predictions[0]);
			for (const result of predictions) {
				if (result.className === predictions[0].className) continue;
				if (result.probability >= predictions[0].probability - 0.1) results.push(result);
			}
			return results.some(result => result.className !== 'Drawing' && result.className !== 'Neutral');
		}
		return predictions;
	}
};
