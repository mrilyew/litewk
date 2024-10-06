if(!window.templates) {
    window.templates = {}
}

window.templates.post = (post, additional_options = {}) => {
    const owner = post.getOwner()
    const signer = post.getSigner()
    const reactions = post.getReactionSet()
    const comment_sort = window.settings_manager.getItem('ux.default_sort').getValue()

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
    <div class='post main_info_block dropdown_root' data-type='post' data-postid='${post.getId()}'>
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
                        <div class='post_name_sub flex flex_row'>
                            <span>
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
                            </span>
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
                    <svg class='posts_menu_toggle dropdown_toggle' id='_actposts${post.getId()}' viewBox="0 0 18.35 7.54"><g><polyline points="0.44 0.63 8.73 6.63 17.94 0.63"/></g></svg>
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
                <div class='post_actions'>
                    ${window.templates._post_like(post.info.likes.user_likes == 1, post.hasLikes(), post.getLikes(), reactions, post.getId())}
                    ${!post.needToHideComments() ? `
                    <a href='${!additional_options.hide_comments_button ? `#wall${post.getId()}` : 'javascript:void(0)'}' data-back='${main_url.getHash()}' class='comment'>
                        <svg viewBox="0 0 15.53 14.47"><polygon points="0 0 0 10.61 4.86 10.61 0.97 14.47 4.86 14.47 10.68 10.61 15.53 10.61 15.53 0 0 0"/></svg>

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

        ${additional_options.show_comments_block == 1 ? `
        <div class='post_comments_wrapper'>
            ${post.getCommentsCount() > 1 ? `
            <div id='post_comment_sort' class='comment_sort'>
                <select>
                    <option value='desc' ${comment_sort == 'desc' ? 'selected' : ''}>${_('wall.sort_new_first')}</option>
                    <option value='asc' ${comment_sort == 'asc' ? 'selected' : ''}>${_('wall.sort_old_first')}</option>
                    <option value='smart' ${comment_sort == 'smart' ? 'selected' : ''}>${_('wall.sort_interesting_first')}</option>
                </select>
            </div>
            
            <div class='post_comments_wrapper_wrapper'></div>
            ` : ''}
        </div>` : ''}

        <div data-trigger='#_actposts${post.getId()}' data-type='click' class='dropdown_actions dropdown_menu_wrapper more_actions'>
            <div class='more_actions_body more_actions_insert'>
                ${post.canEdit() ? `<a class='action' id='_postEdit'>${_('wall.edit_post')}</a>` : ''}
                ${post.canDelete() ? `<a class='action' id='_postDelete'>${_('wall.delete_post')}</a>` : ''}
                ${post.canArchive() && !post.isArchived() ? `<a class='action' id='_postArchiveAction' data-type='0'>${_('wall.archive_post')}</a>` : ''}
                ${post.canArchive() && post.isArchived()? `<a class='action' id='_postArchiveAction' data-type='1'>${_('wall.unarchive_post')}</a>` : ''}
                ${post.canPin() && post.isPinned() ? `<a class='action' id='_pinPost' data-act='unpin'>${_('wall.unpin_post')}</a>` : ''}
                ${post.canPin() && !post.isPinned() ? `<a class='action' id='_pinPost' data-act='pin'>${_('wall.pin_post')}</a>` : ''}
                ${post.canShut() ? `<a class='action' id='_changeComments' data-act='close'>${_('wall.disable_comments_post')}</a>` : ''}
                ${post.canUp() ? `<a class='action' id='_changeComments' data-act='open'>${_('wall.enable_comments_post')}</a>` : ''}
                ${post.canReport() ? `<a class='action' id='_reportPost'>${_('wall.report_post')}</a>` : ''}
                ${post.isFaved() ? `<a class='action' id='_toggleFave' data-val='1' data-type='post' data-addid='${post.getId()}'>${_('faves.remove_from_faves')}</a>` : ''}
                ${!post.isFaved() ? `<a class='action' id='_toggleFave' data-val='0' data-type='post' data-addid='${post.getId()}'>${_('faves.add_to_faves')}</a>` : ''}
                <a class='action' href='https://vk.com/wall${post.getId()}' target='_blank'><span>${_('wall.go_to_vk')}</span></a>
                ${post.info.source_id ? `<a class='action' id='_toggleInteressness' data-val='0' data-type='${post.info.type}' data-addid='${post.getId()}'>${_('wall.not_interesting')}</a>` : ''}
            </div>
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
    const seed = Utils.random_int(0, 4)
    const seed_html = u(`<div></div>`)

    switch(seed) {
        default:
            seed_html.html(`
                <span></span>
                <div class='attachments'>
                    <div class='ordinary_attachments'>
                        <div class='filler' style='width: 30%;height: 100px;'></div>
                    </div>
                </div>
            `)

            break
        case 1:
            seed_html.html(`
                <div class='attachments'>
                    <div class='ordinary_attachments'>
                        <div class='filler' style='width: ${Utils.random_int(10, 30)}%;height: 100px;'></div>
                        <div class='filler' style='width: ${Utils.random_int(10, 50)}%;height: 100px;'></div>
                        <div class='filler' style='width: ${Utils.random_int(10, 30)}%;height: 100px;'></div>
                    </div>
                </div>
            `)

            break
        case 2:
            if(seed_html.find('.repost_block').length > 0) {
                seed_html.html(`
                    <div class='repost_block'>${window.templates.post_skeleton()}</div>
                `)
                break
            }
        case 3:
            seed_html.html(`<p class='filler' style='height: ${Utils.random_int(20, 100)}px;'></p>`)
            break
        case 4:
            seed_html.html(`
            <div class='attachments'>
                <div class='ordinary_attachments'>
                    <div class='filler' style='width: 50%;height: 100px;'></div>
                </div>
            </div>
            `)
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
                                <b></b>
                            </p>
                        </div>

                        <p class='post_date'></p>
                    </div>
                </div>
            </div>
            <div class='post_content contenter'>
                ${seed_html.html()}
            </div>
        </div>
    </div>
    `
}
