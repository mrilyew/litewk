if(!window.templates) {
    window.templates = {}
}

window.templates.work_template = (work) => {
    let club_object = null

    if(work.group_id) {
        club_object = new Club
        club_object.hydrate(work.group)
    }

    return `
        <div class='career_work  ${!club_object ? 'no_group' : ''}'>
            ${club_object ? 
            `<div class='career_work_avatar avatar'>
                <a href='#club${club_object.getId()}'>
                    <img class='avatar' src='${club_object.info.photo_100}'>
                </a>
            </div>` : ''}

            <div class='career_work_info'>
                ${club_object ? `<a href='#club${work.group_id}'><b>${club_object.getName()}</b></a>` : `<b>${Utils.escape_html(work.company)}</b>`}
                <p>${work.position ? `${_('user_page.job_post')}: ` + Utils.escape_html(work.position) : ''}</p>
                <p>${work.from  ? `${_('user_page.job_year_start')}: ` + work.from : ''}</p>
                <p>${work.until ? `${_('user_page.job_year_end')}: ` + work.until : ''}</p>
                <p>${work.city_id ? `${_('user_page.job_city')}: ` + work.city.title : ''}</p>
            </div>
        </div>
    `
}
