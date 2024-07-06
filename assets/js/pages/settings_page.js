window.tweaks = [
    {
        'name': 'settings_ui_tweaks.vk_like_padding',
        'internal_name': 'Remove page padding',
        'author': 'litewk',
        'code': `/* Remove page padding */
.wrapper {
    padding: unset !important;
}

.wrapper .menu {
    background: var(--main-elements-color);
    height: 100%;
    width: 156px;
    border-left: unset !important;
    border-right: 1px solid var(--main-text-lighter-color);
    position: fixed;
}

.to_the_sky {
    display: none;
}

`,
    },
    {
        'name':  'settings_ui_tweaks.transitions_everywhere',
        'internal_name': 'Transitions everywhere',
        'code': `/* Transitions everywhere */
* {
    transition: 200ms all ease-in;
}

textarea {
    transition: unset !important;
}

`,
    },
    {
        'name': 'settings_ui_tweaks.round_avatars',
        'internal_name': 'Round avatars',
        'code': `/* Round avatars */
.avatar img {
    border-radius: 21px;
}

`
    },
    {
        'name': 'settings_ui_tweaks.highlight_friends',
        'internal_name': 'Highlight friends',
        'code': `/* Friends highlighter */
.friended {
    color: var(--main-friendly-color);
}

`
    },
    {
        'name': 'settings_ui_tweaks.hide_onliner',
        'internal_name': 'Hide online square',
        'code': `/* Hide online square */
.onliner::before {
    display: none;
}
  
`
    },
    {
        'name': 'settings_ui_tweaks.hide_counters',
        'internal_name': 'Hide counters in navigation',
        'code': `/* Hide counters in navigation */
.counter {
    display: none;   
}        
`
    }
]

