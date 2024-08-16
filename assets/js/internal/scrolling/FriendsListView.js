class Friends extends ClassicListView {
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

        let items  = objects_data.response.items
        let count  = objects_data.response.count
        let error_message = ''

        switch(this.method_name) {
            default:
                break
            case 'friends.get':
                if(this.method_params.list_id) {
                    error_message = _('errors.friends_list_error')
                } else {
                    error_message = _('errors.friends_get_error')
                }
                
                break
            case 'friends.getOnline':
                error_message = _('errors.friends_get_online_error')

                count = objects_data.response.total_count
                items = objects_data.response.online
                break
            case 'friends.search':
                error_message = _('errors.friends_search_error')

                break
            case 'friends.getRequests':
                if(this.method_params.out == 0) {
                    error_message = _('errors.friends_incoming_error')
                } else {
                    error_message = _('errors.friends_outcoming_error')
                }

                break
            case 'friends.getSuggestions':
                error_message = _('errors.friends_suggestions_error')

                break
            case 'users.getFollowers':
                error_message = _('errors.friends_followers_error')

                break
            case 'execute':
                error_message = _('errors.friends_mutual_error')

                break
        }
        this.objects.count = count

        if(objects_data.error) {
            error()
            return
        }

        if(this.objects.count < 1) {
            this.getInsertNode().insertAdjacentHTML('beforeend', `
                ${error_message}
            `)
        }

        this.objects.pagesCount = Math.ceil(this.objects.count / this.objects.perPage)
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

        this.objects.page = Number(number) + 1
        this.getInsertNode().insertAdjacentHTML('beforeend', templates)
        this.updatePaginator()
    }
}