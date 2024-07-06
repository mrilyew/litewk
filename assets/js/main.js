window.default_left_menu = [
    {
        'name': '_navigation.my_page',
        'href': '#id0',
        'new_page': false,
        'disabled': false,
        'hidden': false,
    },
    {
        'name': '_navigation.my_news',
        'anchor': '_news',
        'href': '#feed',
        'new_page': false,
        'disabled': false,
        'hidden': false,
    },
    {
        'name': '_navigation.my_friends',
        'anchor': '_friends',
        'href': '#friends',
        'new_page': false,
        'disabled': false,
        'hidden': false,
    },
    {
        'name': '_navigation.my_groups',
        'anchor': '_groups_invites',
        'href': '#groups',
        'new_page': false,
        'disabled': false,
        'hidden': false,
    },
    {
        'name': '_navigation.my_messages',
        'anchor': '_messages',
        'href': '#messages',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_photos',
        'anchor': '_photos',
        'href': '#albums',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_audios',
        'anchor': '_audios',
        'href': '#audios',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_videos',
        'anchor': '_videos',
        'href': '#videos',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_faves',
        'anchor': '_faves',
        'href': '#fave',
        'new_page': false,
        'disabled': false,
        'hidden': false,
    },
    {
        'name': '_navigation.my_notifications',
        'href': '#notifs',
        'anchor': '_notifications',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_search',
        'href': '#search',
        'new_page': false,
        'disabled': false,
        'hidden': false,
    },
    {
        'name': '_navigation.my_documents',
        'href': '#docs',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_notes',
        'href': '#notes',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_settings',
        'href': '#settings',
        'new_page': false,
        'disabled': false,
        'hidden': false,
    },
    {
        'name': 'Dota 2',
        'anchor': '_dota2',
        'href': 'steam://rungameid/570',
        'new_page': true,
        'disabled': false,
        'hidden': true,
    }
]

window.main_class = new class {
    load_layout() {
        console.clear()
        console.log('Доброго времени суток.')

        window.saved_pages = []
        window.main_classes = {}
        window.typical_fields = 'common_count,country,city,id,is_favorite,is_hidden_from_feed,image_status,last_seen,online,lists,friend_status,photo_50,photo_100,photo_200,photo_orig,status,sex'
        window.typical_group_fields = 'activity,photo_100,description,members_count'

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
                <a href='${tab.href}' ${tab.new_page ? `target='_blank'` : ''} ${tab.anchor ? ` id='${tab.anchor}' ` : ''} ${tab.disabled ? `class='stopped'` : ''}>${tempname}</a>
            `
        })

        document.querySelector('body').insertAdjacentHTML('afterbegin', 
        `
        <style id='_customcss'>
            ${window.site_params.get('ui.custom_css') ? escape_html(window.site_params.get('ui.custom_css')) : '{}'}
        </style>
        
        <div class='dimmer'></div>
        <div class='to_the_sky menu_up_hover_click'>
            <span class='to_up'>${_('navigation.to_up')}</span>
            <span class='come_back'>${_('navigation.come_back')}</span>
        </div>
        <div class="wrapper">
            <div class="menu">
                ${menu_html}
                <div class='menu_up_hover menu_up_hover_click'></div>
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
                <a href='#login'>${_('navigation.authorize')}</a>
                <a href='#settings'>${_('navigation.my_settings')}</a>
            `
        } else {
            window.vk_api = new VkApi(window.active_account.vk_path, window.active_account.vk_token)
        }

        window.router.route(window.s_url.hash)

        setInterval(async () => {
            if(window.site_params.get('ux.send_online', '1') == '1' && window.active_account) {
                await window.vk_api.call('account.setOnline')

                log('5 minutes exceeded and online was called')
            }
        }, 300000);

        
        setInterval(async () => {
            await refresh_counters()
        }, 60000);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    window.main_class.load_layout()

    $('textarea').trigger('input')
    $(document).trigger('scroll')

    setTimeout(() => {refresh_counters()}, 3000)
})
