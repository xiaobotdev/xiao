const commando = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class TypingGameCommand extends commando.Command {
    constructor(Client) {
        super(Client, {
            name: 'typinggame',
            group: 'games',
            memberName: 'typinggame',
            description: 'See how fast you can type a sentence in a given time limit. (;typinggame easy)',
            examples: [';typinggame easy', ';typinggame medium', ';typinggame hard', ';typinggame extreme'],
            throttling: {
				usages: 1,
				duration: 25
			},
            args: [{
                key: 'difficulty',
                prompt: 'What difficulty should the typing game be? Easy, Medium, Hard, or Extreme?',
                type: 'string',
                validate: difficulty => {
                    if (difficulty.toLowerCase() === 'easy' || difficulty.toLowerCase() === 'medium' || difficulty.toLowerCase() === 'hard' || difficulty.toLowerCase() === 'extreme') {
                        return true;
                    }
                    return 'Please set the difficulty to either `easy`, `medium`, `hard`, or `extreme`.';
                }
            }]
        });
    }

    async run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES', 'EMBED_LINKS'])) return;
        }
        console.log(`[Command] ${message.content}`);
        let level = args.difficulty.toLowerCase();
        if (level !== 'easy' || level !== 'medium' || level !== 'hard' || level !== 'extreme') return message.say(':x: Error! Please set the difficulty to either easy, medium, hard, or extreme!');
        let randomSentence = ['The quick brown fox jumps over the lazy dog.', 'Buffalo buffalo Buffalo buffalo buffalo buffalo Buffalo buffalo.', 'How razorback-jumping frogs can level six piqued gymnasts!', 'Amazingly few discotheques provide jukeboxes.'];
        randomSentence = randomSentence[Math.floor(Math.random() * randomSentence.length)];
        let time;
        let levelWord;
        switch (level) {
            case "easy":
                time = 25000;
                levelWord = "twenty-five";
                break;
            case "medium":
                time = 20000;
                levelWord = "twenty";
                break;
            case "hard":
                time = 15000;
                levelWord = "fifteen";
                break;
            case "extreme":
                time = 10000;
                levelWord = "ten";
                break;
        }
        const embed = new Discord.RichEmbed()
            .setTitle(`You have **${levelWord}** seconds to type:`)
            .setDescription(randomSentence);
        let embedMsg = await message.embed(embed);
        try {
            let collected = await message.channel.awaitMessages(response => response.content === randomSentence && response.author.id === message.author.id, {
                max: 1,
                time: time,
                errors: ['time']
            });
            let victoryMsg = await message.say(`Good Job! You won!`);
            return [embedMsg, collected, victoryMsg];
        }
        catch (err) {
            let loseMsg = await message.say('Aw... Too bad, try again next time!');
            return [embedMsg, loseMsg];
        }
    }
};
