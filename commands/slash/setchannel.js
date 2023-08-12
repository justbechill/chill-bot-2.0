const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription('Set channels to different functions for transcripts and stuff.')
        .addStringOption(option =>
            option.setName('type')
            .setDescription('transcript, log, message, counting')
            .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('The channel to set.')
            .setRequired(true)),
        
    async execute(client, interaction) {
        
        let obj = JSON.parse(fs.readFileSync(path.resolve('./servers.json')));

        if(!obj[interaction.guild.id]) {
            obj[interaction.guild.id] = {
                channels: {
                    transcript: null,
                    log: null,
                    message: null,
                    counting: null
                }
            }
        }

        const type = interaction.options.getString('type').toLowerCase();
        const channel = interaction.options.getChannel('channel');

        if(type == 'transcript') {
            obj[interaction.guild.id].channels.transcript = channel.id;
        } else if(type == 'message') {
            obj[interaction.guild.id].channels.message = channel.id;
        } else if(type == 'counting') {
            obj[interaction.guild.id].channels.counting = channel.id;
        } else {
            await interaction.reply({text: 'There was a problem setting the channel.', ephemeral: true});
            return;
        }

        fs.writeFileSync(path.resolve('./servers.json'), JSON.stringify(obj, null, 4));
        await interaction.reply(`Set ${type} channel to ${channel}`);
    }
}