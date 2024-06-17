window.page_class = new class {
    async render_page() {
        let id = window.s_url.searchParams.get('id')
        if(id == 0 || id == null) {
            id = window.active_account.vk_info.id
        }
    
        let user = new User()
        await user.fromId(id)

        if(!user.info) {
            add_onpage_error(_('errors.profile_not_found', id))
            return
        }

        document.title = escape_html(user.getName())

        $('.page_content')[0].insertAdjacentHTML('beforeend', await user.getTemplate())
    
        // Drawing wall
        if(user.hasAccess() && !user.isDeactivated()) {
            // Wall sections
            let wall_sections = ['all', 'owner']
            
            if(user.isThisUser()) {
                wall_sections.push('others')
                wall_sections.push('archived')
            }

            let wall_temp = window.s_url.searchParams.get('wall_section') ?? 'all'
            let wall_section = wall_temp && wall_sections.includes(wall_temp) ? wall_temp : 'all' // Wall active section

            // Get wall template
            let wall_template_ = await wall_template(user.getId(), wall_sections, wall_section)
            
            // Inserting wall
            $('.user_page_wrapper')[0].insertAdjacentHTML('beforeend', wall_template_)
            $(`.wall_block a[data-section='${wall_section}']`).addClass('selectd')

            // Creating wall as object
            let wall_params   = {'owner_id': user.getId(), 'extended': 1, 'count': 10, 'filter': wall_sections.includes(wall_section) ? wall_section : 'all', 'fields': 'image_status,friend_status,photo_50,photo_200,sex'}
            window.main_classes['wall'] = new ClassicListView(Post, '.user_page_wrapper .wall_block .wall_block_insert')
            window.main_classes['wall'].setParams('wall.get', wall_params, window.s_url.searchParams.get('wall_invert') == 'yes')
            
            window.main_classes['wall'].objects.count = user.info.counters.posts

            if(window.s_url.searchParams.has('page')) {
                window.main_classes['wall'].objects.page = Number(window.s_url.searchParams.get('page')) - 1
            }

            if(wall_temp != 'search') {
                await window.main_classes['wall'].nextPage()
            } else {
                // Reactjsing
                $('.wall_block .searchIcon').trigger('click')
                $(`.wall_block input[type='query']`)[0].value = window.s_url.searchParams.get('wall_query')
                await window.main_classes['wall'].search(window.s_url.searchParams.get('wall_query'))
            }
        }
    }
}
