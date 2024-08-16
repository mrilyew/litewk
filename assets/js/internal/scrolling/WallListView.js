class Wall extends ClassicListView {
    async nextPage()
    {
        if(this.inverse) {
            if(!this.objects.count) {
                let temp_count_params = Object.assign({}, this.method_params)
                temp_count_params.count  = 1
                temp_count_params.offset = 0

                const count = await window.vk_api.call(this.method_name, temp_count_params)
                this.updateCounters(count.count)

                await Utils.sleep(2000)
            }
        }
        
        const result = await super.nextPage()
        this.updateReactions(result.response.reaction_sets)
    }

    updateReactions(reaction_sets) {
        this.objects.reaction_sets = reaction_sets
    }

    hydrateFirstPage(api_result) {
        this.updateReactions(api_result.reaction_sets)
        this.page(0, {'response': api_result})

        if(this.getPagesCount() > this.getPage()) {
            this.createNextPage()
        }

        return
    }

    insertItems(items, profiles, groups) {
        if(window.site_params.get('ux.previous_page_deletion', '0') == '0') {
            items.forEach(item => {
                const item_class = new this.object_class
                item_class.hydrate(item, profiles, groups, this.objects.reaction_sets)
    
                try {
                    this.getInsertNode().insertAdjacentHTML('beforeend', item_class.getTemplate())
                } catch(e) {
                    console.error(e)
    
                    this.causeError(_('errors.template_insert_failed', Utils.escape_html(e.message)))
                }
            })
        } else {
            let whole_html = `<div class='scrollPage' id='_scrollpage${this.getPage()}'>`
            items.forEach(item => {
                const item_class = new this.object_class
                item_class.hydrate(item, profiles, groups, this.objects.reaction_sets)
    
                try {
                    whole_html += item_class.getTemplate()
                } catch(e) {
                    console.error(e)
    
                    this.causeError(_('errors.template_insert_failed', Utils.escape_html(e.message)))
                }
            })

            whole_html += `</div>`
            
            this.getInsertNode().insertAdjacentHTML('beforeend', whole_html)

            const scrollPages = u('.scrollPage').length
            if(scrollPages > 3) {
                u('.scrollPage').nodes[0].remove()
                u('.scrollPage').children().nodes[9].scrollIntoView()
            }
        }
    }

    setSection(section) 
    {
        let temp_params = this.method_params

        temp_params.filter = section
        temp_params.offset = 0

        this.setParams('wall.get', temp_params)
        this.clear()
        this.objects.page = -1

        this.nextPage()
    }

    setParams(method_name, method_params) 
    {
        super.setParams(method_name, method_params)

        switch(method_name) {
            case 'wall.get':
                switch(method_params.filter) {
                    case 'all':
                        this.error_empty_message = _('errors.wall_empty_posts')
                        break
                    default:
                        this.error_empty_message = _('errors.tab_empty_posts')
                        break
                }

                break
            case 'wall.search':
                this.error_empty_message = _('errors.search_wall_not_found')
                break
        }
    }

    async search(query = '') 
    {
        this.objects.perPage = 100

        let temp_params = this.method_params
        temp_params.owner_id = this.method_params.owner_id

        if(this.objects.page == -1) {
            temp_params.offset = 0
        } else {
            temp_params.offset = this.objects.page * this.objects.perPage
        }
        
        // Баг это или фича, но при вызове wall.search 'count' недействительный. Так что вот так вот.
        temp_params.count = 100

        temp_params.q = query
        temp_params = Utils.applyPostsSearchParams(window.main_url, temp_params)

        if(temp_params.q) {
            temp_params.query = temp_params.q
        }

        this.setParams('wall.search', temp_params)

        let temp_url = new BetterURL(location.href)
        
        temp_url.setParam('section', 'search')
        temp_url.setParam('q', query ?? '')

        Utils.replace_state(temp_url)
        this.clear()

        await this.nextPage()

        SavedPage.save(temp_url.href)
    }

    static getTabsByEntity(entity) {
        const wall_sections = ['all', 'owner']

        if(entity.getRealId() > 0) {
            if(entity.isThisUser()) {
                wall_sections.push('others')
                wall_sections.push('archived')
            } else if(entity.canSeeAllPosts()) {
                wall_sections.push('others')
            }
        } else {
            if(entity.isAdmin()) {
                wall_sections.push('suggests')
                wall_sections.push('postponed')
            }

            if(entity.info.can_suggest == 1) {
                wall_sections.push('suggests')
            }
        }

        return wall_sections
    }

    static async fastWallCreate(entity, process_tabs = true, hydrate = true) {
        let wall_temp = main_url.getParam('section') ?? 'all'
        const wall_sections = Wall.getTabsByEntity(entity)

        if(!main_url.getParams('section')) {
            wall_temp = entity.info.wall_default
        }

        const wall_section = wall_temp && wall_sections.includes(wall_temp) ? wall_temp : 'all'
        const wall_invert  = main_url.getParam('invert') == '1'

        if(process_tabs) {
            u('.wall_inserter').append(window.templates.wall(entity.getRealId(), wall_sections, wall_section, wall_invert))
        }

        // Creating wall as object
        const wall_params = {'owner_id': entity.getRealId(), 'extended': 1, 'count': 10, 'filter': wall_sections.includes(wall_section) ? wall_section : 'all', 'fields': window.consts.TYPICAL_FIELDS}
        window.main_classes['wall'] = new Wall(Post, '.wall_block_insert', _('errors.wall_empty_posts'), window.templates.wall_skeleton)
        window.main_classes['wall'].setParams('wall.get', wall_params)

        if(entity.info.counters && hydrate) {
            window.main_classes['wall'].updateCounters(entity.info.counters.posts, -1)
        }

        if(main_url.hasParam('page')) {
            window.main_classes['wall'].updateCounters(null, Number(main_url.getParam('page')))
        }

        window.main_classes['wall'].toggleInverse(wall_invert)

        if(wall_temp != 'search') {
            if(entity.info.posts && hydrate && window.main_classes['wall'].getPage() < 2) {
                window.main_classes['wall'].hydrateFirstPage(entity.info.posts)
            } else {
                await window.main_classes['wall'].nextPage()
            }
            
            return
        }

        u('.wall_block .searchIcon').trigger('click')
        u(`.wall_block input[type='query']`).attr('value', main_url.getParam('q'))

        await window.main_classes['wall'].search(main_url.getParam('q'))
    }
}
