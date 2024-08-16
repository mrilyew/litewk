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
        'anchor': 'news',
        'href': '#feed',
        'new_page': false,
        'disabled': false,
        'hidden': false,
    },
    {
        'name': '_navigation.my_friends',
        'anchor': 'friends',
        'href': '#friends',
        'new_page': false,
        'disabled': false,
        'hidden': false,
    },
    {
        'name': '_navigation.my_groups',
        'anchor': 'groups',
        'href': '#groups',
        'new_page': false,
        'disabled': false,
        'hidden': false,
    },
    {
        'name': '_navigation.my_messages',
        'anchor': 'messages',
        'href': '#im',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_photos',
        'anchor': 'photos',
        'href': '#albums',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_audios',
        'anchor': 'audios',
        'href': 'audios',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_videos',
        'anchor': 'videos',
        'href': '#videos',
        'new_page': false,
        'disabled': true,
        'hidden': false,
    },
    {
        'name': '_navigation.my_faves',
        'anchor': 'faves',
        'href': '#fave',
        'new_page': false,
        'disabled': false,
        'hidden': false,
    },
    {
        'name': '_navigation.my_notifications',
        'href': '#feed/notifications',
        'anchor': 'menu_notifications_badge',
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
        'disabled': false,
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
        const counters = window.main_class.counters
        let menu_html = ``

        if(!window.active_account) {
            return `
                <a href='#login'>${_('navigation.authorize')}</a>
                <a href='#settings'>${_('navigation.my_settings')}</a>
            `
        }

        this.list.forEach(tab => {
            if(!tab) {
                return
            }

            // tab name
            const tab_counter_name = tab.anchor
            let temp_tab_name = tab.name
            let counter_html = ''
            if(tab.hidden) {
                return
            }

            if(tab.name[0] == '_') {
                temp_tab_name = _(tab.name.substr(1))
            }

            // counter
            if(tab_counter_name && counters) {
                const _count = counters[tab_counter_name]
                if(_count && _count > 0) {
                    counter_html = `
                        <span class='counter'>${_count}</span>
                    `
                }
            }

            menu_html += `
                <a href='${tab.href}' ${tab.new_page ? `target='_blank'` : ''} ${tab.anchor ? ` id='${tab.anchor}' ` : ''} ${tab.disabled ? `class='stopped'` : ''}>
                    ${temp_tab_name}
                    ${counter_html}
                </a>
            `
        })

        const menu_html_umbrella = u(`<div>${menu_html}</div>`)
        if(window.site_params.get('ux.better_my_page', '0') == '1' && menu_html_umbrella.find('#_this_user').length > 0) {
            const account_info = window.active_account.getVkAccount()

            menu_html_umbrella.find('#_this_user').nodes[0].outerHTML = `
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
        }

        return menu_html_umbrella.html()
    }

    reset() {
        this.list = window.default_left_menu.slice(0)
        this.save()
    }

    save() {
        window.site_params.set('ui.left_menu', JSON.stringify(this.list))
    }

    append() {
        this.list.push({
            'name': 'replace_me',
            'href': '#' + Utils.random_int(-225527990, 899999999), // ссылка на случайную страницу вк, почему нет
            'new_page': false,
            'disabled': false,
            'hidden': false,
            'anchor': '',
        })

        this.save()
    }

    deleteItem(tab) {
        const index = this.list.indexOf(tab.info)

        this.list = Utils.array_splice(this.list, index)
        this.save()

        let next_tab = this.list[index]

        if(!next_tab) {
            next_tab = this.list[index - 1]
        }

        return next_tab
    }

    moveItem(tab, direction = 'up') {
        const index = this.list.indexOf(tab.info)

        if(direction == 'up') {
            if(index <= 0) {
                return
            }

            this.list = Utils.array_swap(this.list, index, index - 1)
        } else {
            if(index >= this.list.length - 1) {
                return
            }

            this.list = Utils.array_swap(this.list, index, index + 1)
        }

        this.save()
    }

    findItem(href) {
        return this.list.find(el => el.href == href)
    }
}

class LeftMenuItem {
    constructor(tab) {
        this.info = tab
    }
}