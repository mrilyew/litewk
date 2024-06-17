// AJAX-navigation

$(document).on('click', 'a', async (e) => {
    let target = e.target

    if(window.edit_mode) {
        e.preventDefault()

        return
    }

    if(e.target.tagName != 'a') {
        target = e.target.closest('a')
    }

    if(target.href && target.href != '#' && target.href.indexOf(window.s_url.origin) != -1) {
        if(target.dataset.ignore) {
            return
        }
        
        e.preventDefault()

        await window.router.route(target.href)
    }
})

window.addEventListener('popstate', async (e) => {
    e.preventDefault();
    replace_state(location.href)

    await window.router.route(location.href, false)
})

$(document).on('click', '.to_the_sky', (e) => {
    if(scrollY > 1000) {
        window.temp_scroll = scrollY

        window.scrollTo(0, 1)
    } else {
        if(window.temp_scroll) {
            window.scrollTo(0, window.temp_scroll)
        }
    }

    $(document).trigger('scroll')
})

$(document).on('scroll', () => {
    if(scrollY < 1000) {
        if(!window.temp_scroll) {
            $('.to_the_sky').addClass('hidden')
        } else {
            $('.to_the_sky').addClass('down')
        }
    } else {
        $('.to_the_sky').removeClass('hidden').removeClass('down')
    }
})

// Auth

$(document).on('click', '.onpage_error #aut', async () => {
    if($(`input[name='tok']`)[0].value == '' || $(`input[name='path']`)[0].value == '') {
        add_error(_('errors.not_all_fields'), 'fill_form')
        return
    }

    let api_url = $(`input[name='path']`)[0].value
    let token = $(`input[name='tok']`)[0].value

    if(await window.accounts.addAccount(api_url, token)) {
        window.location.assign(document.querySelector('base').href)
    }
})

// Others

$(document).on('input', 'textarea', (e) => {
    let boost = 5
    let textArea = e.target
    textArea.style.height = "5px"
    let newHeight = textArea.scrollHeight
    textArea.style.height = newHeight + boost + "px"

    return;
})

$(document).on('keydown', 'textarea', (e) => {
    if(e.originalEvent.keyCode == 9) {
        let v = e.target.value, s = e.target.selectionStart, end = e.target.selectionEnd
        e.target.value = v.substring(0, s) + '    ' + v.substring(end)
        e.target.selectionStart = e.target.selectionEnd = s + 4
        return false
    }

    return;
})

// User actions

$(document).on('click', '#_toggleFriend', async (e) => {
    e.preventDefault()

    let friend_status = Number(e.currentTarget.dataset.val)

    switch(friend_status) {
        case 0:
            let data = await window.vk_api.call('friends.add', {'user_id': e.target.closest('.page_content').querySelector('#usr_id').value})
            
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
            let data1 = await window.vk_api.call('friends.delete', {'user_id': e.target.closest('.page_content').querySelector('#usr_id').value})

            if(!data1.error) {
                e.target.setAttribute('data-val', 0)
                e.target.innerHTML = _('users_relations.start_friendship')
            } else {
                return
            }

            break
        case 2:
            let data2 = await window.vk_api.call('friends.delete', {'user_id': e.target.closest('.page_content').querySelector('#usr_id').value})
            
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
            let data3 = await window.vk_api.call('friends.add', {'user_id': e.target.closest('.page_content').querySelector('#usr_id').value})

            if(!data3.error) {
                $('#_toggleFriend').remove()

                $('#_actions')[0].insertAdjacentHTML('afterbegin', 
                `
                    <a class='action' id='_toggleFriend' data-val='3' href='#'> ${_('users_relations.destroy_friendship')}</a>
                `)
            } else {
                return
            }

            break
        case 3:
            let data4 = await window.vk_api.call('friends.delete', {'user_id': e.target.closest('.page_content').querySelector('#usr_id').value})

            if(!data4.error) {
                e.target.setAttribute('data-val', 4)
                e.target.innerHTML = _('users_relations.accept_friendship')
            } else {
                return
            }

            break
    }
})

