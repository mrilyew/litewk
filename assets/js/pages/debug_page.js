window.page_class = new class {
    async render_page(section = null) 
    {
        if(section == null) {
            section = window.main_class['hash_params'].section ?? 'api'
        }

        document.title = _('debug.debug_title_' + section)
        $('.page_content')[0].innerHTML = `
            <div class='default_wrapper'>
                <div class='bordered_block'>
                    <div class='settings_tabs tabs'>
                        <a data-ignore='1' data-section='api' ${section == 'api' ? `class='selected'` : ''}>${_('debug.api')}</a>
                        <a data-ignore='1' data-section='cache' ${section == 'cache' ? `class='selected'` : ''}>${_('debug.debug_title_cache')}</a>
                        <a data-ignore='1' data-section='router' ${section == 'router' ? `class='selected'` : ''}>${_('debug.debug_title_router')}</a>
                    </div>
                </div>
            </div>
        `
    
        $('.tabs a').on('click', (e) => {
            e.preventDefault()

            location.hash = '#debug/' + e.target.dataset.section
            Utils.replace_state(location.href)
            this.render_page(e.target.dataset.section)
        })
    
        switch(section) {
            default:
            case 'api':
                $('.page_content .bordered_block')[0].insertAdjacentHTML('beforeend', `
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
                
                $('.settings_block #_send').on('click', async (e) => {
                    if(!window.vk_api) {
                        Utils.add_error(_('not_authorized'), 'no_token', 5000, 'error')
                        return
                    }
    
                    let res = await window.vk_api.call($('#_methodName')[0].value, JSON.parse($('#_methodParams')[0].value), false)
                    
                    $('#_result')[0].value = JSON.stringify(res, null, 4)
                })
    
                $('.settings_block #_clear').on('click', async (e) => {
                    $('#_result')[0].value = ''
                })
    
                $('.settings_block #_unspace').on('click', async (e) => {
                    $('#_result')[0].value = $('#_result')[0].value.replace(/\s+(?=([^"]*"[^"]*")*[^"]*$)/g, '').replace(/\n\r/g, '')
                })

                break
            case 'cache':
                $('.page_content .bordered_block')[0].insertAdjacentHTML('beforeend', `
                    <div class='settings_block'>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('debug.settings_cache')}</b></p>
                            <div class='settings_caches'>
                                <input type='button' name='_export_localstorage' value='${_('debug.settings_localstorage_download')}'>
                                <input type='button' name='_import_localstorage' value='${_('debug.settings_localstorage_import')}'>
                            </div>
                        </div>
                    </div>
                `)

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
                    let localstorage_import = JSON.parse(prompt(_('debug.settings_localstorage_enter')))

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
                $('.page_content .bordered_block')[0].insertAdjacentHTML('beforeend', `
                    <div class='settings_block'>
                        <div class='settings_sublock'>
                            <p class='settings_title'><b>${_('debug.settings_routing')}</b></p>

                            <input type='button' id='_restart_app' value='${_('debug.settings_restart_app')}'>
                        </div>
                    </div>
                `)

                $('.settings_block #_restart_app').on('click', async (e) => {
                    window.router.restart()
                })
                
                break
        }
    }
}
