if(!window.pages) {
    window.pages = {}
}

window.pages['debug_page'] = new class {
    async render_page(section = null) 
    {
        if(section == null) {
            section = window.main_class['hash_params'].section ?? 'api'
        }

        main_class.changeTitle(_('debug.' + section))
        u('.page_content').html(`
            <div class='default_wrapper'>
                <div class='bordered_block'>
                    <div class='settings_tabs tabs'>
                        <a href='#debug/api' ${section == 'api' ? `class='selected'` : ''}>${_('debug.api')}</a>
                        <a href='#debug/cache' ${section == 'cache' ? `class='selected'` : ''}>${_('debug.cache')}</a>
                        <a href='#debug/router' ${section == 'router' ? `class='selected'` : ''}>${_('debug.router')}</a>
                        <a href='#debug/sandbox' ${section == 'sandbox' ? `class='selected'` : ''}>${_('debug.sandbox')}</a>
                        <a href='#debug/others' ${section == 'others' ? `class='selected'` : ''}>${_('debug.others')}</a>
                    </div>
                    <div class='debug_wrapper'></div>
                </div>
            </div>
        `)
    
        switch(section) {
            default:
            case 'api':
                u('.page_content .debug_wrapper').html(`
                    <div class='settings_block'>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('debug.settings_api_test')}</b></p>
                            <div id='_vkapiTest'>
                                <input type="text" style='width: 99%;' id='_methodName' placeholder='${_('debug.settings_method_name')}'>
                                <input type="text" style='width: 99%;' id='_methodParams' placeholder='${_('debug.settings_method_params')}' value='{}'>
                                <textarea style='width: 100%;height: 492px;' id='_result' placeholder='${_('debug.settings_method_result')}'></textarea><br>
    
                                <div id='_vkapiButtons'>
                                    <input type="button" id='_unspace' value="${_('debug.settings_method_unspacify')}">
                                    <input type="button" id='_clear' value="${_('debug.settings_method_clear')}">
                                    <input type="button" id='_send' value="${_('debug.settings_method_send')}">
                                </div>
                            </div>
                        </div>
                    </div>
                `)
                
                u('.settings_block #_send').on('click', async (e) => {
                    if(!window.vk_api) {
                        Utils.add_error(_('not_authorized'), 'no_token', 5000, 'error')
                        return
                    }
    
                    let res = await window.vk_api.call(u('#_methodName').nodes[0].value, JSON.parse(u('#_methodParams').nodes[0].value), false)
                    
                    u('#_result').nodes[0].value = JSON.stringify(res, null, 4)
                })
    
                u('.settings_block #_clear').on('click', async (e) => {
                    u('#_result').nodes[0].value = ''
                })
    
                u('.settings_block #_unspace').on('click', async (e) => {
                    u('#_result').nodes[0].value = u('#_result').nodes[0].value.replace(/\s+(?=([^"]*"[^"]*")*[^"]*$)/g, '').replace(/\n\r/g, '')
                })

                break
            case 'cache':
                u('.page_content .debug_wrapper').html(`
                    <div class='settings_block'>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('debug.settings_cache')}</b></p>
                            <div class='settings_caches'>
                                <input type='button' name='_export_localstorage' value='${_('debug.settings_localstorage_download')}'>
                                <input type='button' name='_import_localstorage' value='${_('debug.settings_localstorage_import')}'>
                            </div>
                        </div>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('debug.settings_cache_indexeddb')}</b></p>
                            <div class='settings_caches'>
                                <input type='button' name='_clear_indexeddb' value='${_('debug.settings_cache_indexeddb_clear')}'>
                            </div>
                        </div>
                    </div>
                `)

                u(`.settings_block input[name='_clear_indexeddb']`).on('click', async (e) => {
                    const ___msg = new MessageBox(_('messagebox.warning'), _('debug.settings_cache_indexeddb_clear_warning'), [_('messagebox.no'), _('messagebox.yes')], [
                        () => {
                            ___msg.close()
                        }, async () => {
                            ___msg.close()
                            window.cache.clearAllStores()
                            window.main_class.newNotification(_('debug.settings_cache_indexeddb_clear_notif'))
                        }
                    ])
                })

                u(`.settings_block input[name='_export_localstorage']`).on('click', async (e) => {
                    let encoded_localstorage = JSON.stringify(localStorage)

                    let tmp_a = document.createElement("a")
                    let file = new Blob([encoded_localstorage], {type: 'application/json'})
                    tmp_a.href = URL.createObjectURL(file)
                    tmp_a.download = "litewk_localstorage.txt"
                    tmp_a.click()

                    tmp_a = null
                })
                    
                u(`.settings_block input[name='_import_localstorage']`).on('click', async (e) => {
                    const localstorage_import = JSON.parse(prompt(_('debug.settings_localstorage_enter')))

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
            case 'router':
                u('.page_content .debug_wrapper').html(`
                    <div class='settings_block'>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('debug.goto_route')}</b></p>

                            <input type='text' id='_gotoroute' placeholder='...'>
                        </div>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('debug.settings_routing')}</b></p>

                            <input type='button' id='_restart_app' value='${_('debug.settings_restart_app')}'>
                        </div>
                    </div>
                `)

                u('.settings_block #_restart_app').on('click', async (e) => {
                    window.router.restart()
                })

                u('.settings_block #_gotoroute').on('change', (e) => {
                    window.router.route('#' + e.target.value)
                })
                
                break
            case 'sandbox':
                u('.page_content .debug_wrapper').html(`
                    <div class='settings_block'>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('debug.sandbox')}</b></p>

                            <div class='flex_row flex_nowrap'>
                                <textarea type='text' id='_runtemplate' placeholder='return window.templates.paginator(10, 1)'>${window.site_params.get('debug.sandbox_saved', window.consts.DEBUG_SANDBOX_DEFAULT_CODE)}</textarea>
                                <input type='button' id='_runtemplatebutton' value='Run' title="better run \nfaster than ma g'n">
                            </div>
                        </div>
                        <div id='_template_insert'></div>
                    </div>
                `)

                u('#_runtemplatebutton').on('click', async (e) => {
                    const template_code = u('#_runtemplate').nodes[0].value
                    const AsyncFunc = Object.getPrototypeOf(async function(){}).constructor
                    const result = new AsyncFunc(template_code)()
                    
                    try {
                        u('#_template_insert').html(await result)
                    } catch(e) {
                        u('#_template_insert').html(e)
                    }
                })

                u('#_runtemplate').on('input', (e) => {
                    window.site_params.set('debug.sandbox_saved', e.target.value)
                })

                break
            case 'others':
                u('.page_content .debug_wrapper').html(`
                <div class='settings_block'>
                    <div class='settings_sublock'>
                        <p class='settings_title'><b>${_('settings_ui.settings_custom_js')}</b></p>
                        <span style='margin: -6px 0px 7px 0px;display: block;'>${_('settings_ui.settings_custom_js_tip')}</span>
                        <textarea id='_custom_js' placeholder='${_('settings.please_enter')}'>${window.site_params.get('ui.custom_js') ?? ''}</textarea>
                    </div>
                </div>`)
                
                u('#_custom_js').on('input', (e) => {
                    window.site_params.set('ui.custom_js', e.target.value)
                })

                break
        }
    }
}