$(document).on('click', '#_toggleFave', async (e) => {
    e.preventDefault()

    let fave_status = Number(e.currentTarget.dataset.val)
    let type = e.target.dataset.type
    let id = e.target.dataset.addid
    let api_type = 'Page'
    let verb = 'add'
    let params = {}

    switch(type) {
        default:
        case 'user':
            api_type = 'Page'
            params.user_id = id
            break
        case 'club':
            api_type = 'Page'
            params.group_id = id
            break
        case 'post':
            api_type = 'Post'
            realid = id.split('_')
            params.owner_id = realid[0]
            params.id = realid[1]
            break
    }

    switch(fave_status) {
        case 0:
            verb = 'add'
            break
        case 1:
            verb = 'remove'
            break
    }

    let result = await window.vk_api.call(`fave.${verb}${api_type}`, params)

    if(!result.error) {
        if(fave_status == 0) {
            e.target.setAttribute('data-val', 1)
            e.target.innerHTML = _('faves.remove_from_faves')
        } else {
            e.target.setAttribute('data-val', 0)
            e.target.innerHTML = _('faves.add_to_faves')
        }
    } else {
        return
    }
})

$(document).on('click', '#_toggleBlacklist', async (e) => {
    e.preventDefault()
    let fave_status = Number(e.currentTarget.dataset.val)

    switch(fave_status) {
        default:
        case 0:
            let eetog_ = await window.vk_api.call('account.ban', {'owner_id': e.target.closest('.page_content').querySelector('#usr_id').value})

            if(!eetog_.error) {
                e.target.setAttribute('data-val', 1)
                e.target.innerHTML = _('blacklist.remove_from_blacklist')
            } else {
                return
            }

            break
        case 1:
            let eetog = await window.vk_api.call('account.unban', {'owner_id': e.target.closest('.page_content').querySelector('#usr_id').value})

            if(!eetog.error) {
                e.target.setAttribute('data-val', 0)
                e.target.innerHTML = _('blacklist.add_user_to_blacklist')
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

    let result = await window.vk_api.call('groups.'+verb, {'group_id': e.target.closest('.page_content').querySelector('#clb_id').value})
    
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
    let hidenes = Number(e.currentTarget.dataset.val)
    let verb = hidenes == 0 ? 'add' : 'delete'
    let result = await window.vk_api.call(`newsfeed.${verb}Ban`, {'user_ids': document.querySelector('#usr_id').value})
    
    if(result.error) {
        return
    }

    if(hidenes == 0) {
        e.target.setAttribute('data-val', 1)
        e.target.innerHTML = _('user_page.unhide_from_feed')
    } else {
        e.target.setAttribute('data-val', 0)
        e.target.innerHTML = _('user_page.hide_from_feed')
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

$(document).on('click', '.posts_menu_toggle', (e) => {
    $('.dropdown_menu.visible').removeClass('visible')
    $('#' + e.currentTarget.dataset.onid).toggleClass('visible')
})

$(document).on('click', 'body > *, .dropdown_menu p', (e) => {
    if(!e.target.classList.contains('dropdown_toggle')/* && !e.target.closest('.dropdown_wrapper')*/) {
        $('.dropdown_menu.visible').removeClass('visible')
    }
})

$(document).on('click', '.post_upper_actions .dropdown_menu #_postDelete', async (e) => {
    e.preventDefault()
    let post = e.target.closest('.post')
    let post_id = post.dataset.postid.split('_')
    let result  = await window.vk_api.call('wall.delete', {'owner_id': post_id[0], 'post_id': post_id[1]})

    if(result.error) {
        return
    } else {
        post.querySelector('.post_wrapper').style.display = 'none'
        post.querySelector('.post_restore_block').style.display = 'block'
    }
})

$(document).on('click', '.post #_postRestore', async (e) => {
    e.preventDefault()
    let post = e.target.closest('.post')
    let post_id = post.dataset.postid.split('_')
    let result  = await window.vk_api.call('wall.restore', {'owner_id': post_id[0], 'post_id': post_id[1]})

    if(result.error) {
        return
    } else {
        post.querySelector('.post_wrapper').style.display = 'block'
        post.querySelector('.post_restore_block').style.display = 'none'
    }
})

$(document).on('click', '.post #_postArchiveAction', async (e) => {
    e.preventDefault()
    let post = e.target.closest('.post')
    let post_id = post.dataset.postid.split('_')
    let un      = Number(e.target.dataset.type) == 1

    // Кто ищет по гитхабу (github git). VK API (vkontakte api vkapi) 
    // wall.archive — добавить запись в архив
    // wall.reveal — вернуть из архива (archive вконтакте функция 2019 незадокументированно)
    let result  = await window.vk_api.call(`wall.${un ? 'reveal' : 'archive'}`, {'owner_id': post_id[0], 'post_id': post_id[1]})

    if(result.error) {
        return
    }

    if(!un) {
        if(Number(e.target.dataset.ref) == 1) {
            post.querySelector('.post_wrapper').style.display = 'block'
            post.querySelector('.post_archive_block').style.display = 'none'
            post.querySelector('.post_unarchive_block').style.display = 'none'
            return
        }

        post.querySelector('.post_wrapper').style.display = 'none'
        post.querySelector('.post_archive_block').style.display = 'block'
    } else {
        if(Number(e.target.dataset.ref) == 1) {
            post.querySelector('.post_wrapper').style.display = 'block'
            post.querySelector('.post_archive_block').style.display = 'none'
            post.querySelector('.post_unarchive_block').style.display = 'none'
            return
        }
        
        post.querySelector('.post_wrapper').style.display = 'none'
        post.querySelector('.post_unarchive_block').style.display = 'block'
    }
})

$(document).on('click', '.post #_changeComments', async (e) => {
    e.preventDefault()
    let post = e.target.closest('.post')
    let post_id = post.dataset.postid.split('_')
    let act = e.target.dataset.act ?? 'close'

    let result = await window.vk_api.call(`wall.${act == 'close' ? 'close' : 'open'}Comments`, {'owner_id': post_id[0], 'post_id': post_id[1]})

    if(result.error) {
        return
    } else {
        if(act == 'close') {
            e.target.innerHTML = _('wall.enable_comments_post')
            e.target.setAttribute('data-act', 'open')
        } else {
            e.target.innerHTML = _('wall.disable_comments_post')
            e.target.setAttribute('data-act', 'close')
        }
    }
})

$(document).on('click', '.post #_pinPost', async (e) => {
    e.preventDefault()
    let post = e.target.closest('.post')
    let post_id = post.dataset.postid.split('_')
    let act = e.target.dataset.act ?? 'pin'

    let result = await window.vk_api.call(`wall.${act == 'pin' ? 'pin' : 'unpin'}`, {'owner_id': post_id[0], 'post_id': post_id[1]})

    if(result.error) {
        return
    } else {
        if(act == 'pin') {
            post.querySelector('.pinned_indicator').classList.remove('hidden')
            e.target.innerHTML = _('wall.unpin_post')
            e.target.setAttribute('data-act', 'unpin')
        } else {
            post.querySelector('.pinned_indicator').classList.add('hidden')
            e.target.innerHTML = _('wall.pin_post')
            e.target.setAttribute('data-act', 'pin')
        }
    }
})

// Wall

$(document).on('click', '.smiley', async (e) => {
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
                <span class='smiley_message_title'>${escape_html(stats.response.popup.title)}</span>
                <span class='smiley_message_text'>${format_text(stats.response.popup.text)}</span>
                
                ${stats.response.popup.buttons && stats.response.popup.buttons.length > 0 ? `<a href='${stats.response.popup.buttons[0].action.url}' target='_blank'><input type='button' id='__getStatus' value='${_('image_status.get_status')}'></a>` : ''}
                
            </div>
        </div>
    `)
})

$(document).on('click', '.show_more', async (e) => {
    if(e.target.dataset.clicked == '1') {
        e.preventDefault()
        return
    }

    e.target.setAttribute('data-clicked', '1')

    await window.main_classes['wall'].nextPage()
    //showMoreObserver.unobserve($('.show_more')[0])

    e.target.setAttribute('data-clicked', '0')
})

$(document).on('click', '.wall_select_block a', (e) => {
    e.preventDefault()
    
    $('.wall_select_block a.selectd').removeClass('selectd')
    $(e.target).addClass('selectd')

    window.main_classes['wall'].setSection($('.wall_select_block a.selectd')[0].dataset.section)
})

$(document).on('change', `input[type='query']`, (e) => {
    e.preventDefault()

    window.main_classes['wall'].search(e.target.value)
})

$(document).on('click', '.wall_block .searchIcon', (e) => {
    e.preventDefault()

    if($(e.target).hasClass('clicked')) {
        $(e.target).removeClass('clicked')
        $('#_shown_layer')[0].style.display = 'block'
        $('#_search_layer')[0].style.display = 'none'
    } else {
        $(e.target).addClass('clicked')
        $('#_shown_layer')[0].style.display = 'none'
        $('#_search_layer')[0].style.display = 'block'
        $(`input[type='query']`)[0].focus()
    }
})

$(document).on('click', '#_invert_wall', (e) => {
    if(e.target.checked) {
        window.s_url.searchParams.append('wall_invert', 'yes')
    } else {
        window.s_url.searchParams.delete('wall_invert')
    }

    push_state(window.s_url)
    let tempp = window.main_classes['wall'].method_params
    tempp.offset = 0

    window.main_classes['wall'].setParams(window.main_classes['wall'].method_name, tempp, e.target.checked)
    window.main_classes['wall'].clear()
    window.main_classes['wall'].objects.page = -1
    window.main_classes['wall'].nextPage()
})

$(document).on('click', '.paginator a', async (e) => {
    e.preventDefault()

    if(e.target.classList.contains('active')) {
        return
    }

    window.main_classes['wall'].clear()
    await window.main_classes['wall'].page(e.target.dataset.page - 1)

    window.s_url = new URL(e.target.href)
    push_state(window.s_url)

    $('.paginator').remove()
    window.main_classes['wall'].createNextPage()

    log($('#insert_paginator_here_bro')[0])
    log(paginator_template(window.main_classes['wall'].objects.pagesCount, Number(window.s_url.searchParams.get('page'))))
    $('#insert_paginator_here_bro')[0].insertAdjacentHTML('beforeend', paginator_template(window.main_classes['wall'].objects.pagesCount, Number(window.s_url.searchParams.get('page'))))
})

$(document).on('click', '.like', async (e) => {
    e.preventDefault()

    let like = e.target.closest('.like')
    let post = like.closest('.main_info_block')
    let id = post.dataset.postid.split('_')
    let verb = !like.classList.contains('activated') ? 'add' : 'delete'
    let entity = post.dataset.type
    let res = await window.vk_api.call(`likes.${verb}`, {'type': entity, 'owner_id': id[0], 'item_id': id[1]})
    
    if(verb == 'add') {
        e.target.closest('.like').classList.add('activated')
        e.target.closest('.like').querySelector('span').innerHTML = res.response.likes
    } else {
        e.target.closest('.like').classList.remove('activated')
        e.target.closest('.like').querySelector('span').innerHTML = res.response.likes
    }
})

$(document).on('click', '.comments_thread_insert_block #shownextcomms', async (e) => {
    e.target.setAttribute('id', 'fakenextcomms')

    let comm_block = e.target.closest('.main_comment_block')
    let insert = e.target.closest('.comments_thread_insert_block')

    let cid = comm_block.dataset.cid
    let offset = comm_block.dataset.offset ?? '3'
    let replies = await window.vk_api.call('wall.getComments', {'owner_id': comm_block.dataset.ownerid, 'comment_id': cid, 'offset': offset, 'count': 10, 'need_likes': 1, 'extended': 1, 'fields': 'photo_50,photo_200', 'sort': 'asc'})

    replies.response.items.forEach(element => {
        let comm = new Comment()
        comm.hydrate(element, replies.response.profiles, replies.response.groups)
        insert.insertAdjacentHTML('beforeend', comm.getTemplate())
    })

    if(Number(comm_block.dataset.commscount) > Number(offset) + 10) {
        comm_block.setAttribute('data-offset', Number(offset) + 10)

        e.target.setAttribute('id', 'shownextcomms')
        insert.append(e.target)
    } else {
        $(e.target).remove()
    }
})

// Viewers

$(document).on('click', '.photo_attachment', (e) => {
    e.preventDefault()

    new MessageWindow(_('photos.photo'), (insert, additional) => {
        insert.insertAdjacentHTML('beforeend', `
            <div class='photo_viewer'>
                <img src='${e.target.dataset.full}'>
            </div>
        `)
    })
})

$(document).on('click', '.video_attachment_viewer_open', (e) => {
    e.preventDefault()

    new MessageWindow(_('photos.photo'), async (insert, additional) => {
        let id = e.target.closest('.ordinary_attachment').dataset.videoid
        let video = await window.vk_api.call('video.get', {'videos': id})

        insert.insertAdjacentHTML('beforeend', `
            <div class='video_viewer'>
                <iframe src='${video.response.items[0].player}'></iframe>
            </div>
        `)
    })
})
