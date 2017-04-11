const { Command } = require('discord.js-commando');

module.exports = class RandomNameCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'name',
            aliases: [
                'namegen',
                'randomname'
            ],
            group: 'response',
            memberName: 'name',
            description: 'Generates a random name (;name Male)',
            examples: [';name', ';name male', ';name female'],
            args: [{
                key: 'gender',
                prompt: 'Which gender do you want to generate a name for?',
                type: 'string',
                validate: gender => {
                    if (gender.toLowerCase() === 'male' || gender.toLowerCase() === 'female') {
                        return true;
                    }
                    return 'Please enter either `male` or `female`.';
                }
            }]
        });
    }

    run(message, args) {
        if (message.channel.type !== 'dm') {
            if (!message.channel.permissionsFor(this.client.user).hasPermission(['SEND_MESSAGES', 'READ_MESSAGES'])) return;
        }
        const gender = args.gender.toLowerCase();
        let lastName = ['Walker', 'Tworni', 'Ross', 'Smith', 'Odendahl', 'Deere', 'Brown', 'Williams', 'Jones', 'Miles', 'Moss', 'Roberto', 'McFly', 'McDonald', 'Lewis', 'Armstrong', 'Stevenson', 'Schwarzenegger', 'Robinson', 'Parker', 'Piper', 'Johnson', 'Brantley', 'Stewart', 'Ree', 'Talbot', 'Seville', 'Peace', 'Spielberg', 'Baggins', 'Wilborn', 'Vankirk', 'Shireman', 'Jimerson', 'Masters', 'Hack', 'Satcher', 'Younkin', 'Aguila', 'Duffey', 'Burgin', 'Highfall', 'Wee', 'Solari', 'Tomaselli', 'Basler', 'Difranco', 'Latch', 'Rives', 'Dolan', 'Abraham', 'Holter', 'Portugal', 'Lininger', 'Holst', 'Mccroy', 'Follmer', 'Hotchkiss', 'Gassaway', 'Wang', 'Agron', 'Raasch', 'Gourd', 'Czaja', 'Marquart', 'Papadopoulos', 'Ringer', 'Lax', 'Sperling', 'Galusha', 'Alston'];
        lastName = lastName[Math.floor(Math.random() * lastName.length)];
        if (gender === 'male') {
            let name = ['Bob', 'Daniel', 'Logan', 'Chris', 'Nathan', 'George', 'Mart', 'Charlie', 'Felix', 'Ralph', 'William', 'Max', 'Jerry', 'Marty', 'Joshua', 'Cody', 'Richard', 'Alex', 'Alexander', 'Jordan', 'Zachary', 'Bill', 'Alfred', 'Bruce', 'Caiden', 'Calvin', 'Eric', 'Robert', 'Mark', 'Miles', 'Nash', 'Ronald', 'Ivan', 'Edgar', 'Royal', 'Augustine', 'Dominic', 'Noel', 'Rocky', 'Grover', 'Paul', 'Jeremy', 'Stevie', 'Brock', 'Jc', 'Tony', 'Enoch', 'Zachery', 'Harvey', 'Gilbert', 'Chang', 'Emery', 'Carroll', 'Odell', 'Jean', 'Archie', 'Russ', 'Barry', 'Lowell', 'Jacob', 'Riku', 'Frederic', 'Levi', 'Faustino', 'Leland', 'Domenic', 'Irwin', 'Moises', 'Louie', 'Larry', 'Victor'];
            name = name[Math.floor(Math.random() * name.length)];
            return message.say(`${name} ${lastName}`);
        }
        else if (gender === 'female') {
            let name = ['Elizabeth', 'Chelsey', 'Rachel', 'Logan', 'Alex', 'Jordan', 'Mary', 'Shirley', 'Sandy', 'Linda', 'Audrey', 'Autumn', 'Gracie', 'Grace', 'Erin', 'Catherine', 'Stephanie', 'Lucy', 'Patty', 'Julie', 'Christina', 'Fiona', 'Riley', 'Ashley', 'Bree', 'Lucila', 'Wendi', 'Evangelina', 'Ricki', 'Merna', 'Tegan', 'Venus', 'Claris', 'Tana', 'Sakura', 'Edythe', 'Adena', 'Princess', 'Elnora', 'Star', 'Edyth', 'Beverly', 'Kelsie', 'Letha', 'Latisha', 'Lolita', 'Bernandine', 'Jessenia', 'Hannah', 'Leonore', 'Alene', 'Fannie', 'Bernardine', 'Leena', 'Tera', 'Yvette', 'Melisa', 'Alissa', 'Xiao', 'Richelle', 'Bridgett', 'Sumiko', 'Paulette', 'Charlott', 'Honey', 'Veola', 'Sherita', 'Amanda', 'Vannessa', 'April', 'Ruth'];
            name = name[Math.floor(Math.random() * name.length)];
            return message.say(`${name} ${lastName}`);
        }
    }
};
