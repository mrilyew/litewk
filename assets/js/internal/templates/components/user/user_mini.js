window.templates.user_mini = (user) => {
    return `
    <div class='content_blacklist_item' style='margin-top: 5px;'>
        <div class='content_blacklist_item_info'>
            <div class='content_blacklist_item_avatar'>
                <a href='${user.getUrl()}' target='_blank'>
                    <img class='outliner' src='${user.getAvatar(true)}'>
                </a>
            </div>

            <div class='content_blacklist_item_name'>
                <div class='user_info_with_name'>
                    <a href='${user.getUrl()}' target='_blank' class='user_name ${user.isFriend() ? ' friended' : ''}'><b>${user.getFullName()}</b></a>
        
                    ${user.has('image_status') && window.site_params.get('ui.hide_image_statuses') != '1' ? 
                    `<div class='image_status' data-id='${user.getId()}' title='${user.getImageStatus().name}'>
                        <img src='${user.getImageStatusURL()}'>
                    </div>` : ``}
                </div>
                <div>
                    ${user.has('last_seen') ? `<span>${user.getFullOnline()}</span> ` : ''}
                </div>
            </div>
        </div>
    </div>`
}
