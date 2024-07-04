// AJAX-navigation

$(document).on('click', 'a', async (e) => {
    let target = e.target

    if(target.tagName != 'A') {
        target = e.target.closest('a')
    }

    if(window.edit_mode) {
        e.preventDefault()
        return
    }

    if(target.href.indexOf('#') != -1) {
        e.preventDefault()
        return
    }

    if(target.getAttribute('target') == '_blank') {
        return
    }

    if(e.target.tagName != 'a') {
        target = e.target.closest('a')
    }

    if(target.href && target.href.indexOf(window.s_url.origin) != -1) {
        e.preventDefault()
        if(target.dataset.ignore) {
            return
        }

        await window.router.route(target.href)
    }
})

window.addEventListener('popstate', async (e) => {
    e.preventDefault();
    replace_state(location.href)

    await window.router.route(location.href, false)
})

$(document).on('click', '.menu_up_hover_click', (e) => {
    if(scrollY > 1000) {
        window.temp_scroll = scrollY
        window.scrollTo(0, 10)
        
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    } else {
        if(window.temp_scroll) {
            window.scrollTo(0, window.temp_scroll - 10)

            window.scrollTo({
                top: window.temp_scroll,
                behavior: "smooth"
            });
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
        case 'link':
            api_type = 'Link'
            params.link = e.target.dataset.link 
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

$(document).on('change', '#post_comment_sort select', async (e) => {
    window.s_url.searchParams.set('comm_sort', e.target.value)
    replace_state(window.s_url)

    window.main_classes['wall'].clear()
    window.main_classes['wall'].objects.page = 0
    window.main_classes['wall'].method_params.sort = e.target.value
    await window.main_classes['wall'].nextPage()
})

$(document).on('change', '#thread_comment_sort select', async (e) => {
    let comm_block = e.target.closest('.main_comment_block')
    log(comm_block)
    let cid = comm_block.dataset.cid
    
    comm_block.setAttribute('data-sort', e.target.value)
    comm_block.setAttribute('data-offset', 10)

    comm_block.querySelector('.comments_thread_insert_block').innerHTML = ''
    let result = await window.vk_api.call('wall.getComments', {'owner_id': comm_block.dataset.ownerid, 'comment_id': cid, 'offset': 0, 'count': 10, 'need_likes': 1, 'extended': 1, 'fields': window.typical_fields, 'sort': e.target.value})
    let comments = result.response.items

    comments.forEach(el => {
        let comment = new Comment
        comment.hydrate(el, result.response.profiles, result.response.groups)

        comm_block.querySelector('.comments_thread_insert_block').insertAdjacentHTML('beforeend', comment.getTemplate())
    })

    if(result.response.count > 10) {
        comm_block.querySelector('.comments_thread_insert_block').insertAdjacentHTML('beforeend', `<span id='shownextcomms'>${_('wall.show_next_comments')}</span>`)
    }
})

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
                <span class='smiley_message_text_span'>${format_text(stats.response.popup.text)}</span>
                
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
    
    let temp_url = window.s_url
    temp_url.searchParams.delete('wall_query')
    temp_url.searchParams.set('wall_section', $('.wall_select_block a.selectd')[0].dataset.section)
    push_state(temp_url)

    temp_url = null
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
    
    if(e.target.tagName == 'INPUT') {
        return
    }

    if(e.target.classList.contains('active')) {
        e.target.innerHTML = `
            <input type='text' value='${e.target.dataset.page}' id='__enterpage' maxlength='5' data-pagescount=${e.target.closest('.paginator').dataset.pagescount}>
        `

        $('.paginator #__enterpage').on('input', (e) => {
            e.target.style.width = (e.target.value.length * 4) + 19 + 'px'
        })

        $('.paginator #__enterpage').trigger('input')

        return
    }

    window.main_classes['wall'].clear()
    await window.main_classes['wall'].page(e.target.dataset.page - 1)

    window.s_url = new URL(e.target.href)
    push_state(window.s_url)

    $('.paginator').remove()
    window.main_classes['wall'].createNextPage()

    $('#insert_paginator_here_bro')[0].insertAdjacentHTML('beforeend', paginator_template(window.main_classes['wall'].objects.pagesCount, Number(window.s_url.searchParams.get('page'))))
})

$(document).on('change', '#__enterpage', async (e) => {
    let new_page = Number(e.target.value)

    if(isNaN(new_page) || new_page < 1 || new_page > e.target.dataset.pagescount) {
        e.target.parentNode.innerHTML = e.target.parentNode.dataset.page

        return
    }

    window.main_classes['wall'].clear()
    await window.main_classes['wall'].page(new_page - 1)

    window.s_url.searchParams.set('page', new_page)
    push_state(window.s_url)

    $('.paginator').remove()
    window.main_classes['wall'].createNextPage()

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
    let sort = comm_block.dataset.sort ?? 'asc'
    let replies = await window.vk_api.call('wall.getComments', {'owner_id': comm_block.dataset.ownerid, 'comment_id': cid, 'offset': offset, 'count': 10, 'need_likes': 1, 'extended': 1, 'fields': window.typical_fields, 'sort': sort})

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

    new MessageWindow(!e.target.dataset.type ? _('photos.photo') : _(`photos.${e.target.dataset.type}`), (insert, additional) => {
        insert.insertAdjacentHTML('beforeend', `
            <div class='photo_viewer'>
                <img src='${e.target.dataset.full}'>
            </div>
        `)
    })
})

$(document).on('click', '.video_attachment_viewer_open', (e) => {
    e.preventDefault()

    new MessageWindow(_('videos.video'), async (insert, additional) => {
        let id = e.target.closest('.ordinary_attachment').dataset.videoid
        let video = await window.vk_api.call('video.get', {'videos': id})

        /*$('.fullscreen_buttons')[0].insertAdjacentHTML('afterbegin', `
            <a href='#' data-ignore='1' id='_hider'><span>${_('messagebox.hide')}</span></a>
        `)*/

        insert.insertAdjacentHTML('beforeend', `
            <div class='video_viewer'>
                <iframe width="600" height="340" src='${video.response.items[0].player}' frameborder='0' sandbox='allow-same-origin allow-scripts allow-popups' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>
            </div>
        `)

        /*$('.fullscreen_buttons #_hider').on('click', (e) => {
            this.close()
        })*/
    })
})

$(document).on('click', '.doc_attachment', (e) => {
    e.preventDefault()

    new MessageWindow(_('docs.doc'), async (insert, additional) => {
        let doc = e.target.closest('.doc_attachment')

        insert.insertAdjacentHTML('beforeend', `
            <div class='doc_viewer'>
                <img src='${doc.dataset.url}'>
            </div>
        `)
    })
})

// newsfeed

$(document).on('click', '.newsfeed_wrapper #__newsfeedrefresh', async (e) => {
    window.main_classes['wall'].clear()
    await window.main_classes['wall'].nextPage()
})

$(document).on('change', '.newsfeed_wrapper #__newsfeedreturntype', async (e) => {
    window.main_classes['wall'].clear()
    if(e.target.value == 'all') {
        delete window.main_classes['wall'].method_params.filters
    } else {
        window.main_classes['wall'].method_params.filters = e.target.value
    }

    window.main_classes['wall'].nextPage()

    window.s_url.searchParams.set('news_type', e.target.value)
    replace_state(window.s_url.href)
})

$(document).on('click', '.newsfeed_wrapper #__newsfeedreturnbanned', async (e) => {
    window.main_classes['wall'].clear()
    window.main_classes['wall'].method_params.return_banned = Number(e.target.checked)
    window.main_classes['wall'].nextPage()

    window.s_url.searchParams.set('return_banned', Number(e.target.checked))
    replace_state(window.s_url.href)
})

$(document).on('change', '#__friendssearch', (e) => {
    window.s_url.searchParams.set('query', e.target.value)
    replace_state(window.s_url.href)

    window.router.restart()
})


$(document).on('click', '#__clearrecentgroups', async (e) => {
    await window.vk_api.call('groups.removeRecents')

    window.router.restart()
})

$(document).on('click', '#__markbookmarks', async (e) => {
    await window.vk_api.call('fave.markSeen')
    window.router.restart()

    $('.menu #_faves .counter').remove()
})

$(document).on('change', `#_bookmarks_search input[type='text']`, async (e) => {
    window.main_classes['wall'].localSearch(e.target.value)
})

$(document).on('click', `#_bookmarks_search input[type='button']`, async (e) => {
    $(`#_bookmarks_search input[type='text']`).trigger('change')
})
