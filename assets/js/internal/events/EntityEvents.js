u(document).on('click', '#_show_hidden_info_us', (e) => {
    if(!u('.additional_info_block_hidden_default').hasClass('shown')) {
        e.target.innerHTML = _('user_page.hide_more_info')
    } else {
        e.target.innerHTML = _('user_page.show_more_info')
    }

    u('.additional_info_block_hidden_default').toggleClass('shown')
})

u(document).on('click', '#_show_hidden_history', (e) => {
    if(!u('.additional_info_block_hidden_default').hasClass('shown')) {
        e.target.innerHTML = _('groups.hide_history_block')
    } else {
        e.target.innerHTML = _('groups.show_history_block')
    }

    u('.additional_info_block_hidden_default').toggleClass('shown')
})

u(document).on('click', '#_toggleFriend', async (e) => {
    e.preventDefault()
    e.target.classList.add('stopped')

    const friend_status = Number(e.currentTarget.dataset.val)
    let data = null

    switch(friend_status) {
        case 0:
            data = await window.vk_api.call('friends.add', {'user_id': e.currentTarget.dataset.addid})

            if(data == 1 || data == 4) {
                e.target.setAttribute('data-val', 1)
                e.target.innerHTML = _('users_relations.cancel_friendship')
            } else if(data == 2) {
                e.target.setAttribute('data-val', 3)
                e.target.innerHTML = _('users_relations.destroy_friendship')
            }

            break
        case 1:
            data = await window.vk_api.call('friends.delete', {'user_id': e.currentTarget.dataset.addid})
            e.target.setAttribute('data-val', 0)
            e.target.innerHTML = _('users_relations.start_friendship')

            break
        case 2:
            data = await window.vk_api.call('friends.add', {'user_id': e.currentTarget.dataset.addid, 'follow': 1})

            u('#_toggleFriend').remove()

            u('#_actions').nodes[0].insertAdjacentHTML('afterbegin', `
                <a class='action' id='_toggleFriend' data-val='0'> ${_('users_relations.start_friendship')}</a>
            `)
            
            break
        case 4:
            data = await window.vk_api.call('friends.add', {'user_id': e.currentTarget.dataset.addid})
            u('#_toggleFriend').remove()

            u('#_actions').nodes[0].insertAdjacentHTML('afterbegin', `
                <a class='action' id='_toggleFriend' data-val='3' data-addid='${e.currentTarget.dataset.addid}'> ${_('users_relations.destroy_friendship')}</a>
            `)

            break
        case 3:
            data = await window.vk_api.call('friends.delete', {'user_id': e.currentTarget.dataset.addid})
            e.target.setAttribute('data-val', 4)
            e.target.innerHTML = _('users_relations.accept_friendship')

            break
    }

    e.target.classList.remove('stopped')
})

u(document).on('click', '#_toggleHiddeness', async (e) => {
    e.preventDefault()
    e.target.classList.add('stopped')

    const hidennes = Number(e.target.dataset.val)
    const verb = hidennes == 0 ? 'add' : 'delete'
    let result = {}
    const params = {'user_ids': ''}
    
    if(e.target.dataset.ban_id) {
        if(Number(e.target.dataset.ban_id) < 0) {
            params.group_ids = Math.abs(Number(e.target.dataset.ban_id))
        } else {
            params.user_ids = Number(e.target.dataset.ban_id)
        }
    } else {
        if(u('#user_info').length > 0) {
            params.user_ids = u('#user_info').nodes[0].value
        } else {
            params.group_ids = u('#clb_id').nodes[0].value
        }
    }

    if(e.target.dataset.type == 'week') {
        params.type = 'week'
    }

    result = await window.vk_api.call(`newsfeed.${verb}Ban`, params)
    
    if(hidennes == 0) {
        e.target.setAttribute('data-val', 1)

        if(e.target.dataset.ban_id != null) {
            e.target.value = _('user_page.unhide_from_feed')
        } else {
            e.target.innerHTML = _('user_page.unhide_from_feed')
        }
    } else {
        e.target.setAttribute('data-val', 0)
        
        if(e.target.dataset.ban_id != null) {
            if(e.target.dataset.type == 'week') {
                e.target.value = _('newsfeed.hide_source_from_feed_on_week')
            } else {
                e.target.value = _('user_page.hide_from_feed')
            }
        } else {
            e.target.innerHTML = _('user_page.hide_from_feed')
        }
    }

    e.target.classList.remove('stopped')
})

u(document).on('click', '#_toggleInteressness', async (e) => {
    e.preventDefault()
    e.target.classList.add('stopped')

    const interest = Number(e.currentTarget.dataset.val)
    const verb = interest == 0 ? 'ignore' : 'unignore'
    const post = e.target.closest('.post')
    const id = post.dataset.postid.split('_')
    const type = e.currentTarget.dataset.type
    if(type == 'post') {
        type = 'wall'
    }

    const result = await window.vk_api.call(`newsfeed.${verb}Item`, {'type': type, 'owner_id': id[0], 'item_id': id[1]})

    if(interest == 1) {
        post.querySelector('.post_wrapper').style.display = 'block'
        post.querySelector('.post_unignore_block').style.display = 'none'
    } else {
        post.querySelector('.post_wrapper').style.display = 'none'
        post.querySelector('.post_unignore_block').style.display = 'block'
    }

    e.target.classList.remove('stopped')
})

