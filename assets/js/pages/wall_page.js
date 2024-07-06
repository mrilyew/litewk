window.page_class = new class {
    async render_page() {
        let id = window.main_class['hash_params'].owner_id
        let section = window.main_class['hash_params'].section ?? 'all'

        if(!id) {
            add_onpage_error(_('errors.wall_not_found', id))
            return
        }
        
        let tabs = ['all', 'owner']
        let tabs_ = ''

        if(id == window.active_account.vk_info.id) {
            tabs.push('others')
            tabs.push('archived')
        }

        tabs.push('search')

        document.title = _('wall.wall')
        tabs.forEach(tab => {tabs_ += `<a href='#wall${id}/${tab}' ${tab == section ? 'class=\'selectd\'' : ''}>${_(`wall.${tab}_posts`)}</a>`})

        $('.page_content')[0].insertAdjacentHTML('beforeend', 
            `
                <div class='default_wrapper wall_wrapper'>
                    <div>
                        <div class='bordered_block wall_wrapper_upper_panel' id='insert_paginator_here_bro'>
                            ${section != 'search' ? `<span>${_('counters.posts_on_wall_count', 0)}</span>` : `
                                <input type="query" placeholder="${_('wall.search')}">
                            `}
                        </div>
                        <div class='wall_wrapper_post'></div>
                    </div>
                    <div class='wall_wrapper_tabs bordered_block'>
                        ${tabs_}

                        <div class='wall_additional_tabs'>
                            <label>
                                <input type='checkbox' id='_invert_wall' ${window.s_url.searchParams.get('wall_invert') == 'yes' ? 'checked' : ''}>
                                ${_('wall.posts_invert')}
                            </label>
                        </div>
                    </div>
                </div>
            `
        )

        let wall_params = {'owner_id': id, 'extended': 1, 'count': 10, 'filter': tabs.includes(section) ? section : 'all', 'fields': window.typical_fields}
        window.main_classes['wall'] = new ClassicListView(Post, '.wall_wrapper_post')
        window.main_classes['wall'].setParams('wall.get', wall_params, window.s_url.searchParams.get('wall_invert') == 'yes')
    
        if(window.s_url.searchParams.has('page')) {
            window.main_classes['wall'].objects.page = Number(window.s_url.searchParams.get('page')) - 1
        }

        if(section != 'search') {
            window.main_classes['wall'].clear()
            await window.main_classes['wall'].nextPage()
        } else {
            if(window.s_url.searchParams.get('wall_query')) {
                $(`input[type='query']`)[0].value = window.s_url.searchParams.get('wall_query')
                await window.main_classes['wall'].search(window.s_url.searchParams.get('wall_query'))
            }
        }

        try {
            $('.wall_wrapper span')[0].innerHTML = _('counters.posts_on_wall_count', window.main_classes['wall'].objects.count)
            $('.wall_wrapper_upper_panel')[0].insertAdjacentHTML('beforeend', paginator_template(window.main_classes['wall'].objects.pagesCount, (Number(window.s_url.searchParams.get('page') ?? 1))))
        } catch(e) {}
    }
}
