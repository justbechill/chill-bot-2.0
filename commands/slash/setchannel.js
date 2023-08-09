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
            .setDescription('transcript, log, message')
            .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('The channel to set.')
            .setRequired(true)),
        
    async execute(client, interaction) {
        
        let obj = JSON.parse(fs.readFileSync(path.resolve('./channels.json')));

        if(!obj[interaction.guild.id]) {
            obj[interaction.guild.id] = {
                transcript: null,
                log: null,
                message: null
            }
        }

        const type = interaction.options.getString('type').toLowerCase();
        const channel = interaction.options.getChannel('channel');

        if(type == 'transcript') {
            obj[interaction.guild.id].transcript = channel.id;
        } else if(type == 'message') {
            obj[interaction.guild.id].message = channel.id;
        } else {
            await interaction.reply({text: 'There was a problem setting the channel.', ephemeral: true});
            return;
        }

        fs.writeFileSync(path.resolve('./channels.json'), JSON.stringify(obj, null, 4));
        await interaction.reply(`Set ${type} channel to ${channel}`);
    }
}