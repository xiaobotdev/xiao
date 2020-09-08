const ImgurAlbumCommand = require('../../structures/commands/ImgurAlbum');
const { stripIndents } = require('common-tags');
const texts = require('../../assets/json/dating');
const {
	DATING_OFF,
	DATING_ALBUM_ID,
	DATING_NAME,
	DATING_AGE,
	DATING_TAG,
	DATING_ORIENTATION,
	DATING_SERIOUS
} = process.env;

module.exports = class DatingCommand extends ImgurAlbumCommand {
	constructor(client) {
		super(client, {
			name: 'dating',
			aliases: ['date', 'tinder'],
			group: 'other',
			memberName: 'dating',
			description: 'Find the person of your dreams with this dating system!',
			clientPermissions: ['ATTACH_FILES'],
			albumID: DATING_ALBUM_ID,
			noImage: Boolean(DATING_OFF)
		});
	}

	generateText() {
		if (DATING_OFF) return 'The dating feature is currently inactive. Check back soon!';
		const text = texts[Math.floor(Math.random() * texts.length)];
		return stripIndents`
			**${DATING_NAME}, ${DATING_AGE}**
			_${text}_

			Send a friend request to ${DATING_TAG} to meet now! ${this.orientationText}
			${this.seriousText}
		`;
	}

	get orientationText() {
		if (DATING_ORIENTATION === 'girls') return '(Note: Girls only)';
		if (DATING_ORIENTATION === 'boys') return '(Note: Boys only)';
		if (DATING_ORIENTATION === 'both') return '(All genders welcome!)';
		return '';
	}

	get seriousText() {
		if (!DATING_SERIOUS || DATING_SERIOUS === 'false') return 'Don\'t worry, this is just a joke. Unless...';
		if (DATING_SERIOUS === 'true') {
			return 'This may look like a joke, but if you actually want to, feel free to really try.';
		}
		return '';
	}
};
