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
        let templates = ''
        let error = (text) => {
            text = text ? text : api_result.error.error_msg
            this.getInsertNode().insertAdjacentHTML('beforeend', _('errors.error_getting_notifs', text))

        }

        try {
            api_result = await window.vk_api.call(this.method_name, this.method_params)

            if(api_result.response.items.length < 1) {
                error(this.error.error_message)

                return
            }

            if(!api_result.response.photos) {
                error(_('errors.notifications_old_error'))

                return
            }

            this.profiles = api_result.response.profiles
            this.groups = api_result.response.groups
            this.photos = api_result.response.photos
            this.videos = api_result.response.videos
            this.apps = api_result.response.apps

            api_result.response.items.forEach(item => {
                const notif = new ApiNotification(item)

                this.notifications.push(notif)

                try {
                    templates += notif.getTemplate()
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

        this.method_params.start_from = api_result.response.next_from

        if(window.site_params.get('ux.save_scroll', '0') == '1') {
            window.main_url.setParam('start_hash', api_result.response.next_from)
            Utils.push_state(window.main_url)
        }

        this.getInsertNode().insertAdjacentHTML('beforeend', templates)
        if(api_result.response.next_from) {
            this.createNextPage()
        } else {
            $('.show_more').remove()
        }
    }

    clear() {
        delete this.method_params.start_from
        this.getInsertNode().innerHTML = ''
    }
}
