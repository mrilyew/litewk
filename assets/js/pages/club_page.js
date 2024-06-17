window.page_class = new class {
    async render_page() {
        let id = window.s_url.searchParams.get('id')
        if(!id || id == '0') {
            add_onpage_error(':(')
            return
        }

        let club = new Club()
        await club.fromId(id)

        if(!club.info) {
            add_onpage_error(_('errors.group_not_found', id))
            return
        }

        document.title = escape_html(club.getName())

        $('.page_content')[0].insertAdjacentHTML('beforeend', await club.getTemplate())
    
        // Drawing wall
        if(club.hasAccess()) {
            // Wall sections
            let wall_sections = ['all', 'owner']
            
            if(club.isAdmin()) {
                wall_sections.push('suggests')
                wall_sections.push('postponed')
            }

            let wall_temp = window.s_url.searchParams.get('wall_section') ?? 'all'
            let wall_section = wall_temp && wall_sections.includes(wall_temp) ? wall_temp : 'all' // Wall active section

            // Get wall template
            let wall_template_ = await wall_template(club.getId(), wall_sections, wall_section)
            
            // Inserting wall
            $('.club_page_wrapper')[0].insertAdjacentHTML('beforeend', wall_template_)
            $(`.wall_block a[data-section='${wall_section}']`).addClass('selectd')

            // Creating wall as object
            let wall_params  = {'owner_id': club.getRealId(), 'extended': 1, 'filter': wall_sections.includes(wall_section) ? wall_section : 'all', 'fields': 'image_status,friend_status,photo_50,photo_200,sex'}
            window.main_classes['wall'] = new ClassicListView(Post, $('.club_page_wrapper .wall_block .wall_block_insert')[0])
            window.main_classes['wall'].setParams('wall.get', wall_params, window.s_url.searchParams.get('wall_invert') == 'yes')
            
            if(window.s_url.searchParams.has('page')) {
                window.main_classes['wall'].objects.page = Number(window.s_url.searchParams.get('page'))
            }

            if(wall_temp != 'search') {
                window.main_classes['wall'].clear()
                await window.main_classes['wall'].nextPage()
            } else {
                $('.wall_block .searchIcon').trigger('click')
                $(`.wall_block input[type='query']`)[0].value = window.s_url.searchParams.get('wall_query')
                await window.main_classes['wall'].search(window.s_url.searchParams.get('wall_query'))
            }
        }
    }
}
