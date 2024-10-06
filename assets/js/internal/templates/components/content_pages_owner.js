if(!window.templates) {
    window.templates = {}
}

window.templates.content_pages_owner = (owner_info, subtext = _('user_page.go_to_user_page'), url = null) => {
    if(!url) {
        url = owner_info.getUrl()
    }
    
    return `
    <a href='${url}' class='layer_two_columns_tabs_user_info'>
        <div>
            <img class='avatar' src='${owner_info.getAvatar()}'>
        </div>

        <div class='layer_two_columns_tabs_user_info_name'>
            <b ${owner_info.isFriend() ? `class='friended'` : ''}>${Utils.cut_string(owner_info.getName(), 15)}</b>
            <span>${subtext}</span>
        </div>
    </a>
    ${owner_info.hasCover() && window.site_params.get('ui.cover_upper', '0') == '4' ? `
    <style>
        .background_fixed {
            background-image: url(${owner_info.getCoverURL()}) !important;
            display: block;
        }

        ${window.consts.CSS_FOCUS_NAVIGATION}
    </style>
    ` : ''}
    `
}

