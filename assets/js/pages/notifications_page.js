window.page_class = new class {
    async render_page() {
        document.title = _(`notifications.notifications`)
        let tab = window.main_class['hash_params'].section ?? 'def'
        let method = 'notifications.get'
        let method_params = {'count': 10, 'mark_as_viewed_after': 1}
        
        $('.page_content')[0].insertAdjacentHTML('beforeend', 
            `
            <div class='layer_two_columns default_wrapper newsfeed_wrapper'>
                <div class='bordered_block'>
                    <div class='notifications_insert notifications_list flex_column'></div>
                </div>
            </div>
            `
        )

        window.main_classes['wall'] = new Notifications('.notifications_insert')
        window.main_classes['wall'].setParams(method, method_params)
        
        if(window.main_url.hasParam('start_hash')) {
            window.main_classes['notifications'].method_params.start_from = window.main_url.getParam('start_hash')
        }

        await window.main_classes['wall'].nextPage()
        setTimeout(async () => {
            await window.vk_api.call('notifications.markAsViewed')
            $('.navigation #_notifications .counter').remove()

            /*try {
                $('#viewed_mark')[0].style.display = 'none'
            } catch(e) {}*/
        }, 5000)
    }
}
