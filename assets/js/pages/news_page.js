window.page_class = new class {
    async render_page() {
        $('.page_content')[0].insertAdjacentHTML('beforeend', 
            `
            <div class='newsfeed_wrapper'>
                <div class='newsfeed_wrapper_posts'></div>
            </div>
            `
        )

        let news = new Newsfeed(Post, $('.newsfeed_wrapper_posts')[0])
        news.setParams('newsfeed.get', {'filters': 'post', 'count': 10, 'fields': 'photo_50,photo_200'})
        
        if(window.s_url.searchParams.has('start_hash')) {
            news.method_params.start_from = window.s_url.searchParams.get('start_hash')
        }

        await news.nextPage()
    }
}