u(document).on('click', '#_toggleSubscribe', async (e) => {
    e.preventDefault()
    e.target.classList.add('stopped')

    let owner = 0
    if(document.querySelector('#user_info')) {
        owner = document.querySelector('#user_info').value
    } else {
        owner = '-' + document.querySelector('#clb_id').value
    }

    const hideness = Number(e.currentTarget.dataset.val)
    const verb = hideness == 0 ? '' : 'un'
    const result = await window.vk_api.call(`wall.${verb}subscribe`, {'owner_id': owner})

    if(hideness == 0) {
        e.target.setAttribute('data-val', 1)
        e.target.innerHTML = _('user_page.unsubscribe_to_new')
    } else {
        e.target.setAttribute('data-val', 0)
        e.target.innerHTML = _('user_page.subscribe_to_new')
    }

    e.target.classList.remove('stopped')
})

u(document).on('click', '.image_status', async (e) => {
    let status = e.target

    if(status.tagName == 'IMG') {
        status = e.target.parentNode
    }

    MessageBox.toggleCircle()
    const stats = new ImageStatus
    await stats.fromUserId(status.dataset.id)

    const html = u('<div></div>')
    html.html(`
    <div class='smiley_message flex flex_column'>
        <div class='smiley_message_icon'>
            <img src='${stats.getIcon()}'>
        </div>

        <div class='smiley_message_text'>
            <span class='smiley_message_title'>${stats.getTitle()}</span>
            <span class='smiley_message_text_span'>${stats.getDescription()}</span>

            <div class='smiley_buttons flex justify_center'></div>
        </div>
    </div>
    `)

    if(stats.hasButtons()) {
        stats.getButtons().forEach(btn => {
            if(btn.action.type == 'open_url') {
                html.find('.smiley_buttons').append(`
                    <a href='${btn.action.url}' target='_blank'><input class='primary' type='button' value='${btn.title.escapeHtml()}'></a>
                `)
            }
        })
    }
    new MessageBox(_('image_status.name'), html.html())

    MessageBox.toggleCircle()
})

u(document).on('click', '#_bl_add_user', (e) => {
    const msg = new MessageBox(_('user_page_edit.add_to_bl'), `
        <div id='_bladd_first_frame' class='flex_column' style='gap: 8px;'>
            <p>${_('user_page_edit.add_to_bl_desc')}</p>

            <input type='search' placeholder='${_('user_page_edit.bl_enter_search')}' id='_blacklist_search'>
        </div>
    `, [_('messagebox.cancel'), _('user_page_edit.add') + '|primary'], [() => {
        msg.close()
    }, async () => {
        const last_btn = msg.getNode().querySelectorAll('.messagebox_buttons input')[1]
        const screen_name = Utils.cut_vk(u('#_blacklist_search').nodes[0].value)

        if(!screen_name || screen_name == '0' || screen_name == '') {
            return
        }

        last_btn.classList.add('stopped')
        const resolved_name = await window.vk_api.resolveScreenName(screen_name)
        
        if(resolved_name.type != 'user') {
            const msg_a = new MessageBox(_('errors.error'), _('errors.this_is_not_user'), [_('messagebox.close') + '|primary'], [() => {
                last_btn.classList.remove('stopped')
                msg_a.close()
            }])
        } else {
            if(!resolved_name.object_id) {
                const msg_c = new MessageBox(_('errors.error'), _('errors.not_found_user'), [_('messagebox.close') + '|primary'], [() => {
                    last_btn.classList.remove('stopped')
                    msg_c.close()
                }])

                return
            }

            if(Number(resolved_name.object_id) == window.active_account.info.id) {
                let msg_d = new MessageBox(_('errors.error'), _('errors.cannot_block_yourself'), [_('messagebox.close') + '|primary'], [() => {
                    last_btn.classList.remove('stopped')
                    msg_d.close()
                }])
                return
            }

            const user = await window.vk_api.call('users.get', {'user_ids': resolved_name.object_id, 'fields': window.consts.TYPICAL_FIELDS_MINIMUM}, false)
            
            msg.close()

            const api_user = new User
            api_user.hydrate(user[0])

            if(api_user.info.blacklisted_by_me == 1) {
                let msg_e = new MessageBox(_('errors.error'), _('errors.blacklisted_by_me'), [_('messagebox.close')], [() => {
                    last_btn.classList.remove('stopped')

                    u('#_bl_add_user').trigger('click')
                    msg_e.close()
                }])
                return
            }

            const msg_b = new MessageBox(_('user_page_edit.add_to_bl'), `
                ${_('user_page_edit.want_to_block')}

                ${window.templates.user_mini(api_user)}
            `, [_('messagebox.no'), _('messagebox.yes') + '|primary'], [
            () => {
                msg_b.close()
                u('#_bl_add_user').trigger('click')
            }, async () => {
                msg_b.getNode().querySelectorAll('.messagebox_buttons input')[1].classList.add('stopped')

                await window.vk_api.call('account.ban', {'owner_id': api_user.getId()})
                window.black_list = null
                msg_b.close()

                window.router.restart(null, 'ignore_menu')
            }])
        }
    }])
})

