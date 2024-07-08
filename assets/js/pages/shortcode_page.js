window.page_class = new class {
    async render_page() {
        let shortcode = window.main_class['hash_params'].shortcode
        
        let res = await window.vk_api.call('utils.resolveScreenName', {'screen_name': shortcode})
        let page = ''
    
        if(!res.response.type) {
            window.location.assign('https://vk.com/' + shortcode)
            return
        }

        switch(res.response.type) {
            case 'user':
                page = 'id'
                break
            case 'group':
            case 'event':
            case 'page':
                page = 'club'
                break
            case 'application':
            case 'vk_app':
                page = 'app'
                break
        }

        window.router.route(`#${page}${res.response.object_id}`)
    }
}