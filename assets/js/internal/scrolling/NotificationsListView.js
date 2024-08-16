class Notifications extends ClassicListView {
    constructor(insert_node, error_message = 'No_count)') {
        super(null, insert_node, error_message)
        this.insert_node = insert_node
        this.profiles = []
        this.groups = []
        this.photos = []
        this.videos = []
        this.apps = []
        this.notifications = []
    }

    async nextPage() {
        let api_result = null
        let templates = document.createElement('div') 
        templates.innerHTML = `
            <div id='not_viewed'>
            
            </div>
            <div id='viewed_mark' style='display:none;'>
                <b>${_('notifications.viewed')}</b>
            </div>
        `

        let error = (text) => {
            text = text ? text : api_result.error.error_msg
            this.getInsertNode().insertAdjacentHTML('beforeend', _('errors.error_getting_notifs', text))

        }

        try {
            api_result = await window.vk_api.call(this.method_name, this.method_params)

            if(api_result.items.length < 1) {
                error(this.error.error_message)

                return
            }

            if(!api_result.photos) {
                error(_('errors.notifications_old_error'))

                return
            }

            this.profiles = api_result.profiles
            this.groups = api_result.groups
            this.photos = api_result.photos
            this.videos = api_result.videos
            this.apps = api_result.apps

            api_result.items.forEach(item => {
                const notif = new ApiNotification(item)
                const is_not_viewed = api_result.last_viewed < item.date
                this.notifications.push(notif)

                try {
                    if(!is_not_viewed) {
                        templates.insertAdjacentHTML('beforeend', notif.getTemplate())
                    } else {
                        templates.querySelector('#not_viewed').insertAdjacentHTML('beforeend', notif.getTemplate())
                        templates.querySelector('#viewed_mark').style.display = 'block'
                    }
                } catch(e) {
                    console.error(e)
                    templates += _('errors.error_getting_news', e)
                    error(e)
                }
                
            })
        } catch(e) {
            console.error(e)
            error()
        }

        this.method_params.start_from = api_result.next_from

        if(window.site_params.get('ux.save_scroll', '0') == '1') {
            window.main_url.setParam('start_hash', api_result.next_from)
            Utils.push_state(window.main_url)
        }

        this.getInsertNode().insertAdjacentHTML('beforeend', templates.innerHTML)
        if(api_result.next_from) {
            this.createNextPage()
        } else {
            u('.show_more').remove()
        }
    }

    clear() {
        delete this.method_params.start_from
        this.getInsertNode().innerHTML = ''
    }
}
