window.default_left_menu = [
    {
        'name': '_navigation.my_page',
        'href': '#id0',
        'anchor': '__this_user',
        'new_page': false,
        'disabled': false,
        'hidden': false,
        'uid': -1,
        'type': 'link',
    },
    {
        'name': '_navigation.my_news',
        'anchor': 'news',
        'href': '#feed',
        'new_page': false,
        'disabled': true,
        'hidden': false,
        'uid': -2,
        'type': 'link',
    },
    {
        'name': '_navigation.my_friends',
        'anchor': 'friends',
        'href': '#friends',
        'new_page': false,
        'disabled': true,
        'hidden': false,
        'uid': -3,
        'type': 'link',
    },
    {
        'name': '_navigation.my_groups',
        'anchor': 'groups',
        'href': '#groups',
        'new_page': false,
        'disabled': true,
        'hidden': false,
        'uid': -4,
        'type': 'link',
    },
    {
        'name': '_navigation.my_messages',
        'anchor': 'messages',
        'href': '#im',
        'new_page': false,
        'disabled': true,
        'hidden': false,
        'uid': -5,
        'type': 'link',
    },
    {
        'name': '_navigation.my_photos',
        'anchor': 'photos',
        'href': '#albums',
        'new_page': false,
        'disabled': true,
        'hidden': false,
        'uid': -6,
        'type': 'link',
    },
    {
        'name': '_navigation.my_audios',
        'anchor': 'audios',
        'href': 'audios',
        'new_page': false,
        'disabled': true,
        'hidden': false,
        'uid': -7,
        'type': 'link',
    },
    {
        'name': '_navigation.my_videos',
        'anchor': 'videos',
        'href': '#videos',
        'new_page': false,
        'disabled': true,
        'hidden': false,
        'uid': -8,
        'type': 'link',
    },
    {
        'name': '_navigation.my_faves',
        'anchor': 'faves',
        'href': '#fave',
        'new_page': false,
        'disabled': true,
        'hidden': false,
        'uid': -9,
        'type': 'link',
    },
    {
        'name': '_navigation.my_documents',
        'href': '#docs',
        'new_page': false,
        'disabled': true,
        'hidden': false,
        'uid': -11,
        'type': 'link',
    },
    {
        'name': '_navigation.my_notes',
        'href': '#notes',
        'new_page': false,
        'disabled': true,
        'hidden': true,
        'uid': -12,
        'type': 'link',
    },
    {
        'name': 'Dota 2',
        'anchor': '_dota2',
        'href': 'steam://rungameid/570',
        'new_page': false,
        'disabled': false,
        'hidden': true,
        'uid': -13,
        'type': 'link',
    },
    {
        'name': '_settings.settings_about',
        'anchor': '_readme',
        'href': window.consts.SETTINGS_README_LINK,
        'new_page': true,
        'disabled': false,
        'hidden': false,
        'uid': -14,
        'type': 'footer_link',
    },
    {
        'name': 'GitHub',
        'anchor': '_github',
        'href': window.consts.SETTINGS_GITHUB_LINK,
        'new_page': true,
        'disabled': false,
        'hidden': false,
        'uid': -15,
        'type': 'footer_link',
    },
    {
        'name': '_navigation.documentation',
        'anchor': '_dev',
        'href': '#dev',
        'new_page': false,
        'disabled': false,
        'hidden': false,
        'uid': -16,
        'type': 'footer_link',
    },
    {
        'name': '_navigation.debug',
        'anchor': '_debug',
        'href': '#debug',
        'new_page': false,
        'disabled': false,
        'hidden': false,
        'uid': -17,
        'type': 'footer_link',
    },
]

class LeftMenu {
    constructor() {
        this.list = window.site_params.has('ui.left_menu') ? JSON.parse(window.site_params.get('ui.left_menu')) : window.default_left_menu
        this.list_unloggeed = [
            {
                'name': '_navigation.authorize',
                'anchor': '_auth',
                'href': 'javascript:loginBox()',
                'new_page': false,
                'disabled': false,
                'hidden': false,
                'uid': -18,
                'type': 'link',
            },
            {
                'name': '_navigation.my_settings',
                'anchor': '_settings',
                'href': '#settings',
                'new_page': false,
                'disabled': false,
                'hidden': false,
                'uid': -19,
                'type': 'link',
            },
            {
                'name': '_settings.settings_about',
                'anchor': '_readme',
                'href': window.consts.SETTINGS_README_LINK,
                'new_page': true,
                'disabled': false,
                'hidden': false,
                'uid': -14,
                'type': 'footer_link',
            },
            {
                'name': 'GitHub',
                'anchor': '_github',
                'href': window.consts.SETTINGS_GITHUB_LINK,
                'new_page': true,
                'disabled': false,
                'hidden': false,
                'uid': -15,
                'type': 'footer_link',
            },
            {
                'name': '_navigation.documentation',
                'anchor': '_dev',
                'href': '#dev',
                'new_page': false,
                'disabled': false,
                'hidden': false,
                'uid': -16,
                'type': 'footer_link',
            },
            {
                'name': '_navigation.debug',
                'anchor': '_debug',
                'href': '#debug',
                'new_page': false,
                'disabled': false,
                'hidden': false,
                'uid': -17,
                'type': 'footer_link',
            },
        ]
    }
    
