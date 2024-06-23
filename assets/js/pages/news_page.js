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
                    <div>
                        <a href='site_pages/news_page.html?news_section=def' ${tab == 'def' ? 'class=\'selectd\'' : ''}>${_(`newsfeed.section_default`)}</a>
                        <a href='site_pages/news_page.html?news_section=smart' ${tab == 'smart' ? 'class=\'selectd\'' : ''}>${_(`newsfeed.section_smart_feed`)}</a>
                        <a href='site_pages/news_page.html?news_section=recommend' ${tab == 'recommend' ? 'class=\'selectd\'' : ''}>${_(`newsfeed.section_recommend`)}</a>
                    </div>
                    <div class='wall_wrapper_newsfeed_params'>
                        <span>${_('newsfeed.newsfeed_lists')}</span>
                    </div>
                    <div id='__insertlists'></div>
                    <div class='wall_wrapper_newsfeed_params'>
                        <span>${_('newsfeed.newsfeed_params')}</span>

                        <div>
                            <label>
                                <input type='checkbox' id='__newsfeedreturnbanned' ${window.s_url.searchParams.get('return_banned') == '1' ? 'checked' : ''}>
                                ${_('newsfeed.newsfeed_return_banned')}
                            </label>

                            ${tab == 'def' || tab == 'custom' ?
                            `<label>
                                <select id='__newsfeedreturntype'>
                                    <option value='all' ${window.s_url.searchParams.get('news_type', 'all') == 'all' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_all')}</option>
                                    <option value='post' ${window.s_url.searchParams.get('news_type', 'all') == 'post' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_posts')}</option>
                                    <!--<option value='photo' ${window.s_url.searchParams.get('news_type', 'all') == 'photo' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_photo')}</option>-->
                                    <option value='photo_tag' ${window.s_url.searchParams.get('news_type', 'all') == 'photo_tag' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_photo_tags')}</option>
                                    <option value='wall_photo' ${window.s_url.searchParams.get('news_type', 'all') == 'wall_photo' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_wall_photo')}</option>
                                    <option value='video' ${window.s_url.searchParams.get('news_type', 'all') == 'video' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_video')}</option>
                                    <option value='audio' ${window.s_url.searchParams.get('news_type', 'all') == 'audio' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_audio')}</option>
                                    <option value='note' ${window.s_url.searchParams.get('news_type', 'all') == 'note' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_note')}</option>
                                    <option value='clip' ${window.s_url.searchParams.get('news_type', 'all') == 'clip' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_clips')}</option>
                                    <option value='friend' ${window.s_url.searchParams.get('news_type', 'all') == 'friend' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_friends')}</option>
                                </select>
                            </label>` : ''}
                            <label>
                                <input type='button' id='__newsfeedrefresh' value='${_('newsfeed.newsfeed_refresh')}' style='width: 100%;'>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            `
        )

        let method = 'newsfeed.get'
        let method_params = {'count': 10, 'fields': window.typical_fields, 'extended': 1}

        if(window.s_url.searchParams.get('news_type', 'all') != 'all') {
            method_params.filters = window.s_url.searchParams.get('news_type', 'all')
        }

        if(window.s_url.searchParams.get('return_banned') == '1' || window.s_url.searchParams.get('return_banned') == 'tanki') {
            method_params.return_banned = 1
        }

        switch(tab) {
            default:
                method = 'newsfeed.get'
                break
            case 'smart':
                method = 'newsfeed.getByType'
                method_params.feed_type = 'top'
                
                break
            case 'recommend':
                method = 'newsfeed.getRecommended'
                break
            case 'custom':
                method = 'newsfeed.get'

                method_params.source_ids = 'list' + window.s_url.searchParams.get('news_section_list')
                break
        }

        document.title = _(`newsfeed.newsfeed`)
        window.main_classes['wall'] = new Newsfeed('.newsfeed_wrapper_posts')
        window.main_classes['wall'].setParams(method, method_params)
        
        if(window.s_url.searchParams.has('start_hash')) {
            window.main_classes['wall'].method_params.start_from = window.s_url.searchParams.get('start_hash')
        }

        await window.main_classes['wall'].nextPage()

        window.main_classes['wall'].lists.items.forEach(list => {
            $('#__insertlists')[0].insertAdjacentHTML('beforeend', 
                `
                <a href='site_pages/news_page.html?news_section=custom&news_section_list=${list.id}&news_type=post' ${Number(window.s_url.searchParams.get('news_section_list')) == list.id ? 'class=\'selectd\'' : ''}>${list.title}</a>
                `
            )
        })
    }
}
