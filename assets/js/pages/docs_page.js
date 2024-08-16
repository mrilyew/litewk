if(!window.pages) {
    window.pages = {}
}

window.pages['docs_page'] = new class {
    async render_page() {
        main_class.changeTitle(_('docs.docs'))
        
        let section  = Number(window.main_url.getParam('section') ?? 0)
        let owner_id = Number(window.main_class['hash_params'].owner ?? window.active_account.info.id)
        let is_this  = owner_id == window.active_account.info.id

        if(owner_id > 0 && !is_this) {
            main_class.add_onpage_error(_('errors.docs_cant_user'))
        }

        let tabs = document.querySelector('#_tabsinsert')
        let method = 'docs.get'
        let method_params = {'owner_id': owner_id, 'search_type': 1, 'count': window.Utils.default_count_more, 'return_tags': 1}

        if(section > 0 && section < 9) {
            console.log(method_params.type)
            method_params.type = section
        }

        if(window.main_url.hasParam('query') && window.main_url.getParam('query') != '') {
            method = 'docs.search'
            method_params.search_type = 1
            method_params.q = window.main_url.getParam('query')
        }

        u('.page_content').html(`
            <div class='default_wrapper layer_two_columns'>
                <div>   
                    <div class='layer_two_columns_up_panel bordered_block' id='insert_paginator_here_bro'>
                        <div class='tabs'>
                            <a data-ignore='1' class='selected' data-section='${section}'>${_('docs.docs')}</a>
                        </div>
                    </div>

                    <div class='bordered_block' id='_docs_root'>
                        <div class='layer_two_columns_local_search_block flex_row flex_nowrap'>
                            <input type='text' value='${window.main_url.getParam('query') ?? ''}' placeholder='${_('docs.search_by_document')}'>
                            <input type='button' value='${_('search.search')}'>
                        </div>

                        <div class='docs_insert short_list'>
                        </div>
                    </div>
                </div>
                <div class='layer_two_columns_tabs bordered_block'>
                    ${tabs ? tabs.outerHTML : `<div id='_tabsinsert'></div>`}
                    ${is_this ? `
                    <a href='#search/docs'>
                        ${_('search.search')}
                    </a>
                    ` : ''}
                </div>
            </div>
        `)

        window.main_classes['wall'] = new Docs(Doc, '.docs_insert')
        window.main_classes['wall'].setParams(method, method_params)
        window.main_classes['wall'].clear()

        if(window.main_url.hasParam('page')) {
            window.main_classes['wall'].objects.page = Number(window.main_url.getParam('page')) - 1
        }

        let result = await window.main_classes['wall'].nextPage()

        if(result == 'fatal') {
            return
        }

        u('#insert_paginator_here_bro').append(window.templates.paginator(window.main_classes['wall'].objects.pagesCount, (Number(window.main_url.getParam('page') ?? 1))))
        
        if(!tabs) {
            let tabs = null

            if(window.use_execute) {
                tabs = await window.vk_api.call('execute', {'code': `
                    var all_documents = API.docs.get({"owner_id": ${owner_id}, "count": 1});
                    var tabs = API.docs.getTypes({"owner_id": ${owner_id}});
    
                    ${owner_id < 0 ? `var group = API.groups.getById({"group_ids": ${Math.abs(owner_id)}});` : ''}
    
                    tabs.items.unshift({
                        "id": 0,
                        "name": "${_('docs.all_docs')}",
                        "count": all_documents.count,
                    });
    
                    ${owner_id < 0 ? `return {"items": tabs.items, "group": group.groups[0]};` : ''}
                    ${owner_id > 0 ? `return {"items": tabs.items};` : ''}
                `,'owner_id': owner_id})
            } else {
                let result_tabs = await window.vk_api.call('docs.getTypes', {'owner_id': owner_id})
    
                tabs = {'items': []}
                if(section == 0) {
                    tabs.items.push({
                        'id': 0,
                        'name': _('docs.all_docs'),
                        'count': window.main_classes['wall'].objects.count,
                    })
                } else {
                    let result_tabs = await window.vk_api.call('docs.get', {'owner_id': owner_id, 'count': 1})
    
                    tabs.items.push({
                        'id': 0,
                        'name': _('docs.all_docs'),
                        'count': result_tabs.response.count,
                    })
                }
                
                result_tabs.items.forEach(tab => [
                    tabs.items.push(tab)
                ])
            }
    
            if(tabs.group) {
                let club = new Club
                club.hydrate(tabs.group)
    
                u('#_tabsinsert').nodes[0].parentNode.insertAdjacentHTML('afterbegin', `
                    <a href='${club.getUrl()}' class='layer_two_columns_tabs_user_info'>
                        <div>
                            <img class='avatar' src='${club.getAvatar()}'>
                        </div>
    
                        <div class='layer_two_columns_tabs_user_info_name'>
                            <b ${club.isMember() ? `class='member'` : ''}>${Utils.cut_string(club.getName(), 15)}</b>
                            <span>${_('user_page.go_to_user_page')}</span>
                        </div>
                    </a>
                `)
            }
    
            tabs.items.forEach(tab => {
                u('#_tabsinsert').nodes[0].insertAdjacentHTML('beforeend', `
                    <a href='${is_this ? `#docs` : '#docs' + owner_id}?section=${tab.id}' ${section == tab.id ? 'class=\'selected\'' : ''}>
                        ${Utils.escape_html(tab.name)} <span class='counter_additional'>${tab.count}</span>
                    </a>
                `)
            })
        }
    }

    execute_buttons() {
        u('#_docs_root').on('change', '.layer_two_columns_local_search_block input', async (e) => {
            window.main_url.setParam('query', e.target.value)
            Utils.replace_state(window.main_url)

            await this.render_page()
            this.execute_buttons()
        })
    }
}