window.page_class = new class {
    async render_page(section = null) 
    {
        if(section == null) {
            section = window.main_class['hash_params'].section ?? 'ui'
        }

        document.title = _('settings.settings_' + section)

        $('.page_content')[0].innerHTML = ''
        $('.page_content')[0].insertAdjacentHTML('beforeend', `
            <div style='padding: 19px 28px 0px 26px;'>
                <div class='bordered_block'>
                    <div class='tabs'>
                        <a data-section='ui' ${section == 'ui' ? `class='selectd'` : ''}>${_('settings.settings_ui')}</a>
                        <a data-section='ux' ${section == 'ux' ? `class='selectd'` : ''}>${_('settings.settings_ux')}</a>
                        <a data-section='language' ${section == 'language' ? `class='selectd'` : ''}>${_('settings.settings_language')}</a>
                        <a data-section='accounts' ${section == 'accounts' ? `class='selectd'` : ''}>${_('settings.settings_accounts')}</a>
                        <a data-section='debug' ${section == 'debug' ? `class='selectd'` : ''}>${_('settings.settings_debug')}</a>
                        <a data-section='about' ${section == 'about' ? `class='selectd'` : ''}>${_('settings.settings_about')}</a>
                    </div>
                </div>
            </div>
        `)
    
        $('.tabs a').on('click', (e) => {
            if(window.edit_mode) {
                return
            }

            this.render_page(e.target.dataset.section)
            window.s_url.hash = 'settings/' + e.target.dataset.section
            push_state(window.s_url)
        })
    
        switch(section) {
            default:
            case 'ui':
                let selected_tab = ''
                window.edit_mode = false
                
                $('.page_content .bordered_block')[0].insertAdjacentHTML('beforeend', `
                    <div class='settings_block'>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('settings_ui.settings_custom_css')}</b></p>
                            <textarea id='_custom_css' placeholder='${_('settings.please_enter')}'>${window.site_params.get('ui.custom_css') ?? ''}</textarea>
                            <b>${_('settings_ui.settings_ui_tweaks')}</b>
                            <div class='tweaks_insert'></div>
                        </div>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('settings_ui.settings_ui_left_menu')}</b></p>
                            ${!window.active_account ? _('settings_ui.settings_ui_left_authorize') : 
                            `
                                <div>
                                    <input type='button' id='_editnav' value='${_('settings_ui.settings_ui_left_menu_start_edit')}'>
                                </div>
                            `}
                            <div id='__menupostedit' class='hidden' style='margin-top: 5px;'>
                                <div>
                                    <input type='button' id='_resetdef' value='${_('settings_ui.settings_ui_left_reset_default')}'>
                                    <input type='button' id='_addnav' value='${_('settings_ui.settings_ui_left_add')}'>
                                </div>
                                
                                <span>${_('settings_ui.settings_ui_left_click_tip')}</span>
                                
                                <div id='__menupostedittab' class='hidden' data-tab=''>
                                    <table>
                                    <tbody>
                                        <tr>
                                            <td>${_('settings_ui.settings_ui_left_text')}</td>
                                            <td>
                                                <input type='text' id='_leftmenu_text'>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                ${_('settings_ui.settings_ui_i18n_tip')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>${_('settings_ui.settings_ui_left_href')}</td>
                                            <td>
                                                <input type='text' id='_leftmenu_href'>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>${_('settings_ui.settings_ui_left_new_page')}</td>
                                            <td>
                                                <input type='checkbox' id='_leftmenu_newpage'>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>${_('settings_ui.settings_ui_left_disabled')}</td>
                                            <td>
                                                <input type='checkbox' id='_leftmenu_disabled'>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>${_('settings_ui.settings_ui_left_hidden')}</td>
                                            <td>
                                                <input type='checkbox' id='_leftmenu_hidden'>
                                            </td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>

                                <div id='__movement_buttons' style='display:none;'>
                                    <input type='button' id='_delnav' value='${_('settings_ui.settings_ui_left_delete')}'>
                                    <input type='button' id='_upnav' value='${_('settings_ui.settings_ui_left_up')}'>
                                    <input type='button' id='_downnav' value='${_('settings_ui.settings_ui_left_down')}'>
                                </div>
                            </div>
                        </div>
                    </div>
                `)

                window.tweaks.forEach(tweak => {
                    $('.tweaks_insert')[0].insertAdjacentHTML('beforeend', `
                        <label>
                            <input type='checkbox' data-name='${tweak.name}' name='tweak_toggle' ${(window.site_params.get('ui.custom_css') ?? '').indexOf(tweak.code) != -1 ? 'checked' : ''}>
                            ${escape_html(_(tweak.name))}
                        </label>
                    `)

                    $(`input[data-name='${tweak.name}']`).on('change', (e) => {
                        if(e.target.checked) {
                            $('textarea#_custom_css')[0].value += tweak.code
                        } else {
                            $('textarea#_custom_css')[0].value = $('textarea')[0].value.replace(tweak.code, '')
                        }

                        $('textarea#_custom_css').trigger('input')
                    })
                })
    
                $('#_custom_css').on('input', (e) => {
                    window.site_params.set('ui.custom_css', e.target.value)
                    $('#_customcss')[0].innerHTML = e.target.value
                })

                // MENU EDITOR

                function rebuild_menu(editing = false) {
                    let menu_html = ''
                    window.left_menu.forEach(tab => {
                        let tempname = tab.name
                        if(!editing && tab.hidden) {
                            return
                        }
            
                        if(!editing && tab.name[0] == '_') {
                            tempname = _(tab.name.substr(1))
                        }            
            
                        menu_html += `
                            <a data-orighref='${tab.href}' href='${tab.href}' ${tab.new_page ? `target='_blank'` : ''} ${tab.disabled ? `class='stopped'` : ''}>${tempname}</a>
                        `
                    })

                    $('.menu')[0].innerHTML = menu_html
                }

                $('#_editnav').on('click', (e) => {
                    if(window.edit_mode == true) {
                        window.edit_mode = false
                        e.target.value = _('settings_ui.settings_ui_left_menu_start_edit')
                        $('.menu')[0].classList.remove('editing')

                        rebuild_menu(false)
                        $('#__menupostedit')[0].classList.add('hidden')
                    } else {
                        window.edit_mode = true
                        e.target.value = _('settings_ui.settings_ui_left_menu_stop_edit')
                        $('.menu')[0].classList.add('editing')

                        rebuild_menu(true)
                        $('#__menupostedit')[0].classList.remove('hidden')
                    }
                })

                $('#__menupostedit #_resetdef').on('click', (e) => {
                    window.left_menu = window.default_left_menu.slice(0)

                    window.site_params.set('ui.left_menu', JSON.stringify(window.left_menu))
                    rebuild_menu(true)
                })

                $('#__menupostedit #_addnav').on('click', (e) => {
                    window.left_menu.push({
                        'name': 'replace_me',
                        'href': random_int(0, 1000),
                        'new_page': false,
                        'disabled': false,
                        'hidden': true,
                    })

                    window.site_params.set('ui.left_menu', JSON.stringify(window.left_menu))
                    rebuild_menu(true)
                })
                
                $('#__menupostedit #_delnav').on('click', (e) => {
                    let index = window.left_menu.indexOf(selected_tab)

                    window.left_menu = array_splice(window.left_menu, window.left_menu.indexOf(selected_tab))
                    window.site_params.set('ui.left_menu', JSON.stringify(window.left_menu))
                    rebuild_menu(true)
               
                    let maybe_tab = window.left_menu[index]

                    if(!maybe_tab) {
                        maybe_tab = window.left_menu[index - 1]
                    }

                    if(maybe_tab) {
                        $(`.menu.editing a[data-orighref='${maybe_tab.href}']`).trigger('click')
                    }
                })
                                
                $('#__menupostedit #_upnav').on('click', (e) => {
                    let index = window.left_menu.indexOf(selected_tab)

                    if(index <= 0) {
                        return
                    }

                    window.left_menu = array_swap(window.left_menu, index, index - 1)
                    window.site_params.set('ui.left_menu', JSON.stringify(window.left_menu))
                    rebuild_menu(true)

                    $(`.menu.editing a[data-orighref='${selected_tab.href}']`).addClass('editing')
                })

                $('#__menupostedit #_downnav').on('click', (e) => {
                    let index = window.left_menu.indexOf(selected_tab)

                    if(index >= window.left_menu.length - 1) {
                        return
                    }

                    window.left_menu = array_swap(window.left_menu, index, index + 1)
                    window.site_params.set('ui.left_menu', JSON.stringify(window.left_menu))
                    rebuild_menu(true)

                    $(`.menu.editing a[data-orighref='${selected_tab.href}']`).addClass('editing')
                })

                $(document).on('click', '.menu.editing a', (e) => {
                    $('.menu.editing a.editing').removeClass('editing')
                    e.target.classList.toggle('editing')
                    let tab = window.left_menu.find(el => el.href == e.target.dataset.orighref)

                    selected_tab = tab
                    $('#__menupostedittab')[0].classList.remove('hidden')
                    $('#__menupostedittab #_leftmenu_text')[0].value = tab.name
                    $('#__menupostedittab #_leftmenu_href')[0].value = tab.href
                    $('#__menupostedittab #_leftmenu_newpage')[0].checked = tab.new_page
                    $('#__menupostedittab #_leftmenu_disabled')[0].checked = tab.disabled
                    $('#__menupostedittab #_leftmenu_hidden')[0].checked = tab.hidden
                    $('#__movement_buttons')[0].style.display = 'block'
                })

                $('#__menupostedittab input').on('input', (e) => {
                    selected_tab.name = $('#__menupostedittab #_leftmenu_text')[0].value
                    selected_tab.href = $('#__menupostedittab #_leftmenu_href')[0].value
                    selected_tab.new_page = $('#__menupostedittab #_leftmenu_newpage')[0].checked
                    selected_tab.disabled = $('#__menupostedittab #_leftmenu_disabled')[0].checked
                    selected_tab.hidden = $('#__menupostedittab #_leftmenu_hidden')[0].checked

                    window.left_menu[window.left_menu.indexOf(selected_tab)] = selected_tab
                    window.site_params.set('ui.left_menu', JSON.stringify(window.left_menu))

                    rebuild_menu(true)

                    $(`.menu.editing a[data-orighref='${selected_tab.href}']`).addClass('editing')
                })

                break
            case 'ux':
                let date_val = window.site_params.get('ui.date_format') ?? 'default'
                $('.page_content .bordered_block')[0].insertAdjacentHTML('beforeend', `
                    <div class='settings_block'>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('settings_ui.settings_custom_js')}</b></p>
                            <span style='margin: -6px 0px 7px 0px;display: block;'>${_('settings_ui.settings_custom_js_tip')}</span>
                            <textarea id='_custom_js' placeholder='${_('settings.please_enter')}'>${window.site_params.get('ui.custom_js') ?? ''}</textarea>
                        </div>
                        <div class='settings_sublock settings_flex'>
                            <p class='settings_title'><b>${_('settings_ui.settings_date_format')}</b></p>
                            <label><input name='_date_format' ${date_val == 'default' ? 'checked' : ''} value='default' type='radio' data-sett='ui.date_format'>${_('settings_ui.settings_date_format_default')}</label>
                            <label><input name='_date_format' ${date_val == 'month' ? 'checked' : ''} value='month' type='radio' data-sett='ui.date_format'>${_('settings_ui.settings_date_format_day_month')}</label>
                        </div>
                        <div class='settings_sublock settings_flex'>
                            <p class='settings_title'><b>${_('settings_ux.settings_default_sort')}</b></p>
                            <select data-sett='ux.default_sort' style='width: min-content;'>
                                <option value='asc' ${window.site_params.get('ux.default_sort', 'asc') == 'asc' ? 'selected' : ''}>${_('wall.sort_old_first')}</option>
                                <option value='desc' ${window.site_params.get('ux.default_sort', 'asc') == 'desc' ? 'selected' : ''}>${_('wall.sort_new_first')}</option>
                                <option value='smart' ${window.site_params.get('ux.default_sort', 'asc') == 'smart' ? 'selected' : ''}>${_('wall.sort_interesting_first')}</option>
                            </select>
                        </div>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('settings_ui.settings_ui_other')}</b></p>
                            <label>
                                <input type='checkbox' data-sett='ui.hide_image_statuses' ${window.site_params.get('ui.hide_image_statuses') == '1' ? 'checked' : ''}>
                                ${_('settings_ui.settings_hide_image_statuses')}
                            </label>
                            <label>
                                <input type='checkbox' data-sett='ux.save_scroll' ${window.site_params.get('ux.save_scroll', '0') == '1' ? 'checked' : ''}>
                                ${_('settings_ux.settings_save_hash_progress')}
                            </label>
                            <label>
                                <input type='checkbox' data-sett='ux.auto_scroll' ${window.site_params.get('ux.auto_scroll', '1') == '1' ? 'checked' : ''}>
                                ${_('settings_ux.settings_auto_scroll')}
                            </label>
                            <label>
                                <input type='checkbox' data-sett='ux.send_online' ${window.site_params.get('ux.send_online', '1') == '1' ? 'checked' : ''}>
                                ${_('settings_ux.settings_send_online')}
                            </label>
                            <label>
                                <input type='checkbox' data-sett='internal.use_proxy' ${window.site_params.get('internal.use_proxy', '0') == '1' ? 'checked' : ''}>
                                ${_('settings_ux.settings_use_proxy')}
                            </label>
                            <label>
                                <input type='checkbox' data-sett='ux.show_reg' ${window.site_params.get('ux.show_reg', '0') == '1' ? 'checked' : ''}>
                                ${_('settings_ux.settings_show_registration_date')}
                            </label>
                        </div>
                    </div>
                `)

                $(`.settings_block input[type='checkbox']`).on('change', (e) => {
                    window.site_params.set(e.target.dataset.sett, Number(e.target.checked))
                })
                
                $(`.settings_block select`).on('change', (e) => {
                    window.site_params.set(e.target.dataset.sett, e.target.value)
                })
                
                $(`.settings_block input[type='radio']`).on('click', (e) => {
                    window.site_params.set(e.target.dataset.sett, $(`input[type='radio'][data-sett='${e.target.dataset.sett}']:checked`).val())
                })

                $('#_custom_js').on('input', (e) => {
                    window.site_params.set('ui.custom_js', e.target.value)
                })

                break
            case 'language':
                $('.page_content .bordered_block')[0].insertAdjacentHTML('beforeend', `
                    <div class='settings_block'>
                        <div class='settings_sublock settings_flex'></div>
                    </div>
                `)
    
                window.langs.forEach(lang => {
                    if(!lang.lang_info) {
                        return
                    }

                    $('.settings_flex')[0].insertAdjacentHTML('beforeend', 
                        `
                        <label class='lang_block'>
                            <input name='_lang' ${escape_html(window.lang.lang_info.short_name == lang.lang_info.short_name ? 'checked' : '')} value='${lang.lang_info.short_name}' type='radio'>
                            <span>${escape_html(lang.lang_info.native_name)}</span>
                            
                            <div class='lang_info'>
                                <p>${escape_html(lang.lang_info.eng_name)}</p>
                                <p>${_('settings_language.lang_author')}: ${escape_html(lang.lang_info.author)}</p>
                            </div>
                        </label>
                        `
                    )
    
                    $('input[name="_lang"]').on('click', () => {
                        window.site_params.set('lang', $('input[name="_lang"]:checked').val())
                        window.lang = null
                        window.lang = !window.site_params.get('lang') ? window.langs.find(item => item.lang_info.short_name == 'ru') : window.langs.find(item => item.lang_info.short_name == window.site_params.get('lang'))
                        
                        setTimeout(() => {window.router.restart('language', 'ignore_menu')}, 50)
                    })
                })
    
                break
            case 'debug':
                $('.page_content .bordered_block')[0].insertAdjacentHTML('beforeend', `
                    <div class='settings_block'>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('settings_debug.settings_api_test')}</b></p>
                            <div id='_vkapiTest'>
                                <input type="text" style='width: 99%;' id='_methodName' placeholder='${_('settings_debug.settings_method_name')}'>
                                <input type="text" style='width: 99%;' id='_methodParams' placeholder='${_('settings_debug.settings_method_params')}' value='{}'>
                                <textarea style='width: 100%;height: 492px;' id='_result' placeholder='${_('settings_debug.settings_method_result')}'></textarea><br>
    
                                <div id='_vkapiButtons'>
                                    <input type="button" id='_unspace' value="${_('settings_debug.settings_method_unspacify')}">
                                    <input type="button" id='_clear' value="${_('settings_debug.settings_method_clear')}">
                                    <input type="button" id='_send' value="${_('settings_debug.settings_method_send')}">
                                </div>
                            </div>
                        </div>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('settings_debug.settings_cache')}</b></p>
                            <div class='settings_caches'>
                                <label>
                                    <input type='button' name='_clear_cache' data-tab='cities_cache' value='${_('settings_debug.settings_method_clear')}'>
                                    <span>${_('settings_debug.settings_cache_cities')}</span>
                                </label>
                            </div>
                            <div class='settings_caches'>
                                <label>
                                    <input type='button' name='_clear_cache' data-tab='clubs_cache' value='${_('settings_debug.settings_method_clear')}'>
                                    <span>${_('settings_debug.settings_cache_groups')}</span>
                                </label>
                            </div>
                            <div class='settings_caches'>
                                <input type='button' name='_export_localstorage' value='${_('settings_debug.settings_localstorage_download')}'>
                                <input type='button' name='_import_localstorage' value='${_('settings_debug.settings_localstorage_import')}'>
                            </div>
                        </div>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('settings_debug.settings_routing')}</b></p>

                            <input type='button' id='_restart_app' value='${_('settings_debug.settings_restart_app')}'>
                        </div>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('settings_ui.settings_ui_other')}</b></p>

                            <label>
                                <input type='checkbox' name='_useExecute' ${window.site_params.get('internal.use_execute', '1') == '1' ? 'checked' : ''}>
                                ${_('settings_debug.settings_use_execute')}
                            </label>
                        </div>
                    </div>
                `)
                
                $('.settings_block #_send').on('click', async (e) => {
                    if(!window.vk_api) {
                        add_error(_('not_authorized'), 'no_token', 5000, 'error')
                        return
                    }
    
                    let res = await window.vk_api.call($('#_methodName')[0].value, JSON.parse($('#_methodParams')[0].value))
                    $('#_result')[0].value = JSON.stringify(res, null, 4)
                })
    
                $('.settings_block #_clear').on('click', async (e) => {
                    $('#_result')[0].value = ''
                })
                    
                $('.settings_block #_restart_app').on('click', async (e) => {
                    window.router.restart()
                })
    
                $('.settings_block #_unspace').on('click', async (e) => {
                    $('#_result')[0].value = $('#_result')[0].value.replace(/\s+/g, '').replace(/\n\r/g, '')
                })
    
                $(`.settings_block input[name='_clear_cache']`).on('click', async (e) => {
                    localStorage.removeItem(e.target.dataset.tab)
                })
    
                $(`.settings_block input[name='_export_localstorage']`).on('click', async (e) => {
                    let encoded_localstorage = JSON.stringify(localStorage)
    
                    let tmp_a = document.createElement("a")
                    let file = new Blob([encoded_localstorage], {type: 'application/json'})
                    tmp_a.href = URL.createObjectURL(file)
                    tmp_a.download = "litewk_localstorage.txt"
                    tmp_a.click()
    
                    tmp_a = null
                })
    
                $(`.settings_block input[name='_import_localstorage']`).on('click', async (e) => {
                    let localstorage_import = JSON.parse(prompt(_('settings_debug.settings_localstorage_enter')))

                    if(!localstorage_import) {
                        return
                    }
                    
                    localStorage.clear()
    
                    Object.entries(localstorage_import).forEach(([key, value]) => {
                        localStorage.setItem(key, value)
                    })
    
                    window.router.restart()
                })

                $(document).on('change', 'input[name="_useExecute"]', () => {
                    window.site_params.set('internal.use_execute', Number($('input[name="_useExecute"]')[0].checked))
                })

                break
            case 'accounts':
                $('.page_content .bordered_block')[0].insertAdjacentHTML('beforeend', `
                    <div class='settings_block'>
                        <div class='settings_buttons'>
                            <span><b>${_('settings_accounts.accounts_count', window.accounts.getAccountsCount())}</b></span>
    
                            <div class='additional_buttons'>
                                ${!window.site_params.has('active_account') ? '' : `<input type='button' id='_logoutacc' value='${_('settings_accounts.accounts_logout')}'>`}
                                <a href='#login'><input type='button' value='${_('settings_accounts.accounts_add')}'></a>
                            </div>
                        </div>
                        <div class='settings_accounts'></div>
                    </div>
                `)

                window.accounts.getAccounts().forEach(acc => {
                    $('.settings_accounts')[0].insertAdjacentHTML('beforeend',
                    `
                        <div class='settings_account'>
                            <div class='settings_account_avatar'>
                                <a href='site_pages/user_page.html?id=${acc.vk_info.id}'>
                                    <img src='${acc.vk_info.photo_200}'>
                                </a>
                            </div>
                            <div class='settings_account_info'>
                                <a href='site_pages/user_page.html?id=${acc.vk_info.id}'>${escape_html(acc.vk_info.first_name + ' ' + acc.vk_info.last_name)}</a>

                                <div>
                                    <span class='grayer'>${acc.vk_path} |</span>
                                    <span class='grayer'>${escape_html(acc.vk_info.phone)}</span>
                                </div>
                            </div>
                            <div class='settings_account_actions'>
                                ${!window.active_account || window.active_account.vk_token != acc.vk_token ? `<input type='button' data-id='${acc.vk_token}' id='_enteracc' value='${_('settings_accounts.accounts_set_default')}'>` : ''}
                            </div>
                        </div>
                    `
                    )
                })

                $('.settings_accounts').on('click', '#_enteracc', (e) => {
                    if(Number(window.site_params.get('active_account')) == e.currentTarget.dataset.id) {
                        return
                    }

                    window.accounts.setActiveAccount(e.currentTarget.dataset.id)
                    window.router.restart('accounts', 'ignore_menu')

                    refresh_counters()
                })

                $('#_logoutacc').on('click', (e) => {
                    window.site_params.delete('active_account')
                    window.router.restart('accounts', 'ignore_menu')
                })

                break
            case 'about':
                window.open('https://github.com/udjhh/litewk/blob/main/README.md', '_blank').focus();
                
                break
        }
    }
}
