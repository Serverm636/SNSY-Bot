const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js')
const punishmentSchema = require('../Models/punishment-schema')
const archiveSchema = require('../Models/archive-schema')
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'soft',
    description: 'Soft bans/unbans a member',
    options: [
        {
            name: 'ban',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'soft-bans a member',
            options: [
                {
                    name: 'user',
                    type: ApplicationCommandOptionType.User,
                    description: 'The user to be banned',
                    required: true,
                },
                {
                    name: 'reason',
                    type: ApplicationCommandOptionType.String,
                    description: 'The reason for the ban',
                    required: true,
                },
            ],
        },
        {
            name: 'unban',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'soft-unbans a member',
            options: [
                {
                    name: 'user',
                    type: ApplicationCommandOptionType.User,
                    description: 'The user to be unbanned',
                    required: true,
                },
                {
                    name: 'reason',
                    type: ApplicationCommandOptionType.String,
                    description: 'The reason for the unban',
                    required: true,
                },
            ],
        },
    ],
    async execute(client, interaction) {
        try {
            const subCommand = interaction.options.getSubcommand()
            const guildId = interaction.guild.id;
            const result2 = await guildCommandsSchema.findOne({
                guildID: guildId
            })
            if (!result2.bannedRole) {
                return await interaction.reply({ content: '**❌ The banned role have not been set up. Please use `/set banned-role`**' })
            }
            const banRole = result2.bannedRole

            const result3 = await guildCommandsSchema.findOne({
                guildID: guildId
            })
            if (!result3.warnsChannel) {
                return await interaction.reply({ content: '**❌ The warns channel have not been set up. Please use `/set warns-channel`**' })
            }
            const channel = result3.warnsChannel

            const result4 = await guildCommandsSchema.findOne({
                guildID: guildId
            })
            if (!result4.mainRole) {
                return await interaction.reply({ content: '**❌ The main role have not been set up. Please use `/set main-role`**' })
            }
            let mainRoles = result4.mainRole.split(' ')

            //Test for role existance

            //Banned role
            let ok = interaction.guild.roles.cache.find(r => r.id === banRole)
            if (typeof ok === undefined) {
                let schema = await guildCommandsSchema.findOne({
                    guildID: guildId
                })
                schema.bannedRole = ''
                await schema.save()
                return await interaction.reply({ content: '**❌ The banned role have not been set up. Please use `/set banned-role`**' })
            }

            //Warns channel
            ok = interaction.guild.channels.cache.find(c => c.id === channel)
            if (typeof ok === undefined) {
                let schema = await guildCommandsSchema.findOne({
                    guildID: guildId
                })
                schema.warnsChannel = ''
                await schema.save()
                return await interaction.reply({ content: '**❌ The warns channel have not been set up. Please use `/set warns-channel`**' })
            }

            //Main roles
            if (isIterable(mainRoles)) {
                let okRoles = ''
                let first = false
                for (const role of mainRoles) {
                    if (role === '') {
                        continue
                    }
                    ok = interaction.guild.roles.cache.find(r => r.id === role)
                    if (typeof ok !== undefined) {
                        if (!first) {
                            okRoles = role + ' '
                            first = true
                        }
                        else {
                            okRoles += role + ' '
                        }
                    }
                }
                if (okRoles === '') {
                    let schema = await guildCommandsSchema.findOne({
                        guildID: guildId
                    })
                    schema.mainRole = ''
                    await schema.save()
                    return await interaction.reply({ content: '**❌ The main role have not been set up. Please use `/set main-role`**' })
                }
                else {
                    let schema = await guildCommandsSchema.findOne({
                        guildID: guildId
                    })
                    schema.mainRole = okRoles
                    await schema.save()
                }
                mainRoles = okRoles.split(' ')
                mainRoles = mainRoles.filter(elm => elm)
            }
            else {
                ok = interaction.guild.roles.cache.find(r => r.id === mainRoles)
                if (typeof ok === undefined) {
                    let schema = await guildCommandsSchema.findOne({
                        guildID: guildId
                    })
                    schema.mainRole = ''
                    await schema.save()
                    return await interaction.reply({ content: '**❌ The main role have not been set up. Please use `/set main-role`**' })
                }
            }


            if (subCommand === 'ban') {
                let ok = false
                const result = await guildCommandsSchema.findOne({
                    guildID: guildId
                })
                if (!result.rolesBan) {
                    return await interaction.reply({ content: '**❌ You are not authorized to use this**' })
                }
                const roles = result.rolesBan.split(" ")

                if (interaction.member.roles.cache.some(r => roles.includes(r.id))) {
                    ok = true
                }

                if (ok === true || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    const user = interaction.options.getUser('user') //FOLOSIT DOAR LA MEMBERTARGET
                    const bannedMember = interaction.options.getUser('user') //FOLOSIT DOAR LA NICKNAME
                    if (user) {
                        let memberTarget = interaction.guild.members.cache.get(user.id)
                        if (memberTarget.roles.cache.some(r => roles.includes(r.id))) {
                            return await interaction.reply('**CAN\'T BAN THAT MEMBER**')
                        }
                        const result = await punishmentSchema.findOne({
                            guildID: guildId,
                            userID: user.id,
                            type: 'ban',
                        })
                        if (result) {
                            return await interaction.reply({ content: `❌ <@${user.id}> is already banned.` })
                        }
                        let banReason = interaction.options.getString('reason')
                        await memberTarget.roles.remove(memberTarget.roles.cache)
                        await memberTarget.roles.add(banRole)

                        if (!banReason) {
                            banReason = 'No reason provided'
                            await interaction.reply({ content: `✅ <@${memberTarget.user.id}> has been banned.` })
                        }
                        else {
                            await interaction.reply({ content: `✅ <@${memberTarget.user.id}> has been banned for ${banReason}.` })
                        }

                        //SANCTIUNI
                        let schema = await punishmentSchema.create({
                            guildID: guildId,
                            userID: user.id,
                            staffID: interaction.user.id,
                            reason: banReason,
                            type: 'ban',
                        })
                        await schema.save()

                        //ARHIVA
                        let arhiva = await archiveSchema.create({
                            guildID: guildId,
                            userID: user.id,
                            staffID: interaction.user.id,
                            reason: banReason,
                            type: 'ban',
                        })
                        await arhiva.save()

                        //#SANCTIUNI
                        const messsage = new EmbedBuilder()
                            .setTitle('BAN')
                            .setColor('Red')
                            .addFields({
                                name: 'ID',
                                value: `${memberTarget.id}`,
                                inline: true
                            })
                            .addFields({
                                name: 'Nickname',
                                value: memberTarget.nickname || bannedMember.tag.substring(0, bannedMember.tag.length - 5),
                                inline: true
                            })
                            .addFields({
                                name: 'Mention',
                                value: `<@${memberTarget.id}>`,
                                inline: true
                            })
                            .addFields({
                                name: 'Banned by',
                                value: `<@${interaction.user.id}>`,
                                inline: true
                            })
                            .addFields({
                                name: 'Nickname',
                                value: interaction.user.nickname || interaction.user.tag.substring(0, interaction.user.tag.length - 5),
                                inline: true
                            })
                            .addFields({
                                name: 'Reason',
                                value: `${banReason}`,
                                inline: true
                            })
                            .setTimestamp(Date.now())
                        return client.channels.cache.get(channel).send({ embeds: [messsage] })
                    }
                }
                await interaction.reply({ content: '**❌ You are not authorized to use this**' })
            }
            else if (subCommand === 'unban') {
                let ok = false
                const result = await guildCommandsSchema.findOne({
                    guildID: guildId
                })
                if (!result.rolesUnban) {
                    return await interaction.reply({ content: '**❌ You are not authorized to use this**' })
                }
                const roles = result.rolesUnban.split(" ")

                if (interaction.member.roles.cache.some(r => roles.includes(r.id))) {
                    ok = true
                }
                if (ok === true || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    const user = interaction.options.getUser('user') //FOLOSIT DOAR LA MEMBERTARGET
                    const bannedMember = interaction.options.getUser('user') //FOLOSIT DOAR LA NICKNAME
                    if (user) {
                        let memberTarget = interaction.guild.members.cache.get(user.id)
                        let unbanReason = interaction.options.getString('reason')
                        if (isIterable(mainRoles)) {
                            for (const role of mainRoles) {
                                await memberTarget.roles.add(role)
                            }
                        }
                        else {
                            await memberTarget.roles.add(mainRoles)
                        }
                        await memberTarget.roles.remove(banRole);
                        await interaction.reply({ content: `✅ <@${memberTarget.user.id}> has been unbanned.` })
                        if (!unbanReason) {
                            unbanReason = 'No reason provided'
                        }

                        //DELETING FROM DATABASE
                        const query = {
                            guildID: guildId,
                            userID: memberTarget.user.id,
                        }
                        await punishmentSchema.deleteMany(query)

                        //ARHIVA
                        let arhiva = await archiveSchema.create({
                            guildID: guildId,
                            userID: user.id,
                            staffID: interaction.user.id,
                            reason: unbanReason,
                            type: 'unban',
                        })
                        await arhiva.save()

                        //#SANCTIUNI
                        const message = new EmbedBuilder()
                            .setTitle('UNBAN')
                            .setColor('Green')
                            .addFields({
                                name: 'ID',
                                value: `${memberTarget.id}`,
                                inline: true
                            })
                            .addFields({
                                name: 'Nickname',
                                value: memberTarget.nickname || bannedMember.tag.substring(0, bannedMember.tag.length - 5),
                                inline: true
                            })
                            .addFields({
                                name: 'Mention',
                                value: `<@${memberTarget.id}>`,
                                inline: true
                            })
                            .addFields({
                                name: 'Unbanned by',
                                value: `<@${interaction.user.id}>`,
                                inline: true
                            })
                            .addFields({
                                name: 'Nickname',
                                value: interaction.user.nickname || interaction.user.tag.substring(0, interaction.user.tag.length - 5),
                                inline: true
                            })
                            .addFields({
                                name: 'Reason',
                                value: `${unbanReason}`,
                                inline: true
                            })
                            .setTimestamp(Date.now())
                        return client.channels.cache.get(channel).send({ embeds: [message] })
                    }
                }
            }
            await interaction.reply({ content: '**❌ You are not authorized to use this**' })
        } catch(err) {
            await interaction.reply({ content: '**❌ Oops something went wrong... check if my role is above all the other roles 🤔**' })
            console.log(err)
        }
    }
}

function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function'
}