if(!window.templates) {
    window.templates = {}
}

window.templates.comment = (object) => {
    let owner = object.getOwner()
    console.log(object)
    let template = `
        <div id='_comment_${object.info.id}' class='main_comment_block' ${object.hasThread() ? `data-commscount='${object.info.thread.count}'` : ''} data-ownerid='${object.info.owner_id}' data-cid='${object.getCorrectID()}'>
            <div class='comment_block main_info_block' data-type='comment' data-postid='${object.getId()}'>
                <div class='comment_author'>
                    <div class='comment_avaname avatar'>
                        <a ${owner.isOnline() ? `class='onliner'` : ''} href='${owner ? owner.getUrl() : ''}'>
                            <img src='${owner ? owner.getAvatar(true) : ''}'>
                        </a>
                    </div>
                </div>
                <div class='comment_info'>
                    <div class='comment_upper_author'>
                        <div class='comment_author_name'>
                            <b>
                                <a href='${owner ? owner.getUrl() : ''}' ${owner.isFriend() ? `class='friended'` : ''}>${owner ? owner.getName() : ''}</a>
                            </b>

                            ${owner.has('image_status') && window.site_params.get('ui.hide_image_statuses') != '1' ? 
                            `<div class='image_status' data-id='${owner.getId()}' title='${Utils.escape_html(owner.getImageStatus().name)}'>
                                <img src='${owner.getImageStatusURL()}'>
                            </div>` : ``}

                            ${object.isAuthor() ? `<span class='comment_op'>OP</span>` : ''}
                            ${object.info.reply_to_comment ? `${_('wall.reply_to_comment', window.main_url.href + '#_comment_'  + object.info.id)}` : ''}
                        </div>
                        
                        <div class='comment_upper_actions'>
                            ${!object.canDelete() ? `<div class='icons1' id='_reportComment'></div>` : ''}
                            ${object.canEdit() ? `<div class='icons1' id='_commentEdit'></div>` : ''}
                            ${object.canDelete() ? `<div class='icons1' id='_commentDelete'></div>` : ''}
                        </div>
                    </div>

                    <div class='comment_content contenter'>
                        <p>${object.getText()}</p>
                        ${object.hasAttachments() ? window.templates.attachments(object.getAttachments()) : ''}
                    </div>

                    <div class='comment_bottom'>
                        <span>
                            <a href='#'>${object.getDate()}</a>
                        </span>
                        <div class='post_actions_no_frame'>
                            <div class='like ${object.isLiked() ? 'activated' : '' }'>
                                <svg class='like_icon_hearted' viewBox="0 0 17 16.22"><g><path id="heart" d="M12.43,1A4.67,4.67,0,0,0,9,2.48,4.67,4.67,0,0,0,5.57,1,4.44,4.44,0,0,0,1,5.29C1,7.65,9,16,9,16s8-8.35,8-10.71A4.44,4.44,0,0,0,12.43,1Z" transform="translate(-0.5 -0.5)"/></g></svg>
                                <span>${object.getLikes()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ${object.hasThread() ? `
            <div class='comment_thread_block'>
                <div class='comment_thread_block_title'>
                    <span>${_('wall.thread_count', object.getThreadCount())}</span>

                    ${object.info.thread.count > 4 ? `
                    <div id='thread_comment_sort' class='comment_sort'>
                        <select>
                            <option value='desc'>${_('wall.sort_new_first')}</option>
                            <option value='asc' selected>${_('wall.sort_old_first')}</option>
                        </select>
                    </div>` : ''}
                </div>

                <div class='comments_thread_insert_block'></div>
            </div>
            ` : ''}
        </div>
    `

    let temp_l = document.createElement('div')
    temp_l.innerHTML = template

    if(object.hasThread()) {
        object.info.thread.items.forEach(el => {
            let comment = new Comment()
            comment.hydrate(el, object.profiles, object.groups)

            temp_l.querySelector('.comments_thread_insert_block').insertAdjacentHTML('beforeend', comment.getTemplate())
        })

        if(object.info.thread.count > 3) {
            temp_l.querySelector('.comments_thread_insert_block').insertAdjacentHTML('beforeend', `
                <span id='shownextcomms'>${_('wall.show_next_comments')}</span>
            `)
        }
    }

    return temp_l.innerHTML
}

