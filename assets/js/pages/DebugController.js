window.controllers['DebugController'] = (function() {
    return {
        Debug: async function() {
            const section = window.main_class['hash_params'].section ?? 'api'
            main_class.changeTitle(_('debug.' + section))

            u('.page_content').html(`
                <div class='default_wrapper'>
                    <div class='bordered_block'>
                        <div class='settings_tabs tabs'></div>
                        <div class='debug_wrapper'></div>
                    </div>
                </div>
            `)
    
            u('.page_content').html(window.templates.two_blocks_grid())
            u('.page_content .layer_two_columns_content').html(`<div class='debug_wrapper'></div>`)
            u('.page_content .layer_two_columns_tabs').html(`
                <div class='settings_tabs tabs flex flex_column horizontal_tabs'>
                    <a href='#debug/api' data-section='api'>${_('debug.api')}</a>
                    <a href='#debug/cache' data-section='cache'>${_('debug.cache')}</a>
                    <a href='#debug/router' data-section='router'>${_('debug.router')}</a>
                    <a href='#debug/sandbox' data-section='sandbox'>${_('debug.sandbox')}</a>
                    <a href='#debug/others' data-section='others'>${_('debug.others')}</a>
                </div>
            `)
            u(`.settings_tabs a[data-section='${section}']`).addClass('selected')
        
            switch(section) {
                default:
                case 'api':
                    await window.controllers['DebugController'].DebugApi()
                    break
                case 'cache':
                    window.controllers['DebugController'].DebugCache()
                    break
                case 'router':
                    window.controllers['DebugController'].DebugRouter()
                    break
                case 'sandbox':
                    window.controllers['DebugController'].DebugSandbox()
                    break
                case 'others':
                    window.controllers['DebugController'].DebugOthers()
                    break
            }
        },
        DebugApi: async function() {
            u('.page_content .debug_wrapper').html(`
                <div class='bordered_block settings_block padding'>
                    <div class='bordered_block_name'>
                        <span>${_('debug.settings_api_test')}</span>
                    </div>

                    <div class='settings_sublock'>
                        <div id='_vkapiTest' style='gap: 5px;' class='flex flex_column'>
                            <input type='text' style='width: 100%;' id='_methodName' placeholder='${_('debug.settings_method_name')}'>
                            <input type='text' style='width: 100%;' id='_methodParams' placeholder='${_('debug.settings_method_params')}' value='{}'>
                            <textarea style='width: 100%;height: 492px;' id='_result' placeholder='${_('debug.settings_method_result')}'></textarea>
                            <label>
                                <input checked type='checkbox' id='_methodForceness'>
                                ${_('debug.settings_method_process_errors')}
                            </label>
                            <label>
                                <select id='_methodModule'>
                                    ${window.active_account ? `<option value='default'>${_('debug.settings_method_api_module_default')}</option>` : ''}
                                    <option value='anonymous'>${_('debug.settings_method_api_module_anonymous')}</option>
                                    <option value='anonymous_docs'>${_('debug.settings_method_api_module_anonymous_docs')}</option>
                                    <option value='no_token'>${_('debug.settings_method_api_module_no_token')}</option>
                                </select>
                                ${_('debug.settings_method_api_module')}
                            </label>

                            <div id='_vkapiButtons' class='align_right_text'>
                                <input type="button" id='_unspace' value="${_('debug.settings_method_unspacify')}">
                                <input type="button" id='_clear' value="${_('debug.settings_method_clear')}">
                                <input class='primary' type="button" id='_send' value="${_('debug.settings_method_send')}">
                            </div>
                        </div>
                    </div>
                </div>
            `)
            
            u('.settings_block #_send').on('click', async (e) => {
                const method = u('#_methodName').nodes[0].value
                const params = JSON.parse(u('#_methodParams').nodes[0].value)
                const forceness = u('#_methodForceness').nodes[0].checked
                const module = u('#_methodModule').nodes[0].value
                let api_module = window.vk_api

                switch(module) {
                    case 'default':
                        api_module = window.account_vk_api
                        break
                    case 'anonymous':
                        api_module = await Accounts.getAnonymousModule()
                        break
                    case 'anonymous_docs':
                        api_module = await Accounts.getAnonymousDocumentationModule()
                        break
                    case 'no_token':
                        api_module = new VkApi(window.consts.DEFAULT_VK_API_DOMAIN_FULL, null)
                        break
                }

                const res = await api_module.call({method: method, params: params, raw_result: forceness})
                
                u('#_result').nodes[0].value = JSON.stringify(res, null, 4)
            })

            u('.settings_block #_clear').on('click', async (e) => {
                u('#_result').nodes[0].value = ''
            })

            u('.settings_block #_unspace').on('click', async (e) => {
                u('#_result').nodes[0].value = u('#_result').nodes[0].value.replace(/\s+(?=([^"]*"[^"]*")*[^"]*$)/g, '').replace(/\n\r/g, '')
            })
        },
        DebugCache: function() {
            u('.page_content .debug_wrapper').html(`
                <div class='bordered_block settings_block padding'>
                    <div class='bordered_block_name'>
                        <span>${_('debug.settings_cache')}</span>
                    </div>

                    <div class='flex flex_column' style='gap:8px;'>
                        <div class='settings_sublock'>
                            <div class='settings_caches'>
                                <input type='button' class='primary' name='_export_localstorage' value='${_('debug.settings_localstorage_download')}'>
                                <input type='button' class='primary' name='_import_localstorage' value='${_('debug.settings_localstorage_import')}'>
                            </div>
                        </div>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('debug.settings_cache_indexeddb')}</b></p>
                            <div class='settings_caches'>
                                <input type='button' class='primary' name='_clear_indexeddb' value='${_('debug.settings_cache_indexeddb_clear')}'>
                            </div>
                        </div>
                    </div>
                </div>
            `)

            u(`.settings_block input[name='_clear_indexeddb']`).on('click', async (e) => {
                const ___msg = new MessageBox(_('messagebox.warning'), _('debug.settings_cache_indexeddb_clear_warning'), [_('messagebox.no'), _('messagebox.yes') + '|primary'], [
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
        },
        DebugRouter: function() {
            u('.page_content .debug_wrapper').html(`
                <div class='bordered_block settings_block padding'>
                    <div class='bordered_block_name'>
                        <span>${_('debug.router')}</span>
                    </div>
                    
                    <div class='flex flex_column' style='gap:10px;'>
                        <div class='settings_sublock'>
                            <b class='block'>${_('debug.goto_route')}</b>

                            <input type='text' id='_gotoroute' placeholder='id0'>
                        </div>
                        <div class='settings_sublock'>
                            <b class='block'>${_('debug.settings_routing')}</b>

                            <input type='button' class='primary' id='_restart_app' value='${_('debug.settings_restart_app')}'>
                        </div>
                    </div>
                </div>
            `)

            u('.settings_block #_restart_app').on('click', async (e) => {
                window.router.restart()
            })

            u('.settings_block #_gotoroute').on('change', (e) => {
                window.router.route('#' + e.target.value)
            })
        },
        DebugSandbox: function() {
            u('.page_content .debug_wrapper').html(`
                <div class='bordered_block settings_block padding'>
                    <div class='bordered_block_name'>
                        <span>${_('debug.sandbox')}</span>
                    </div>

                    <div class='settings_sublock'>
                        <div class='flex flex_row flex_nowrap'>
                            <textarea type='text' id='_runtemplate' placeholder='return window.templates.paginator(10, 1)'>${window.settings_manager.getItem('debug.sandbox_saved').getValue()}</textarea>
                            <input class='primary' type='button' id='_runtemplatebutton' value='Run'>
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
        },
        DebugOthers: function() {
            u('.page_content .debug_wrapper').html(`
            <div class='bordered_block settings_block padding'>
                <div class='bordered_block_name'>
                    <span>${_('debug.others')}</span>
                </div>
                <div class='settings_sublock'>
                    <p class='settings_title'><b>${_('settings_ui.settings_custom_js')}</b></p>

                    <span style='margin: 0px 0px 7px 0px;display: block;'>${_('settings_ui.settings_custom_js_tip')}</span>
                    <textarea id='_custom_js' placeholder='${_('settings.please_enter')}'>${window.site_params.get('ui.custom_js') ?? ''}</textarea>
                </div>
            </div>`)
            
            u('#_custom_js').on('input', (e) => {
                window.site_params.set('ui.custom_js', e.target.value)
            })
        },
    }
})()