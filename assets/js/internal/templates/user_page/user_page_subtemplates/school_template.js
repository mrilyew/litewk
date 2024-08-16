if(!window.templates) {
    window.templates = {}
}

window.templates.school_template = (school) => {
    return `
        <div class='table_element'>
            <span><b>${_('user_page.school')}</b></span>
        </div>
        <div class='table_element'>
            <span>${_('user_page.school_name')}</span>
            <div class='table_element_value'>${Utils.escape_html(school.name)}</div>
        </div>
        ${school.city ? `<div class='table_element'>
            <span>${_('user_page.city')}</span>
            <div class='table_element_value'>
                <span>${Utils.escape_html(school.city_name)}</span>
            </div>
        </div>` : ''}
        ${school.year_from ? `<div class='table_element'>
            <span>${_('user_page.school_start_year')}</span>
            <div class='table_element_value'>
                <span>${school.year_from}</span>
            </div>
        </div>` : ''}
        ${school.year_to ? `<div class='table_element'>
            <span>${_('user_page.school_end_year')}</span>
            <div class='table_element_value'>
                <span>${school.year_to}</span>
            </div>
        </div>` : ''}
        ${school.year_graduated ? `<div class='table_element'>
            <span>${_('user_page.school_graduation_year')}</span>
            <div class='table_element_value'>
                <span>${school.year_graduated}</span>
            </div>
        </div>` : ''}
        ${school.class ? `<div class='table_element'>
            <span>${_('user_page.school_class')}</span>
            <div class='table_element_value'>
                <span>${Utils.escape_html(school.class)}</span>
            </div>
        </div>` : ''}
    `
}
