const tfnode = require('@tensorflow/tfjs-node');
const nsfw = require('nsfwjs');
const faceDetection = require('@tensorflow-models/face-detection');
const url = require('url');
const path = require('path');

module.exports = class Tensorflow {
	constructor(client) {
		Object.defineProperty(this, 'client', { value: client });

		this.nsfwModel = null;
		this.faceModel = faceDetection.SupportedModels.MediaPipeFaceDetector;
		this.faceDetector = null;
	}

	async loadNSFWModel() {
		const nsfwModel = await nsfw.load(
			`${url.pathToFileURL(path.join(__dirname, '..', 'tf_models', 'nsfw', 'web_model')).href}/`,
			{ type: 'graph' }
		);
		this.nsfwModel = nsfwModel;
		return this.nsfwModel;
	}

	async loadFaceDetector() {
		const faceDetector = await faceDetection.createDetector(this.faceModel, { runtime: 'tfjs', maxFaces: 10 });
		this.faceDetector = faceDetector;
		return this.faceDetector;
	}

	async detectFaces(imgData) {
		if (Buffer.byteLength(imgData) >= 4e+6) return 'size';
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
		const predictions = await this.nsfwModel.classify(img);
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
