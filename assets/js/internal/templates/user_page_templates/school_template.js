if(!window.templates) {
    window.templates = {}
}

window.templates.school_template = (school) => {
    return `
        <tr>
            <td>
                <span><b>${_('user_page.school')}</b></span>
            </td>
        </tr>
        <tr>
            <td>${_('user_page.school_name')}</td>
            <td>${Utils.escape_html(school.name)}</td>
        </tr>
        ${school.city ? `<tr>
            <td>
                <span>${_('user_page.city')}</span>
            </td>
            <td>
                <span>${Utils.escape_html(school.city_name)}</span>
            </td>
        </tr>` : ''}
        ${school.year_from ? `<tr>
            <td>
                <span>${_('user_page.school_start_year')}</span>
            </td>
            <td>
                <span>${school.year_from}</span>
            </td>
        </tr>` : ''}
        ${school.year_to ? `<tr>
            <td>
                <span>${_('user_page.school_end_year')}</span>
            </td>
            <td>
                <span>${school.year_to}</span>
            </td>
        </tr>` : ''}
        ${school.year_graduated ? `<tr>
            <td>
                <span>${_('user_page.school_graduation_year')}</span>
            </td>
            <td>
                <span>${school.year_graduated}</span>
            </td>
        </tr>` : ''}
        ${school.class ? `<tr>
            <td>
                <span>${_('user_page.school_class')}</span>
            </td>
            <td>
                <span>${Utils.escape_html(school.class)}</span>
            </td>
        </tr>` : ''}
    `
}
