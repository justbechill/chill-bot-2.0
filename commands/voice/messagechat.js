const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    data: {
        name: 'message chat',
        description: `Say anything after "message chat" that will be sent to your server's message channel.`,
        terms: ['message chat', 'tell chat', 'message scott']
    },

    async execute(client, message, term) {
        const msg = message.content.toLowerCase().split(term)

        const channels = JSON.parse(fs.readFileSync('./servers.json', 'utf8'));

        if(channels[message.guild.id] && channels[message.guild.id].channels.message) {
            const channel = message.guild.channels.cache.get(channels[message.guild.id].message);

            if(channel) channel.send(msg[1]);
        }
    }
}