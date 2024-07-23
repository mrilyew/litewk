window.default_left_menu = [
    {
        'name': '_navigation.my_page',
        'href': '#id0',
        'anchor': '_this_user',
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
        'href': '#feed/notifications',
        'anchor': '_notifications',
        'new_page': false,
        'disabled': false,
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
        'disabled': false,
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
        'name': '_navigation.my_debug',
        'anchor': '_debugger',
        'href': '#debug',
        'new_page': false,
        'disabled': false,
        'hidden': true,
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

class LeftMenu {
    constructor() {
        this.list = window.site_params.has('ui.left_menu') ? JSON.parse(window.site_params.get('ui.left_menu')) : window.default_left_menu
    }
    
    getHTML() {
        let menu_html = ``

        this.list.forEach(tab => {
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

        let temp_div = document.createElement('div')
        temp_div.innerHTML = menu_html

        if(window.active_account && window.site_params.get('ux.better_my_page', '0') == '1') {
            let account_info = window.active_account.getVkAccount()

            temp_div.querySelector('#_this_user').outerHTML = `
                <a href='#id0' id='_this_user' class='better'>
                    <div id='_this_user_wrapper'>
                        <object type='image/jpeg' data='${account_info.getAvatar()}'>
                            <div class='placeholder'></div>
                        </object>
                        
                        <span>${account_info.getName()}</span>
                    </div>
                </a>
                
                <a href='#edit' id='_this_user_edit'>${_('navigation.edit_short')}</a>
            `

            // поняли типо отсылка на вк до 2016 с этим ред
        }

        return temp_div.innerHTML
    }
}
