class Bookmarks extends ClassicListView {
    constructor(insert_node)
    {
        super(null, insert_node)
        
        this.objects_list = []
        this.objects.profiles = []
        this.objects.groups = []
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
                <div class='bordered_block error_block'>${_('errors.error_getting_wall', objects_data.error.error_msg ? objects_data.error.error_msg : 'unknown error :( maybe timeout')}</div>
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

        let messej = _('errors.bookmarks_all_not_found')
        let items  = objects_data.response.items
        let count  = objects_data.response.count
        this.objects.count = count
        this.objects.profiles = this.objects.profiles.concat(objects_data.response.profiles)
        this.objects.groups = this.objects.groups.concat(objects_data.response.groups)

        if(objects_data.error) {
            error()
            return
        }

        if(this.objects.count < 1) {
            this.getInsertNode().insertAdjacentHTML('beforeend', `
                <div class='bordered_block error_block'>${messej}</div>
            `)
        }

        if(items.length < 10) {
            this.objects.pagesCount = number + 1
        } else {
            this.objects.pagesCount = Math.ceil(this.objects.count / this.objects.perPage)
        }

        let templates = ''
        
        if(items) {
            items.forEach(obj => {
                templates += this.insertItem(obj)
            })
        }

        this.objects.page = Number(number) + 1
        this.objects_list = this.objects_list.concat(items)

        this.getInsertNode().insertAdjacentHTML('beforeend', templates)
        this.updatePaginator()
    }

    insertItem(obj) {
        let obj_class = null
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
                obj_class = LinkListView
                break
            case 'video':
                obj_class = VideoListView
                break
        }
        
        let obj_item = new obj_class
        obj_item.hydrate(obj[obj.type], this.objects.profiles, this.objects.groups)

        try {
            let templater = '<div>' 
            templater += obj_item.getTemplate()

            if(obj.tags && obj.tags.length > 0) {
                templater += `
                <div class='template_tags_inserter'>
                    <b>${_('bookmarks.tags')}:</b>
                `

                obj.tags.forEach(tag => {
                    templater += `
                        <div>
                            <a href='#fave/${tag.id}/${obj.type}'>${Utils.escape_html(tag.name)}</a>
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
                    <span>${_('errors.template_insert_failed', escape_html(e.message))}</span>
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
                window.showMoreObserver.observe($('.show_more')[0])
            }

            return
        } else {
            if(this.old_templates == null || this.old_templates == undefined) {
                this.old_templates = this.getInsertNode().innerHTML
            }
        }

        let arr = this.objects_list.filter(obj => Utils.array_deep_search(obj, query));
        if(arr && arr.length > 0) {
            let all_templates = ''

            if($('.show_more')[0] && window.showMoreObserver) {
                window.showMoreObserver.unobserve($('.show_more')[0])
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
