const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'perms',
    description: 'Setup roles permissions.',
    options: [
        {
            name: 'list',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Shows the roles that have access to a specific command',
        },
        {
            name: 'soft-ban',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Soft-bans members',
            options: [
                {
                    name: 'roles',
                    description: 'Roles to have acces to soft-ban other members',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'soft-unban',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Soft-unbans members',
            options: [
                {
                    name: 'roles',
                    description: 'Roles to have acces to soft-unban other members',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'mute',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Mutes members',
            options: [
                {
                    name: 'roles',
                    description: 'Roles to have acces to mute other members',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'unmute',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Unmutes members',
            options: [
                {
                    name: 'roles',
                    description: 'Roles to have acces to unmute other members',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'kick',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'kick members',
            options: [
                {
                    name: 'roles',
                    description: 'Roles to have acces to kick other members',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'hist',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'punishment history',
            options: [
                {
                    name: 'roles',
                    description: 'Roles to have acces to other members history',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'purge',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'mass deletes messages',
            options: [
                {
                    name: 'roles',
                    description: 'Roles to have acces to mass delete messages',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
    ],
    async execute(client, interaction) {
        try {
            if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const guildID = interaction.guild.id;
                let schema
                const subCommand = interaction.options.getSubcommand()
                if (subCommand === 'list') {
                    let rolesSoftBan = 'not set', rolesSoftUnban = 'not set', rolesMute = 'not set', rolesUnmute = 'not set', rolesKick = 'not set', rolesHist = 'not set', rolesPurge = 'not set', rolesEdit = 'not set'
                    schema = await guildCommandsSchema.findOne({
                        guildID: guildID,
                    })
                    if (schema.rolesBan) {
                        rolesSoftBan = schema.rolesBan.split(' ')
                        for (let i = 0; i < rolesSoftBan.length; ++i) {
                            let role = interaction.guild.roles.cache.find(r => r.id === rolesSoftBan[i])
                            if (role) {
                                rolesSoftBan[i] = " " + role.name
                            }
                            else {
                                rolesSoftBan[i] = " " + "deleted-role"
                            }
                        }
                    }

                    if (schema.rolesUnban) {
                        rolesSoftUnban = schema.rolesUnban.split(' ')
                        for (let i = 0; i < rolesSoftUnban.length; ++i) {
                            let role = interaction.guild.roles.cache.find(r => r.id === rolesSoftUnban[i])
                            if (role) {
                                rolesSoftUnban[i] = " " + role.name
                            }
                            else {
                                rolesSoftUnban[i] = " " + "deleted-role"
                            }
                        }
                    }

                    if (schema.rolesMute) {
                        rolesMute = schema.rolesMute.split(' ')
                        for (let i = 0; i < rolesMute.length; ++i) {
                            let role = interaction.guild.roles.cache.find(r => r.id === rolesMute[i])
                            if (role) {
                                rolesMute[i] = " " + role.name
                            }
                            else {
                                rolesMute[i] = " " + "deleted-role"
                            }
                        }
                    }

                    if (schema.rolesUnmute) {
                        rolesUnmute = schema.rolesUnmute.split(' ')
                        for (let i = 0; i < rolesUnmute.length; ++i) {
                            let role = interaction.guild.roles.cache.find(r => r.id === rolesUnmute[i])
                            if (role) {
                                rolesUnmute[i] = " " + role.name
                            }
                            else {
                                rolesUnmute[i] = " " + "deleted-role"
                            }
                        }
                    }

                    if (schema.rolesKick) {
                        rolesKick = schema.rolesKick.split(' ')
                        for (let i = 0; i < rolesKick.length; ++i) {
                            let role = interaction.guild.roles.cache.find(r => r.id === rolesKick[i])
                            if (role) {
                                rolesKick[i] = " " + role.name
                            }
                            else {
                                rolesKick[i] = " " + "deleted-role"
                            }
                        }
                    }

                    if (schema.rolesHist) {
                        rolesHist = schema.rolesHist.split(' ')
                        for (let i = 0; i < rolesHist.length; ++i) {
                            let role = interaction.guild.roles.cache.find(r => r.id === rolesHist[i])
                            if (role) {
                                rolesHist[i] = " " + role.name
                            }
                            else {
                                rolesHist[i] = " " + "deleted-role"
                            }
                        }
                    }

                    if (schema.rolesPurge) {
                        rolesPurge = schema.rolesPurge.split(' ')
                        for (let i = 0; i < rolesPurge.length; ++i) {
                            let role = interaction.guild.roles.cache.find(r => r.id === rolesPurge[i])
                            if (role) {
                                rolesPurge[i] = " " + role.name
                            }
                            else {
                                rolesPurge[i] = " " + "deleted-role"
                            }
                        }
                    }

                    if (schema.staffRole) {
                        rolesEdit = schema.staffRole.split(' ')
                        for (let i = 0; i < rolesEdit.length; ++i) {
                            let role = interaction.guild.roles.cache.find(r => r.id === rolesEdit[i])
                            if (role) {
                                rolesEdit[i] = " " + role.name
                            }
                            else {
                                rolesEdit[i] = " " + "deleted-role"
                            }
                        }
                    }

                    const message = new EmbedBuilder()
                        .setTitle(`Perms list for ${interaction.guild.name}`)
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                        .setColor('Blue')
                        .addFields({
                            name: 'Soft-ban:',
                            value: `${rolesSoftBan}`,
                        })
                        .addFields({
                            name: 'Soft-unban:',
                            value: `${rolesSoftUnban}`,
                        })
                        .addFields({
                            name: 'Mute:',
                            value: `${rolesMute}`,
                        })
                        .addFields({
                            name: 'Unmute:',
                            value: `${rolesUnmute}`,
                        })
                        .addFields({
                            name: 'Kick:',
                            value: `${rolesKick}`,
                        })
                        .addFields({
                            name: 'Hist:',
                            value: `${rolesHist}`,
                        })
                        .addFields({
                            name: 'Purge:',
                            value: `${rolesPurge}`,
                        })
                        .addFields({
                            name: 'Edit:',
                            value: `${rolesEdit}`,
                        })
                    return await interaction.reply({ embeds: [message] })
                }
                let roles = interaction.options.getString('roles')
                const rolesName = roles;
                roles = roles.replaceAll('<', '');
                roles = roles.replaceAll('@', '');
                roles = roles.replaceAll('&', '');
                roles = roles.replaceAll('>', '');
                switch (subCommand) {
                    case 'soft-ban':
                        await interaction.reply(`✅ Roles: ${rolesName} have been authorized for ${subCommand}.`)

                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema) {
                            schema.rolesBan = roles
                            await schema.save()
                        }
                        else {
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                rolesBan: roles,
                            })
                            await schema.save()
                        }

                        break;
                    case 'soft-unban':
                        await interaction.reply(`✅ Roles: ${rolesName} have been authorized for ${subCommand}.`)

                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema) {
                            schema.rolesUnban = roles
                            await schema.save()
                        }
                        else {
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                rolesUnban: roles,
                            })
                            await schema.save()
                        }

                        break;
                    case 'mute':
                        await interaction.reply(`✅ Roles: ${rolesName} have been authorized for ${subCommand}.`)

                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema) {
                            schema.rolesMute = roles
                            await schema.save()
                        }
                        else {
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                rolesMute: roles,
                            })
                            await schema.save()
                        }

                        break;
                    case 'unmute':
                        await interaction.reply(`✅ Roles: ${rolesName} have been authorized for ${subCommand}.`)

                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema) {
                            schema.rolesUnmute = roles
                            await schema.save()
                        }
                        else {
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                rolesUnmute: roles,
                            })
                            await schema.save()
                        }

                        break;
                    case 'kick':
                        await interaction.reply(`✅ Roles: ${rolesName} have been authorized for ${subCommand}.`)

                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema) {
                            schema.rolesKick = roles
                            await schema.save()
                        }
                        else {
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                rolesKick: roles,
                            })
                            await schema.save()
                        }

                        break;
                    case 'hist':
                        await interaction.reply(`✅ Roles: ${rolesName} have been authorized for ${subCommand}.`)

                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema) {
                            schema.rolesHist = roles
                            await schema.save()
                        }
                        else {
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                rolesHist: roles,
                            })
                            await schema.save()
                        }

                        break;
                    case 'purge':
                        await interaction.reply(`✅ Roles: ${rolesName} have been authorized for ${subCommand}.`)

                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema) {
                            schema.rolesPurge = roles
                            await schema.save()
                        }
                        else {
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                rolesPurge: roles,
                            })
                            await schema.save()
                        }

                        break
                }
                return
            }
            return await interaction.reply({ content: '**❌ You are not authorized to use this**' })
        } catch(err) {
            await interaction.reply({ content: '**❌ Oops something went wrong... please contact me: Sergetec#6803 🤔**' })
            console.log(err)
        }
    }
}