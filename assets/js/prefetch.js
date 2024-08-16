document.addEventListener('DOMContentLoaded', async () => {
    function __logToWaterfall(text) {
        if((localStorage.getItem('ux.hide_waterfall') ?? '0') == '0') {
            document.querySelector('#_insertlogs').insertAdjacentHTML('beforeend', text)
        }

        window.scrollBy(0, 1000)
    }

    function __insertScript(url, toBody = false) {
        return new Promise(function (resolve, reject) {
            let script = document.createElement('script')
            script.src = url
            script.async = 'true'

            script.onerror = () => {
                __logToWaterfall(`<p style='color:red'>Loader | Did not loaded script "${url}".</p>`)
                reject()
            }

            script.onload = async () => {
                __logToWaterfall(`<p>Loader | Loaded script "${url}"</p>`)
                resolve(true)
            }

            if(!toBody) {
                document.head.appendChild(script)
            } else {
                document.body.appendChild(script)
            }
        }) 
    }

    function __insertStyle(url, from = null) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = url
            if(from) {
                link.setAttribute('data-from', from)
            }

            link.onload = async () => {
                __logToWaterfall(`<p>Loader | Loaded style "${url}"</p>`)
                resolve(true)
            }

            link.onerror = () => {
                __logToWaterfall(`<p style='color:red'>Loader | Did not loaded style "${url}".</p>`)
                reject()
            }

            document.head.appendChild(link)
        })
    }

    function __addBase(href) {
        let base = document.createElement('base')
        base.href = href
    
        document.head.appendChild(base)
    }

    const libs_list = [
        'https://cdn.jsdelivr.net/npm/umbrellajs',
        'https://momentjs.com/downloads/moment.js',
    ]

    const scripts_list = [
        /* Lists */
        'assets/js/internal/lists/themes.js',
        'assets/js/internal/lists/routes.js',
        'assets/js/internal/lists/consts.js',
        'assets/js/internal/lists/tweaks.js',

        /* Storage */
        'assets/js/internal/storage/site_params.js',
        'assets/js/internal/storage/index_db.js',

        /* Site logic */
        'assets/js/internal/elements/left_menu.js',
        'assets/js/internal/components/accounts.js',
        'assets/js/internal/components/notificator.js',
        'assets/js/internal/misc/utils.js',
        'assets/js/internal/routing/router.js',
        'assets/js/internal/elements/message_box.js',
        
        /* Api classes */
        'assets/js/internal/components/vk_api.js',
        'assets/js/internal/api/errors/ApiError.js',
        'assets/js/internal/api/errors/ApiNotFoundError.js',
        'assets/js/internal/api/main_classes.js',
        'assets/js/internal/api/wallable/user.js',
        'assets/js/internal/api/wallable/club.js',
        
        'assets/js/internal/api/postable/post.js',
        'assets/js/internal/api/postable/photo.js',
        'assets/js/internal/api/postable/video.js',
        'assets/js/internal/api/postable/audio.js',
        'assets/js/internal/api/postable/poll.js',
        'assets/js/internal/api/postable/attached_link.js',
        'assets/js/internal/api/postable/doc.js',
        'assets/js/internal/api/postable/comment.js',
        'assets/js/internal/api/postable/note.js',
        'assets/js/internal/api/postable/classic_graffiti.js',
        'assets/js/internal/api/uncategorized/gift.js',
        'assets/js/internal/api/uncategorized/album.js',
        'assets/js/internal/api/uncategorized/group_link.js',
        'assets/js/internal/api/uncategorized/board.js',
        'assets/js/internal/api/uncategorized/sticker.js',
        'assets/js/internal/api/uncategorized/notification.js',
        'assets/js/internal/api/uncategorized/dummy.js',

        /* Api helpers */
        'assets/js/internal/scrolling/ApiListViews.js',
        'assets/js/internal/scrolling/CommonListViews.js',
        'assets/js/internal/scrolling/SearchListView.js',
        'assets/js/internal/scrolling/newsfeed/NewsfeedListViews.js',
        'assets/js/internal/scrolling/BookmarksListView.js',
        'assets/js/internal/scrolling/WallListView.js',
        'assets/js/internal/scrolling/CommentsListView.js',
        'assets/js/internal/scrolling/FriendsListView.js',
        'assets/js/internal/scrolling/RecomGroupsListView.js',
        'assets/js/internal/scrolling/DocsListView.js',
        'assets/js/internal/scrolling/GroupHistoryListView.js',
        'assets/js/internal/scrolling/NotificationsListView.js',
        'assets/js/internal/scrolling/VotersListView.js',

        /* Languages */
        'assets/js/internal/langs/ru.js',
        'assets/js/internal/langs/qqx.js',
        'assets/js/internal/langs/i18n.js',

        /* Templates */
        'assets/js/internal/templates/layouts/main_template.js',
        'assets/js/internal/templates/layouts/two_blocks_grid.js',
        'assets/js/internal/templates/layouts/fave_page.js',
        'assets/js/internal/templates/user_page/user_page_subtemplates/mil_template.js',
        'assets/js/internal/templates/user_page/user_page_subtemplates/relative_template.js',
        'assets/js/internal/templates/user_page/user_page_subtemplates/school_template.js',
        'assets/js/internal/templates/user_page/user_page_subtemplates/univer_template.js',
        'assets/js/internal/templates/user_page/user_page_subtemplates/work_template.js',
        'assets/js/internal/templates/user_page/user_page_subtemplates/user_page_buttons.js',
        'assets/js/internal/templates/entity_subblocks/photo_status.js',
        'assets/js/internal/templates/entity_subblocks/row_block.js',
        'assets/js/internal/templates/entity_subblocks/subscriptions.js',
        'assets/js/internal/templates/entity_subblocks/gifts_block.js',
        'assets/js/internal/templates/entity_subblocks/albums.js',
        'assets/js/internal/templates/entity_subblocks/videos.js',
        'assets/js/internal/templates/entity_subblocks/group_links.js',
        'assets/js/internal/templates/entity_subblocks/group_board_block.js',
        'assets/js/internal/templates/entity_subblocks/docs.js',
        'assets/js/internal/templates/postable/note.js',

        'assets/js/internal/templates/user_page/user_page.js',
        'assets/js/internal/templates/layouts/club_page.js',
        'assets/js/internal/templates/postable/attachments.js',
        'assets/js/internal/templates/postable/post.js',
        'assets/js/internal/templates/postable/comment.js',
        'assets/js/internal/templates/components/masonry.js',
        'assets/js/internal/templates/components/notification_bubble.js',
        'assets/js/internal/templates/components/notification.js',
        'assets/js/internal/templates/components/search/search_users_params.js',
        'assets/js/internal/templates/components/search/search_posts_params.js',
        'assets/js/internal/templates/components/wall.js',
        'assets/js/internal/templates/components/paginator.js',
        'assets/js/internal/templates/components/wall_tabs.js',
        'assets/js/internal/templates/components/content_pages_owner.js',
        'assets/js/internal/templates/components/sticker.js',
        'assets/js/internal/templates/components/entity_page_cover.js',
        'assets/js/internal/templates/components/album.js',
        'assets/js/internal/templates/components/group_topic.js',
        'assets/js/internal/templates/components/docs/type_gif.js',
        'assets/js/internal/templates/components/docs/type_image.js',
        'assets/js/internal/templates/components/docs/type_list.js',
        'assets/js/internal/templates/components/docs/html_preview.js',
        'assets/js/internal/templates/components/poll.js',
        'assets/js/internal/templates/settings/common.js',
        'assets/js/internal/templates/settings/nav_edit.js',

        'assets/js/internal/templates/components/attached_link/attached_link_playlist.js',
        'assets/js/internal/templates/components/attached_link/attached_link_vertical.js',
        'assets/js/internal/templates/components/attached_link/attached_link_regular.js',

        'assets/js/internal/templates/components/photo/graffiti.js',
        'assets/js/internal/templates/components/photo/photo_fullsize.js',
        'assets/js/internal/templates/components/photo/photo_mini.js',

        'assets/js/internal/templates/components/video/video_attachment_with_name.js',
        'assets/js/internal/templates/components/video/video_attachment_mini.js',

        'assets/js/internal/templates/components/reports/report_user.js',
        'assets/js/internal/templates/components/reports/report_post.js',

        'assets/js/internal/templates/components/listview/user.js',
        'assets/js/internal/templates/components/listview/club.js',
        'assets/js/internal/templates/components/user/user_mini.js',
        'assets/js/internal/templates/components/post/post_like.js',
        'assets/js/internal/templates/components/gift.js',

        /* JS Events */
        'assets/js/internal/events/CommonEvents.js',
        'assets/js/internal/events/FaveEvents.js',
        'assets/js/internal/events/EntityEvents.js',
        'assets/js/internal/events/WallEvents.js',
        'assets/js/internal/events/DocsEvents.js',
        'assets/js/internal/events/SearchEvents.js',
        'assets/js/internal/events/NewsfeedEvents.js',
        'assets/js/internal/events/GroupsEvents.js',
        'assets/js/internal/events/PollsEvents.js',

        'assets/js/internal/events/viewers/PhotoViewer.js',

        /* Pages */
        'assets/js/pages/auth_page.js',
        'assets/js/pages/club_page.js',
        'assets/js/pages/debug_page.js',
        'assets/js/pages/doc_page.js',
        'assets/js/pages/docs_page.js',
        'assets/js/pages/edit_page.js',
        'assets/js/pages/faves_page.js',
        'assets/js/pages/friends_page.js',
        'assets/js/pages/gifts_page.js',
        'assets/js/pages/groups_page.js',
        'assets/js/pages/likes_page.js',
        'assets/js/pages/news_page.js',
        'assets/js/pages/note_page.js',
        'assets/js/pages/notes_page.js',
        'assets/js/pages/notifications_page.js',
        'assets/js/pages/post_page.js',
        'assets/js/pages/photo_page.js',
        'assets/js/pages/poll_voters_page.js',
        'assets/js/pages/resolve_link.js',
        'assets/js/pages/search_page.js',
        'assets/js/pages/subscriptions_page.js',
        'assets/js/pages/settings_page.js',
        'assets/js/pages/user_page.js',
        'assets/js/pages/wall_page.js',

        /* And finally, */
        'assets/js/main.js'
    ]

    const styles_list = [
        'assets/css/layout.css',
    ]

    const base = '/litewk/'
    __addBase(base)

    if((localStorage.getItem('ux.hide_waterfall') ?? '0') == '0') {
        document.body.insertAdjacentHTML('beforeend', `<div id='_insertlogs'></div>`)
    }

    const libs_promises = libs_list.map(src => __insertScript(src, false))
    await Promise.all(libs_promises)

    // тут про тему

    let theme = null
    try {
        if(localStorage.getItem('ui.installed_theme') != null) {
            theme = JSON.parse(localStorage.getItem('ui.installed_theme'))

            if(!theme || theme.id == 'default') {
                theme = null
            }
            
            __logToWaterfall(`<p style='color:pink'>Found theme "${theme.id}".</p>`)
        }
    } catch(e) {
        theme = null
        __logToWaterfall(`<p style='color:red'>${e.message}.</p>`)
    }

    if(!theme || theme.inherits_default) {
        styles_list.forEach(async styler => {
            await __insertStyle(styler)
        })
    }

    for(const scripter of scripts_list) {
        await __insertScript(scripter)
    }

    if(theme) {
        if(theme.requires_js) {
            const libs_promises_theme = theme.include_libs.map(src => __insertScript(src, false))
            await Promise.all(libs_promises_theme)

            for(const scripter of theme.include_scripts) {
                await __insertScript(scripter)
            }
        }

        theme.include_styles.forEach(async styler => {
            await __insertStyle(styler, 'theme')
        })
    }

    u('#_prefetch_script').remove()
    u('#_insertlogs').remove()

    main_class.startup()
})
