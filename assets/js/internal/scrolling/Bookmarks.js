class Bookmarks extends ClassicListView {
    constructor(insert_node)
    {
        super(null, insert_node)
        
        this.objects_list = []
        this.objects.profiles = []
        this.objects.groups = []
    }

    async page(page_number = 0)
    {
        let templates_insert = ''
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

        if(this.inverse) {
            api_result.response.items = api_result.response.items.reverse()
        }

        const items  = api_result.response.items
        this.objects.profiles = this.objects.profiles.concat(api_result.response.profiles)
        this.objects.groups = this.objects.groups.concat(api_result.response.groups)

        if(api_result.error) {
            this.causeError(api_result.error.error_msg)

            return
        }
        
        this.updateCounters(api_result.response.count, page_number)

        if(this.getCount() < 1) {
            this.causeEmptyError()
        }

        if(items) {
            items.forEach(obj => {
                templates_insert += this.insertItem(obj)
            })
        }

        this.getInsertNode().insertAdjacentHTML('beforeend', templates_insert)
        this.objects_list = this.objects_list.concat(items)

        this.saveProgress()
        this.updatePaginator()
    }

    insertItem(obj) {
        let obj_class = null
        const additional = {}
        let return_template = ``

        switch(obj.type) {
            default:
                obj_class = UnknownListView
                break
            case 'user':
                obj_class = UserListView
                break
            case 'group':
                obj_class = ClubListView
                break
            case 'post':
                obj_class = Post
                break
            case 'article':
                obj_class = ArticleListView
                break
            case 'link':
                obj_class = Link
                additional.forceVertical = true

                break
            case 'video':
                obj_class = VideoListView
                break
        }
        
        let obj_item = new obj_class
        obj_item.hydrate(obj[obj.type], this.objects.profiles, this.objects.groups)
        
        try {
            let templater = '<div>' 
            templater += obj_item.getTemplate(additional)

            if(obj.tags && obj.tags.length > 0) {
                templater += `
                <div class='template_tags_inserter'>
                    <b>${_('bookmarks.tags')}:</b>
                `

                obj.tags.forEach(tag => {
                    templater += `
                        <div>
                            <a href='#fave/${obj.type}?tag=${tag.id}'>${Utils.escape_html(tag.name)}</a>
                        </div>
                    `
                })

                templater += `</div>`
            }

            templater += '</div>'
            return_template += templater
        } catch(e) {
            console.error(e)

            return_template += `
                <div class='error_template bordered_block'>
                    <span>${_('errors.template_insert_failed', Utils.escape_html(e.message))}</span>
                </div>
            `
        }

        return return_template
    }

    localSearch(query) {
        if(query.length < 1) {
            this.getInsertNode().innerHTML = this.old_templates
            this.old_templates = null

            if(!window.showMoreObserver) {
                main_class.init_observers()
            } else {
                window.showMoreObserver.observe(u('.show_more').nodes[0])
            }

            return
        } else {
            if(this.old_templates == null || this.old_templates == undefined) {
                this.old_templates = this.getInsertNode().innerHTML
            }
        }

        const arr = this.objects_list.filter(obj => Utils.array_deep_search(obj, query));
        if(arr && arr.length > 0) {
            let all_templates = ''
            if(u('.show_more').nodes[0] && window.showMoreObserver) {
                window.showMoreObserver.unobserve(u('.show_more').nodes[0])
            }
            
            this.clear()
            arr.forEach(obj => {
                all_templates += this.insertItem(obj)
            })

            this.getInsertNode().insertAdjacentHTML('beforeend', all_templates)
        } else {
            return
        }
    }
}
