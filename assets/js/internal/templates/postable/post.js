if(!window.templates) {
    window.templates = {}
}

window.templates.post = (post, additional_options = {}) => {
    const owner = post.getOwner()
    const signer = post.getSigner()
    const reactions = post.getReactionSet()

    if(additional_options.added_photos == 1) {
        if(!post.info.post_source) {
            post.info.post_source = {}
        }

        post.info.post_source.data = 'added_photos'
    }
    
    if(additional_options.uploaded_videos == 1) {
        if(!post.info.post_source) {
            post.info.post_source = {}
        }

        post.info.post_source.data = 'added_videos'
    }
        
    if(additional_options.tagged_photo == 1) {
        if(!post.info.post_source) {
            post.info.post_source = {}
        }

        post.info.post_source.data = 'tagged_on_photos'
    }

    if(additional_options.uploaded_audios == 1) {
        if(!post.info.post_source) {
            post.info.post_source = {}
        }

        post.info.post_source.data = 'added_audios'
    }

    const shorted_text = Utils.get_short_text(post.info.text, 10, 500, true)
    const should_short_text = window.site_params.get('ux.shortify_text', '1') == '1' && !additional_options.force_full_text
    
    let template = u(`
    <div class='post main_info_block dropdown_root' data-reactions='${post.getReactionsArray()}' data-type='post' data-postid='${post.getId()}'>
        <div class='post_hidden_by_default post_restore_block'>
            ${_('wall.post_has_deleted')}
        </div>
        <div class='post_hidden_by_default post_archive_block'>
            ${_('wall.post_has_archived')}
        </div>
        <div class='post_hidden_by_default post_unarchive_block'>
            ${_('wall.post_has_unarchived')}
        </div>
        <div class='post_hidden_by_default post_unignore_block'>
            ${_('wall.post_has_ignored', post.info.type)}
            
            <div>
                <input type='button' id='_toggleHiddeness' data-val='0' data-ban_id='${post.getOwnerID()}' data-type='week' value='${_('newsfeed.hide_source_from_feed_on_week')}'>
                <input type='button' id='_toggleHiddeness' data-val='0' data-ban_id='${post.getOwnerID()}' value='${_('newsfeed.hide_source_from_feed')}'>
            </div>
        </div>
        <div class='post_wrapper'>
            <div class='post_author'>
                <div class='post_avaname'>
                    <div class='post_ava avatar'>
                        <a class='${owner.isOnline() ? 'onliner' : ''}' href='${owner.getUrl()}' data-back='${main_url.getHash()}'>
                            <img class='outliner' loading='lazy' src='${owner.getAvatar(true)}'>
                        </a>
                    </div>
                    <div class='post_name'>
                        <div class='post_name_sup flex_row'>
                            <p>
                                <b>
                                    <a href='${owner.getUrl()}' ${owner.isFriend() ? `class='friended'` : ''} data-back='${main_url.getHash()}'>
                                        ${owner.getName()}
                                    </a>
                                </b>

                                ${owner.has('image_status') && window.site_params.get('ui.hide_image_statuses') != '1' ? 
                                `<div class='image_status' data-id='${owner.getId()}' title='${owner.getImageStatus().name}'>
                                    <img src='${owner.getImageStatusURL()}'>
                                </div>` : ``}

                            ${post.hasUpperText() ? post.getUpperText() : ''}
                            </p>
                        </div>
                        <p class='post_date'>
                            <a href='#wall${post.getId()}'>${post.getDate()}</a>
                            <span class='pinned_indicator ${post.isPinned() ? '' : 'hidden'}'>${_('wall.pinned')}</span>
                        </p>
                    </div>
                </div>
                    
                ${post.isntRepost() ? 
                `
                <div class='post_toggle_wrap'>
                    <svg class='posts_menu_toggle dropdown_toggle' data-onid='_actposts${post.getId()}' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.35 7.54"><g><polyline points="0.44 0.63 8.73 6.63 17.94 0.63"/></g></svg>
                    <div class='dropdown_actions dropdown_wrapper'>
                        <div class='dropdown_menu' id='_actposts${post.getId()}'>
                            ${post.canEdit() ? `<p id='_postEdit'>${_('wall.edit_post')}</p>` : ''}
                            ${post.canDelete() ? `<p id='_postDelete'>${_('wall.delete_post')}</p>` : ''}
                            ${post.canArchive() && !post.isArchived() ? `<p id='_postArchiveAction' data-type='0'>${_('wall.archive_post')}</p>` : ''}
                            ${post.canArchive() && post.isArchived()? `<p id='_postArchiveAction' data-type='1'>${_('wall.unarchive_post')}</p>` : ''}
                            ${post.canPin() && post.isPinned() ? `<p id='_pinPost' data-act='unpin'>${_('wall.unpin_post')}</p>` : ''}
                            ${post.canPin() && !post.isPinned() ? `<p id='_pinPost' data-act='pin'>${_('wall.pin_post')}</p>` : ''}
                            ${post.canShut() ? `<p id='_changeComments' data-act='close'>${_('wall.disable_comments_post')}</p>` : ''}
                            ${post.canUp() ? `<p id='_changeComments' data-act='open'>${_('wall.enable_comments_post')}</p>` : ''}
                            ${!post.canDelete() ? `<p id='_reportPost'>${_('wall.report_post')}</p>` : ''}
                            ${post.isFaved() ? `<p id='_toggleFave' data-val='1' data-type='post' data-addid='${post.getId()}'>${_('faves.remove_from_faves')}</p>` : ''}
                            ${!post.isFaved() ? `<p id='_toggleFave' data-val='0' data-type='post' data-addid='${post.getId()}'>${_('faves.add_to_faves')}</p>` : ''}
                            <a href='https://vk.com/wall${post.getId()}' target='_blank'><p>${_('wall.go_to_vk')}</p></a>
                            ${post.info.source_id ? `<p id='_toggleInteressness' data-val='0' data-type='${post.info.type}' data-addid='${post.getId()}'>${_('wall.not_interesting')}</p>` : ''}
                        </div>
                    </div>
                </div>` : ''}
            </div>

            <div class='post_content contenter'>
                ${should_short_text ? shorted_text : `<span>${post.getText()}</span>`}

                ${post.hasAttachments() ? window.templates.attachments(post.getAttachments()) : ''}
                ${post.hasRepost() ? `<div class='repost_block'></div>` : ''}

                ${post.hasSigner() ? `<div class='post_signer special_post_block'>
                    ${_('wall.author')}:
                    <a href='${signer.getUrl()}'>${signer.getName()}</a>
                </div>` : ''}
                ${post.hasSource() ? `<div class='post_source special_post_block'>
                    ${_('wall.source')}:
                    ${post.getSource()}
                </div>` : ''}
                ${post.isAd() ? `<div class='is_ad special_post_block'>
                    <span>${_('wall.is_ad')}</span>
                </div>` : ''}
                ${post.hasGeo() ? `<div class='geo_block special_post_block'>
                    ${_('wall.geo')}:
                    <span>${post.getShortGeo()}</span>
                </div>` : ''}
            </div>

            ${post.info.likes ?
            `<div class='post_bottom'>
                <div class='post_actions' oncontextmenu='return false;'>
                    ${window.templates._post_like(post.info.likes.user_likes == 1, post.hasLikes(), post.getLikes(), reactions, post.getId())}
                    ${!additional_options.hide_comments && !post.needToHideComments() ? `
                    <a href='#wall${post.getId()}' data-back='${main_url.getHash()}' class='comment'>
                        <svg class='comment_icon' viewBox="0 0 18 17"><g><polygon id="comment" points="0 0 0 12.47 5.63 12.47 1.13 17 5.63 17 12.38 12.47 18 12.47 18 0 0 0"/><polygon points="1 1 1 11 8 11 5 14 8 14 12 11 17 11 17 1 1 1"/></g></svg>

                        ${post.hasCommentsCount() ? `<span class='comments_handler'>${post.getCommentsCount()}</span>` : ''}
                    </a>` : ''}
                    <a class='repost'>
                        <svg viewBox="0 0 17.24 15.71"><g><polygon id="reposter" points="9.5 15.21 0.5 15.21 0.5 5.21 10.5 5.21 10.5 1.21 16.5 7.21 10.5 12.21 10.5 8.21 3.5 8.21 3.5 13.21 9.5 13.21 9.5 15.21"/></g></svg>
                        ${post.hasReposts() ? `<span class='reposts_handler'>${post.getRepostsCount()}</span>` : ''}
                    </a>
                </div>
                ${post.hasViews() ? `<div class='views_block'>
                    <svg id="_icon_view_eye" viewBox="0 0 27 16"><ellipse id="head" cx="13.5" cy="8" rx="13.5" ry="8"/><circle id="eye" cx="13.5" cy="7.5" r="5.5"/><circle id="pupil" class="cls-2" cx="13.5" cy="7.5" r="2.5"/></svg>
                    <span>${post.getViews().divideByDigit()}</span>
                </div>` : ''}
            </div>` : ''}
        </div>
    </div>`)



    if(post.isCopy()) {
        let reposted_post = new Post()

        reposted_post.hydrate(post.getRepost(), post.profiles, post.groups)
        template.find('.repost_block').html(window.templates.post(reposted_post, additional_options))
    }

    return template.nodes[0].outerHTML
}

