window.pages['news_page'] = new class {
    async render_page() {
        const tab = window.main_class['hash_params'].section ?? 'def'
        
        u('.page_content').html(`
            <div class='layer_two_columns default_wrapper newsfeed_wrapper'>
                <div>
                    <div class='newsfeed_wrapper_posts'></div>
                </div>
                <div class='layer_two_columns_tabs bordered_block'>
                    <div>
                        <a href='#feed/def' ${tab == 'def' ? 'class=\'selected\'' : ''}>${_(`newsfeed.section_default`)}</a>
                        <a href='#feed/smart' ${tab == 'smart' ? 'class=\'selected\'' : ''}>${_(`newsfeed.section_smart_feed`)}</a>
                        <a href='#feed/follow' ${tab == 'follow' ? 'class=\'selected\'' : ''}>${_(`newsfeed.section_friends`)}</a>
                        <a href='#feed/recommend' ${tab == 'recommend' ? 'class=\'selected\'' : ''}>${_(`newsfeed.section_recommend`)}</a>
                    </div>
                    <div class='layer_two_columns_params'>
                        <span>${_('newsfeed.newsfeed_lists')}</span>
                    </div>
                    <div id='__insertlists'></div>
                    <div class='layer_two_columns_params'>
                        <span>${_('newsfeed.newsfeed_params')}</span>

                        <div>
                            <label>
                                <input type='checkbox' id='__newsfeedreturnbanned' ${window.main_url.getParam('return_banned') == '1' ? 'checked' : ''}>
                                ${_('newsfeed.newsfeed_return_banned')}
                            </label>

                            ${tab == 'def' || tab == 'custom' || tab == 'frien' ?
                            `<label>
                                <select id='__newsfeedreturntype'>
                                    <option value='all' ${window.main_url.getParam('news_type', 'all') == 'all' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_all')}</option>
                                    <option value='post' ${window.main_url.getParam('news_type', 'all') == 'post' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_posts')}</option>
                                    <!--<option value='photo' ${window.main_url.getParam('news_type', 'all') == 'photo' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_photo')}</option>-->
                                    <option value='photo_tag' ${window.main_url.getParam('news_type', 'all') == 'photo_tag' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_photo_tags')}</option>
                                    <option value='wall_photo' ${window.main_url.getParam('news_type', 'all') == 'wall_photo' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_wall_photo')}</option>
                                    <option value='video' ${window.main_url.getParam('news_type', 'all') == 'video' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_video')}</option>
                                    <option value='audio' ${window.main_url.getParam('news_type', 'all') == 'audio' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_audio')}</option>
                                    <option value='note' ${window.main_url.getParam('news_type', 'all') == 'note' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_note')}</option>
                                    <option value='clip' ${window.main_url.getParam('news_type', 'all') == 'clip' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_clips')}</option>
                                    <option value='friend' ${window.main_url.getParam('news_type', 'all') == 'friend' ? 'selected' : ''}>${_('newsfeed.newsfeed_type_friends')}</option>
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
        let method_params = {'count': 10, 'fields': window.Utils.typical_fields + ',' + window.Utils.typical_groups_fields, 'extended': 1}
        let title_sub = null

        if(window.main_url.getParam('news_type', 'all') != 'all') {
            method_params.filters = window.main_url.getParam('news_type', 'all')
        }

        if(window.main_url.getParam('return_banned') == '1' || window.main_url.getParam('return_banned') == 'tanki') {
            method_params.return_banned = 1
        }

        switch(tab) {
            default:
                method = 'newsfeed.get'
                title_sub = _('newsfeed.section_default')

                break
            case 'smart':
                method = 'newsfeed.getByType'
                method_params.feed_type = 'top'
                title_sub = _('newsfeed.section_smart_feed')
                
                break
            case 'recommend':
                method = 'newsfeed.getRecommended'
                title_sub = _('newsfeed.section_recommend')

                break
            case 'follow':
                method = 'newsfeed.get'
                title_sub = _('newsfeed.section_friends')

                method_params.source_ids = 'friends,following'
                break
            case 'frien':
                method = 'newsfeed.get'
                title_sub = _('newsfeed.section_only_friends')

                method_params.source_ids = 'friends'
                break
            case 'custom':
                method = 'newsfeed.get'
                title_sub = _('newsfeed.newsfeed_list')

                method_params.source_ids = 'list' + window.main_url.getParam('news_section_list')
                break
        }

        main_class.changeTitle(title_sub, _(`newsfeed.newsfeed`))
        window.main_classes['wall'] = new Newsfeed('.newsfeed_wrapper_posts')
        window.main_classes['wall'].setParams(method, method_params)
        
        if(window.main_url.hasParam('start_hash')) {
            window.main_classes['wall'].method_params.start_from = window.main_url.getParam('start_hash')
        }

        await window.main_classes['wall'].nextPage()

        if(window.main_classes['wall'].lists) {
            window.main_classes['wall'].lists.items.forEach(list => {
                u('#__insertlists').append(`
                    <a href='#feed/custom?news_section_list=${list.id}&news_type=post' ${Number(window.main_url.getParam('news_section_list')) == list.id ? 'class=\'selected\'' : ''}>${list.title}</a>
                    `
                )
            })
        }
    }
}
