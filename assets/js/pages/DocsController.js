window.controllers['DocsController'] = (function() {
    return {
        DocPage: async function() {
            main_class.changeTitle(_('docs.doc'))

            let owner_id = Number(window.main_class['hash_params'].owner)
            let item_id = Number(window.main_class['hash_params'].id)
            let doc_api = await window.vk_api.call('docs.getById', {'docs': owner_id + '_' + item_id, 'return_tags': 1})
            let content_html = ``
    
            window.main_class['doc'] = new Doc
            window.main_class['doc'].hydrate(doc_api[0])
    
            if(!window.main_class['doc'].info) {
                main_class.add_onpage_error(_('errors.doc_not_found'))
            }
    
            main_class.changeTitle(window.main_class['doc'].getTitle())
    
            switch(window.main_class['doc'].getType()) {
                default:
                    content_html = `<div class='document_body_panel'>${_('errors.docs_load_error', 'https://vk.com/doc' + window.main_class['doc'].getId())}</div>`
                    break
                case 4:
                case 3:
                    content_html = `
                        <div class='document_body_panel'>
                            <a href='${window.main_class['doc'].getURL()}'>
                                <img src='${window.main_class['doc'].getURL()}'>
                            </a>
                        </div>
                    `
                    break
                case 7:
                    content_html = `
                        <iframe src='${window.main_class['doc'].getURL()}'>
                    `
                    break
            }
    
            u('body .page_content').html(`
                <div class='document_single_view'>
                    <div class='document_upper_panel'>
                        <a data-ignore='1' href='javascript:void(0)' id='_titler'>${window.main_class['doc'].getTitle()}</a>
    
                        <div>
                            ${owner_id != window.active_account.info.id ? 
                                `<input type='button' id='_save_doc' value='${_('docs.save_to_self')}'>`
                                : ''}
                            <input type='button' id='_download_doc' download value='${_('docs.download_file')}'>
                        </div>
                    </div>
    
                    <div>
                        ${content_html}
                    </div>
                </div>
            `
            )

            u('.document_single_view #_titler').on('click', (e) => {
                let msg = new MessageBox(_('docs.doc'), `
                    <table class='straight_table'>
                        <tbody>
                            <tr>
                                <td>${_('docs.title')}</td>
                                <td>${window.main_class['doc'].getTitle()}</td>
                            </tr>
                            <tr>
                                <td>${_('docs.size')}</td>
                                <td>${window.main_class['doc'].getFileSize()}</td>
                            </tr>
                            <tr>
                                <td>${_('docs.ext')}</td>
                                <td>${window.main_class['doc'].getExtension()}</td>
                            </tr>
                            <tr>
                                <td>${_('docs.date')}</td>
                                <td>${window.main_class['doc'].getDate()}</td>
                            </tr>
                            <tr>
                                <td>${_('docs.type')}</td>
                                <td>${window.main_class['doc'].getTextType()}</td>
                            </tr>
                            <tr>
                                <td>${_('docs.tags')}</td>
                                <td>${window.main_class['doc'].getCSVTags()}</td>
                            </tr>
                            ${window.main_class['doc'].info.owner_id != window.active_account.info.id ? `<tr>
                                <td>${_('docs.uploader')}</td>
                                <td><a id='_onclickcloseme' href='#${window.main_class['doc'].info.owner_id}'>${window.main_class['doc'].info.owner_id}</a></td>
                            </tr>` : ''}
                        </tbody>
                    </table>
                `, ['OK'], [() => {msg.close()}])
    
                msg.getNode().style.width = '250px'
    
                u('#_onclickcloseme').on('click', () => {
                    msg.close()
                })
            })
    
            u('.document_single_view').on('click', '#_download_doc', (e) => {
                Utils.download_file_by_link(window.main_class['doc'].getURL(), window.main_class['doc'].getTitleWithExt())
            })
            
            u('.document_single_view').on('click', '#_save_doc', async (e) => {
                e.target.classList.add('stopped')
    
                let result = await window.vk_api.call('docs.add', {'owner_id': window.main_class['doc'].info.owner_id, 'doc_id': window.main_class['doc'].info.id, 'access_key': window.main_class['doc'].info.access_key})
            
                e.target.classList.remove('stopped')
    
                window.tmp_doc = result.response
                e.target.value = _('docs.added')
                e.target.setAttribute('id', '_delete_doc_')
            })
                    
            u('.document_single_view').on('click', '#_delete_doc_', async (e) => {
                e.target.classList.add('stopped')
                await window.vk_api.call('docs.delete', {'owner_id': window.active_account.info.id, 'doc_id': window.tmp_doc})
            
                e.target.classList.remove('stopped')
                e.target.value = _('docs.save_to_self')
                e.target.setAttribute('id', '_save_doc')
            })
        },
        DocList: async function() {
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

            u('#_docs_root').on('change', '.layer_two_columns_local_search_block input', async (e) => {
                window.main_url.setParam('query', e.target.value)
                Utils.replace_state(window.main_url)
    
                await this.render_page()
                this.execute_buttons()
            })
        }
    }
})
