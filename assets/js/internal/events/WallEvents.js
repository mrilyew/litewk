u(document).on('click', '.post #_postRestore', async (e) => {
    e.preventDefault()

    const post = e.target.closest('.post')
    const post_id = post.dataset.postid.split('_')

    try {
        await window.vk_api.call('wall.restore', {'owner_id': post_id[0], 'post_id': post_id[1]})
    } catch(e) {
        return
    }

    post.querySelector('.post_wrapper').style.display = 'block'
    post.querySelector('.post_restore_block').style.display = 'none'
})

u(document).on('click', '.post #_postArchiveAction', async (e) => {
    e.preventDefault()

    const post = e.target.closest('.post')
    const post_id = post.dataset.postid.split('_')
    const un      = Number(e.target.dataset.type) == 1

    // Кто ищет по гитхабу (github git). VK API (vkontakte api vkapi) 
    // wall.archive — добавить запись в архив
    // wall.reveal — вернуть из архива (archive вконтакте функция 2019 незадокументированно)
    
    try {
        await window.vk_api.call(`wall.${un ? 'reveal' : 'archive'}`, {'owner_id': post_id[0], 'post_id': post_id[1]})
    } catch(e) {
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

u(document).on('click', '.post #_changeComments', async (e) => {
    e.preventDefault()

    const post = e.target.closest('.post')
    const post_id = post.dataset.postid.split('_')
    const act = e.target.dataset.act ?? 'close'

    try {
        await window.vk_api.call(`wall.${act == 'close' ? 'close' : 'open'}Comments`, {'owner_id': post_id[0], 'post_id': post_id[1]})
    } catch(e) {
        return
    }

    if(act == 'close') {
        e.target.innerHTML = _('wall.enable_comments_post')
        e.target.setAttribute('data-act', 'open')
    } else {
        e.target.innerHTML = _('wall.disable_comments_post')
        e.target.setAttribute('data-act', 'close')
    }
})

u(document).on('click', '.post #_pinPost', async (e) => {
    e.preventDefault()

    const post = e.target.closest('.post')
    const post_id = post.dataset.postid.split('_')
    const act = e.target.dataset.act ?? 'pin'

    try {
        await window.vk_api.call(`wall.${act == 'pin' ? 'pin' : 'unpin'}`, {'owner_id': post_id[0], 'post_id': post_id[1]})
    } catch(e) {
        return
    }

    if(act == 'pin') {
        post.querySelector('.pinned_indicator').classList.remove('hidden')
        e.target.innerHTML = _('wall.unpin_post')
        e.target.setAttribute('data-act', 'unpin')
    } else {
        post.querySelector('.pinned_indicator').classList.add('hidden')
        e.target.innerHTML = _('wall.pin_post')
        e.target.setAttribute('data-act', 'pin')
    }
})

u(document).on('click', '.dropdown_menu #_postDelete', async (e) => {
    e.preventDefault()
    const post = e.target.closest('.post')
    const post_id = post.dataset.postid.split('_')

    try {
        await window.vk_api.call('wall.delete', {'owner_id': post_id[0], 'post_id': post_id[1]})
    } catch(e) {
        return
    }

    post.querySelector('.post_wrapper').style.display = 'none'
    post.querySelector('.post_restore_block').style.display = 'block'
})

u(document).on('change', '#post_comment_sort select', async (e) => {
    main_url.setParam('comment_sort', e.target.value)
    Utils.replace_state(window.main_url)
    
    window.main_classes['wall'].changeSort(e.target.value)
})

u(document).on('change', '#thread_comment_sort select', async (e) => {
    const result = null
    const comm_block = e.target.closest('.main_comment_block')
    const cid = comm_block.dataset.cid
    
    comm_block.setAttribute('data-sort', e.target.value)
    comm_block.setAttribute('data-offset', 10)
    comm_block.querySelector('.comments_thread_insert_block').innerHTML = ''

    try {
        result = await window.vk_api.call('wall.getComments', {'owner_id': comm_block.dataset.ownerid, 'comment_id': cid, 'offset': 0, 'count': 10, 'need_likes': 1, 'extended': 1, 'fields': window.Utils.typical_fields, 'sort': e.target.value})
    } catch(e) {
        return
    }
    
    const comments = result.items
    comments.forEach(el => {
        let comment = new Comment
        comment.hydrate(el, result.profiles, result.groups)

        comm_block.querySelector('.comments_thread_insert_block').insertAdjacentHTML('beforeend', comment.getTemplate())
    })

    if(result.count > 10) {
        comm_block.querySelector('.comments_thread_insert_block').insertAdjacentHTML('beforeend', `<span id='shownextcomms'>${_('wall.show_next_comments')}</span>`)
    }
})

u(document).on('click', '.comments_thread_insert_block #shownextcomms', async (e) => {
    e.target.setAttribute('id', 'fakenextcomms')

    const comm_block = e.target.closest('.main_comment_block')
    const insert = e.target.closest('.comments_thread_insert_block')

    const cid = comm_block.dataset.cid
    const offset = comm_block.dataset.offset ?? '3'
    const sort = comm_block.dataset.sort ?? 'asc'
    const replies = await window.vk_api.call('wall.getComments', {'owner_id': comm_block.dataset.ownerid, 'comment_id': cid, 'offset': offset, 'count': 10, 'need_likes': 1, 'extended': 1, 'fields': window.Utils.typical_fields + ',' + window.Utils.typical_group_fields, 'sort': sort})

    replies.items.forEach(element => {
        let comm = new Comment()
        comm.hydrate(element, replies.profiles, replies.groups)
        insert.insertAdjacentHTML('beforeend', comm.getTemplate())
    })

    if(Number(comm_block.dataset.commscount) > Number(offset) + 10) {
        comm_block.setAttribute('data-offset', Number(offset) + 10)

        e.target.setAttribute('id', 'shownextcomms')
        insert.append(e.target)
    } else {
        u(e.target).remove()
    }
})

u(document).on('click', '.wall_select_block .wall_section', (e) => {
    if(e.target.classList.contains('selected') || e.target.classList.contains('selectd')) {
        if(window.main_url.getParam('section') != 'search') {
            return
        }
    }

    e.preventDefault()

    u('.wall_select_block a.selected').removeClass('selected')
    u(e.target).addClass('selected')
        
    const section = u('.wall_select_block a.selected').attr('data-section')
    window.main_classes['wall'].setSection(section)
    window.main_url.deleteParam('q')
    window.main_url.setParam('section', section)

    Utils.push_state(window.main_url)
})

u(document).on('change', `.wall_select_block input[type='query']`, (e) => {
    e.preventDefault()

    window.main_classes['wall'].objects.page = -1
    window.main_classes['wall'].error_empty_message = _('errors.search_wall_not_found')
    window.main_classes['wall'].search(e.target.value)
})

u(document).on('click', '.wall_block .searchIcon, .wall_block .searchIcon_clicked', (e) => {
    e.preventDefault()

    let target = e.target
    if(target.tagName != 'svg') {
        target = target.closest('svg')
    }

    let wall_block = u('.wall_select_block')
    wall_block.toggleClass('shown_search')

    if(wall_block.hasClass('shown_search')) {
        u(`input[type='query']`).nodes[0].focus()
    }
})

u(document).on('change', '#_wall_sorter', (e) => {
    if(e.target.value == 'old') {
        main_url.setParam('invert', '1')
    } else {
        main_url.deleteParam('invert')
    }
    
    Utils.push_state(window.main_url)

    window.main_classes['wall'].toggleInverse(e.target.value == 'old')
    window.main_classes['wall'].clear()

    window.main_classes['wall'].nextPage()
})

u(document).on('change', '#__friendssearch', (e) => {
    main_url.setParam('query', e.target.value)
    Utils.replace_state(window.main_url.href)
    
    window.router.restart()
})

u(document).on('click', '#not_gif_attachment', (e) => {
    e.preventDefault()

    if(e.target.tagName == 'svg' || e.target.tagName == 'polygon') {
        return
    }
    
    new MessageWindow(_('docs.doc'), async (insert, additional) => {
        const doc = e.target.closest('#not_gif_attachment')
        
        insert.insertAdjacentHTML('beforeend', `
            <div class='doc_viewer'>
                <img src='${doc.dataset.url}'>
            </div>
        `)
    })
})

u(document).on('click', '.gif_attachment', (e) => {
    e.preventDefault()
    
    let target = e.target

    if(target.tagName == 'svg' || target.tagName == 'polygon') {
        return
    }

    if(!target.classList.contains('doc_attachment_tall')) {
        target = target.closest('.doc_attachment_tall')
    }
    
    const vid = target.querySelector('video')

    vid.setAttribute('src', vid.dataset.src)
    target.classList.toggle('shown')
    target.querySelector('video').play()
})

u(document).on('click', '.notification.ungroup', async (e) => {
    e.preventDefault()
    let target = e.target

    if(!target.classList.contains('notification')) {
        target = target.closest('.notification')
    }
    
    let notif  = window.main_classes['wall'].notifications.find(notif => notif.info.id == target.getAttribute('id'))
    let notifs = await window.vk_api.call('notifications.getGrouped', {'query': notif.info.action.context.query})
    let big_html = ``

    notifs.items.forEach(notif => {
        const notifobj = new ApiNotification(notif)
        console.log(notifobj)
        console.log(notifobj.info.action_buttons)
        big_html += notifobj.getTemplate()
    })

    target.outerHTML = big_html
    SavedPage.save()
})

u(document).on('click', '.video_attachment_viewer_open', (e) => {
    e.preventDefault()

    if(u('.messagebox').length > 0) {
        return
    }

    new MessageWindow(_('videos.video'), async (insert, additional) => {
        let id = e.target.closest('.video_attachment_viewer_open').dataset.videoid
        let video = await window.vk_api.call('video.get', {'videos': id})

        /*u('.fullscreen_buttons')[0].insertAdjacentHTML('afterbegin', `
            <a href='#' data-ignore='1' id='_hider'><span>${_('messagebox.hide')}</span></a>
        `)*/

        insert.insertAdjacentHTML('beforeend', `
            <div class='video_viewer'>
                <iframe width="600" height="340" src='${video.items[0].player}' frameborder='0' sandbox='allow-same-origin allow-scripts allow-popups' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>
            </div>
        `)

        /*u('.fullscreen_buttons #_hider').on('click', (e) => {
            this.close()
        })*/
    })
})

u(document).on('click', '.content_text_wrapper', (e) => {
    let target = e.target

    if(!target.classList.contains('content_text_wrapper')) {
        target = target.closest('.content_text_wrapper')
    }

    // target.classList.toggle('full_text_shown')
    target.classList.add('full_text_shown')
})

u(document).on('click', '.post_toggle_wrap #_reportPost', (e) => {
    const post_template = e.target.closest('.post')
    const post_template_html = u(post_template.outerHTML)
    post_template_html.find('.post_toggle_wrap').remove()
    post_template_html.find('.post_bottom').remove()
    post_template_html.find('.post_hidden_by_default').remove()

    const msg = new MessageBox(_('common.report'), window.templates._report_post_block(post_template_html.nodes[0].outerHTML), [_('messagebox.cancel'), _('messagebox.send')], [() => {
        msg.close()
    }, async () => {
        const post_id = post_template.dataset.postid.split('_')
        const report_type_node = u(`input[name='reports.lists']:checked`).nodes[0]

        if(!report_type_node) {
            return
        }

        const report_type = report_type_node.value
        let result = null

        try {
            result = await window.vk_api.call('wall.reportPost', {
                'owner_id': post_id[0],
                'post_id': post_id[1],
                'reason': report_type,
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

u(document).on('mousedown', '.post .post_actions .like', (e) => {
    e.preventDefault()
    if(e.button == 2) { 
        u(e.target.closest('.post_actions')).find('.like_another').toggleClass('expanded')
    }
})