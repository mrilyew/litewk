window.page_class = new class {
    async render_page() {
        let tab = window.s_url.searchParams.get('news_section') ?? 'def'

        $('.page_content')[0].insertAdjacentHTML('beforeend', 
            `
            <div class='newsfeed_wrapper default_wrapper wall_wrapper'>
                <div>
                    <div class='newsfeed_wrapper_posts'></div>
                </div>
                <div class='wall_wrapper_tabs bordered_block'>
                    <a href='site_pages/news_page.html?news_section=def' ${tab == 'def' ? 'class=\'selectd\'' : ''}>${_(`newsfeed.section_default`)}</a>
                    <a href='site_pages/news_page.html?news_section=smart' ${tab == 'smart' ? 'class=\'selectd\'' : ''}>${_(`newsfeed.section_smart_feed`)}</a>
                    <a href='site_pages/news_page.html?news_section=recommend' ${tab == 'recommend' ? 'class=\'selectd\'' : ''}>${_(`newsfeed.section_recommend`)}</a>
                </div>
            </div>
            `
        )

        let method = 'newsfeed.get'
        let method_params = {'filters': 'post', 'count': 10, 'fields': 'photo_50,photo_200'}

        switch(tab) {
            default:
                method = 'newsfeed.get'
                break
            case 'smart':
                method = 'execute.getNewsfeedSmart'
                method_params.feed_type = 'top'
                
                break
            case 'recommend':
                method = 'newsfeed.getRecommended'
                break
        }

        window.main_classes['wall'] = new Newsfeed(Post, '.newsfeed_wrapper_posts')
        window.main_classes['wall'].setParams(method, method_params)
        
        if(window.s_url.searchParams.has('start_hash')) {
            window.main_classes['wall'].method_params.start_from = window.s_url.searchParams.get('start_hash')
        }

        await window.main_classes['wall'].nextPage()
    }
}
