window.templates._report_user_block = (user) => {
    return `
    <div class='flex_row justifier report_content_block'>
        <div>
            <h4>${user.getName()}</h4>
            <span>${_('user_page.profile')}</span>
        </div>
        <img src='${user.getAvatar()}'>
    </div>

    <h4 style='margin-top: 5px;'>${_('reports.report_user_desc', user.getFirstNameCase('gen'))}</h4>
    <div class='chechmarks_list flex_column'>
        <label>
            <input type='radio' name='reports.lists' value='spam'>
            ${_('reports.spam')}
        </label>
        <label>
            <input type='radio' name='reports.lists' value='fraud'>
            ${_('reports.fraud')}
        </label>
        <label>
            <input type='radio' name='reports.lists' value='insult'>
            ${_('reports.insult')}
        </label>
        <label>
            <input type='radio' name='reports.lists' value='advertisment'>
            ${_('reports.adversiment')}
        </label>
        <label>
            <input type='radio' name='reports.lists' value='porn'>
            ${_('reports.porner')}
        </label>
    </div>

    <h4 style='margin-top: 5px;'>${_('reports.additional_comments')}</h4>
    <div class='additional_comments_list'>
        <textarea id='_additional_desc' maxlength='200' placeholder='${_('reports.additional_comment_desc')}'></textarea>
    </div>`
}
