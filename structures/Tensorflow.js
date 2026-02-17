const tf = require('@tensorflow/tfjs-node');
const faceDetection = require('@tensorflow-models/face-detection');
const faceModel = faceDetection.SupportedModels.MediaPipeFaceDetector;
const path = require('path');
const url = require('url');

module.exports = class Tensorflow {
	constructor(client) {
		Object.defineProperty(this, 'client', { value: client });

		this.faceDetector = null;
		this.styleModel = null;
		this.transformerModel = null;
	}

	async loadFaceDetector() {
		const faceDetector = await faceDetection.createDetector(faceModel, { runtime: 'tfjs', maxFaces: 10 });
		this.faceDetector = faceDetector;
		return this.faceDetector;
	}

	async loadStyleModel() {
		const model = await tf.loadGraphModel(
			url.pathToFileURL(path.join(__dirname, '..', 'assets', 'tensorflow', 'style_js', 'model.json')).href
		);
		this.styleModel = model;
		return this.styleModel;
	}

	async loadTransformerModel() {
		const model = await tf.loadGraphModel(
			url.pathToFileURL(path.join(__dirname, '..', 'assets', 'tensorflow', 'transformer_js', 'model.json')).href
		);
		this.transformerModel = model;
		return this.transformerModel;
	}

	async detectFaces(imgData) {
		if (Buffer.byteLength(imgData) >= 8e+6) return 'size';
		tf.setBackend('tensorflow');
		const image = tf.node.decodeImage(imgData, 3);
		tf.setBackend('cpu');
		const faces = await this.faceDetector.estimateFaces(image);
		tf.setBackend('tensorflow');
		image.dispose();
		if (!faces || !faces.length) return null;
		return faces;
	}

	async stylizeImage(image, styleImg) {
		const imageTensor = await tf.node.decodeImage(image, 3);
		const [originalHeight, originalWidth] = imageTensor.shape.slice(0, 2);
		const desiredHeight = 256;
		const aspectRatio = originalWidth / originalHeight;
		const newWidth = Math.round(desiredHeight * aspectRatio);
		const resizedImage = tf.image.resizeBilinear(imageTensor, [desiredHeight, newWidth]);
		imageTensor.dispose();
		const loadedImage = resizedImage.toFloat().div(tf.scalar(255)).expandDims();
		resizedImage.dispose();
		const styleTensor = tf.node.decodeImage(styleImg, 3);
		const loadedStyle = styleTensor.toFloat().div(tf.scalar(255)).expandDims();
		styleTensor.dispose();
		const stylePrediction = await this.styleModel.predict(loadedStyle);
		loadedStyle.dispose();
		const stylizedImage = (await this.transformerModel.predict([loadedImage, stylePrediction])).squeeze();
		loadedImage.dispose();
		stylePrediction.dispose();
		const encodedImg = stylizedImage.mul(255).clipByValue(0, 255).toInt();
		stylizedImage.dispose();
		const buffer = await tf.node.encodeJpeg(encodedImg);
		encodedImg.dispose();
		return Buffer.from(buffer);
	}
};
