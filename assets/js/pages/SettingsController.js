window.controllers['SettingsController'] = (function() {
    return {
        Settings: function() {
            const section = window.main_class['hash_params'].section ?? 'common'
            main_class.changeTitle(_('settings.settings_' + section), _('settings.settings'))
    
            u('.page_content').html(window.templates.two_blocks_grid())
            u('.page_content .layer_two_columns_content').html(`<div class='settings_wrapper'></div>`)
            u('.page_content .layer_two_columns_tabs').html(`
                <div class='settings_tabs tabs flex flex_column horizontal_tabs'>
                    <a href='#settings/common' data-section='common'>${_('settings.settings_common')}</a>
                    <a href='#settings/content' data-section='content'>${_('settings.settings_content')}</a>
                    <a href='#settings/ui' data-section='ui'>${_('settings.settings_ui')}</a>
                    ${section == 'tweaks' ? `<a href='#settings/tweaks' data-section='tweaks'>${_('settings.settings_tweaks')}</a>` : ''}
                </div>
            `)
            u(`.settings_tabs a[data-section='${section}']`).addClass('selected')
    
            switch(section) {
                default:
                case 'ui':
                    window.controllers['SettingsController'].SettingsSectionUi()
                    break
                case 'tweaks':
                    window.controllers['SettingsController'].SettingsSectionTweaks()
                    break
                case 'common':
                    window.controllers['SettingsController'].SettingsSectionCommon()

                    u('.settings_block').on('click', '#_reset_all_settings', (e) => {
                        const msg = new MessageBox(_('settings.reset_settings_action'), _('settings.reset_settings_action_description'), [_('messagebox.no') + '|primary', _('messagebox.yes')], [() => {
                            msg.close()
                        }, () => {
                            msg.close()
                            
                            window.settings_manager.resetAllSettings()
                            setTimeout(() => {window.router.restart('common', 'ignore_menu')}, 50)
                        }])
                    })
                    break
                case 'content':
                    window.controllers['SettingsController'].SettingsSectionContent()
                    break
            }
    
            switch(section) {
                case 'common':
                case 'content':
                case 'ui':
                    u(`.settings_block input[type='checkbox']`).on('change', (e) => {
                        window.settings_manager.getItem(e.target.dataset.sett).setValue(Number(e.target.checked))
                        
                        if(e.target.dataset.reload == '1') {
                            setTimeout(() => {window.router.restart('common', 'ignore_menu')}, 50)
                        }
                                                
                        if(e.target.dataset.cssreload == '1') {
                            u('#_css_settings').html(window.templates.css_settings())
                        }
                    })
                    
                    u(`.settings_block select`).on('change', (e) => {
                        window.settings_manager.getItem(e.target.dataset.sett).setValue(e.target.value)
                    })
                    
                    u(`.settings_block input[type='radio']`).on('click', (e) => {
                        window.settings_manager.getItem(e.target.dataset.sett).setValue(u(`input[type='radio'][data-sett='${e.target.dataset.sett}']:checked`).attr('value'))
                    })
    
                    u(`.settings_block input[type='text']`).on('change', (e) => {
                        window.settings_manager.getItem(e.target.dataset.sett).setValue(u(`input[type='text'][data-sett='${e.target.dataset.sett}']`).nodes[0].value)
                        
                        if(e.target.dataset.reload == '1') {
                            setTimeout(() => {window.router.restart('common', 'ignore_menu')}, 50)
                        }

                        if(e.target.dataset.cssreload == '1') {
                            u('#_css_settings').html(window.templates.css_settings())
                        }
                    })

                    u(`.settings_block input[type='color']`).on('input', (e) => {
                        window.settings_manager.getItem(e.target.dataset.sett).setValue(u(`input[type='color'][data-sett='${e.target.dataset.sett}']`).nodes[0].value)
                        
                        if(e.target.dataset.reload == '1') {
                            setTimeout(() => {window.router.restart('common', 'ignore_menu')}, 50)
                        }

                        if(e.target.dataset.cssreload == '1') {
                            u('#_css_settings').html(window.templates.css_settings())
                        }
                    })
                    
                    break
            }
        },

        SettingsSectionContent: function() {
            u('.page_content .layer_two_columns_content .settings_wrapper').html(window.templates._settings_content())
        },

        SettingsSectionCommon: function() {
            u('.page_content .layer_two_columns_content .settings_wrapper').html(window.templates._settings_common())
        },

        SettingsSectionUi: function() {
            const currentTheme = Theme.getInstalledTheme()
    
            u('.page_content .settings_wrapper').html(`
            <div class='settings_block bordered_block padding'>
                <div class='bordered_block_name flex align_normal justify_space_between no_border nopadding'>
                    <span>${_('settings_ui.settings_ui')}</span>
                    <div class='additional_buttons'>
                        <a href='#settings/tweaks'><input class='primary' type='button' value='${_('settings_ui.css_settings')}'></a>
                    </div>
                </div>

                ${window.templates._settings_ui()}

                <div class='settings_block_tweaks'>
                    <b>${_('settings_ui.themes')}</b>
                    <div id='themes_block_insert'></div>
                </div>
            </div>
            `)

            window.themes.forEach(theme => {
                const installable = currentTheme.id != theme.info.id
                u('.page_content .settings_wrapper #themes_block_insert').append(`
                <div class='theme_block ${installable ? 'installable' : ''}'>
                    <div class='theme_preview'>
                        ${theme.getPreview() ?? 'np'}
                        ${installable ? `<input type='button' class='dark' id='_theme_install' data-id='${theme.getId()}' value='${_('settings_ui.install_theme')}'>` : ''}
                    </div>

                    <div class='flex flex_column'>
                        <b>${theme.getName()}</b>
                        <span>${_('settings_ui.from_author', theme.getAuthor())}</span>
                    </div>
                </div>
                `)

                if(installable) {
                    u('.settings_wrapper').on('click', `#_theme_install[data-id='${theme.getId()}']`, (e) => {
                        const result = theme.install()

                        if(result) {
                            if(theme.isInheritsDefault() && !theme.isRequiresJS()) {
                                u(`link[data-from='theme']`).remove()
                                theme.getStylesList().forEach(style => {
                                    Utils.append_style(style, 'theme')
                                })

                                window.router.restart()
                            } else {
                                window.router.hardRestart()
                            }
                        }
                    })
                }
            })
        },
        SettingsSectionTweaks: function() {
            u('.page_content .settings_wrapper').html(`
                <div class='settings_block bordered_block padding'>
                    <div style='padding:0px;' class='bordered_block_name flex align_normal justify_space_between no_border'>
                        <span>${_('settings_ui.css_settings')}</span>
                    </div>
                    
                    <div class='settings_sublock'>
                        <textarea style='height: 248px;' id='_custom_css' placeholder='${_('settings.please_enter')}'>${window.site_params.get('ui.custom_css') ?? ''}</textarea>
                    </div>
                </div>
            `)

            u('#_custom_css').on('input', (e) => {
                window.site_params.set('ui.custom_css', e.target.value)
                u('#_customcss').nodes[0].innerHTML = e.target.value
            })
        }
    }
})()