// если история группы настолько большая
u(document).on('click', '#_groups_history_full', async (e) => {
    let next_from = e.target.dataset.next_from
    let result    = await window.vk_api.call('groups.getNameHistory', {"group_id": u('#clb_id')[0].value, 'start_from': next_from}, false);
    let full_html = ''
    result.response.items.forEach(item => {
        let hist_item = new GroupHistoryItem(item)

        full_html += hist_item.getHTML()
    })

    u(`.club_history`).nodes[0].innerHTML = full_html
})

u(document).on('click', '.dead_person_mark', (e) => {
    u(e.target).remove()

    u('#_last_online span').attr('style', 'display:block;')
})

u(document).on('click', '#_getAdminGroupd', async (e) => {
    MessageBox.toggleCircle()

    let groups = await window.vk_api.getAdminedGroupsByUser(e.target.dataset.id)
    groups = groups.response

    if(groups.count < 1) {
        alert(_('user_page.admined_groups_not_found'))
    } else {
        const ids = []
        groups.items.forEach(group => {
            ids.push(group.id)
        })

        const real_groups = await window.vk_api.call('groups.getById', {'group_ids': ids.slice(0, 500).join(','), 'fields': window.consts.TYPICAL_GROUPS_FIELDS})
        MessageBox.toggleCircle()

        const msg = new MessageBox(_('user_page.admined_groups'), '', null, null, {'as_window': 1, 'no_title': 1})
        msg.getNode().style.width = '630px'
        const msg_body = u(msg.getNode().querySelector('.messagebox_body'))

        u(msg.getNode()).find('.messagebox_title b').append(`<span class='gray'> ${real_groups.groups.length}</span>`)
        msg_body.html(`<div class='entity_double_grid'><div class='listview_insert'></div></div>`)

        const insert = msg_body.find('.entity_double_grid .listview_insert')
        real_groups.groups.forEach(group => {
            const club = new Club
            club.hydrate(group)

            insert.append(window.templates._subs_listview(club))
        })
    }
})

u(document).on('click', '#_subs_user', async (e) => {
    MessageBox.toggleCircle()

    const perPage = 24

    const id = u('#user_info').attr('data-userid')
    const subscriptions = await window.vk_api.call('users.getSubscriptions',  {"user_id": id, "extended": 1, 'count': perPage, "fields": window.consts.TYPICAL_USERS_GROUPS_FIELDS})
   
    const msg = new MessageBox(_('subscriptions.subscriptions'), ``, null, null, {'as_window': 1, 'no_title': 1, 'big_name': 1})
    msg.getNode().style.width = '630px'
    u(msg.getNode()).find('.messagebox_title b').append(`<span class='gray'> ${subscriptions.count}</span>`)

    const msg_body = u(msg.getNode().querySelector('.messagebox_body'))
    MessageBox.toggleCircle()

    msg_body.html(`<div class='entity_double_grid'></div>`)
    window.main_classes['subs'] = new Subscriptions({
        'insertNode': '.entity_double_grid',
        'handler': 'subs',
        'method_params': {
            'owner_id': id,
        },
        'presetPerPage': perPage,
    })

    window.main_classes['subs'].hydrateResult(subscriptions)
})

u(document).on('click', '#_sub_small_button', async (e) => {
    const target = u(e.target)
    const id = Number(target.attr('data-id'))

    target.addClass('stopped')

    let entity = null
    if(id > 0) {
        entity = new User
    } else {
        entity = new Club
    }

    await entity.fromId(Math.abs(id), false)

    try {
        if(!target.hasClass('primary')) {
            // UNSUBSCRIBE 
    
            await entity.unsubscribe()
            target.removeClass('secondary').addClass('primary').attr('value', _('users_relations.subscribe'))
        } else {
            // SUBSCRIBE
            
            await entity.subscribe()
            target.removeClass('primary').addClass('secondary').attr('value', _('users_relations.unsubscribe'))
        }
    } catch(e) {
        Utils.vklikeError(e.message)
    }

    target.removeClass('stopped')
})

u(document).on('click', '#_similarGroups', async (e) => {
    const club_id = u('#clb_id').attr('data-clubid')
    const block = u('#_similar_groups_block')
    block.removeClass('hidden')

    window.main_classes['similar'] = new SimilarGroups({
        'insertNode': '#_similar_groups_block .entity_items',
        'handler': 'similar',
        'method_params': {
            'club_id': club_id,
        },
        'presetPerPage': 30,
    })

    window.main_classes['similar'].nextPage()
   
    block.find('.filler').remove()
})
