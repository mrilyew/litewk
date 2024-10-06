class SettingsManager {
    constructor() {
        this.refresh()
    }

    refresh() {
        const computed_style = getComputedStyle(document.body)
        this.settings_list = [
            {
                'name': 'ux.hide_back_button',
                'localized_name': '',
                'description': `Hide "back" button, that can appear after hyperlink transition`,
                'type': 'bool',
                'default_value': '0',
                'value': window.site_params.get('ux.hide_back_button')
            },
            {
                'name': 'ux.navigation_away_enable',
                'type': 'bool',
                'default_value': '1',
                'value': window.site_params.get('ux.navigation_away_enable'),
            },
            {
                'name': 'ux.navigation_counters',
                'type': 'bool',
                'default_value': '1',
                'value': window.site_params.get('ux.navigation_counters'),
            },
            {
                'name': 'ux.live_notifications',
                'type': 'bool',
                'default_value': '0',
                'value': window.site_params.get('ux.live_notifications'),
            },
            {
                'name': 'ux.online_status',
                'type': 'string',
                'default_value': 'none',
                'value': window.site_params.get('ux.online_status'),
            },
            {
                'name': 'internal.proxy_url',
                'type': 'string',
                'default_value': 'https://api.allorigins.win/get?url=',
                'value': window.site_params.get('internal.proxy_url'),
            },
            {
                'name': 'internal.proxy_useragent',
                'type': 'string',
                'default_value': '',
                'value': window.site_params.get('internal.proxy_useragent'),
            },
            {
                'name': 'internal.use_proxy_everywhere',
                'type': 'bool',
                'default_value': '0',
                'value': window.site_params.get('internal.use_proxy_everywhere'),
            },
            {
                'name': 'internal.use_execute',
                'type': 'bool',
                'default_value': '1',
                'value': window.site_params.get('internal.use_execute'),
            },
            {
                'name': 'ux.hide_waterfall',
                'type': 'bool',
                'default_value': '0',
                'value': window.site_params.get('ux.hide_waterfall'),
            },
            {
                'name': 'ui.date_format',
                'type': 'string',
                'default_value': 'default',
                'value': window.site_params.get('ui.date_format'),
            },
            {
                'name': 'ux.save_scroll',
                'type': 'bool',
                'default_value': '0',
                'value': window.site_params.get('ux.save_scroll'),
            },
            {
                'name': 'ux.auto_scroll',
                'type': 'bool',
                'default_value': '1',
                'value': window.site_params.get('ux.auto_scroll'),
            },
            {
                'name': 'ux.update_paginators',
                'type': 'bool',
                'default_value': '0',
                'value': window.site_params.get('ux.update_paginators'),
            },
            {
                'name': 'ux.previous_page_deletion',
                'type': 'bool',
                'default_value': '0',
                'value': window.site_params.get('ux.previous_page_deletion'),
            },
            {
                'name': 'ux.twemojify',
                'type': 'bool',
                'default_value': '1',
                'value': window.site_params.get('ux.twemojify'),
            },
            {
                'name': 'ux.shortify_text',
                'type': 'bool',
                'default_value': '1',
                'value': window.site_params.get('ux.shortify_text'),
            },
            {
                'name': 'ux.default_sort',
                'type': 'string',
                'default_value': window.site_params.get('ux.default_sort'),
                'value': (function(){
                    const available_sorts = ['asc', 'desc', 'smart']
                    const url_param = window.main_url.getParam('comment_sort')
                    const setting_value = window.site_params.get('ux.default_sort')
                    let result = 'asc'
                    if(url_param) {
                        result = url_param
                    } else {
                        result = setting_value
                    }

                    if(available_sorts.indexOf(result) == -1) {
                        return 'asc'
                    }

                    return result
                })(),
            },
            {
                'name': 'ui.lottie_sticker_animations',
                'type': 'bool',
                'default_value': '1',
                'value': window.site_params.get('ui.lottie_sticker_animations'),
            },
            {
                'name': 'ux.show_reg',
                'type': 'bool',
                'default_value': '0',
                'value': window.site_params.get('ux.show_reg'),
            },
            {
                'name': 'ui.cover_upper',
                'type': 'string',
                'default_value': '0',
                'value': window.site_params.get('ui.cover_upper'),
            },
            {
                'name': 'ui.header_name',
                'type': 'string',
                'default_value': window.consts.NAME,
                'value': window.site_params.get('ui.header_name'),
            },
            {
                'name': 'debug.sandbox_saved',
                'type': 'string',
                'default_value': window.consts.DEBUG_SANDBOX_DEFAULT_CODE,
                'value': window.site_params.get('debug.sandbox_saved'),
            },
            // ui!
            {
                'name': 'ui.hide_imagestatus',
                'type': 'bool',
                'default_value': '0',
                'value': window.site_params.get('ui.hide_imagestatus'),
            },
            {
                'name': 'ui.strabismus',
                'type': 'bool',
                'default_value': '0',
                'value': window.site_params.get('ui.strabismus'),
            },
            {
                'name': 'ui.smooth',
                'type': 'bool',
                'default_value': '0',
                'value': window.site_params.get('ui.smooth'),
            },
            {
                'name': 'ui.round_avatars',
                'type': 'bool',
                'default_value': '0',
                'value': window.site_params.get('ui.round_avatars'),
            },
            {
                'name': 'ui.accent_color',
                'type': 'string',
                'default_value': '#3a79c2',
                'value': window.site_params.get('ui.accent_color'),
            },
        ]
    }

    getItem(name) 
    {
        const item = this.settings_list.find(item => item.name == name)
        if(!item) {
            return
        }

        return new SettingsItem(item)
    }

    resetAllSettings() {
        this.settings_list.forEach(setting => {
            setting = new SettingsItem(setting)
            setting.reset()
    
            this.refresh()
        })
    }

    isEnabledProxy() {
        
    }
}

class SettingsItem {
    constructor(item) {
        this.info = item
    }

    getName() {
        return this.info.name
    }

    getType() {
        return this.info.type
    }

    getDefault() {
        return this.info.default_value
    }

    getValue() {
        return this.info.value ?? this.getDefault()
    }

    isEqual(val = '0') {
        return this.getValue() == val
    }

    isChecked() {
        if(this.getType() != 'bool') {
            return false
        }

        return this.getValue() == '1'
    }

    setValue(val = '0') {
        console.info(`SettingsManager | ${this.getName()} was changed to "${val}"`)
        window.site_params.set(this.getName(), val)

        window.settings_manager.refresh()
    }

    reset() {
        window.site_params.set(this.getName(), this.getDefault())
    }
}