    getHTML(edit_mode = false) {
        const counters = window.main_class.counters
        let menu_html = u(`
        <div>
            <div class='menu_items'></div>
            <div class='navigation_sublinks'></div>
        </div>`)
        
        let list = this.list
        if(!window.active_account && !edit_mode) {
            list = this.list_unloggeed
        }

        list.forEach(tab => {
            if(!tab) {
                return
            }

            if(counters) {
                tab = new LeftMenuItem(tab, counters[tab.anchor])  
            } else {
                tab = new LeftMenuItem(tab)
            }
            
            if(tab.isHidden() && !edit_mode) {
                return
            }

            if(tab.getType() == 'link' || edit_mode) {
                menu_html.find('.menu_items').append(`
                    <a data-uid='${tab.getUid()}' href='${tab.getURL()}' ${tab.isOpensBlank() ? `target='_blank'` : ''} ${tab.hasAnchor() ? ` id='${tab.getAnchor()}' ` : ''} ${tab.isDisabled() ? `class='stopped'` : ''}>
                        ${tab.getName(edit_mode)}
                        ${tab.hasCounter() ? `
                            <span class='counter'>${tab.getCounter()}</span>
                        ` : ''}
                    </a>
                `)
            } else {
                menu_html.find('.navigation_sublinks').append(`
                    <a data-uid='${tab.getUid()}' href='${tab.getURL()}' ${tab.isOpensBlank() ? `target='_blank'` : ''} ${tab.hasAnchor() ? ` id='${tab.getAnchor()}' ` : ''} ${tab.isDisabled() ? `class='stopped'` : ''}>
                        ${tab.getName(edit_mode)}
                    </a>
                `)
            }
        })

        if(counters && counters['menu_notifications_badge'] > 0) {
            u('#header_icon_notification_counter').html(counters['menu_notifications_badge'])
            u('#header_icon_notification').attr('data-state', 'unread')
        }

        if(window.selected_tab) {
            menu_html.find(`a[data-uid='${window.selected_tab.info.uid}']`).addClass('editing')
        }

        return menu_html.html()
    }

    reset() {
        this.list = window.default_left_menu.slice(0)
        this.save()
    }

    save() {
        window.site_params.set('ui.left_menu', JSON.stringify(this.list))
    }

    append() {
        const inf = {
            'name': 'replace_me',
            'href': '#' + Utils.random_int(-225527990, 899999999), // ссылка на случайную страницу вк, почему нет
            'new_page': false,
            'disabled': false,
            'hidden': false,
            'anchor': '',
            'uid': Utils.random_int(0, 899999999),
            'type': 'link',
        }

        this.list.push(inf)
        this.save()

        return new LeftMenuItem(inf)
    }

    deleteItem(tab) {
        const index = this.list.indexOf(tab.info)

        this.list = Utils.array_splice(this.list, index)
        this.save()

        let next_tab = this.list[index]

        if(!next_tab) {
            next_tab = this.list[index - 1]
        }

        return next_tab ? new LeftMenuItem(next_tab) : null
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

    findItem(uid) {
        return this.list.find(el => el.uid == uid)
    }
}

class LeftMenuItem {
    constructor(tab, counter = null) {
        this.info = tab

        if(counter) {
            this.counter = counter
        }
    }

    getUid() {
        return this.info.uid
    }

    getName(unlocalized = false) {
        let name = this.info.name
        if(name[0] == '_' && !unlocalized) {
            name = _(name.substr(1))
        }

        return name
    }

    getAnchor() {
        return this.info.anchor
    }

    getURL() {
        let url = this.info.href
        if(this.getAnchor() == '__this_user' && window.active_account) {
            url = '#id' + window.active_account.info.id
        }

        return url
    }

    getCounter() {
        return this.counter
    }
    
    getType() {
        return this.info.type
    }

    hasAnchor() {
        return this.info.anchor != null
    }

    hasCounter() {
        return this.counter != null
    }

    isOpensBlank() {
        return this.info.new_page
    }

    isDisabled() {
        return this.info.disabled
    }

    isHidden() {
        return this.info.hidden
    }
}
