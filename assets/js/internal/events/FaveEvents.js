u(document).on('click', '#_toggleFave', async (e) => {
    e.preventDefault()
    e.target.classList.add('stopped')

    const fave_status = Number(e.currentTarget.dataset.val)
    const target = e.target

    const entity = target.dataset.type
    const id = target.dataset.addid
    let api_type = 'Page'
    let verb = 'add'
    let notif_message = _('bookmarks.notif_object_faved')

    let api_params = {}

    switch(entity) {
        default:
        case 'user':
            api_type = 'Page'
            api_params.user_id = id
            notif_message = _('bookmarks.notif_user_faved')

            break
        case 'club':
            api_type = 'Page'
            api_params.group_id = id
            notif_message = _('bookmarks.notif_club_faved')

            break
        case 'post':
            api_type = 'Post'
            realid = id.split('_')

            api_params.owner_id = realid[0]
            api_params.id = realid[1]
            notif_message = _('bookmarks.notif_post_faved')

            break
        case 'link':
            api_type = 'Link'
            api_params.link = target.dataset.link
            notif_message = _('bookmarks.notif_link_faved')

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

    try {
        const result = await window.vk_api.call(`fave.${verb}${api_type}`, api_params)

        if(fave_status == 0) {
            e.target.setAttribute('data-val', 1)
            e.target.innerHTML = _('faves.remove_from_faves')

            window.main_class.newNotification(notif_message, null, null, null, () => {
                window.router.route('#fave')
            })
        } else {
            e.target.setAttribute('data-val', 0)
            e.target.innerHTML = _('faves.add_to_faves')
        }
    } catch(e) {
        window.main_class.newNotification(_('errors.notif_object_not_faved'))
    }

    e.target.classList.remove('stopped')
})

u(document).on('click', '._like_add', async (e) => {
    e.preventDefault()
    
    // Nodes
    const like = u(e.target.closest('._like_add'))
    const post = like.closest('.main_info_block')
    const main_post_like = post.find('.post_like')

    // Like info
    const id = post.attr('data-postid').split('_')
    const verb = !like.hasClass('activated') ? 'add' : 'delete'
    const entity = post.attr('data-type')
    const handler = like.find('span')
    const reaction_id = like.attr('data-reaction')

    // Fake update
    u(post).find('.reaction_like').removeClass('activated')
    if(verb == 'add') {
        main_post_like.addClass('activated')
        like.addClass('activated')
    } else {
        main_post_like.removeClass('activated')
        like.removeClass('activated')
    }

    if(handler) {
        like.find('span').html(Number(handler.html()) + (verb == 'add' ? 1 : -1))
    } else {
        like.append(`
            <span class='likes_handler'>1</span>
        `)
    }

    const params = {'type': entity, 'owner_id': id[0], 'item_id': id[1]}
    if(reaction_id) {
        params.reaction_id = reaction_id
    }

    const res = await window.vk_api.call(`likes.${verb}`, params)
})

u(document).on('click', '.like_not_post', async (e) => {
    e.preventDefault()

    const like = e.target.closest('.like')
    const post = like.closest('.main_info_block')
    const id = post.dataset.postid.split('_')
    const verb = !like.classList.contains('activated') ? 'add' : 'delete'
    const entity = post.dataset.type
    const handler = u(like.querySelector('span'))

    if(verb == 'add') {
        like.classList.add('activated')

        if(handler.length == 0) {
            u(like).append(`
                <span>1</span>
            `)
        } else {
            handler.html(Number(handler.innerHTML) + 1)
        }
    } else {
        const resulter = Number(handler.innerHTML) - 1
        like.classList.remove('activated')

        if(resulter > 0) {
            handler.html(resulter)
        } else {
            handler.remove()
        }
    }

    const res = await window.vk_api.call(`likes.${verb}`, {'type': entity, 'owner_id': id[0], 'item_id': id[1]})
    
    if(res.likes > 0) {
        handler.html(res.likes)
    } else {
        handler.remove()
    }
})

u(document).on('click', '#__markbookmarks', async (e) => {
    await window.vk_api.call('fave.markSeen')

    u('.navigation #_faves .counter').remove()
})

u(document).on('click', '#_toggleLinkFave', async (e) => {
    let target = e.target

    if(target.tagName != 'svg') {
        target = target.closest('svg')
    }

    const url = target.dataset.url
    const verb = !target.classList.contains('faved') ? 'add' : 'remove'
    const result = await window.vk_api.call(`fave.${verb}Link`, {'link': url})
    
    if(verb == 'add') {
        target.classList.add('faved')
    } else {
        target.classList.remove('faved')
    }
})

u(document).on('change', `#_bookmarks_search input[type='text']`, async (e) => {
    window.main_classes['wall'].localSearch(e.target.value)
})

u(document).on('click', `#_bookmarks_search input[type='button']`, async (e) => {
    u(`#_bookmarks_search input[type='text']`).trigger('change')
})
