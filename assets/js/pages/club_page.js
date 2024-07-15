window.page_class = new class {
    async render_page() {
        let id = window.main_class['hash_params'].id
        if(!id || id == '0') {
            main_class.add_onpage_error(':(')
            return
        }

        let club = new Club()
        await club.fromId(id, true)

        if(!club.info) {
            main_class.add_onpage_error(_('errors.group_not_found', id))
            return
        }

        document.title = Utils.escape_html(club.getName())

        $('.page_content')[0].insertAdjacentHTML('beforeend', club.getTemplate())
    
        // Drawing wall
        if(club.hasAccess()) {
            // Wall sections
            let wall_sections = ['all', 'owner']
            
            if(club.isAdmin()) {
                wall_sections.push('suggests')
                wall_sections.push('postponed')
            }

            if(club.info.can_suggest == 1) {
                wall_sections.push('suggests')
            }

            let wall_temp = main_url.getParam('wall_section') ?? 'all'
            let wall_section = wall_temp && wall_sections.includes(wall_temp) ? wall_temp : 'all' // Wall active section

            if(club.info.deactivated != 'banned' && club.hasAccess()) {
                // Get wall template
                let wall_template_ = await window.templates.wall(club.getRealId(), wall_sections, wall_section)
                            
                // Inserting wall
                $('.wall_inserter')[0].insertAdjacentHTML('beforeend', wall_template_)
                $(`.wall_block a[data-section='${wall_section}']`).addClass('selected')

                // Creating wall as object
                let wall_params  = {'owner_id': club.getRealId(), 'extended': 1, 'filter': wall_sections.includes(wall_section) ? wall_section : 'all', 'fields': window.typical_fields}
                window.main_classes['wall'] = new Wall(Post, '.club_page_wrapper .wall_block .wall_block_insert')
                window.main_classes['wall'].setParams('wall.get', wall_params, main_url.getParam('wall_invert') == 'yes')
                
                if(main_url.hasParam('page')) {
                    window.main_classes['wall'].objects.page = Number(main_url.getParam('page'))
                }

                if(wall_temp != 'search') {
                    window.main_classes['wall'].clear()
                    await window.main_classes['wall'].nextPage()
                } else {
                    $('.wall_block .searchIcon').trigger('click')
                    $(`.wall_block input[type='query']`)[0].value = main_url.getParam('wall_query')
                    await window.main_classes['wall'].search(main_url.getParam('wall_query'))
                }
            } else {
                $('.club_page_wrapper')[0].insertAdjacentHTML('beforeend', Utils.format_mentions(Utils.escape_html(club.info.deactivated_message)))
            }
        }
    }
}
