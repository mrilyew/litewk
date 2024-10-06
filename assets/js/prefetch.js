document.addEventListener('DOMContentLoaded', async () => {
    function __logToWaterfall(text, increment = true) {
        if(localStorage.getItem('ux.hide_waterfall') == '1') {
            return
        }

        if(document.querySelector('#lwk_loader_status_name')) {
            document.querySelector('#lwk_loader_status_name').innerHTML = text
        }

        if(increment) {
            i += 1
            const percent = (i / load_length) * 100
    
            document.querySelector('#lwk_loader_status_bar').style.width = percent + '%'
            document.querySelector('#lwk_loader_display_hs').style.transform = `rotate(${Math.round(Math.random() * (180 - 0) + 0)}deg) scale(${Math.round(Math.random() * (150 - 80) + 50)}%)`
        }
    }

    function __insertScript(url, toBody = false) {
        return new Promise(function (resolve, reject) {
            let script = document.createElement('script')
            script.src = url
            //script.async = 'true'

            __logToWaterfall(`Loading script "${url}"`, false)

            script.onerror = () => {
                __logToWaterfall(`Did not loaded script "${url}"`)
                resolve(true)
            }

            script.onload = async () => {
                __logToWaterfall(`Loaded script "${url}"`)
                resolve(true)
            }

            if(!toBody) {
                document.head.appendChild(script)
            } else {
                document.body.appendChild(script)
            }
        }) 
    }

    function __insertStyle(url, from = null, toBody = false) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = url
            if(from) {
                link.setAttribute('data-from', from)
            }

            link.onload = async () => {
                __logToWaterfall(`Loaded style "${url}`)
                resolve(true)
            }

            link.onerror = () => {
                __logToWaterfall(`Did not loaded style "${url}"`)
                reject()
            }

            if(!toBody) {
                document.head.appendChild(link)
            } else {
                document.body.appendChild(link)
            }
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
        'https://cdn.jsdelivr.net/npm/marked/marked.min.js'
    ]

    if(localStorage.getItem('ux.twemojify') ?? '1' == '1') {
        libs_list.push('https://unpkg.com/twemoji@latest/dist/twemoji.min.js')
    }

    if(localStorage.getItem('ui.lottie_sticker_animations') == '1') {
        libs_list.push('https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.7.14/lottie.min.js')
    }

    const scripts_list = [
        /* Lists */
        'assets/js/internal/lists/themes.js',
        'assets/js/internal/lists/routes.js',
        'assets/js/internal/lists/consts.js',

        /* Storage */
        'assets/js/internal/storage/site_params.js',
        'assets/js/internal/storage/index_db.js',

        /* Site logic */
        'assets/js/internal/elements/header.js',
        'assets/js/internal/elements/left_menu.js',
        'assets/js/internal/elements/dropdown.js',
        'assets/js/internal/components/accounts.js',
        'assets/js/internal/components/settings.js',
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
        'assets/js/internal/api/uncategorized/documentation.js',
        'assets/js/internal/api/uncategorized/image_status.js',

        /* Api helpers */
        'assets/js/internal/scrolling/CommonListViews.js',
        'assets/js/internal/scrolling/GroupHistory.js',
        'assets/js/internal/scrolling/SimilarGroups.js',
        'assets/js/internal/scrolling/Newsfeed.js',
        'assets/js/internal/scrolling/Bookmarks.js',

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
        'assets/js/internal/templates/user_page/user_page_subtemplates/entity_page_buttons.js',
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
        'assets/js/internal/templates/components/entity_subblocks.js',
        'assets/js/internal/templates/components/entity_page_cover.js',
        'assets/js/internal/templates/components/album.js',
        'assets/js/internal/templates/components/group_topic.js',
        'assets/js/internal/templates/components/docs/type_gif.js',
        'assets/js/internal/templates/components/docs/type_image.js',
        'assets/js/internal/templates/components/docs/type_list.js',
        'assets/js/internal/templates/components/docs/html_preview.js',
        'assets/js/internal/templates/components/poll.js',
        'assets/js/internal/templates/settings/common.js',
        'assets/js/internal/templates/settings/content.js',
        'assets/js/internal/templates/settings/nav_edit.js',
        'assets/js/internal/templates/settings/ui.js',

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
        'assets/js/internal/events/DevEvents.js',
        'assets/js/internal/events/Settings.js',
        'assets/js/internal/events/FaveEvents.js',
        'assets/js/internal/events/EntityEvents.js',
        'assets/js/internal/events/WallEvents.js',
        'assets/js/internal/events/DocsEvents.js',
        'assets/js/internal/events/SearchEvents.js',
        'assets/js/internal/events/NewsfeedEvents.js',
        'assets/js/internal/events/GroupsEvents.js',
        'assets/js/internal/events/PollsEvents.js',
        'assets/js/internal/events/Navigation.js',

        'assets/js/internal/events/viewers/PhotoViewer.js',

        /* Pages */
        'assets/js/pages/DebugController.js',
        'assets/js/pages/DocumentationController.js',
        'assets/js/pages/EditController.js',
        'assets/js/pages/FriendsController.js',
        'assets/js/pages/GroupsController.js',
        'assets/js/pages/NewsController.js',
        'assets/js/pages/SearchController.js',
        'assets/js/pages/SettingsController.js',
        'assets/js/pages/UserController.js',
        'assets/js/pages/UtilsController.js',
        'assets/js/pages/WallController.js',

        /* And finally, */
        'assets/js/main.js'
    ]

    const styles_list = [
        'assets/css/every/1.palette.css',
        'assets/css/every/2.tags.css',
        'assets/css/every/3.tailwind.css',
        'assets/css/every/4.scrollbars.css',
        'assets/css/every/5.animations.css',
        'assets/css/every/6.messagebox.css',
        'assets/css/every/7.notifications.css',
        'assets/css/every/8.dropdown.css',
        'assets/css/every/9.viewers.css',
        'assets/css/every/10.wall.css',
        'assets/css/every/11.wtf.css',

        'assets/css/pages/1.loader.css',
        'assets/css/pages/2.layout.css',
        'assets/css/pages/3.settings.css',
        'assets/css/pages/4.dev.css',
        'assets/css/pages/5.user.css',
        'assets/css/pages/6.club.css',
        'assets/css/pages/7.settings.css',
    ]

    window.controllers = {}
    window.templates = {}
    
    let load_length = libs_list.length + scripts_list.length + styles_list.length
    let i = 0
    
    __addBase('/')

    if(localStorage.getItem('ux.hide_waterfall') != '1') {
        document.body.insertAdjacentHTML('beforeend', `
        <div id='lwk_loader' class='flex flex_column justify_space_between'>
            <div id='lwk_loader_display' class='flex justify_center align_center'>
                <div class='flex flex_column align_center'>
                    <img id='lwk_loader_display_hs' src='assets/images/hs.svg'>
                    <p id='lwk_name' class='text_big align_center_text'>LiteWK</p>
                </div>
            </div>
            <div id='lwk_loader_status' class='relative flex flex_row align_center justify_center'>
                <div class='absolute' id='lwk_loader_status_bar'></div>
                <span id='lwk_loader_status_name'>Loaded file -</span>
            </div>
        </div>`)
    }

    // тут про тему

    let theme = null
    try {
        if(localStorage.getItem('ui.installed_theme') != null) {
            theme = JSON.parse(localStorage.getItem('ui.installed_theme'))

            if(!theme || theme.id == 'default') {
                theme = null
            }
            
            __logToWaterfall(`Found theme "${theme.id}"`)
        }
    } catch(e) {
        theme = null
        __logToWaterfall(`${e.message}`)
    }

    if(!theme || theme.inherits_default) {
        styles_list.forEach(async styler => {
            await __insertStyle(styler)
        })
    }

    for(const lib of libs_list) {
        await __insertScript(lib)
    }

    for(const scripter of scripts_list) {
        await __insertScript(scripter)
    }

    if(theme) {
        i = 0

        try {
            load_length = theme.include_libs.length + theme.include_styles.length
        } catch(e) {
            load_length = 1
        }

        document.querySelector('#lwk_name').innerHTML = theme.en_display_name
        document.querySelector('#lwk_loader_status_bar').style.width = '0%'
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

    // hold
    //return
    
    u('#_prefetch_script').remove()
    u('#lwk_loader').remove()

    main_class.startup()
})
