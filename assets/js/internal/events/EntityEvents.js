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

u(document).on('click', '#_toggleSub', async (e) => {
    e.preventDefault()

    e.target.classList.add('stopped')

    const sub_status = Number(e.currentTarget.dataset.val)
    let verb = 'join'

    if(sub_status == 1) {
        verb = 'leave'
    }

    const result = await window.vk_api.call('groups.'+verb, {'group_id': e.target.dataset.addid})

    if(sub_status == 0) {
        e.target.setAttribute('data-val', 1)
        e.target.innerHTML = _('groups.unsubscribe')
    } else {
        e.target.setAttribute('data-val', 0)
        e.target.innerHTML = _('groups.subscribe')
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

    const stats = await window.vk_api.call('status.getImagePopup', {'user_id': status.dataset.id})
    
    new MessageBox(_('image_status.name'), `
        <div class='smiley_message'>
            <div class='smiley_message_icon'>
                <img src='${stats.popup.photo.images[2].url}'>
            </div>

            <div class='smiley_message_text'>
                <span class='smiley_message_title'>${Utils.escape_html(stats.popup.title)}</span>
                <span class='smiley_message_text_span'>${Utils.format_text(stats.popup.text)}</span>

                ${stats.popup.buttons && stats.popup.buttons.length > 0 ? `<a href='${stats.popup.buttons[0].action.url}' target='_blank'><input type='button' id='__getStatus' value='${_('image_status.get_status')}'></a>` : ''}
                
            </div>
        </div>
    `)
})

u(document).on('click', '#_bl_add_user', (e) => {
    const msg = new MessageBox(_('user_page_edit.add_to_bl'), `
        <div id='_bladd_first_frame'>
            <p>${_('user_page_edit.add_to_bl_desc')}</p>

            <input type='query' placeholder='${_('user_page_edit.bl_enter_search')}' style='width: 98%;' id='_blacklist_search'>
        </div>
    `, [_('messagebox.cancel'), _('user_page_edit.add')], [() => {
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
            const msg_a = new MessageBox(_('errors.error'), _('errors.this_is_not_user'), [_('messagebox.close')], [() => {
                last_btn.classList.remove('stopped')
                msg_a.close()
            }])
        } else {
            if(!resolved_name.object_id) {
                const msg_c = new MessageBox(_('errors.error'), _('errors.not_found_user'), [_('messagebox.close')], [() => {
                    last_btn.classList.remove('stopped')
                    msg_c.close()
                }])

                return
            }

            if(Number(resolved_name.object_id) == window.active_account.info.id) {
                let msg_d = new MessageBox(_('errors.error'), _('errors.cannot_block_yourself'), [_('messagebox.close')], [() => {
                    last_btn.classList.remove('stopped')
                    msg_d.close()
                }])
                return
            }

            const user = await window.vk_api.call('users.get', {'user_ids': resolved_name.object_id, 'fields': window.consts.TYPICAL_FIELDS_MINIMUM}, false)
            
            msg.close()

            const api_user = new User
            api_user.hydrate(user.response[0])

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
            `, [_('messagebox.no'), _('messagebox.yes')], [
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

    u('#_last_online').attr('style', 'display:block;')
})
