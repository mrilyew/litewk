window.page_class = new class {
    async render_page() {
        let id = window.s_url.searchParams.get('id')
        if(!id || id == '0') {
            add_onpage_error(':(')
            return
        }

        // Drawing user page
        let info = null

        try {
            info = (await window.vk_api.call('groups.getById', {'group_id': id, 'fields': 'activity,addresses,age_limits,ban_info,can_create_topic,can_message,can_post,can_suggest,can_see_all_posts,can_upload_doc,can_upload_story,can_upload_video,city,contacts,counters,country,cover,crop_photo,description,fixed_post,has_photo,is_favorite,is_hidden_from_feed,is_messages_blocked,links,main_album_id,main_section,member_status,members_count,place,public_date_label,site,start_date,finish_date,status,trending,verified,wall,wiki_page'}, false)).response.groups[0]
        } catch(e) {}
        
        if(!info) {
            add_onpage_error(_('errors.group_not_found', id))
            return
        }
    
        let club = new Club(info)
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
            let wall_params  = {'owner_id': club.getRealId(), 'extended': 1, 'filter': wall_sections.includes(wall_section) ? wall_section : 'all'}
            window.wall = new ClassicListView(post_template, $('.club_page_wrapper .wall_block .wall_block_insert')[0])
            window.wall.setParams('wall.get', wall_params, window.s_url.searchParams.get('wall_invert') == 'yes')
            
            if(window.s_url.searchParams.has('page')) {
                window.wall.objects.page = Number(window.s_url.searchParams.get('page'))
            }

            if(wall_temp != 'search') {
                window.wall.clear()
                await window.wall.nextPage()
            } else {
                $('.wall_block .searchIcon').trigger('click')
                $(`.wall_block input[type='query']`)[0].value = window.s_url.searchParams.get('wall_query')
                await window.wall.search(window.s_url.searchParams.get('wall_query'))
            }
        }
    }
}
