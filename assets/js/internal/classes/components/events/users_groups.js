$(document).on('click', '#_show_hidden_info_us', (e) => {
    if(!$('.additional_info_block_hidden_default').hasClass('shown')) {
        e.target.innerHTML = _('user_page.hide_more_info')
    } else {
        e.target.innerHTML = _('user_page.show_more_info')
    }

    $('.additional_info_block_hidden_default').toggleClass('shown')
})

$(document).on('click', '#_show_hidden_history', (e) => {
    if(!$('.additional_info_block_hidden_default').hasClass('shown')) {
        e.target.innerHTML = _('groups.hide_history_block')
    } else {
        e.target.innerHTML = _('groups.show_history_block')
    }

    $('.additional_info_block_hidden_default').toggleClass('shown')
})


$(document).on('click', '#_toggleFriend', async (e) => {
    e.preventDefault()

    let friend_status = Number(e.currentTarget.dataset.val)

    switch(friend_status) {
        case 0:
            let data = await window.vk_api.call('friends.add', {'user_id': e.currentTarget.dataset.addid})
            
            if(!data.error) {
                if(data.response == 1 || data.response == 4) {
                    e.target.setAttribute('data-val', 1)
                    e.target.innerHTML = _('users_relations.cancel_friendship')
                } else if(data.response == 2) {
                    e.target.setAttribute('data-val', 3)
                    e.target.innerHTML = _('users_relations.destroy_friendship')
                }
            } else {
                return
            }

            break
        case 1:
            let data1 = await window.vk_api.call('friends.delete', {'user_id': e.currentTarget.dataset.addid})

            if(!data1.error) {
                e.target.setAttribute('data-val', 0)
                e.target.innerHTML = _('users_relations.start_friendship')
            } else {
                return
            }

            break
        case 2:
            let data2 = await window.vk_api.call('friends.add', {'user_id': e.currentTarget.dataset.addid, 'follow': 1})
            
            if(!data2.error) {
                $('#_toggleFriend').remove()

                $('#_actions')[0].insertAdjacentHTML('afterbegin', `
                    <a class='action' id='_toggleFriend' data-val='0' href='#'> ${_('users_relations.start_friendship')}</a>
                `)
            } else {
                return
            }
            
            break
        case 4:
            let data3 = await window.vk_api.call('friends.add', {'user_id': e.currentTarget.dataset.addid})

            if(!data3.error) {
                $('#_toggleFriend').remove()

                $('#_actions')[0].insertAdjacentHTML('afterbegin', 
                `
                    <a class='action' id='_toggleFriend' data-val='3' href='#' data-addid='${e.currentTarget.dataset.addid}'> ${_('users_relations.destroy_friendship')}</a>
                `)
            } else {
                return
            }

            break
        case 3:
            let data4 = await window.vk_api.call('friends.delete', {'user_id': e.currentTarget.dataset.addid})

            if(!data4.error) {
                e.target.setAttribute('data-val', 4)
                e.target.innerHTML = _('users_relations.accept_friendship')
            } else {
                return
            }

            break
    }
})

$(document).on('click', '#_toggleBlacklist', async (e) => {
    e.preventDefault()
    let fave_status = Number(e.currentTarget.dataset.val)

    switch(fave_status) {
        default:
        case 0:
            let eetog_ = await window.vk_api.call('account.ban', {'owner_id': e.target.dataset.addid})

            if(!eetog_.error) {
                e.target.setAttribute('data-val', 1)
                e.target.innerHTML = _('blacklist.remove_from_blacklist')
            } else {
                return
            }

            break
        case 1:
            let eetog = await window.vk_api.call('account.unban', {'owner_id': e.target.dataset.addid})

            if(!eetog.error) {
                e.target.setAttribute('data-val', 0)
                e.target.innerHTML = _('blacklist.add_to_blacklist')
            } else {
                return
            }

            break
    }
})

