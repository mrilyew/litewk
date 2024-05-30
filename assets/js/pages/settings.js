window.tweaks = [
    {
        'name': 'settings_ui_tweaks.vk_like_padding',
        'internal_name': 'VK-like page padding',
        'author': 'litewk',
        'code': `/* VK-like page padding */
.wrapper {
    padding: 0px 10%;
}
            
.wrapper .menu {
    border-left: 1px solid var(--main-text-lighter-color);
}`,
    }
]

window.page_class = new class {
    async render_page(section = null) 
    {
        if(section == null) {
            section = window.s_url.searchParams.get('section') ?? 'ui'
        }

        document.title = _('settings.settings_' + section)

        $('.page_content')[0].innerHTML = ''
        $('.page_content')[0].insertAdjacentHTML('beforeend', `
            <div style='padding: 19px 28px 0px 26px;'>
                <div class='bordered_block'>
                    <div class='tabs'>
                        <a data-section='ui' ${section == 'ui' ? `class='selectd'` : ''}>${_('settings.settings_ui')}</a>
                        <a data-section='language' ${section == 'language' ? `class='selectd'` : ''}>${_('settings.settings_language')}</a>
                        <a data-section='accounts' ${section == 'accounts' ? `class='selectd'` : ''}>${_('settings.settings_accounts')}</a>
                        <a data-section='debug' ${section == 'debug' ? `class='selectd'` : ''}>${_('settings.settings_debug')}</a>
                    </div>
                </div>
            </div>
        `)
    
        $('.tabs a').on('click', (e) => {
            this.render_page(e.target.dataset.section)
            window.s_url.searchParams.set('section', e.target.dataset.section)
            push_state(window.s_url)
        })
    
        switch(section) {
            default:
            case 'ui':
                let date_val = window.site_params.get('ui.date_format') ?? 'default'
                $('.page_content .bordered_block')[0].insertAdjacentHTML('beforeend', `
                    <div class='settings_block'>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('settings_ui.settings_custom_css')}</b></p>
                            <textarea id='_custom_css' placeholder='${_('settings.please_enter')}'>${window.site_params.get('ui.custom_css') ?? ''}</textarea>
                            <b>${_('settings_ui.settings_ui_tweaks')}</b>
                            <div class='tweaks_insert'></div>
                        </div>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('settings_ui.settings_custom_js')}</b></p>
                            <span style='margin: -6px 0px 7px 0px;display: block;'>${_('settings_ui.settings_custom_js_tip')}</span>
                            <textarea id='_custom_js' placeholder='${_('settings.please_enter')}'>${window.site_params.get('ui.custom_js') ?? ''}</textarea>
                        </div>
                        <div class='settings_sublock settings_flex'>
                            <p class='settings_title'><b>${_('settings_ui.settings_date_format')}</b></p>
                            <label><input name='_date_format' ${date_val == 'default' ? 'checked' : ''} value='default' type='radio'>${_('settings_ui.settings_date_format_default')}</label>
                            <label><input name='_date_format' ${date_val == 'month' ? 'checked' : ''} value='month' type='radio'>${_('settings_ui.settings_date_format_day_month')}</label>
                        </div>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('settings_ui.settings_ui_other')}</b></p>
                            <label>
                                <input type='checkbox' name='_hideImageStatus' ${window.site_params.get('ui.hide_image_statuses') == '1' ? 'checked' : ''}>
                                ${_('settings_ui.settings_hide_image_statuses')}
                            </label>
                        </div>
                    </div>
                `)

                tweaks.forEach(tweak => {
                    $('.tweaks_insert')[0].insertAdjacentHTML('beforeend', `
                        <label>
                            <input type='checkbox' data-name='${tweak.name}' name='tweak_toggle' ${window.site_params.get('ui.custom_css').indexOf(tweak.code) != -1 ? 'checked' : ''}>
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
    
                $(document).on('input', '#_custom_css', (e) => {
                    window.site_params.set('ui.custom_css', e.target.value)
                    $('#_customcss')[0].innerHTML = e.target.value
                })
    
                $(document).on('input', '#_custom_js', (e) => {
                    window.site_params.set('ui.custom_js', e.target.value)
                })
    
                $(document).on('click', 'input[name="_date_format"]', () => {
                    window.site_params.set('ui.date_format', $('input[name="_date_format"]:checked').val())
                })

                $(document).on('change', 'input[name="_hideImageStatus"]', () => {
                    window.site_params.set('ui.hide_image_statuses', Number($('input[name="_hideImageStatus"]')[0].checked))
                })
    
                date_val = null
                break
            case 'language':
                $('.page_content .bordered_block')[0].insertAdjacentHTML('beforeend', `
                    <div class='settings_block'>
                        <div class='settings_sublock settings_flex'></div>
                    </div>
                `)
    
                window.langs.forEach(lang => {
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
                        window.main_class.restart('language')
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
                            <p class='settings_title'><b>${_('settings_ui.settings_ui_other')}</b></p>
                            <label>
                                <input type='checkbox' name='_useExecute' ${window.site_params.get('internal.use_execute') == '1' ? 'checked' : ''}>
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
    
                    Object.keys(localstorage_import).forEach(el => {
                        localStorage.setItem(el, JSON.stringify(localstorage_import[el]))
                    })
    
                    window.main_class.restart()
                })

                $(document).on('change', 'input[name="_useExecute"]', () => {
                    window.site_params.set('internal.use_execute', Number($('input[name="_useExecute"]')[0].checked))
                })

                break
            case 'accounts':
                $('.page_content .bordered_block')[0].insertAdjacentHTML('beforeend', `
                    <div class='settings_block'>
                        <div class='settings_buttons'>
                            <span>${_('settings_accounts.accounts_count', window.accounts.getAccountsCount())}</span>
    
                            <div class='additional_buttons'>
                                ${!window.site_params.has('active_account') ? '' : `<input type='button' id='_logoutacc' value='${_('settings_accounts.accounts_logout')}'>`}
                                <a href='site_pages/auth.html'><input type='button' value='${_('settings_accounts.accounts_add')}'></a>
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
                                ${Number(window.site_params.get('active_account')) != acc.vk_info.id ? `<input type='button' data-id='${acc.vk_info.id}' id='_enteracc' value='${_('settings_accounts.accounts_set_default')}'>` : ''}
                            </div>
                        </div>
                    `
                    )
                })

                $('#_enteracc').on('click', (e) => {
                    if(Number(window.site_params.get('active_account')) == e.currentTarget.dataset.id) {
                        return
                    }

                    window.accounts.setActiveAccount(e.currentTarget.dataset.id)
                    window.main_class.restart('accounts')
                })

                $('#_logoutacc').on('click', (e) => {
                    window.site_params.delete('active_account')
                    window.main_class.restart('accounts')
                })

                break
        }
    }
}