window.templates.post_skeleton = () => {
    let seed = Utils.random_int(0, 3)
    let seed_html = ''

    switch(seed) {
        default:
            seed_html = `
                <span>...</span>
                <div class='attachments'>
                    <div class='ordinary_attachments'>
                        <div class='filler' style='width: 30%;height: 100px;'></div>
                    </div>
                </div>
            `
            break
        case 1:
            seed_html = `
                <div class='attachments'>
                    <div class='ordinary_attachments'>
                        <div class='filler' style='width: 30%;height: 100px;'></div>
                        <div class='filler' style='width: 30%;height: 100px;'></div>
                        <div class='filler' style='width: 30%;height: 100px;'></div>
                    </div>
                </div>
            `
            break
        case 2:
            seed_html = `<div class='repost_block'>${window.templates.post_skeleton()}</div>`
            break
        case 3:
            seed_html = `<span>...</span>`
            break
    }

    return `
    <div class='post' id='_skeleton'>
        <div class='post_wrapper'>
            <div class='post_author'>
                <div class='post_avaname'>
                    <div class='post_ava avatar'>
                        <div class='filler'></div>
                    </div>
                    <div class='post_name'>
                        <div class='post_name_sup'>
                            <p>
                                <b>...</b>
                            </p>
                        </div>

                        <p class='post_date'>...</p>
                    </div>
                </div>
            </div>
            <div class='post_content contenter'>
                ${seed_html}
            </div>
        </div>
    </div>
    `
}
