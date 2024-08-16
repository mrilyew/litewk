if(!window.templates) {
    window.templates = {}
}

window.templates.mil_template = (mil) => {
    return `
    <div class='table_element'>
        <span>${_('user_page.military_unit')}</span>

        <div class='table_element_value'>${Utils.escape_html(mil.unit)}</div>
    </div>
    ${mil.from ? `
    <div class='table_element'>
        <span>${_('user_page.military_year_start')}</span>
        
        <div class='table_element_value'>${mil.from}</div>
    </div>` : ''}
    ${mil.until ? `
    <div class='table_element end_of_mil'>
        <span>${_('user_page.military_year_end')}</span>

        <div class='table_element_value'><span>${mil.until}</span></div>
    </div>` : ''}
    `
}
