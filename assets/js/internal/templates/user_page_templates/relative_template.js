if(!window.templates) {
    window.templates = {}
}

window.templates.relative_template = (rel) => {
    let male = '_male'

    if(!rel.user) {
        return `
            <tr>
                <td>${_('user_page.relative_' + rel.type)}</td>
                <td>${Utils.escape_html(rel.name)}</td>
            </tr>
        `
    } else {
        let user = new User
        user.hydrate(rel.user)

        if(user.isWoman()) {
            male = '_female'
        }

        return `
            <tr>
                <td>${_('user_page.relative_' + rel.type + male)}</td>
                <td><a href='${user.getUrl()}'>${user.getName()}</a></td>
            </tr>
        `
    }
}
