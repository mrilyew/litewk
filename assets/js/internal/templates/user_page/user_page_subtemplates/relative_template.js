if(!window.templates) {
    window.templates = {}
}

window.templates.relative_template = (rel) => {
    let male = '_male'

    if(!rel.user) {
        return `
        <div class='avatar_namish_block avatarless'>
            <div class='left_avatar avatar'>
                <div class='filler_standart'></div>
            </div>
            <div class='right_info'>
                <p>${rel.name.escapeHtml()}</p>
                <p>${_('user_page.relative_' + rel.type)}</p>
            </div>
        </div>
        `
    } else {
        const user = new User
        user.hydrate(rel.user)

        if(user.isWoman()) {
            male = '_female'
        }

        return `
        <div class='avatar_namish_block'>
            <div class='left_avatar avatar'>
                <a href='#id${user.getId()}'>
                    <img class='avatar outliner' src='${user.info.photo_100}'>
                </a>
            </div>

            <div class='right_info'>
                <b><a href='#id${user.getId()}'>${user.getName()}</a></b>
                <p>${_('user_page.relative_' + rel.type + male)}</p>
            </div>
        </div>
        `
    }
}
