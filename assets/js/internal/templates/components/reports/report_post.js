window.templates._report_post_block = (html) => {
    return `
    <div class='flex_row justifier report_content_block'>
        <div>
            ${html}
        </div>
    </div>

    <h4 style='margin-top: 5px;'>${_('reports.report_post_desc')}</h4>
    <div class='chechmarks_list flex_column' style='margin-top: 3px'>
        <label>
            <input type='radio' name='reports.lists' value='0'>
            ${_('reports.spam')}
        </label>
        <label>
            <input type='radio' name='reports.lists' value='1'>
            ${_('reports.cpu')}
        </label>
        <label>
            <input type='radio' name='reports.lists' value='2'>
            ${_('reports.extremism')}
        </label>
        <label>
            <input type='radio' name='reports.lists' value='3'>
            ${_('reports.violence')}
        </label>
        <label>
            <input type='radio' name='reports.lists' value='4'>
            ${_('reports.drugs')}
        </label>
        <label>
            <input type='radio' name='reports.lists' value='5'>
            ${_('reports.adult_materials')}
        </label>
        <label>
            <input type='radio' name='reports.lists' value='6'>
            ${_('reports.insult_single')}
        </label>
        <label>
            <input type='radio' name='reports.lists' value='8'>
            ${_('reports.suicide_commits')}
        </label>
        <label>
            <input type='radio' name='reports.lists' value='11'>
            ${_('reports.deception')}
        </label>
    </div>`

    // по сути "обман" внатуре обман, ведь я не знаю, что означает данный пункт
}
