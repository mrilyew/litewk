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

$(document).on('change', '#post_comment_sort select', async (e) => {
    main_url.setParam('comment_sort', e.target.value)
    Utils.replace_state(window.main_url)
    
    window.main_classes['wall'].changeSort(e.target.value)
})

$(document).on('change', '#thread_comment_sort select', async (e) => {
    let comm_block = e.target.closest('.main_comment_block')

    let cid = comm_block.dataset.cid
    
    comm_block.setAttribute('data-sort', e.target.value)
    comm_block.setAttribute('data-offset', 10)

    comm_block.querySelector('.comments_thread_insert_block').innerHTML = ''
    let result = await window.vk_api.call('wall.getComments', {'owner_id': comm_block.dataset.ownerid, 'comment_id': cid, 'offset': 0, 'count': 10, 'need_likes': 1, 'extended': 1, 'fields': window.Utils.typical_fields, 'sort': e.target.value})
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

$(document).on('click', '.wall_select_block a', (e) => {
    if(e.target.classList.contains('selected') || e.target.classList.contains('selectd')) {
        return
    }

    e.preventDefault()
    
    $('.wall_select_block a.selectd').removeClass('selectd')
    $(e.target).addClass('selectd')

    window.main_classes['wall'].setSection($('.wall_select_block a.selectd')[0].dataset.section)
    
    let temp_url = main_url
    temp_url.deleteParam('wall_query')
    temp_url.setParam('wall_section', $('.wall_select_block a.selectd')[0].dataset.section)
    Utils.push_state(temp_url)

    temp_url = null
})

$(document).on('change', `input[type='query']`, (e) => {
    e.preventDefault()

    window.main_classes['wall'].objects.page = -1
    window.main_classes['wall'].search(e.target.value)
})

$(document).on('click', '.wall_block .searchIcon, .wall_block .searchIcon_clicked', (e) => {
    e.preventDefault()

    let target = e.target

    if(target.tagName != 'svg') {
        target = target.closest('svg')
    }

    if(target.classList.contains('searchIcon_clicked')) {
        $('.searchIcon_clicked')[0].classList.add('hidden')
        $('.searchIcon')[0].classList.remove('hidden')

        $('.wall_select_block').removeClass('search_shown')
        $('#_shown_layer')[0].style.display = 'block'
        $('#_search_layer')[0].style.display = 'none'
    } else {
        $('.searchIcon')[0].classList.add('hidden')
        $('.searchIcon_clicked')[0].classList.remove('hidden')

        $('.wall_select_block').addClass('search_shown')

        $('#_shown_layer')[0].style.display = 'none'
        $('#_search_layer')[0].style.display = 'block'
        $(`input[type='query']`)[0].focus()
    }
})

$(document).on('click', '#_invert_wall', (e) => {
    if(e.target.checked) {
        main_url.setParam('wall_invert', 'yes')
    } else {
        main_url.deleteParam('wall_invert')
    }

    Utils.push_state(window.main_url)
    let tempp = window.main_classes['wall'].method_params
    tempp.offset = 0

    window.main_classes['wall'].setParams(window.main_classes['wall'].method_name, tempp, e.target.checked)
    window.main_classes['wall'].clear()
    window.main_classes['wall'].objects.page = -1

    window.main_classes['wall'].nextPage()
})

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

    main_url.setParam('news_type', e.target.value)
    Utils.replace_state(window.main_url.href)
})

$(document).on('click', '.newsfeed_wrapper #__newsfeedreturnbanned', async (e) => {
    window.main_classes['wall'].clear()
    window.main_classes['wall'].method_params.return_banned = Number(e.target.checked)
    window.main_classes['wall'].nextPage()

    main_url.setParam('return_banned', Number(e.target.checked))
    Utils.replace_state(window.main_url.href)
})

$(document).on('change', '#__friendssearch', (e) => {
    main_url.setParam('query', e.target.value)
    Utils.replace_state(window.main_url.href)
    
    window.router.restart()
})
