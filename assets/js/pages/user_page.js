window.page_class = new class {
    async render_page() {
        let id = window.main_class['hash_params'].id
        let searchParams = new URL(location.href).searchParams

        if(id == 0 || id == null) {
            id = window.active_account.info.id
        }
    
        let user = new User()
        await user.fromId(id)
        
        if(!user.info) {
            add_onpage_error(_('errors.profile_not_found', id))
            return
        }

        document.title = Utils.escape_html(user.getName())

        $('.page_content')[0].insertAdjacentHTML('beforeend', await user.getTemplate())
    
        // Show reg date
        if(window.site_params.get('ux.show_reg', '0') == '1') {
            $('#__regdate')[0].innerHTML = _('messagebox.loading_shy')
            try {
                $('#__regdate')[0].innerHTML = await user.getRegistrationDate()
            } catch(e) {
                $('#__regdate')[0].innerHTML = _('user_page.error_getting_registration_date')
            }
        }
        
        // Drawing wall
        if(user.hasAccess() && !user.isDeactivated()) {
            // Wall sections
            let wall_sections = ['all', 'owner']
            
            if(user.isThisUser()) {
                wall_sections.push('others')
                wall_sections.push('archived')
            } else if(user.info.can_see_all_posts == 1) {
                wall_sections.push('others')
            }

            let wall_temp = searchParams.get('wall_section') ?? 'all'

            if(!searchParams.get('wall_section')) {
                wall_temp = user.info.wall_default
            }

            let wall_section = wall_temp && wall_sections.includes(wall_temp) ? wall_temp : 'all' // Wall active section

            // Get wall template
            let wall_template_ = await window.templates.wall(user.getId(), wall_sections, wall_section, searchParams.get('wall_invert') == 'yes')
            
            // Inserting wall
            $('.user_page_wrapper')[0].insertAdjacentHTML('beforeend', wall_template_)
            $(`.wall_block a[data-section='${wall_section}']`).addClass('selectd')

            // Creating wall as object
            let wall_params   = {'owner_id': user.getId(), 'extended': 1, 'count': 10, 'filter': wall_sections.includes(wall_section) ? wall_section : 'all', 'fields': window.typical_fields}
            window.main_classes['wall'] = new Wall(Post, '.user_page_wrapper .wall_block .wall_block_insert')
            window.main_classes['wall'].setParams('wall.get', wall_params, searchParams.get('wall_invert') == 'yes')
            
            window.main_classes['wall'].objects.count = user.info.counters.posts

            if(searchParams.has('page')) {
                window.main_classes['wall'].objects.page = Number(searchParams.get('page')) - 1
            }

            if(wall_temp != 'search') {
                await window.main_classes['wall'].nextPage()
            } else {
                // Reactjsing
                $('.wall_block .searchIcon').trigger('click')
                $(`.wall_block input[type='query']`)[0].value = searchParams.get('wall_query')
                await window.main_classes['wall'].search(searchParams.get('wall_query'))
            }
        }
    }
}
