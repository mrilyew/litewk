if(!window.templates) {
    window.templates = {}
}

window.templates.mil_template = (mil) => {
    return `
    <tr>
        <td>${_('user_page.military_unit')}</td>
        <td>${Utils.escape_html(mil.unit)}</td>
    </tr>
    ${mil.from ? `<tr>
        <td>${_('user_page.military_year_start')}</td>
        <td>${mil.from}</td>
    </tr>` : ''}
    ${mil.until ? `<tr class='end_of_mil'>
        <td>${_('user_page.military_year_end')}</td>
        <td><span>${mil.until}</span></td>
    </tr>` : ''}
    `
}
