window.default_left_menu = [
    {
        'name': '_navigation.my_page',
        'href': 'site_pages/user_page.html',
        'new_page': false,
        'disabled': false,
        'hidden': false,
    },
    {
        'name': '_navigation.my_news',
        'href': 'site_pages/news_page.html',
        'new_page': false,
        'disabled': false,
        'hidden': false,
    },
    {
        'name': '_navigation.my_friends',
        'href': 'site_pages/friends.html',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_messages',
        'href': 'site_pages/messages.html',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_photos',
        'href': 'site_pages/albums.html',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_audios',
        'href': 'site_pages/audios.html',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_videos',
        'href': 'site_pages/videos.html',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_faves',
        'href': 'site_pages/faves.html',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_notifications',
        'href': 'site_pages/notifs.html',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_search',
        'href': 'site_pages/search.html',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_documents',
        'href': 'site_pages/docs.html',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_notes',
        'href': 'site_pages/notes.html',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_wikipages',
        'href': 'site_pages/wikipages.html',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_settings',
        'href': 'site_pages/settings.html',
        'new_page': false,
        'disabled': false,
        'hidden': false,
    },
    {
        'name': 'Dota 2',
        'href': 'steam://rungameid/570',
        'new_page': true,
        'disabled': false,
        'hidden': true,
    }
]

window.main_class = new class {
    load_layout() {
        window.saved_pages = []
        window.main_classes = {}

        let menu_html = ``
        window.left_menu = window.site_params.has('ui.left_menu') ? JSON.parse(window.site_params.get('ui.left_menu')) : window.default_left_menu

        window.left_menu.forEach(tab => {
            let tempname = tab.name
            if(tab.hidden) {
                return
            }

            if(tab.name[0] == '_') {
                tempname = _(tab.name.substr(1))
            }

            menu_html += `
                <a href='${tab.href}' ${tab.new_page ? `target='_blank'` : ''} ${tab.disabled ? `class='stopped'` : ''}>${tempname}</a>
            `
        })

        document.querySelector('body').insertAdjacentHTML('afterbegin', 
        `
        <style id='_customcss'>
            ${window.site_params.get('ui.custom_css') ? escape_html(window.site_params.get('ui.custom_css')) : '{}'}
        </style>
    
        <div class='dimmer'></div>
        <div class='to_the_sky'>
            <span class='to_up'>${_('navigation.to_up')}</span>
            <span class='come_back'>${_('navigation.come_back')}</span>
        </div>
        <div class="wrapper">
            <div class="menu">
                ${menu_html}
            </div>
    
            <div class="page_content">
    
            </div>
        </div>
        `)
        
        let custom_js = window.site_params.get('ui.custom_js')
        if(custom_js) {
            let tmp_script = document.createElement('script')
            tmp_script.setAttribute('id', '_customjs')
            tmp_script.innerHTML = custom_js
    
            document.body.appendChild(tmp_script)
        }

        window.s_url = new URL(location.href)
        window.accounts = new Accounts
        window.active_account = window.accounts.getActiveAccount()
        window.use_execute = window.site_params.get('internal.use_execute', '1') == '1'
        if(!window.active_account) {
            $('.wrapper .menu')[0].innerHTML = `
                <a href='site_pages/auth.html'>${_('navigation.authorize')}</a>
                <a href='site_pages/settings.html'>${_('navigation.my_settings')}</a>
            `
        } else {
            window.vk_api = new VkApi(window.active_account.vk_path, window.active_account.vk_token)
        }

        window.router.route(window.s_url.href)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.main_class.load_layout()

    $('textarea').trigger('input')
    $(document).trigger('scroll')
})
