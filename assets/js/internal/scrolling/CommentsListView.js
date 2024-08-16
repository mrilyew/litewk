class Comments extends ClassicListView {
    insertItems(items, profiles, groups) {
        items.forEach(item => {
            let item_class = new this.object_class
            item_class.hydrate(item, profiles, groups)

            try {
                this.getInsertNode().insertAdjacentHTML('beforeend', item_class.getTemplate())
            } catch(e) {
                console.error(e)

                this.causeError(_('errors.template_insert_failed', Utils.escape_html(e.message)))
            }
        })
    }

    causeEmptyError() {
        if(this.method_name != 'wall.get') {
            this.objects.count = 0
            this.objects.pagesCount = 0
            
            return
        }
        
        this.causeError(_('errors.no_comments'))
    }

    async page(page_number = 0, hydrated_result = null)
    {
        if(page_number < 0) {
            page_number = 0
        }
        
        let api_result = null
        this.method_params.offset = (page_number * this.objects.perPage)

        if(!hydrated_result) {
            try {
                api_result = await window.vk_api.call(this.method_name, this.method_params, false)
    
                if(!api_result.response) {
                    api_result.response = {}
                    api_result.count = 0
                }
            } catch(e) {
                this.causeError(e.message)
    
                return
            }
        } else {
            api_result = hydrated_result
        }

        if(this.inverse) {
            api_result.response.items = api_result.response.items.reverse()
        }

        const items  = api_result.response.items

        if(api_result.error) {
            this.causeError(api_result.error.error_msg)

            return
        }
        
        this.updateCounters(api_result.response.current_level_count, page_number)

        if(this.getCount() < 1) {
            this.causeEmptyError()
        }

        if(items) {
            this.insertItems(items, api_result.response.profiles, api_result.response.groups)
        }

        this.saveProgress()
        this.updatePaginator()
    }

    /*async page(page_number = 0)
    {
        if(page_number < 0) {
            page_number = 0
        }
        
        let api_result = null
        this.method_params.offset = (page_number * this.objects.perPage)

        try {
            api_result = await window.vk_api.call(this.method_name, this.method_params, false)

            if(!api_result.response) {
                api_result.response = {}
                api_result.count = 0
            }
        } catch(e) {
            this.causeError(e.getMessage())

            return
        }

        const items  = api_result.response.items
        this.objects.count = api_result.response.current_level_count

        if(api_result.error) {
            this.causeError(api_result.error.error_msg)

            return
        }

        this.objects.pagesCount = Math.ceil(this.objects.count / this.objects.perPage)
        
        if(this.inverse) {
            this.objects.page = Number(page_number) - 1

            api_result.response.items = api_result.response.items.reverse()
        } else {
            this.objects.page = Number(page_number) + 1
        }

        if(items) {
            this.insertItems(items, api_result.response.profiles, api_result.response.groups)
        }

        this.saveProgress()
        this.updatePaginator()
    }*/

    changeSort(sort) {
        this.clear()
        this.objects.page = 0
        this.method_params.sort = sort
        
        this.nextPage()
    }

    static fastCreate(method, params, node = '.wall_wrapper_post .wall_wrapper_comments') {
        const comments = new Comments(Comment, node)
        comments.setParams(method, params)
        //params.fields = params.fields.removePart('friend_status')

        if(window.main_url.hasParam('page')) {
            comments.objects.page = Number(window.main_url.getParam('page')) - 1
        }

        comments.clear()

        return comments
    }
}
