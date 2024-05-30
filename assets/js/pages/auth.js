window.page_class = new class {
    render_page() 
    {
        document.title = _('auth.auth')

        $('.page_content')[0].insertAdjacentHTML('beforeend', `
            <div class="onpage_error" style='width: 400px;'>
                <table cellspacing="0" cellpadding="5" width="60%">
                    <tbody>
                        <tr>
                            <td style='width:120px;'>
                                <span>${_('auth.path_to_api')}</span>
                            </td>
                            <td><input type='text' name='path' value='https://api.vk.com/method/' disabled></td>
                        </tr>
                        <tr>
                            <td style='width:120px;'>
                                <span>${_('auth.vk_api_token')}</span>
                            </td>
                            <td><input type='password' name='tok' value='' required></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><input type="button" id='aut' value='${_('auth.auth')}'></td>
                        </tr>
                    </tbody>
                </table>
    
                <ul class='auth_list_help'>
                    <li>${_('auth.vk_api_get_token')}</li>
                    <li>${_('auth.vk_api_info_token')}</li>
                    <li>${_('auth.vk_api_info_recommend')}</li>
                </ul>
            </div>
        `)

        $('#aut').on('click', async () => {
            if($(`input[name='tok']`)[0].value == '' || $(`input[name='path']`)[0].value == '') {
                add_error(_('errors.not_all_fields'), 'fill_form')
                return
            }
    
            let api_url = $(`input[name='path']`)[0].value
            let token = $(`input[name='tok']`)[0].value
    
            if(await window.accounts.addAccount(api_url, token)) {
                window.location.assign(document.querySelector('base').href)
            }
        })
    }
}
