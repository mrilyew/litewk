if(!window.templates) {
    window.templates = {}
}

window.templates.post = (post, additional_options = {}) => {
    let owner = post.getOwner()
    let signer = post.getSigner()

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
    
    let template = ``
    template += 
    `
    <div class='post main_info_block' data-type='post' data-postid='${post.getId()}'>
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
        `

    template += `
            <div class='post_ava avatar'>
                <a ${owner.isOnline() ? `class='onliner'` : ''} href='${owner.getUrl()}'>
                    <img src='${owner.getAvatar(true)}'>
                </a>
            </div>
            <div class='post_name'>
                <div class='post_name_sup'>
                    <p>
                        <b>
                            <a href='${owner.getUrl()}' ${owner.isFriend() ? `class='friended'` : ''}>
                                ${owner.getName()}
                            </a>
                        </b>

                        ${owner.has('image_status') && window.site_params.get('ui.hide_image_statuses') != '1' ? 
                        `<div class='smiley' data-id='${owner.getId()}' title='${owner.getImageStatus().name}'>
                            <img src='${owner.getImageStatusURL()}'>
                        </div>` : ``}
                    ${post.hasUpperText() ? post.getUpperText() : ''}
                    </p>
                </div>
                <p><a href='#wall${post.getId()}'>${post.getDate()}</a><span class='pinned_indicator ${post.isPinned() ? '' : 'hidden'}'>${_('wall.pinned')}</span></p>
            </div>
            `

    template += `
                </div>
                
                ${post.isntRepost() ? 
                `
                <div class='post_toggle_wrap'>
                    <div class='posts_menu_toggle dropdown_toggle icons1' data-onid='_actposts${post.getId()}'></div>
                        <div class='post_upper_actions dropdown_wrapper'>
                            <div class='dropdown_menu' id='_actposts${post.getId()}'>
                                ${post.canEdit() ? `<p id='_postEdit'>${_('wall.edit_post')}</p>` : ''}
                                ${post.canDelete() ? `<p id='_postDelete'>${_('wall.delete_post')}</p>` : ''}
                                ${post.canArchive() && !post.isArchived() ? `<p id='_postArchiveAction' data-type='0'>${_('wall.archive_post')}</p>` : ''}
                                ${post.canArchive() && post.isArchived()? `<p id='_postArchiveAction' data-type='1'>${_('wall.unarchive_post')}</p>` : ''}
                                ${post.canPin() && post.isPinned() ? `<p id='_pinPost' data-act='unpin'>${_('wall.unpin_post')}</p>` : ''}
                                ${post.canPin() && !post.isPinned() ? `<p id='_pinPost' data-act='pin'>${_('wall.pin_post')}</p>` : ''}
                                ${post.canShut() ? `<p id='_changeComments' data-act='close'>${_('wall.disable_comments_post')}</p>` : ''}
                                ${post.canUp() ? `<p id='_changeComments' data-act='open'>${_('wall.enable_comments_post')}</p>` : ''}
                                ${!post.canDelete() ? `<p>${_('wall.report_post')}</p>` : ''}
                                ${post.isFaved() ? `<p id='_toggleFave' data-val='1' data-type='post' data-addid='${post.getId()}'>${_('faves.remove_from_faves')}</p>` : ''}
                                ${!post.isFaved() ? `<p id='_toggleFave' data-val='0' data-type='post' data-addid='${post.getId()}'>${_('faves.add_to_faves')}</p>` : ''}
                                <a href='https://vk.com/wall${post.getId()}' target='_blank'><p>${_('wall.go_to_vk')}</p></a>
                                ${post.info.source_id ? `<p id='_toggleInteressness' data-val='0' data-type='${post.info.type}' data-addid='${post.getId()}'>${_('wall.not_interesting')}</p>` : ''}
                            </div>
                        </div>
                    </div>` : ''}
            </div>

            <div class='post_content contenter'>
                <span>${post.getText()}</span>

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
            `<div class='post_actions'>
                <div class='post_actions_wr'>
                    <a class='like ${post.info.likes.user_likes == 1 ? 'activated' : '' }'>
                        <div class='like_icon icons1'></div>
                        <span>${post.getLikes()}</span>
                    </a>
                    ${!additional_options.hide_comments ? `
                    <a href='#wall${post.getId()}' class='comment'>
                        <div class='comment_icon icons1'></div>
                        <span>${post.getCommentsCount()}</span>
                    </a>` : ''}
                    <a class='repost'>
                        <div class='repost_icon icons1'></div>
                        <span>${post.getRepostsCount()}</span>
                    </a>
                </div>
                ${post.hasViews() ? `<div class='views_block'>
                    <div class='eye_icon icons1'></div>
                    <span>${post.getViews()}</span>
                </div>` : ''}
            </div>` : ''}
        </div>
        </div>
    `

    let post_class = document.createElement('div')
    post_class.innerHTML = template

    // proccess attachments

    if(post.isCopy()) {
        let reposted_post = new Post()

        reposted_post.hydrate(post.getRepost(), post.profiles, post.groups)
        post_class.querySelector('.repost_block').innerHTML = window.templates.post(reposted_post, additional_options)
    }

    return post_class.innerHTML
}
