window.templates.search_posts_params = (local = false) => {
    if(!local) {
        return `
        <div class='search_param'>
            <b class='nobold'>${_('search.search_params_posts_type')}</b>
            <select data-setname='type'>
                <option value='none' ${window.main_url.getParam('sp_type', 'none') == 'none' ? 'selected' : ''}>${_('search.search_params_posts_type_none')}</option>
                <option value='copy' ${window.main_url.getParam('sp_type', 'none') == 'copy' ? 'selected' : ''}>${_('search.search_params_posts_type_copies')}</option>
            </select>
        </div>
        <div class='search_param'>
            <b class='nobold'>${_('search.search_params_posts_attachments')}</b>
            <select data-setname='attachment'>
                <option value='0' ${window.main_url.getParam('sp_attachment', '0') == '0' ? 'selected' : ''}>${_('search.search_params_posts_attachments_not_select')}</option>
                <option value='1' ${window.main_url.getParam('sp_attachment', '0') == '1' ? 'selected' : ''}>${_('search.search_params_posts_attachments_photo')}</option>
                <option value='2' ${window.main_url.getParam('sp_attachment', '0') == '2' ? 'selected' : ''}>${_('search.search_params_posts_attachments_video')}</option>
                <option value='3' ${window.main_url.getParam('sp_attachment', '0') == '3' ? 'selected' : ''}>${_('search.search_params_posts_attachments_audio')}</option>
                <option value='4' ${window.main_url.getParam('sp_attachment', '0') == '4' ? 'selected' : ''}>${_('search.search_params_posts_attachments_graffiti')}</option>
                <option value='5' ${window.main_url.getParam('sp_attachment', '0') == '5' ? 'selected' : ''}>${_('search.search_params_posts_attachments_note')}</option>
                <option value='6' ${window.main_url.getParam('sp_attachment', '0') == '6' ? 'selected' : ''}>${_('search.search_params_posts_attachments_poll')}</option>
                <option value='7' ${window.main_url.getParam('sp_attachment', '0') == '7' ? 'selected' : ''}>${_('search.search_params_posts_attachments_link')}</option>
                <option value='8' ${window.main_url.getParam('sp_attachment', '0') == '8' ? 'selected' : ''}>${_('search.search_params_posts_attachments_file')}</option>
                <option value='9' ${window.main_url.getParam('sp_attachment', '0') == '9' ? 'selected' : ''}>${_('search.search_params_posts_attachments_album')}</option>
                <option value='10' ${window.main_url.getParam('sp_attachment', '0') == '10' ? 'selected' : ''}>${_('search.search_params_posts_attachments_article')}</option>
                <option value='12' ${window.main_url.getParam('sp_attachment', '0') == '12' ? 'selected' : ''}>${_('search.search_params_posts_attachments_wikipage')}</option>
                <option value='11' ${window.main_url.getParam('sp_attachment', '0') == '11' ? 'selected' : ''}>${_('search.search_params_posts_attachments_none')}</option>
            </select>
        </div>
        <div class='search_param'>
            <b class='nobold'>${_('search.search_params_posts_link')}</b>
            <input type='text' placeholder='${_('search.search_params_posts_link')}' data-setname='link' value='${window.main_url.getParam('sp_link', '')}'>
        </div>
        <div class='search_param'>
            <b class='nobold'>${_('search.search_params_posts_exclude')}</b>
            <input type='text' placeholder='${_('search.search_params_posts_exclude')}' data-setname='exclude' value='${window.main_url.getParam('sp_exclude', '')}'>
        </div>
        <div class='search_param'>
            <b class='nobold'>${_('search.search_params_posts_likes')}</b>
            <select data-setname='likes'>
                <option value='0' ${!window.main_url.hasParam('sp_likes', '0') ? 'selected' : ''}>${_('search.search_params_posts_likes_any')}</option>
                <option value='10' ${window.main_url.getParam('sp_likes', '0') == '10' ? 'selected' : ''}>${_('search.search_params_posts_likes_not_lesser', 10)}</option>
                <option value='100' ${window.main_url.getParam('sp_likes', '0') == '100' ? 'selected' : ''}>${_('search.search_params_posts_likes_not_lesser', 100)}</option>
                <option value='1000' ${window.main_url.getParam('sp_likes', '0') == '1000' ? 'selected' : ''}>${_('search.search_params_posts_likes_not_lesser', 1000)}</option>
            </select>

            <label>
                <input type='checkbox' value='1' ${window.main_url.getParam('sp_show_trash') == 1 ? 'checked' : ''} data-setname='show_trash'>
                ${_('search.search_params_posts_show_trash')}
            </label>
        </div>
        `
    }
        
    return `
    <div class='layer_two_columns_params'>
        <div class='search_params'>
            <div class='search_param'>
                <b class='nobold'>${_('search.search_params_posts_from')}</b>
                <select data-setname='owners_only'>
                    <option value='0' ${window.main_url.getParam('sp_owners_only', '0') == '0' ? 'selected' : ''}>${_('search.search_params_posts_from_any')}</option>
                    <option value='1' ${window.main_url.getParam('sp_owners_only', '0') == '1' ? 'selected' : ''}>${_('search.search_params_posts_from_owner')}</option>
                </select>
            </div>
            <div class='search_param'>
                <b class='nobold'>${_('search.search_params_posts_type')}</b>
                <select data-setname='type'>
                    <option value='none' ${window.main_url.getParam('sp_type', 'none') == 'none' ? 'selected' : ''}>${_('search.search_params_posts_type_none')}</option>
                    <option value='copy' ${window.main_url.getParam('sp_type', 'none') == 'copy' ? 'selected' : ''}>${_('search.search_params_posts_type_copies')}</option>
                    <option value='reply' ${window.main_url.getParam('sp_type', 'none') == 'reply' ? 'selected' : ''}>${_('search.search_params_posts_type_replies')}</option>
                </select>
            </div>
            <div class='search_param'>
                <b class='nobold'>${_('search.search_params_posts_attachments')}</b>
                <select data-setname='attachment'>
                    <option value='0' ${window.main_url.getParam('sp_attachment', '0') == '0' ? 'selected' : ''}>${_('search.search_params_posts_attachments_not_select')}</option>
                    <option value='1' ${window.main_url.getParam('sp_attachment', '0') == '1' ? 'selected' : ''}>${_('search.search_params_posts_attachments_photo')}</option>
                    <option value='2' ${window.main_url.getParam('sp_attachment', '0') == '2' ? 'selected' : ''}>${_('search.search_params_posts_attachments_video')}</option>
                    <option value='3' ${window.main_url.getParam('sp_attachment', '0') == '3' ? 'selected' : ''}>${_('search.search_params_posts_attachments_audio')}</option>
                    <option value='4' ${window.main_url.getParam('sp_attachment', '0') == '4' ? 'selected' : ''}>${_('search.search_params_posts_attachments_graffiti')}</option>
                    <option value='5' ${window.main_url.getParam('sp_attachment', '0') == '5' ? 'selected' : ''}>${_('search.search_params_posts_attachments_note')}</option>
                    <option value='6' ${window.main_url.getParam('sp_attachment', '0') == '6' ? 'selected' : ''}>${_('search.search_params_posts_attachments_poll')}</option>
                    <option value='7' ${window.main_url.getParam('sp_attachment', '0') == '7' ? 'selected' : ''}>${_('search.search_params_posts_attachments_link')}</option>
                    <option value='8' ${window.main_url.getParam('sp_attachment', '0') == '8' ? 'selected' : ''}>${_('search.search_params_posts_attachments_file')}</option>
                    <option value='9' ${window.main_url.getParam('sp_attachment', '0') == '9' ? 'selected' : ''}>${_('search.search_params_posts_attachments_album')}</option>
                    <option value='10' ${window.main_url.getParam('sp_attachment', '0') == '10' ? 'selected' : ''}>${_('search.search_params_posts_attachments_article')}</option>
                    <option value='12' ${window.main_url.getParam('sp_attachment', '0') == '12' ? 'selected' : ''}>${_('search.search_params_posts_attachments_wikipage')}</option>
                    <option value='11' ${window.main_url.getParam('sp_attachment', '0') == '11' ? 'selected' : ''}>${_('search.search_params_posts_attachments_none')}</option>
                </select>
            </div>
            <div class='search_param'>
                <b class='nobold'>${_('search.search_params_posts_link')}</b>
                <input type='text' placeholder='${_('search.search_params_posts_link')}' data-setname='link' value='${window.main_url.getParam('sp_link', '')}'>
            </div>
            <div class='search_param'>
                <b class='nobold'>${_('search.search_params_posts_exclude')}</b>
                <input type='text' placeholder='${_('search.search_params_posts_exclude')}' data-setname='exclude' value='${window.main_url.getParam('sp_exclude', '')}'>
            </div>
        </div>
    </div>
    `
}
