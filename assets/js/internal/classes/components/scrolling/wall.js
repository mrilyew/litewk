class Wall extends ClassicListView {
    setParams(method_name, method_params, inverse = false) 
    {
        this.method_name       = method_name
        this.method_params     = method_params
        this.objects.perPage   = method_params.count ?? 10
        method_params.count    = this.objects.perPage ?? 10

        this.inverse           = inverse
    }

    async nextPage()
    {
        let page_condition = false

        // Inversing
        if(this.inverse) {
            if(!this.objects.count) {
                await new Promise(pr => setTimeout(pr, 3000))
                let count = await window.vk_api.call(this.method_name, this.method_params) 

                this.objects.count = count.response.count
            }

            this.objects.pagesCount = Math.ceil(this.objects.count / this.objects.perPage)

            if(this.objects.page == -1) {
                this.objects.page = this.objects.pagesCount - 1
            }

            if(this.objects.page < 0) {
                console.info('Last page reached. Do not care.')

                $('.show_more').remove()
                return
            }

            try {
                await this.page(this.objects.page)
            } catch(e) {
                console.error(e)

                return 'ERR'
            }

            page_condition = this.objects.page >= 0
        } else {
            if(this.objects.pagesCount < this.objects.page + 1) {
                console.info('Last page reached. Do not care.')
                $('.show_more').remove()

                return
            }

            if(this.objects.page == -1) {
                this.objects.page = 0
            }

            try {
                await this.page(this.objects.page)
            } catch(e) {
                console.error(e)

                return 'ERR'
            }
            
            page_condition = this.objects.pagesCount > this.objects.page
        }

        if(page_condition) {
            this.createNextPage()
        } else {
            $('.show_more').remove()
        }

        if(window.site_params.get('ux.save_scroll', '0') == '1') {
            window.setParam('page', this.objects.page)
            
            Utils.replace_state(window.main_url)
        }
    }

    async page(number = 0)
    {
        if(number < 0) {
            number = 0
        }
        
        let objects_data = null
        this.method_params.offset = number * this.objects.perPage + (this.objects.special_offset ?? 0)

        let error = () => {
            this.objects.count = 0
            this.objects.pagesCount = 0

            this.getInsertNode().insertAdjacentHTML('beforeend', `
                <div class='bordered_block'>${_('errors.error_getting_wall', objects_data.error.error_msg ? objects_data.error.error_msg : 'unknown error :( maybe timeout')}</div>
            `)
        }

        try {
            objects_data = await window.vk_api.call(this.method_name, this.method_params, false)

            if(!objects_data.response) {
                objects_data.response = {}
                objects_data.count = 0
            }
        } catch(e) {
            error()
            return
        }

        let zero_items_message = _('wall.no_posts_in_tab')
        let items  = objects_data.response.items
        let count  = objects_data.response.count

        switch(this.method_name) {
            default:
                zero_items_message  = _('wall.no_posts_in_tab')
                break
            case 'wall.getComments':
                count = objects_data.response.current_level_count
                break
            case 'wall.search':
                zero_items_message = _('wall.no_posts_in_search')
                break
        }

        this.objects.count = count

        if(objects_data.error) {
            error()
            return
        }

        if(this.method_name != 'wall.getComments' && this.objects.count < 1) {
            this.getInsertNode().insertAdjacentHTML('beforeend', `
                <div class='bordered_block'>${zero_items_message}</div>
            `)
        }

        if(this.inverse) {
            objects_data.response.items = objects_data.response.items.reverse()
        } else {
            this.objects.pagesCount = Math.ceil(this.objects.count / this.objects.perPage)
        }

        let templates = ''

        if(items) {
            items.forEach(obj => {
                let ob_j = new this.object_class
                ob_j.hydrate(obj, objects_data.response.profiles, objects_data.response.groups)

                try {
                    templates += ob_j.getTemplate()
                } catch(e) {
                    console.error(e)
    
                    templates += `
                        <div class='error_template bordered_block'>
                            <span>${_('errors.template_insert_failed', Utils.escape_html(e.message))}</span>
                        </div>
                    `
                }
            })
        }

        if(this.inverse) {
            this.objects.page = Number(number) - 1
        } else {
            this.objects.page = Number(number) + 1
        }
        
        this.getInsertNode().insertAdjacentHTML('beforeend', templates)
        this.updatePaginator()
    }

    setSection(section, query = null) 
    {
        if(query) {
            return this.search(query)
        }

        let temp_params = this.method_params
        
        temp_params.filter = section
        temp_params.offset = 0
        this.objects.page = -1

        this.setParams(this.method_name, temp_params)
        this.clear()

        this.nextPage()
    }

    async search(query) 
    {
        this.objects.perPage = 100

        let temp_params = this.method_params
        temp_params.owner_id = this.method_params.owner_id

        if(this.objects.page == -1) {
            temp_params.offset = 0
        } else {
            temp_params.offset = this.objects.page * this.objects.perPage
        }

        temp_params.query = query
        temp_params.owners_only = Number(window.main_url.getParam('wall_owners_only')) == 1 ? 1 : 0

        // Баг это или фича, но при вызове wall.search 'count' недействительный. Так что вот так вот.
        temp_params.count  = 100

        this.setParams('wall.search', temp_params)

        let temp_url = new BetterURL(location.href)

        temp_url.setParam('wall_section', 'search')
        temp_url.setParam('wall_query', query)

        Utils.replace_state(temp_url)
        
        temp_url = null

        this.clear()
        await this.nextPage()

        SavedPage.save(temp_url.href)
    }
}
