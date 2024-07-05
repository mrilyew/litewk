window.page_class = new class {
    async render_page() {
        document.title = _('search.search')
          
        let section = window.s_url.searchParams.get('section') ?? 'all'
        let tabs_html = ``
        let method = 'users.search'
        let method_params = {'count': 10, 'extended': 1, 'fields': window.typical_group_fields + ',' + window.typical_fields}
        let SearchClass = null

        switch(section) {
            default:
                break
            case 'users':
                SearchClass = UserListView
                method = 'users.search'
                method_params.q = window.s_url.searchParams.get('query') ?? ''

                if(window.s_url.searchParams.get('group_id')) {
                    method_params.group_id = window.s_url.searchParams.get('group_id')
                }

                break
            case 'groups':
                SearchClass = ClubListView
                method = 'groups.search'
                method_params.q = window.s_url.searchParams.get('query') ?? ''
                break
            case 'posts':
                SearchClass = Post
                method = 'newsfeed.search'
                method_params.q = window.s_url.searchParams.get('query') ?? ''
                break
        }

        document.title = _(`search.search_${section}_section`)
        tabs_html = `
            <a href='site_pages/search.html?section=${section}' data-section='${section}'>${_('search.search')}</a>
        `

        let sections_list = ``
        let sections = ['all', 'users', 'groups', 'posts', 'audios', 'videos', 'photos', 'games']
        sections.forEach(el => {
            if(el == 'divider') {
                sections_list += `
                    <hr>
                `
                
                return
            }

            sections_list += `
                <a href='site_pages/search.html?section=${el}' ${section == el ? 'class=\'selectd\'' : ''}>${_(`search.search_${el}_section`)}</a>
            `
        })

        $('.page_content')[0].insertAdjacentHTML('beforeend', 
            `
                <div class='default_wrapper two_big_blocks_wrapper'>
                    <div>
                        <div class='typical_tabs bordered_block'>
                            <div class='wall_wrapper_upper_panel friend_select_tab' id='insert_paginator_here_bro'>
                                <div class='tabs'>${tabs_html}</div>
                            </div>
                        </div>

                        <div class='friends_search_fuck_block' id='_global_search' style='margin-bottom: 10px;'>
                            <input type='text' placeholder='${_('search.search')}' value='${window.s_url.searchParams.get('query') ?? ''}'>
                            <input type='button' style='margin-left: 5px;' value='${_('wall.search')}'>
                        </div>

                        <div class='search_insert bordered_block short_list'></div>
                    </div>
                    <div class='wall_wrapper_tabs bordered_block'>
                        <div>
                            ${sections_list}
                        </div>
                    </div>
                </div>
            `
        )
        
        let tab_dom = $(`.typical_tabs a[data-section='${section}']`)
        tab_dom.addClass('selectd')

        window.main_classes['wall'] = new ClassicListView(SearchClass, '.search_insert')
        window.main_classes['wall'].setParams(method, method_params)
        window.main_classes['wall'].clear()
            
        if(window.s_url.searchParams.has('page')) {
            window.main_classes['wall'].objects.page = Number(window.s_url.searchParams.get('page')) - 1
        }

        await window.main_classes['wall'].nextPage()
        if(tab_dom[0]) {
            tab_dom[0].innerHTML = tab_dom[0].innerHTML + ` (${window.main_classes['wall'].objects.count})`
        }

        $('#insert_paginator_here_bro')[0].insertAdjacentHTML('beforeend', paginator_template(window.main_classes['wall'].objects.pagesCount, (Number(window.s_url.searchParams.get('page') ?? 1))))
    }
}