$(document).on('click', '#_toggleSub', async (e) => {
    e.preventDefault()
    let sub_status = Number(e.currentTarget.dataset.val)
    let verb = 'join'

    if(sub_status == 1) {
        verb = 'leave'
    }

    let result = await window.vk_api.call('groups.'+verb, {'group_id': e.target.dataset.addid})
    
    if(!result.error) {
        if(sub_status == 0) {
            e.target.setAttribute('data-val', 1)
            e.target.innerHTML = _('groups.unsubscribe')
        } else {
            e.target.setAttribute('data-val', 0)
            e.target.innerHTML = _('groups.subscribe')
        }
    }
})

$(document).on('click', '#_toggleHiddeness', async (e) => {
    e.preventDefault()
    let hidenes = Number(e.target.dataset.val)
    let verb = hidenes == 0 ? 'add' : 'delete'
    let result = {}
    let params = {'user_ids': ''}
    
    if(e.target.dataset.ban_id) {
        if(Number(e.target.dataset.ban_id) < 0) {
            params.group_ids = Math.abs(Number(e.target.dataset.ban_id))
        } else {
            params.user_ids = Number(e.target.dataset.ban_id)
        }
    } else {
        if($('#usr_id')[0]) {
            params.user_ids = $('#usr_id')[0].value
        } else {
            params.group_ids = $('#clb_id')[0].value
        }
    }

    if(e.target.dataset.type == 'week') {
        params.type = 'week'
    }

    result = await window.vk_api.call(`newsfeed.${verb}Ban`, params)
    
    if(result.error) {
        return
    }
    
    if(hidenes == 0) {
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
})

$(document).on('click', '#_toggleInteressness', async (e) => {
    e.preventDefault()
    let interes = Number(e.currentTarget.dataset.val)
    let verb = interes == 0 ? 'ignore' : 'unignore'
    let post = e.target.closest('.post')
    let id = post.dataset.postid.split('_')
    let type = e.currentTarget.dataset.type

    if(type == 'post') {
        type = 'wall'
    }

    let result = await window.vk_api.call(`newsfeed.${verb}Item`, {'type': type, 'owner_id': id[0], 'item_id': id[1]})
    
    if(result.error) {
        return
    } else {
        if(interes == 1) {
            post.querySelector('.post_wrapper').style.display = 'block'
            post.querySelector('.post_unignore_block').style.display = 'none'
        } else {
            post.querySelector('.post_wrapper').style.display = 'none'
            post.querySelector('.post_unignore_block').style.display = 'block'
        }
    }
})

$(document).on('click', '#_toggleSubscribe', async (e) => {
    e.preventDefault()

    let owner = 0

    if(document.querySelector('#usr_id')) {
        owner = document.querySelector('#usr_id').value
    } else {
        owner = "-" + document.querySelector('#clb_id').value
    }

    let hidenes = Number(e.currentTarget.dataset.val)
    let verb = hidenes == 0 ? '' : 'un'
    let result = await window.vk_api.call(`wall.${verb}subscribe`, {'owner_id': owner})
    
    if(result.error) {
        return
    }

    if(hidenes == 0) {
        e.target.setAttribute('data-val', 1)
        e.target.innerHTML = _('user_page.unsubscribe_to_new')
    } else {
        e.target.setAttribute('data-val', 0)
        e.target.innerHTML = _('user_page.subscribe_to_new')
    }
})

$(document).on('click', '.image_status', async (e) => {
    let status = e.target

    if(status.tagName == 'IMG') {
        status = e.target.parentNode
    }

    let stats = await window.vk_api.call('status.getImagePopup', {'user_id': status.dataset.id})
    
    new MessageBox(_('image_status.name'), `
        <div class='smiley_message'>
            <div class='smiley_message_icon'>
                <img src='${stats.response.popup.photo.images[2].url}'>
            </div>

            <div class='smiley_message_text'>
                <span class='smiley_message_title'>${Utils.escape_html(stats.response.popup.title)}</span>
                <span class='smiley_message_text_span'>${Utils.format_text(stats.response.popup.text)}</span>

                ${stats.response.popup.buttons && stats.response.popup.buttons.length > 0 ? `<a href='${stats.response.popup.buttons[0].action.url}' target='_blank'><input type='button' id='__getStatus' value='${_('image_status.get_status')}'></a>` : ''}
                
            </div>
        </div>
    `)
})

$(document).on('click', '#_bl_add_user', (e) => {
    let msg = new MessageBox(_('user_page_edit.add_to_bl'), `
        <div id='_bladd_first_frame'>
            <p>${_('user_page_edit.add_to_bl_desc')}</p>

            <input type='query' placeholder='${_('user_page_edit.bl_enter_search')}' style='width: 98%;' id='__bles'>
        </div>
    `, [_('messagebox.cancel'), _('user_page_edit.add')], [() => {
        msg.close()
    }, async () => {
        let last_btn = msg.getNode().querySelectorAll('.messagebox_buttons input')[1]
        let screen_name = Utils.cut_vk($('#__bles')[0].value)

        if(!screen_name || screen_name == '0' || screen_name == '') {
            return
        }

        last_btn.classList.add('stopped')

        let res = await window.vk_api.resolveScreenName(screen_name)
        
        if(res.type != 'user') {
            let msg_a = new MessageBox(_('errors.error'), _('errors.this_is_not_user'), [_('messagebox.close')], [() => {
                last_btn.classList.remove('stopped')
                msg_a.close()
            }])
        } else {
            if(!res.object_id) {
                let msg_c = new MessageBox(_('errors.error'), _('errors.not_found_user'), [_('messagebox.close')], [() => {
                    last_btn.classList.remove('stopped')
                    msg_c.close()
                }])

                return
            }

            if(Number(res.object_id) == window.active_account.info.id) {
                let msg_d = new MessageBox(_('errors.error'), _('errors.cannot_block_yourself'), [_('messagebox.close')], [() => {
                    last_btn.classList.remove('stopped')
                    msg_d.close()
                }])
                return
            }

            let user = await window.vk_api.call('users.get', {'user_ids': res.object_id, 'fields': window.Utils.typical_fields_min}, false)
            user = user.response

            msg.close()

            let api_user = new User
            api_user.hydrate(user[0])

            if(api_user.info.blacklisted_by_me == 1) {
                let msg_e = new MessageBox(_('errors.error'), _('errors.blacklisted_by_me'), [_('messagebox.close')], [() => {
                    last_btn.classList.remove('stopped')

                    $('#_bl_add_user')[0].click()
                    msg_e.close()
                }])
                return
            }

            let msg_b = new MessageBox(_('user_page_edit.add_to_bl'), `
                ${_('user_page_edit.want_to_block')}

                <div class='content_blacklist_item' style='margin-top: 5px;'>
                    <div class='content_blacklist_item_info'>
                        <div class='content_blacklist_item_avatar'>
                            <a href='${api_user.getUrl()}' target='_blank'>
                                <img class='outliner' src='${api_user.getAvatar(true)}'>
                            </a>
                        </div>

                        <div class='content_blacklist_item_name'>
                            <div class='user_info_with_name'>
                                <a href='${api_user.getUrl()}' target='_blank' class='user_name ${api_user.isFriend() ? ' friended' : ''}'><b>${api_user.getFullName()}</b></a>
                    
                                ${api_user.has('image_status') && window.site_params.get('ui.hide_image_statuses') != '1' ? 
                                `<div class='image_status' data-id='${api_user.getId()}' title='${api_user.getImageStatus().name}'>
                                    <img src='${api_user.getImageStatusURL()}'>
                                </div>` : ``}
                            </div>
                            <div>
                                ${api_user.has('last_seen') ? `<span>${api_user.getFullOnline()}</span> ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `, [_('messagebox.no'), _('messagebox.yes')], [
            () => {
                msg_b.close()
                $('#_bl_add_user')[0].click()
            }, async () => {
                let res_ = await window.vk_api.call('account.ban', {'owner_id': api_user.getId()})
                window.black_list = null
                msg_b.close()

                window.router.restart(null, 'ignore_menu')
            }])
        }
    }])
})

$(document).on('click', '#_groups_history_full', async (e) => {
    let next_from = e.target.dataset.next_from
    let result    = await window.vk_api.call('groups.getNameHistory', {"group_id": $('#clb_id')[0].value, 'start_from': next_from}, false);
    let full_html = ''
    result.response.items.forEach(item => {
        let hist_item = new GroupHistoryItem(item)

        full_html += hist_item.getHTML()
    })

    $(`.club_history`)[0].innerHTML = full_html
})