const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    data: {
        name: 'counting',
        description: 'Counting can be enabled by using `/setchannel`.',
        terms: []
    },

    async execute(client, message) {
        const servers = JSON.parse(fs.readFileSync('./servers.json', 'utf8'));

        if(!servers[message.guild.id] || !servers[message.guild.id].channels.counting) return;

        let count = servers[message.guild.id].count;
        const channel = message.guild.channels.cache.get(servers[message.guild.id].channels.counting);

        if(!channel || channel.id != message.channel.id) return;

        if(!count) {
            count = {
                num: 0,
                last: ''
            }
        }

        if(!isNaN(parseInt(message.content))) {
            if(parseInt(message.content) == count.num + 1) {

                if(count.last == message.author.id) {
                    await message.channel.send(`You can't count twice in a row idiot.`);
                } else {
                    count.num++;

                    message.react('✅');
                }
            } else {

                if(count.last == message.author.id) {
                    await message.channel.send(`You can't count twice in a row idiot.`);
                } else {
                    count.num = 0;
    
                    message.react('❌');
    
                    for(let i = 0; i < 5; i++) {
                        await channel.send(`${message.author} bitch`);
                    }
                }
            }

            count.last = message.author.id;
            servers[message.guild.id].count = count;
            fs.writeFileSync('./servers.json', JSON.stringify(servers, null, 4));
        }


    }
}