// AJAX

$(document).on('click', 'a', async (e) => {
    let target = e.target
    if(target.tagName != 'A') {
        target = e.target.closest('a')
    }

    if(window.edit_mode) {
        e.preventDefault()

        return
    }

    if(target.getAttribute('target') == '_blank') {
        return
    }

    if(target.dataset.ignore == '1') {
        return
    } else {
        if(target.href && target.href.indexOf(location.origin) != -1) {
            e.preventDefault()
    
            await window.router.route(target.href, true, target.dataset.back)
        }
    }
})

// Работает на честном слове.

window.addEventListener('hashchange', async (e) => {
    e.preventDefault()

    /* brute forc */
    if(location.href.indexOf('settings') != -1 || history.state != null) {
        return
    }

    if(window.edit_mode) {
        e.preventDefault()

        return
    }

    Utils.push_state(location.href)
    await window.router.route(location.href)
})

window.addEventListener('popstate', async (e) => {
    e.preventDefault()
    
    if(e.state == null) {
        return
    }

    console.log('Popstate event go.')

    Utils.replace_state(location.href)
    await window.router.route(location.href, false)
})

$(document).on('click', '.menu_up_hover_click', (e) => {
    if(scrollY > 1000) {
        window.temp_scroll = scrollY

        // smooth effect like как в вк
        window.scrollTo(0, 10)
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    } else {
        if(window.back_button) {
            window.router.route('#' + window.back_button)
    
            window.back_button = null
            $(document).trigger('scroll')
            return
        }

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
        if(window.back_button) {
            $('#up_panel').addClass('back') 
            $('#up_panel').removeClass('hidden')
        } else {
            if(!window.temp_scroll) {
                $('#up_panel').addClass('hidden')
            } else {
                $('#up_panel').addClass('down')
            }
        }
    } else {
        $('#up_panel').removeClass('hidden').removeClass('down')
        $('#up_panel').removeClass('back').addClass('to_up')
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

$(document).on('click', '.dropdown_toggle', (e) => {
    let target = e.target

    if(target.tagName != 'svg') {
        target = target.closest('svg')
    }

    let dropdown = $('#' + target.dataset.onid)[0]

    $('.dropdown_menu.visible').removeClass('visible')

    if(!dropdown) {
        return
    }

    dropdown.classList.add('visible')
})

$(document).on('click', 'body > *, .dropdown_menu p', (e) => {
    if(e.target.getAttribute('class') && e.target.getAttribute('class').indexOf('dropdown') != -1 || e.target.classList.contains('dropdown_toggle')) {
        return
    }

    if(e.target.tagName == 'polyline' || e.target.tagName == 'g' || e.target.tagName == 'svg') {
        return
    }

    $('.dropdown_menu.visible').removeClass('visible')
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


// Wall

$(document).on('click', '.show_more', async (e) => {
    if(e.target.dataset.clicked == '1') {
        e.preventDefault()
        return
    }

    e.target.setAttribute('data-clicked', '1')

    await window.main_classes['wall'].nextPage()
    //showMoreObserver.unobserve($('.show_more')[0])

    e.target.setAttribute('data-clicked', '0')
    SavedPage.save(location.href)
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

    main_url = new URL(e.target.href)
    Utils.push_state(window.main_url)

    $('.paginator').remove()
    window.main_classes['wall'].createNextPage()

    $('#insert_paginator_here_bro')[0].insertAdjacentHTML('beforeend', window.templates.paginator(window.main_classes['wall'].objects.pagesCount, Number(window.main_url.getParam('page'))))
})

$(document).on('change', '#__enterpage', async (e) => {
    let new_page = Number(e.target.value)

    if(isNaN(new_page) || new_page < 1 || new_page > e.target.dataset.pagescount) {
        e.target.parentNode.innerHTML = e.target.parentNode.dataset.page

        return
    }

    window.main_classes['wall'].clear()
    await window.main_classes['wall'].page(new_page - 1)

    main_url.setParam('page', new_page)
    Utils.push_state(window.main_url)

    $('.paginator').remove()
    window.main_classes['wall'].createNextPage()

    $('#insert_paginator_here_bro')[0].insertAdjacentHTML('beforeend', window.templates.paginator(window.main_classes['wall'].objects.pagesCount, Number(window.main_url.getParam('page'))))
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
    let replies = await window.vk_api.call('wall.getComments', {'owner_id': comm_block.dataset.ownerid, 'comment_id': cid, 'offset': offset, 'count': 10, 'need_likes': 1, 'extended': 1, 'fields': window.Utils.typical_fields + ',' + window.Utils.typical_group_fields, 'sort': sort})

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

$(document).on('click', '.photo_viewer_open', (e) => {
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
        let id = e.target.closest('.video_attachment_viewer_open').dataset.videoid
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

$(document).on('click', '#__clearrecentgroups', async (e) => {
    await window.vk_api.call('groups.removeRecents')

    window.router.restart()
})

$(document).on('click', '#__markbookmarks', async (e) => {
    await window.vk_api.call('fave.markSeen')
    window.router.restart()

    $('.navigation #_faves .counter').remove()
})

$(document).on('change', `#_bookmarks_search input[type='text']`, async (e) => {
    window.main_classes['wall'].localSearch(e.target.value)
})

$(document).on('click', `#_bookmarks_search input[type='button']`, async (e) => {
    $(`#_bookmarks_search input[type='text']`).trigger('change')
})

$(document).on('change', `#_global_search input[type='text']`, async (e) => {
    main_url.setParam('query', e.target.value)
    main_url.deleteParam('page')

    Utils.replace_state(main_url)

    window.router.restart()
})

$(document).on('click', `#_global_search input[type='button']`, async (e) => {
    $(`#_global_search input[type='text']`).trigger('change')
})

$(document).on('change', `.search_params .search_param input[type='text'], .search_params .search_param input[type='date'], .search_params .search_param select`, (e) => {
    if(e.target.value == '' || e.target.value == null) {
        window.main_url.deleteParam('sp_' + e.target.dataset.setname)
    } else {
        window.main_url.setParam('sp_' + e.target.dataset.setname, e.target.value)
    }
    
    window.Utils.replace_state(window.main_url)
})

$(document).on('change', `.search_params .search_param input[type='radio']`, (e) => {
    window.main_url.setParam('sp_' + e.target.dataset.setname, $(`input[type='radio'][data-setname='${e.target.dataset.setname}']:checked`).val())
    window.Utils.replace_state(window.main_url)
})

$(document).on('change', `.search_params .search_param input[type='checkbox']`, (e) => {
    if(!e.target.checked) {
        window.main_url.deleteParam('sp_' + e.target.dataset.setname)
    } else {
        window.main_url.setParam('sp_' + e.target.dataset.setname, 1)
    }

    window.Utils.replace_state(window.main_url)
})
