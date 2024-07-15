if(!window.templates) {
    window.templates = {}
}

window.templates.relative_template = (rel) => {
    let male = '_male'

    if(!rel.user) {
        return `
        <div class='avatar_namish_block avatarless'>
            <div class='right_info'>
                <p>${Utils.escape_html(rel.name)}</p>
                <p>${_('user_page.relative_' + rel.type)}</p>
            </div>
        </div>
        `
    } else {
        let user = new User
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
                <b><a href='#user${user.getId()}'>${user.getName()}</a></b>
                <p>${_('user_page.relative_' + rel.type + male)}</p>
            </div>
        </div>
        `
    }
}
