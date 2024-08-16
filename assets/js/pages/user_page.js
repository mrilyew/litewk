window.pages['user_page'] = new class {
    async render_page() {
        let id = parseInt(main_class['hash_params'].id)
        if(isNaN(id) || id == null || id == 0 || id < 0) {
            id = window.active_account.info.id
        }
        
        const user = new User

        try {
            await user.fromId(id, true, window.main_url.getParam('section', 'all'))

            this.user = user
        } catch(e) {
            console.error(e)

            main_class.addOnpageErrorWithTitle(_('user_page.info'), `
                <span>${_('errors.profile_not_found')}</span>
                <input type='button' id='__comeback' value='${_('messagebox.comeback')}'>
            `)

            return
        }

        main_class.changeTitle(user.getName().escapeHtml())
        u('.page_content').html(user.getTemplate())
        
        // Drawing wall
        if(user.hasAccess() && !user.isDeactivated()) {
            await Wall.fastWallCreate(user)
        }

        // Show reg date
        if(window.site_params.get('ux.show_reg', '0') == '1') {
            u('#__regdate').html(_('messagebox.loading_shy'))
            try {
                u('#__regdate').html(await user.getRegistrationDate())
            } catch(e) {
                console.log('Profile | Registration date getter error. Text: ', e)

                u('#__regdate').html(_('user_page.error_getting_registration_date'))
            }
        }
    }

    show_skeleton() {
        u('.page_content').html(window.templates.user_page_skeleton())
    }

    execute_buttons() 
    {
        u('.user_page_grid').on('click', '#_setReport', (e) => {
            const msg = new MessageBox(_('common.report'), window.templates._report_user_block(this.user), [_('messagebox.cancel'), _('messagebox.send')], [() => {
                msg.close()
            }, async () => {
                const report_type_node = u(`input[name='reports.lists']:checked`).nodes[0]

                if(!report_type_node) {
                    return
                }

                const report_type = report_type_node.value
                const report_text = u('#_additional_desc').nodes[0].value
                let result = null

                try {
                    result = await window.vk_api.call('users.report', {
                        'user_id': this.user.getId(),
                        'type': report_type,
                        'comment': report_text.escapeHtml(),
                    })
                } catch(e) {
                    //window.main_class.newNotification(_('reports.report_was_not_sent'), e.message)
                }

                if(result == 1) {
                    window.main_class.newNotification(_('reports.report_was_sent'))
                }

                msg.close()
            }])

            msg.getNode().style.width = '318px'
        })

        u('.user_page_grid').on('click', '#_friendStatusChange', async (e) => {
            e.preventDefault()

            u('#_actions').addClass('stopped')
            const friend_status = Number(e.currentTarget.dataset.val)
            const user_id = Number(e.currentTarget.dataset.addid)
            let result = 0

            switch(friend_status) {
                // Add friend as first
                case 0:
                    result = await User.addFriend(user_id)
                    break
                // Remove your friend request
                case 1:
                    await User.deleteFriend(user_id)
                    result = 0
                    break
                // Accept friend request
                case 2:
                    result = await User.addFriend(user_id, true)
                    break
                // Decline friend request
                case 3:
                    result = await User.deleteFriend(user_id)
                    result = 0
                    break
                case 4:
                    result = await User.addFriend(user_id)
                    result = 3
                    break
            }

            this.user.info.friend_status = result
            this.user.cacheEntity(true)

            u('#_actions').removeClass('stopped')
            u('.page_content #_actions').html(window.templates._user_page_buttons(this.user))
        })

        u('.user_page_grid').on('click', '#_toggleBlacklist', async (e) => {
            e.preventDefault()

            u('#_actions').addClass('stopped')

            const bl_status = Number(e.currentTarget.dataset.val)
            const addid = this.user.getId()
            let result = null

            switch(bl_status) {
                default:
                case 0:
                    result = await window.vk_api.call('account.ban', {'owner_id': addid})
                    
                    e.target.setAttribute('data-val', 1)
                    e.target.innerHTML = _('blacklist.remove_from_blacklist')
                    this.user.info.blacklisted_by_me = 1
        
                    break
                case 1:
                    result = await window.vk_api.call('account.unban', {'owner_id': addid})

                    e.target.setAttribute('data-val', 0)
                    e.target.innerHTML = _('blacklist.add_to_blacklist')
                    this.user.info.blacklisted_by_me = 0

                    break
            }

            u('#_actions').removeClass('stopped')
            this.user.cacheEntity(true)
        })
    }
}
