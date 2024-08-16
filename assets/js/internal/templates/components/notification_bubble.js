window.templates._notification_bubble = (title, description = '', avatar = null, right_additional = null, uid = null) => {
    if(!uid) {
        uid = Utils.random_int(0, 9999999)
    }
    
    let avatar_html = ''
    let right_html = ''

    if(avatar) {
        avatar_html = `
        <div class='notification_balloon_avatar'>
            <img src='${avatar}'>
        </div>
        `
    }

    if(right_additional) {
        right_html = `
        <div class='notification_balloon_avatar'>
            <img src='${right_additional}'>
        </div>
        `
    }

    const is_big = description || avatar_html || right_additional

    return u(`
        <div class='notification_balloon ${!is_big ? 'mini' : ''}' id='${uid}'>
            <div class='notification_balloon_title'>
                <h4>${title}</h4>
                <svg id='close' viewBox="0 0 11.71 11.71"><path d="M2.54,2.81" transform="translate(-2.15 -2.15)"/><line x1="11.35" y1="11.35" x2="0.35" y2="0.35"/><line x1="11.35" y1="0.35" x2="0.35" y2="11.35"/></svg>
            </div>

            ${is_big ?
            `<div class='notification_balloon_bottom flex_row flex_nowrap'>
                ${avatar_html}
                ${description || right_additional ? `<div class='notification_balloon_content flex_row justifier'>
                    ${description ? `<span>${description}</span>` : '<span></span>'}
                    ${right_html ?? ''}
                </div>` : ''}
            </div>` : ''}
        </div>
    `)
}
