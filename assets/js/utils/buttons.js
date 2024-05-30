// AJAX-navigation

$(document).on('click', 'a', async (e) => {
    if(e.target.href && e.target.href != '#' && e.target.href.indexOf(window.s_url.origin) != -1) {
        if(e.target.dataset.ignore) {
            return
        }
        
        e.preventDefault()

        await window.main_class.go_to(e.target.href)
    }
})

window.addEventListener('popstate', async (e) => {
    e.preventDefault();
    replace_state(location.href)

    await window.main_class.go_to(location.href, false)
});

// Others

// угадайте откуда спиздил
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
    let hidenes = Number(e.currentTarget.dataset.val)
    let verb = hidenes == 0 ? '' : 'un'
    let result = await window.vk_api.call(`wall.${verb}subscribe`, {'owner_id': document.querySelector('#usr_id').value})
    
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

$(document).on('click', '.wall_select_block a', (e) => {
    e.preventDefault()
    
    $('.wall_select_block a.selectd').removeClass('selectd')
    $(e.target).addClass('selectd')

    wall.setSection($('.wall_select_block a.selectd')[0].dataset.section)
})

$(document).on('change', `input[type='query']`, (e) => {
    e.preventDefault()

    window.wall.search(e.target.value)
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
    }
})

$(document).on('click', '#_invert_wall', (e) => {
    if(e.target.checked) {
        window.s_url.searchParams.append('wall_invert', 'yes')
    } else {
        window.s_url.searchParams.delete('wall_invert')
    }

    push_state(window.s_url)
    let tempp = wall.method_params
    tempp.offset = 0

    window.wall.setParams(wall.method_name, tempp, e.target.checked)
    window.wall.clear()
    window.wall.nextPage()
})

$(document).on('click', '.like', async (e) => {
    e.preventDefault()

    let id = e.target.closest('.like').closest('.post').dataset.postid.split('_')

    if(!e.target.closest('.like').classList.contains('activated')) {
        let res = await window.vk_api.call('likes.add', {'type': 'post', 'owner_id': id[0], 'item_id': id[1]})

        if(res.error) {
            return
        } else {
            e.target.closest('.like').classList.add('activated')
            e.target.closest('.like').querySelector('span').innerHTML = res.response.likes
        }
    } else {
        let res = await window.vk_api.call('likes.delete', {'type': 'post', 'owner_id': id[0], 'item_id': id[1]})

        if(res.error) {
            return
        } else {
            e.target.closest('.like').classList.remove('activated')
            e.target.closest('.like').querySelector('span').innerHTML = res.response.likes
        }
    }
})
