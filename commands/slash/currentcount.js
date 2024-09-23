const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');
const database = require('../../database');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('currentcount')
        .setDescription('Check the current number of the server\'s counting channel'),
    async execute(client, interaction) {
        let config = await database.getServer(interaction.guild.id);

        if(!config || !config.countingChannel) {
            await interaction.reply({
                content: 'This server does not have counting set up. To enable counting in a channel, use `/config channel',
                ephemeral: true
            })
        } else {
            await interaction.reply({
                content: `The count is currently at \`${config.currentNumber}\``,
                ephemeral: false
            })
        }
    }
}