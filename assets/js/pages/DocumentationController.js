window.controllers['DocumentationController'] = (function() {
    return {
        _BuildPage: async function(page) {
            window.main_class.changeTitle(page.getTitle(), _('documentations.documentation'))
        
            switch(page.getType()) {
                default:
                    u('#page_insert').html(`<h1>${page.getTitle()}</h1>`)
                    break
                case 'method':
                //case 'method-list':
                case 'article':
                    break
            }
    
            switch(page.getType()) {
                case 'article':
                    u('#page_insert').append(page.getText())
                    if(page.getId() == 'reference__state') {
                        const health = await window.doc_vk_api.call({method: 'documentation.getPlatformHealthStatuses', params: {}})
                        let marked_finale = `|${_('documentations.section')}|${_('documentations.state')}|\n|--|--|\n`
                        
                        health.health_statuses.forEach(status => {
                            marked_finale += `|${status.category.escapeHtml()}|${status.status == 'okay' ? '✔' : ''} ${status.average_response_time}ms, ${status.uptime}%|\n`
                        })

                        u('#page_insert').append(marked.parse(marked_finale))
                    }

                    break
                case 'errors':
                    let table_html = `|${_('documentations.code')}|${_('documentations.message')}|${_('documentations.description')}|\n|--|--|--|\n`
                    page.getChildren().forEach(el => {
                        table_html += `|${el.error_code}|${el.title}|${el.description}|\n`
                    })
    
                    u('#page_insert').append(marked.parse(table_html))
                    u('#page_insert table').attr('id', '_error_codes')
                    break
                case 'method-list':
                    let markdown_text_list = `${page.getDescription()}\n\n|${_('documentations.method')}|${_('documentations.description')}|\n|--|--|\n`
    
                    function insertItem(item) {
                        markdown_text_list += `|[${item.title.escapeHtml()}](method/${item.title.escapeHtml()})|${Utils.nl2br(item.description.escapeHtml())}|\n`
                    }
                    
                    page.getChildren().forEach(item => {
                        if(item.children) {
                            item.children.forEach(el => {
                                insertItem(el)
                            })
                        } else {
                            insertItem(item)
                        }
                    })
    
                    u('#page_insert').append(marked.parse(markdown_text_list))
                    break
                case 'method':
                    const method_split = page.getTitle().split('.')
                    const main_part = method_split[0].escapeHtml()
                    const second_part = method_split[1].escapeHtml()
                    let markdown_text = 
                    `# [${main_part}](method/${main_part}) > ${second_part ? main_part + '.' + second_part : ''}\n`
    
                    markdown_text += `${page.getDescription()}\n`
                    if(page.has('description')) {
                        markdown_text += `<br><br>${page.getRawText()}\n`
                    }
    
                    if(page.has('required_access_list')) {
                        markdown_text += `## [${_('documentations.need_rights')}](reference/access-rights)\n${_('documentations.need_rights_verb')}`
                        markdown_text += page.info.required_access_list.join(',').escapeHtml() + '.\n'
                    }
    
                    if(page.getParams().length > 0) {
                        markdown_text += `## ${_('documentations.params')}\n\n|${_('documentations.param')}|${_('documentations.description')}|\n|--|--|`
    
                        page.getParams().forEach(paramer => {
                            const param = new DocumentationMethodParam
                            param.hydrate(paramer)
    
                            markdown_text += `\n|<p>**${param.getName()}**</p> ${param.getType()}|${param.getDescription()} ${param.isRequired() ? `**${_('documentations.required_param')}**` : ''}|`
                        })
    
                        markdown_text += '\n'
                    }
    
                    if(page.has('params_common_description')) {
                        markdown_text += '\n' + page.getCommonDescription() + '\n'
                    }
    
                    if(page.has('result_description')) {
                        markdown_text += `## ${_('documentations.result')} \n ${page.getResultDescription()} \n`
                    }
    
                    if(page.has('linked')) {
                        markdown_text += `## ${_('documentations.linked_versions')} \n |${_('documentations.version')}|${_('documentations.description')}|\n|--|--|\n`
    
                        page.getLinkedVersions().forEach(ver => {
                            markdown_text += `|[${ver.title.escapeHtml()}](reference/${ver.page_id})|${Utils.nl2br(ver.description.escapeHtml())}|\n`
                        })
                    }
    
                    if(page.has('errors')) {
                        markdown_text += `## ${_('documentations.error_codes')} \n|${_('documentations.code')}|${_('documentations.description')}|\n|-|--|\n`
                        
                        page.getErrorCodes().forEach(ver => {
                            markdown_text += `|${ver.title}|${Utils.nl2br(ver.description.escapeHtml())}|\n`
                        })
                    }
    
                    u('#page_insert').append(marked.parse(markdown_text))
                    u('#page_insert').append(`
                        <div class='execute_method'>
                            <h2>${_('documentations.execute_method')}</h2>
    
                            <div id='execution'>
                                <input type='hidden' id='_execute_method_name' value='${page.getTitle()}'>
                                <div class='left_panel'>
                                    <div id='execution_params'>
                                        <div>
                                            <span>access_token</span>
                                            <input type='text' value='${window.vk_api.api_token}' data-name='access_token'>
                                        </div>
                                    </div>
                                </div>
                                <div class='right_panel'>
                                    <span id='_result_api'>${_('documentations.result_will_be_here')}</span>
                                </div>
                            </div>
                        </div>
                    `)    
    
                    if(page.getParams().length > 0) {
                        page.getParams().forEach(paramer => {
                            const param = new DocumentationMethodParam
                            param.hydrate(paramer)
    
                            u('#execution_params').append(`
                                <div>
                                    <span>${param.getName()} ${param.isRequired() ? ' *' : ''}</span>
                                    <input type='text' data-name='${param.getName()}'>
                                </div>
                            `)
                        })
                    }
    
                    u('#execution_params').append(`
                        <div>
                            <input class='primary' type='button' id='_dev_vkapi_run' value='${_('documentations.execute')}'>
                        </div>
                    `)
    
                    break
                case 'versions':
                    let final_markdown = ''
                    page.getChildren().forEach(child => {
                        const children = new DocumentationApiVersion()
                        children.hydrate(child)
    
                        final_markdown += `\n## [${children.getVersion()}](${children.getURL()})\n\n${children.getDescription()}\n`
    
                        if(children.hasChildren()) {
                            const methods_md = []
                            children.getChildren().forEach(child2 => {
                                methods_md.push(`[${child2.title}](${child2.url})`)
                            })
    
                            final_markdown += `\n${_('documentations.affect_methods')}: ${methods_md.join(', ')}\n`
                        }
    
                        final_markdown += '\n---\n\n'
                    })
    
                    u('#page_insert').append(marked.parse(final_markdown))
                    break
                case 'version':
                    let final_markdown_version = `${page.getDescription()}\n\n`
    
                    if(page.has('linked')) {
                        const methods_md = []
                        page.info.linked.forEach(child => {
                            methods_md.push(`[${child.title}](${child.url})`)
                        })
    
                        final_markdown_version += `\n---\n## ${_('documentations.affect_methods')}\n${methods_md.join(', ')}
                        `
                    }
                    
                    u('#page_insert').append(marked.parse(final_markdown_version))
                    break
            }
        },
        _BuildImages: async function() {
            const images = u('.dev_page img')

            if(images.length > 0) {
                const images_array = []
    
                images.nodes.forEach(img => {
                    const sha = img.dataset.src.removePart(location.origin + location.pathname)
                    const secret = img.getAttribute('title')
                    images_array.push({
                        'sha': sha,
                        'secret': secret,
                        'id': sha + secret,
                    })
                })
    
                const true_images = await window.doc_vk_api.call({method: 'documentation.getImagesByIp', params: {'ip': window.site_params.get('docs_ip'), 'images': JSON.stringify(images_array)}})
                true_images.images.forEach(img => {
                    // выкрутился x2
                    u(`img[data-src*='${img.id.slice(0, 10)}']`).attr('src', img.src)
                })
            }
        },
        _BuildMenu: function(items_arr) {
            function insert_item(item) {
                item = new DocumentationMenuItem(item)
                const has_children = item.hasChildren()
    
                return `
                    <div class='rsp ${has_children ? `rsp_main` : 'no_rsp'}'>
                        <a data-ignore='1' data-href='${item.getURL()}' class='${item.isSelected() ? `selected` : ''}' href='${item.getFullURL()}'>
                            ${item.getTitle()}
                            ${has_children ? `
                            <svg id='down_icon' viewBox="0 0 10 6"><polygon points="0 0 5 6 10 0 0 0"/></svg>
                            <svg id='up_icon' viewBox="0 0 10 6"><polygon points="0 6 5 0 10 6 0 6"/></svg>
                            ` : ''}
                        </a>
    
                        ${has_children ? `<div class='sub_tabs'>${window.controllers['DocumentationController']._BuildMenu(item.getChildren())}</div>` : ''}
                    </div>
                `
            }
    
            let finaler_html = ''
            if(Array.isArray(items_arr)) {
                items_arr.forEach(item => {
                    if(Array.isArray(item)) {
                        finaler_html += this._BuildMenu(item)
                        finaler_html += `<hr>`
                    } else {
                        finaler_html += insert_item(item)
                    }
                })
            }
    
            finaler_html = u(`<div>${finaler_html}</div>`)
            const selected_item = finaler_html.find('.selected')
    
            if(selected_item.length > 0) {
                let selected_parent = selected_item.nodes[0].parentElement
                while(selected_parent) {
                    if(selected_parent.matches('#docums_menu_insert')) {
                        selected_parent = null
                    }
        
                    if(selected_parent.matches('.rsp_main')) {
                        selected_parent.querySelector('.sub_tabs').classList.add('shown')
                        selected_parent.classList.add('rsp_main')
                        selected_parent.classList.add('arrowed')
                    }
        
                    selected_parent = selected_parent.parentElement
                }
            }
    
            return finaler_html.html()
        },
        _EmptyMenu: function() {
            u('#docums_menu_insert').html('')
        },
        _EmptyPage: function() {
            u('#page_insert').html('')
        },
        SearchPage: async function() {
            await Accounts.getAnonymousDocumentationModule()
            if(!this.docs_menu) {
                this.docs_menu = await window.doc_vk_api.call({method: 'documentation.getMenu', params: {'menu_id': 'main_menu'}})
            }

            u('.page_content').html(window.templates.two_blocks_grid())
            u('.page_content .default_wrapper').addClass('dev_wrapper')
            u('.page_content .layer_two_columns_content').html(`
                <div class='dev_wrapper_subcontent full_height flex flex_column'>
                    <div class='bordered_block tabs default_tabs flex align_normal justify_space_between'>
                        <div class='flex' style='gap: 2px;'>
                            <a class='tab' href='#dev?path=/guide'>${_('documentations.main_menu')}</a>
                            <a class='tab' href='#dev?path=/reference'>${_('documentations.api_menu')}</a>
                            <a class='tab' href='#dev?path=/community'>${_('documentations.community_menu')}</a>
                        </div>
                    </div>
                    <div class='bordered_block padding dev_page_wrapper full_height'>
                        <div class='dev_page' id='page_insert'></div>
                    </div>
                </div>
            `)
            u('.page_content .layer_two_columns_tabs').html(`
                <div class='settings_tabs tabs flex flex_column horizontal_tabs' id='docums_menu_insert'></div>
            `)
            u('#docums_menu_insert').html(this._BuildMenu(this.docs_menu.menu))
            
            const query = window.main_url.getParam('q')
            window.main_class.changeTitle(_('documentations.search_by_query', query), _('documentations.documentation'))

            const search = await window.doc_vk_api.call({method: 'documentation.search', params: {'count': 100, 'query': query}})
            
            u('#page_insert').html(`
                <div id='results_header'>
                    <h1>${_('documentations.search_by_documentation_results')}</h1>
                    <p>${_('documentations.search_by_documentation_results_desc', search.total_count, query.escapeHtml())}</p>
                </div>

                <div id='results_body'></div>
            `)

            let offset = 0
            function insertItems(items, count) {
                let markdown = ''
                items.forEach(itemer => {
                    /*if(itemer.is_hidden) {
                        return
                    }*/

                    markdown += `\n## [${itemer.title.escapeHtml()}](${itemer.url})\n`
                    if(itemer.search_fragments && itemer.search_fragments.content && itemer.search_fragments.content.length > 0) {
                        itemer.search_fragments.content.forEach(frag => {
                            markdown += `${frag.escapeHtml()}\n`
                        })
                    }
                })
                
                u('#results_body').append(marked.parse(markdown))

                offset += 100
                if(offset <= count) {
                    u('#results_body').append(`
                        <a href='javascript:void(0)' id='show_more_documentation'>${_('documentations.show_more')}</a>
                    `)
                }
            }

            u('#page_insert').on('click', '#show_more_documentation', async (e) => {
                u(e.target).addClass('stopped').addClass('but_not_visible')
                
                const search = await window.doc_vk_api.call({method: 'documentation.search', params: {'offset': offset, 'count': 100, 'query': query}})
                u('#show_more_documentation').remove()

                insertItems(search.items, search.total_count)
            })

            insertItems(search.items, search.total_count)
        },
        DocumentationPage: async function() {
            const proxy_url = window.settings_manager.getItem('internal.proxy_url').getValue()
            if(!proxy_url) {
                u('.page_content').html(_('errors.documentations_proxy_error'))
                window.location.assign('https://dev.vk.com/')
            }
    
            await Accounts.getAnonymousDocumentationModule()
            if(!window.site_params.has('docs_ip')) {
                const ip = await Utils.request(`${window.settings_manager.getItem('internal.proxy_url').getValue()}${encodeURIComponent('https://dev.vk.com/getClientIp')}&origin=login.vk.com`)
    
                window.site_params.set('docs_ip', ip.response.ip)
            }

            let path = window.main_url.getParam('path') ?? '/guide'
            const page = new Documentation()
    
            try {
                await page.fromId(path)
            } catch(e) {
                u('.filler').removeClass('filler')
                u('.layer_two_columns_content').html(`
                <div class='bordered_block padding'>
                    ${_('errors.documentation_page_not_found')}
                </div>
                `)
                return
            }
    
            if(page.getMenuId() != this.menu_id) {
                this.menu_id = page.getMenuId()
                this.docs_menu = await window.doc_vk_api.call({method: 'documentation.getMenu', params: {'menu_id': page.getMenuId()}})
            }
    
            u('.page_content').html(window.templates.two_blocks_grid())
            u('.page_content .default_wrapper').addClass('dev_wrapper')
            u('.page_content .layer_two_columns_content').html(`
                <div class='dev_wrapper_subcontent full_height flex flex_column'>
                    <div class='bordered_block tabs default_tabs flex align_normal justify_space_between'>
                        <div class='flex' style='gap: 2px;'>
                            <a class='tab ${page.getMenuId() == 'main_menu' ? `selected` : ''}' href='#dev?path=/guide'>${_('documentations.main_menu')}</a>
                            <a class='tab ${page.getMenuId() == 'api_menu' ? `selected` : ''}' href='#dev?path=/reference'>${_('documentations.api_menu')}</a>
                            <a class='tab ${page.getMenuId() == 'community_menu' ? `selected` : ''}' href='#dev?path=/community'>${_('documentations.community_menu')}</a>
                        </div>
                        <div class='additional_buttons'>
                            <a href='https://${window.consts.VK_DOCS_URL}${path}'><input class='primary' type='button' value='${_('documentations.original_documentation')}'></a>
                        </div>
                    </div>
                    <div class='bordered_block padding dev_page_wrapper full_height'>
                        <div class='dev_page' id='page_insert'></div>
                    </div>
                </div>
            `)
            u('.page_content .layer_two_columns_tabs').html(`
                <div class='settings_tabs tabs flex flex_column horizontal_tabs' id='docums_menu_insert'></div>
            `)

            this._EmptyMenu()
            u('#docums_menu_insert').html(this._BuildMenu(this.docs_menu.menu))
            await this._BuildPage(page)
            await this._BuildImages()
        },
        DocumentationPageSkeleton: function() {
            u('.page_content').html(window.templates.two_blocks_grid_skeleton())
        },
    }
})()
