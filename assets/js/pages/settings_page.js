window.page_class = new class {
    async render_page(section = null) 
    {
        if(section == null) {
            section = window.main_class['hash_params'].section ?? 'ui'
        }

        document.title = _('settings.settings_' + section)
        $('.page_content')[0].innerHTML = `
            <div class='default_wrapper'>
                <div class='bordered_block'>
                    <div class='settings_tabs tabs'>
                        <a data-ignore='1' data-section='ui' ${section == 'ui' ? `class='selected'` : ''}>${_('settings.settings_ui')}</a>
                        <a data-ignore='1' data-section='ux' ${section == 'ux' ? `class='selected'` : ''}>${_('settings.settings_ux')}</a>
                        <a data-ignore='1' data-section='language' ${section == 'language' ? `class='selected'` : ''}>${_('settings.settings_language')}</a>
                        <a data-ignore='1' data-section='accounts' ${section == 'accounts' ? `class='selected'` : ''}>${_('settings.settings_accounts')}</a>
                        <a data-ignore='1' data-section='debug' ${section == 'debug' ? `class='selected'` : ''}>${_('settings.settings_debug')}</a>
                        <a data-ignore='1' data-section='about' ${section == 'about' ? `class='selected'` : ''}>${_('settings.settings_about')}</a>
                    </div>
                </div>
            </div>
        `
    
        $('.tabs a').on('click', (e) => {
            e.preventDefault()

            if(window.edit_mode) {
                return
            }

            location.hash = '#settings/' + e.target.dataset.section
            Utils.push_state(location.href)
            this.render_page(e.target.dataset.section)
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
                                            <td>${_('settings_ui.settings_ui_left_anchor')}</td>
                                            <td>
                                                <input type='text' id='_leftmenu_anchor'>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                ${_('settings_ui.settings_ui_anchor_tip')}
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
                            ${Utils.escape_html(_(tweak.name))}
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
                    window.left_menu.list.forEach(tab => {
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

                    $('.navigation')[0].innerHTML = menu_html
                }

                $('#_editnav').on('click', (e) => {
                    if(window.edit_mode == true) {
                        window.edit_mode = false

                        e.target.value = _('settings_ui.settings_ui_left_menu_start_edit')
                        $('.navigation')[0].classList.remove('editing')

                        rebuild_menu(false)
                        $('#__menupostedit')[0].classList.add('hidden')
                    } else {
                        window.edit_mode = true
                        e.target.value = _('settings_ui.settings_ui_left_menu_stop_edit')
                        $('.navigation')[0].classList.add('editing')

                        rebuild_menu(true)
                        $('#__menupostedit')[0].classList.remove('hidden')
                    }
                })

                $('#__menupostedit #_resetdef').on('click', (e) => {
                    window.left_menu.list = window.default_left_menu.slice(0)

                    window.site_params.set('ui.left_menu', JSON.stringify(window.left_menu.list))
                    rebuild_menu(true)
                })

                $('#__menupostedit #_addnav').on('click', (e) => {
                    window.left_menu.list.push({
                        'name': 'replace_me',
                        'href': Utils.random_int(0, 10000),
                        'new_page': false,
                        'disabled': false,
                        'hidden': true,
                        'anchor': '',
                    })

                    window.site_params.set('ui.left_menu', JSON.stringify(window.left_menu.list))
                    rebuild_menu(true)
                })
                
                $('#__menupostedit #_delnav').on('click', (e) => {
                    let index = window.left_menu.list.indexOf(selected_tab)

                    window.left_menu.list = Utils.array_splice(window.left_menu.list, window.left_menu.list.indexOf(selected_tab))
                    window.site_params.set('ui.left_menu', JSON.stringify(window.left_menu.list))
                    rebuild_menu(true)
               
                    let maybe_tab = window.left_menu.list[index]

                    if(!maybe_tab) {
                        maybe_tab = window.left_menu.list[index - 1]
                    }

                    if(maybe_tab) {
                        $(`.navigation.editing a[data-orighref='${maybe_tab.href}']`).trigger('click')
                    }
                })
                                
                $('#__menupostedit #_upnav').on('click', (e) => {
                    let index = window.left_menu.list.indexOf(selected_tab)

                    if(index <= 0) {
                        return
                    }

                    window.left_menu.list = Utils.array_swap(window.left_menu.list, index, index - 1)
                    window.site_params.set('ui.left_menu', JSON.stringify(window.left_menu.list))
                    rebuild_menu(true)

                    $(`.navigation.editing a[data-orighref='${selected_tab.href}']`).addClass('editing')
                })

                $('#__menupostedit #_downnav').on('click', (e) => {
                    let index = window.left_menu.list.indexOf(selected_tab)

                    if(index >= window.left_menu.list.length - 1) {
                        return
                    }

                    window.left_menu.list = Utils.array_swap(window.left_menu.list, index, index + 1)
                    window.site_params.set('ui.left_menu', JSON.stringify(window.left_menu.list))
                    rebuild_menu(true)

                    $(`.navigation.editing a[data-orighref='${selected_tab.href}']`).addClass('editing')
                })

                $(document).on('click', '.navigation.editing a', (e) => {
                    $('.navigation.editing a.editing').removeClass('editing')
                    e.target.classList.toggle('editing')

                    let tab = window.left_menu.list.find(el => el.href == e.target.dataset.orighref)

                    selected_tab = tab
                    $('#__menupostedittab')[0].classList.remove('hidden')
                    $('#__menupostedittab #_leftmenu_text')[0].value = tab.name
                    $('#__menupostedittab #_leftmenu_href')[0].value = tab.href
                    $('#__menupostedittab #_leftmenu_anchor')[0].value = tab.anchor ?? ''
                    $('#__menupostedittab #_leftmenu_newpage')[0].checked = tab.new_page
                    $('#__menupostedittab #_leftmenu_disabled')[0].checked = tab.disabled
                    $('#__menupostedittab #_leftmenu_hidden')[0].checked = tab.hidden
                    $('#__movement_buttons')[0].style.display = 'block'
                })

                $('#__menupostedittab input').on('input', (e) => {
                    selected_tab.name = $('#__menupostedittab #_leftmenu_text')[0].value
                    selected_tab.href = $('#__menupostedittab #_leftmenu_href')[0].value
                    selected_tab.anchor = $('#__menupostedittab #_leftmenu_anchor')[0].value
                    selected_tab.new_page = $('#__menupostedittab #_leftmenu_newpage')[0].checked
                    selected_tab.disabled = $('#__menupostedittab #_leftmenu_disabled')[0].checked
                    selected_tab.hidden = $('#__menupostedittab #_leftmenu_hidden')[0].checked

                    window.left_menu.list[window.left_menu.list.indexOf(selected_tab)] = selected_tab
                    window.site_params.set('ui.left_menu', JSON.stringify(window.left_menu.list))

                    rebuild_menu(true)

                    $(`.navigation.editing a[data-orighref='${selected_tab.href}']`).addClass('editing')
                })

                break
            case 'ux':
                let date_val = window.site_params.get('ui.date_format') ?? 'default'
                let online_val = window.site_params.get('ux.online_status') ?? 'none'
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
                            <p class='settings_title'><b>${_('settings_ux.settings_online_status')}</b></p>
                            <label><input name='_online_format' ${online_val == 'none' ? 'checked' : ''} value='none' type='radio' data-sett='ux.online_status'>${_('settings_ux.settings_send_online_none')}</label>
                            <label><input name='_online_format' ${online_val == 'method_call' ? 'checked' : ''} value='method_call' type='radio' data-sett='ux.online_status'>${_('settings_ux.settings_send_online_method_call')}</label>
                            <label><input name='_online_format' ${online_val == 'timeout' ? 'checked' : ''} value='timeout' type='radio' data-sett='ux.online_status'>${_('settings_ux.settings_send_online_timeout')}</label>
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
                            <p class='settings_title'><b>${_('settings_ux.settings_scrolling')}</b></p>
                            <label>
                                <input type='checkbox' data-sett='ux.save_scroll' ${window.site_params.get('ux.save_scroll', '0') == '1' ? 'checked' : ''}>
                                ${_('settings_ux.settings_save_hash_progress')}
                            </label>
                            <label>
                                <input type='checkbox' data-sett='ux.auto_scroll' ${window.site_params.get('ux.auto_scroll', '1') == '1' ? 'checked' : ''}>
                                ${_('settings_ux.settings_auto_scroll')}
                            </label>
                        </div>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('settings_ux.settings_user')}</b></p>
                            <label>
                                <input type='checkbox' data-sett='ux.show_reg' ${window.site_params.get('ux.show_reg', '0') == '1' ? 'checked' : ''}>
                                ${_('settings_ux.settings_show_registration_date')}
                            </label>
                            <label>
                                <select data-sett='ux.friends_block_sort'>
                                    <option value='hints'  ${window.site_params.get('ux.friends_block_sort', 'hints') == 'hints' ? 'selected' : ''}>${_('settings_ux.settings_friends_block_sort_rating')}</option>
                                    <option value='random' ${window.site_params.get('ux.friends_block_sort', 'random') == 'random' ? 'selected' : ''}>${_('settings_ux.settings_friends_block_sort_random')}</option>
                                </select>
                                ${_('settings_ux.settings_friends_block_sort')}
                            </label>
                        </div>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('user_page.cover')}</b></p>
                            <label>
                                <input name='_cover_upper' type='radio' value='0' data-sett='ui.cover_upper' ${window.site_params.get('ui.cover_upper', '0') == '0' ? 'checked' : ''}>
                                ${_('settings_ui_tweaks.show_cover_on_up')}
                            </label>
                            <label>
                                <input name='_cover_upper' type='radio' value='1' data-sett='ui.cover_upper' ${window.site_params.get('ui.cover_upper', '0') == '1' ? 'checked' : ''}>
                                ${_('settings_ui_tweaks.show_cover_from_name')}
                            </label>
                            <label>
                                <input name='_cover_upper' type='radio' value='2' data-sett='ui.cover_upper' ${window.site_params.get('ui.cover_upper', '0') == '2' ? 'checked' : ''}>
                                ${_('settings_ui_tweaks.show_cover_background')}
                            </label>
                            <label>
                                <input name='_cover_upper' type='radio' value='3' data-sett='ui.cover_upper' ${window.site_params.get('ui.cover_upper', '0') == '3' ? 'checked' : ''}>
                                ${_('settings_ui_tweaks.show_cover_no')}
                            </label>
                        </div>
                        
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('settings_ui.settings_ui_other')}</b></p>
                            <label>
                                <input type='checkbox' data-sett='internal.use_proxy' ${window.site_params.get('internal.use_proxy', '0') == '1' ? 'checked' : ''}>
                                ${_('settings_ux.settings_use_proxy')}
                            </label>
                            <label>
                                <input type='checkbox' data-sett='internal.use_execute' ${window.site_params.get('internal.use_execute', '1') == '1' ? 'checked' : ''}>
                                ${_('settings_debug.settings_use_execute')}
                            </label>
                            <label>
                                <input type='checkbox' data-sett='ux.twemojify' ${window.site_params.get('ux.twemojify', '1') == '1' ? 'checked' : ''}>
                                ${_('settings_ux.settings_format_emojis')}
                            </label>
                            <label>
                                <input type='checkbox' data-sett='ux.better_my_page' data-reload='1' ${window.site_params.get('ux.better_my_page', '0') == '1' ? 'checked' : ''}>
                                ${_('settings_ux.better_my_page')}
                            </label>
                            <label>
                                <input type='checkbox' data-sett='ux.hide_back_button' ${window.site_params.get('ux.hide_back_button', '0') == '1' ? 'checked' : ''}>
                                ${_('settings_ux.hide_back_button')}
                            </label>
                        </div>
                    </div>
                `)

                $(`.settings_block input[type='checkbox']`).on('change', (e) => {
                    window.site_params.set(e.target.dataset.sett, Number(e.target.checked))
                    
                    if(e.target.dataset.reload == '1') {
                        setTimeout(() => {window.router.restart('ux', 'ignore_menu')}, 50)
                    }
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
                            <input name='_lang' ${window.lang.lang_info.short_name == lang.lang_info.short_name ? 'checked' : ''} value='${lang.lang_info.short_name}' type='radio'>
                            <span>${Utils.escape_html(lang.lang_info.native_name)}</span>
                            
                            <div class='lang_info'>
                                <p>${Utils.escape_html(lang.lang_info.eng_name)}</p>
                                <p>${_('settings_language.lang_author')}: ${Utils.escape_html(lang.lang_info.author)}</p>
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
                                <input type='button' name='_export_localstorage' value='${_('settings_debug.settings_localstorage_download')}'>
                                <input type='button' name='_import_localstorage' value='${_('settings_debug.settings_localstorage_import')}'>
                            </div>
                        </div>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('settings_debug.settings_routing')}</b></p>

                            <input type='button' id='_restart_app' value='${_('settings_debug.settings_restart_app')}'>
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

                break
            case 'accounts':
                $('.page_content .bordered_block')[0].insertAdjacentHTML('beforeend', `
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
                    $('.settings_accounts')[0].insertAdjacentHTML('beforeend',
                    `
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

                    $(`.settings_accounts .settings_account[data-number='${Utils.cut_string(acc.token, 10)}'] .settings_account_info a`).on('click', (e) => {
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
                            if(window.active_account && window.active_account.token == acc.token) {
                                return
                            }

                            let msg2 = new MessageBox('?', `
                                ${_('settings_accounts.sure_deleting')}
                            `, [_('messagebox.no'), _('messagebox.yes')], [() => {
                                msg2.close()
                            }, () => {
                                acc.remove()
                                
                                $(`.settings_accounts .settings_account[data-number='${Utils.cut_string(acc.token, 10)}']`).remove()
                                $('#_accs_count')[0].innerHTML = _('settings_accounts.accounts_count', window.accounts.getAccountsCount())

                                msg.close()
                                msg2.close()
                            }])
                        }, () => {
                            acc.edit($('#_set_first')[0].value, $('#_set_last')[0].value, $('#_set_path')[0].value)
                            
                            let mainer = document.querySelector(`.settings_accounts .settings_account[data-number='${Utils.cut_string(acc.token, 10)}']`)
                            mainer.querySelector(`.settings_account_info a`).innerHTML = Utils.escape_html($('#_set_first')[0].value + ' ' + $('#_set_last')[0].value)
                            mainer.querySelector(`.settings_account_info span`).innerHTML = $('#_set_path')[0].value + ' | '

                            msg.close()
                        }])

                        if(window.active_account && window.active_account.token == acc.token) {
                            msg.getNode().querySelectorAll('.messagebox_buttons input')[1].classList.add('stopped')
                        }
                    })
                })

                $('.settings_accounts').on('click', '#_enteracc', (e) => {
                    if(window.site_params.get('active_account') == e.currentTarget.dataset.token) {
                        return
                    }

                    window.accounts.setActiveAccount(e.currentTarget.dataset.token)
                    window.router.restart('accounts', 'ignore_menu')
                })

                $('#_logoutacc').on('click', (e) => {
                    window.site_params.delete('active_account')
                    window.vk_api = null
                    window.router.restart('accounts', 'ignore_menu')
                })

                break
            case 'about':
                window.open('https://github.com/udjhh/litewk/blob/main/README.md', '_blank').focus();
                
                break
        }
    }
}
