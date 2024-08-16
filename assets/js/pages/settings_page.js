window.pages['settings_page'] = new class {
    async render_page() 
    {
        const section = window.main_class['hash_params'].section ?? 'ux'

        main_class.changeTitle(_('settings.settings_' + section), _('settings.settings'))

        u('.page_content').html(`
            <div class='default_wrapper'>
                <div class='bordered_block'>
                    <div class='settings_tabs tabs'>
                        <a href='#settings/ux' data-section='ux' ${section == 'ux' ? `class='selected'` : ''}>${_('settings.settings_ux')}</a>
                        <a href='#settings/themes' data-section='themes' ${section == 'themes' ? `class='selected'` : ''}>${_('settings.settings_themes')}</a>
                        ${section == 'tweaks' ? `<a href='#settings/tweaks' data-section='tweaks' class='selected'>${_('settings.settings_tweaks')}</a>` : ''}
                        <a href='#settings/language' data-section='language' ${section == 'language' ? `class='selected'` : ''}>${_('settings.settings_language')}</a>
                        ${section == 'navigation' ? `<a href='#settings/navigation' data-section='navigation' class='selected'>${_('settings.settings_navigation')}</a>` : ''}
                        <a href='#settings/accounts' data-section='accounts' ${section == 'accounts' ? `class='selected'` : ''}>${_('settings.settings_accounts')}</a>
                    </div>
                    <div class='settings_wrapper'></div>
                </div>
            </div>
        `)
    
        switch(section) {
            default:
            case 'themes':
                const currentTheme = Theme.getInstalledTheme()

                u('.page_content .settings_wrapper').html(`
                <div class='settings_block'>
                    <div class='settings_sublock'>
                        <div class='settings_buttons'>
                            <b class='settings_title'>${_('settings_ui.themes')}</b>

                            <div class='additional_buttons'>
                                <a href='#settings/tweaks'><input type='button' value='${_('settings_ui.css_settings')}'></a>
                            </div>
                        </div>
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
                            ${installable ? `<input type='button' id='_theme_install' data-id='${theme.getId()}' value='${_('settings_ui.install_theme')}'>` : ''}
                        </div>

                        <div class='flex_column'>
                            <b style='height: 15px;'>${theme.getName()}</b>
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

                break
            case 'tweaks':    
                u('.page_content .settings_wrapper').html(`
                    <div class='settings_block'>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('settings_ui.settings_custom_css')}</b></p>
                            <textarea id='_custom_css' placeholder='${_('settings.please_enter')}'>${window.site_params.get('ui.custom_css') ?? ''}</textarea>
                            <b>${_('settings_ui.settings_ui_tweaks')}</b>
                            <div class='tweaks_insert'></div>
                        </div>
                    </div>
                `)

                window.tweaks.forEach(tweak => {
                    u('.tweaks_insert').append(`
                        <label>
                            <input type='checkbox' data-name='${tweak.name}' name='tweak_toggle' ${(window.site_params.get('ui.custom_css') ?? '').indexOf(tweak.code) != -1 ? 'checked' : ''}>
                            ${_(tweak.name).escapeHtml()}
                        </label>
                    `)

                    u(`.settings_block input[data-name='${tweak.name}']`).on('change', (e) => {
                        if(e.target.checked) {
                            u('textarea#_custom_css').nodes[0].value += tweak.code
                        } else {
                            u('textarea#_custom_css').nodes[0].value = u('textarea').nodes[0].value.removePart(tweak.code)
                        }

                        u('.settings_block textarea#_custom_css').trigger('input')
                    })
                })
    
                u('#_custom_css').on('input', (e) => {
                    window.site_params.set('ui.custom_css', e.target.value)
                    u('#_customcss').nodes[0].innerHTML = e.target.value
                })

                break
            case 'navigation':
                let selected_tab = ''
                window.edit_mode = false

                u('.page_content .settings_wrapper').html(window.templates._settings_nav())
                
                function rebuild_menu(editing = false, change_mode = true) {
                    let menu_html = ''

                    if(!editing) {
                        if(change_mode) {
                            u('#__menupostedit').addClass('hidden')
                            u('.navigation').removeClass('editing')
                        }

                        menu_html = window.left_menu.getHTML()
                    } else {
                        if(change_mode) {
                            u('#__menupostedit').removeClass('hidden')
                            u('.navigation').addClass('editing')
                        }

                        window.left_menu.list.forEach(tab => {
                            if(!tab) {
                                return
                            }

                            let temp_name = tab.name
                            let is_selected = selected_tab ? tab.href == selected_tab.info.href : false

                            if(!editing && tab.hidden) {
                                return
                            }
                
                            if(!editing && tab.name[0] == '_') {
                                temp_name = _(tab.name.substr(1))
                            }            

                            menu_html += `
                                <a data-orighref='${tab.href}' href='${tab.href}' ${tab.new_page ? `target='_blank'` : ''} class='${is_selected ? 'editing' : ''} ${tab.disabled ? `stopped` : ''}'>${temp_name}</a>
                            `
                        })
                    }

                    u('.navigation').html(menu_html)
                }

                window.edit_mode = true
                rebuild_menu(window.edit_mode, true)

                u('#__menupostedit #_resetdef').on('click', (e) => {
                    window.left_menu.reset()

                    rebuild_menu(true)
                })

                u('#__menupostedit #_addnav').on('click', (e) => {
                    window.left_menu.append()

                    rebuild_menu(true)
                })
                
                u('#__menupostedit #_delnav').on('click', (e) => {
                    const next_item = window.left_menu.deleteItem(selected_tab)
                    rebuild_menu(true)

                    if(next_item) {
                        u(`.navigation.editing a[data-orighref='${next_item.href}']`).trigger('click')
                    }
                })
                                
                u('#__menupostedit #_upnav').on('click', (e) => {
                    window.left_menu.moveItem(selected_tab, 'up')
                    rebuild_menu(true)

                    u(`.navigation.editing a[data-orighref='${selected_tab.href}']`).addClass('editing')
                })

                u('#__menupostedit #_downnav').on('click', (e) => {
                    window.left_menu.moveItem(selected_tab, 'down')
                    rebuild_menu(true)

                    u(`.navigation.editing a[data-orighref='${selected_tab.href}']`).addClass('editing')
                })

                u(document).on('click', '.navigation.editing a', (e) => {
                    u('.navigation.editing a.editing').removeClass('editing')
                    e.target.classList.toggle('editing')

                    const tab = window.left_menu.findItem(e.target.dataset.orighref)

                    selected_tab = new LeftMenuItem(tab)
                    
                    u('#__menupostedittab').removeClass('hidden')
                    u('#__menupostedittab #_leftmenu_text').nodes[0].value = selected_tab.info.name
                    u('#__menupostedittab #_leftmenu_href').nodes[0].value = selected_tab.info.href
                    u('#__menupostedittab #_leftmenu_anchor').nodes[0].value = selected_tab.info.anchor ?? ''
                    u('#__menupostedittab #_leftmenu_newpage').nodes[0].checked = selected_tab.info.new_page
                    u('#__menupostedittab #_leftmenu_disabled').nodes[0].checked = selected_tab.info.disabled
                    u('#__menupostedittab #_leftmenu_hidden').nodes[0].checked = selected_tab.info.hidden
                    u('#__movement_buttons').nodes[0].style.display = 'block'
                })

                u('#__menupostedittab input').on('input', (e) => {
                    selected_tab.info.name = u('#__menupostedittab #_leftmenu_text').nodes[0].value
                    selected_tab.info.href = u('#__menupostedittab #_leftmenu_href').nodes[0].value
                    selected_tab.info.anchor = u('#__menupostedittab #_leftmenu_anchor').nodes[0].value
                    selected_tab.info.new_page = u('#__menupostedittab #_leftmenu_newpage').nodes[0].checked
                    selected_tab.info.disabled = u('#__menupostedittab #_leftmenu_disabled').nodes[0].checked
                    selected_tab.info.hidden = u('#__menupostedittab #_leftmenu_hidden').nodes[0].checked

                    window.left_menu.list[window.left_menu.list.indexOf(selected_tab)] = selected_tab
                    window.left_menu.save()

                    rebuild_menu(true)
                    u(`.navigation.editing a[data-orighref='${selected_tab.href}']`).addClass('editing')
                })

                break
            case 'ux':
                u('.page_content .settings_wrapper').html(window.templates._settings_common())

                u(`.settings_block input[type='checkbox']`).on('change', (e) => {
                    window.site_params.set(e.target.dataset.sett, Number(e.target.checked))
                    
                    if(e.target.dataset.reload == '1') {
                        setTimeout(() => {window.router.restart('ux', 'ignore_menu')}, 50)
                    }
                })
                
                u(`.settings_block select`).on('change', (e) => {
                    window.site_params.set(e.target.dataset.sett, e.target.value)
                })
                
                u(`.settings_block input[type='radio']`).on('click', (e) => {
                    window.site_params.set(e.target.dataset.sett, u(`input[type='radio'][data-sett='${e.target.dataset.sett}']:checked`).attr('value'))
                })

                u(`.settings_block input[type='text']`).on('change', (e) => {
                    window.site_params.set(e.target.dataset.sett, u(`input[type='text'][data-sett='${e.target.dataset.sett}']`).nodes[0].value)
                })

                break
            case 'language':
                u('.page_content .settings_wrapper').html(`
                    <div class='settings_block'>
                        <div class='settings_sublock settings_flex'></div>
                    </div>
                `)
    
                window.langs.forEach(lang => {
                    if(!lang.lang_info) {
                        return
                    }

                    u('.settings_flex').append(`
                        <label class='lang_block'>
                            <input name='_lang' ${window.lang.lang_info.short_name == lang.lang_info.short_name ? 'checked' : ''} value='${lang.lang_info.short_name}' type='radio'>
                            <span>${Utils.escape_html(lang.lang_info.native_name)}</span>
                            
                            <div class='lang_info'>
                                <p>${Utils.escape_html(lang.lang_info.eng_name)}</p>
                                <p>${_('settings_language.lang_author')}: ${Utils.escape_html(lang.lang_info.author)}</p>
                            </div>
                        </label>
                        `
                    )
    
                    u('input[name="_lang"]').on('click', () => {
                        window.site_params.set('lang', u('input[name="_lang"]:checked').attr('value'))
                        window.lang = null
                        window.lang = !window.site_params.get('lang') ? window.langs.find(item => item.lang_info.short_name == 'ru') : window.langs.find(item => item.lang_info.short_name == window.site_params.get('lang'))
                        
                        setTimeout(() => {window.router.restart('language', 'ignore_menu')}, 50)
                    })
                })
    
                break
            case 'accounts':
                u('.page_content .bordered_block').append(`
                    <div class='settings_block'>
                        <div class='settings_buttons'>
                            <span><b id='_accs_count'>${_('settings_accounts.accounts_count', window.accounts.getAccountsCount())}</b></span>
    
                            <div class='additional_buttons'>
                                ${!window.site_params.has('active_account') ? '' : `<input type='button' id='_logoutacc' value='${_('settings_accounts.accounts_logout')}'>`}
                                <a href='#login'><input type='button' value='${_('settings_accounts.accounts_add')}'></a>
                            </div>
                        </div>
                        <div class='settings_accounts'></div>
                    </div>
                `)

                window.accounts.getAccounts().forEach(acc => {
                    u('.settings_accounts').append(`
                        <div class='settings_account' data-number='${Utils.cut_string(acc.token, 10)}'>
                            <div class='settings_account_avatar'>
                                <a href='#id${acc.info.id}'>
                                    <object class='outliner' type="image/jpeg" data='${acc.info.photo_200}'>
                                        <div class='placeholder'></div>
                                    </object>
                                </a>
                            </div>
                            <div class='settings_account_info'>
                                <a data-ignore='1' href='#id${acc.info.id}'>${Utils.escape_html(acc.info.first_name + ' ' + acc.info.last_name)}</a>

                                <div>
                                    <span class='grayer'>${Utils.escape_html(acc.path)} |</span>
                                    <span class='grayer'>${Utils.escape_html(acc.info.phone)}</span>
                                </div>
                            </div>
                            <div class='settings_account_actions'>
                                ${!window.active_account || window.active_account.token != acc.token ? `<input type='button' data-token='${acc.token}' id='_enteracc' value='${_('settings_accounts.accounts_set_default')}'>` : ''}
                            </div>
                        </div>
                    `
                    )

                    u(`.settings_accounts .settings_account[data-number='${Utils.cut_string(acc.token, 10)}'] .settings_account_info a`).on('click', (e) => {
                        e.preventDefault()

                        let msg = new MessageBox(_('settings_accounts.edit'), `
                            <div class='flex_row settings_edit'>
                                <div class='settings_edit_avatar'>
                                    <object class='outliner' type="image/jpeg" data='${acc.info.photo_200}'>
                                        <div class='placeholder'></div>
                                    </object>
                                </div>

                                <div class='flex_column settings_params'>
                                    <div class='flex_column'>    
                                        <input type='text' placeholder='${_('user_page.first_name')}' id='_set_first' value='${Utils.escape_html(acc.info.first_name)}'>
                                        <input type='text' placeholder='${_('user_page.last_name')}' id='_set_last' value='${Utils.escape_html(acc.info.last_name)}'>
                                    </div>

                                    <div class='flex_column'>
                                        <input type='text' placeholder='${_('auth.path_to_api')}' id='_set_path' value='${Utils.escape_html(acc.path)}'>
                                        <input type='text' id='_token_hider' disabled placeholder='${_('auth.vk_api_token')}' value='${acc.token}'>
                                    </div>
                                </div>
                            </div>
                        `, [_('messagebox.cancel'), _('settings_accounts.delete'), _('messagebox.save')], [() => {msg.close()}, () => {
                            let msg2 = new MessageBox('?', `
                                ${_('settings_accounts.sure_deleting')}
                            `, [_('messagebox.no'), _('messagebox.yes')], [() => {
                                msg2.close()
                            }, () => {
                                acc.remove()
                                
                                u(`.settings_accounts .settings_account[data-number='${Utils.cut_string(acc.token, 10)}']`).remove()
                                u('#_accs_count').nodes[0].innerHTML = _('settings_accounts.accounts_count', window.accounts.getAccountsCount())

                                msg.close()
                                msg2.close()

                                if(window.active_account && window.active_account.token == acc.token) {
                                    window.site_params.delete('active_account')
                                    window.vk_api = null
                                    window.router.restart('accounts', 'ignore_menu')
                                }
                            }])
                        }, () => {
                            acc.edit(u('#_set_first').nodes[0].value, u('#_set_last').nodes[0].value, u('#_set_path').nodes[0].value)
                            
                            let mainer = document.querySelector(`.settings_accounts .settings_account[data-number='${Utils.cut_string(acc.token, 10)}']`)
                            mainer.querySelector(`.settings_account_info a`).innerHTML = Utils.escape_html(u('#_set_first').nodes[0].value + ' ' + u('#_set_last').nodes[0].value)
                            mainer.querySelector(`.settings_account_info span`).innerHTML = u('#_set_path').nodes[0].value + ' | '

                            msg.close()
                        }])
                    })
                })

                u('.settings_accounts').on('click', '#_enteracc', (e) => {
                    if(window.site_params.get('active_account') == e.currentTarget.dataset.token) {
                        return
                    }

                    window.accounts.setActiveAccount(e.currentTarget.dataset.token)
                    window.cache.clearAllStores()
                    window.main_class.counters = null

                    window.router.restart('accounts', 'ignore_menu')
                })

                u('#_logoutacc').on('click', (e) => {
                    window.site_params.delete('active_account')
                    window.vk_api = null
                    window.main_class.counters = null
                    
                    window.router.restart('accounts', 'ignore_menu')
                })

                break
        }
    }
}
