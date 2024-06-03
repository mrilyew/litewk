window.main_class = new class {
    load_layout() {
        document.querySelector('body').insertAdjacentHTML('afterbegin', 
        `
        <style id='_customcss'>
            ${window.site_params.get('ui.custom_css') ? escape_html(window.site_params.get('ui.custom_css')) : '{}'}
        </style>
    
        <div class='dimmer'></div>
        <div class='to_the_sky'>
            <span class='to_up'>${_('navigation.to_up')}</span>
            <span class='come_back'>${_('navigation.come_back')}</span>
        </div>
        <div class="wrapper">
            <div class="menu">
                <a href='site_pages/user_page.html'>${_('navigation.my_page')}</a>
                <a href='site_pages/news_page.html'>${_('navigation.my_news')}</a>
                <a class='stopped'>${_('navigation.my_friends')}</a>
                <a class='stopped'>${_('navigation.my_messages')}</a>
                <a class='stopped'>${_('navigation.my_photos')}</a>
                <a class='stopped'>${_('navigation.my_audios')}</a>
                <a class='stopped'>${_('navigation.my_videos')}</a>
                <a class='stopped'>${_('navigation.my_faves')}</a>
                <a class='stopped'>${_('navigation.my_notifications')}</a>
                <a class='stopped'>${_('navigation.my_search')}</a>
                <a class='stopped'>${_('navigation.my_documents')}</a>
                <a class='stopped'>${_('navigation.my_notes')}</a>
                <a class='stopped'>${_('navigation.my_wikipages')}</a>
                <a href='site_pages/settings.html'>${_('navigation.my_settings')}</a>
                <a href='site_pages/logout.html'>${_('navigation.logout')}</a>
            </div>
    
            <div class="page_content">
    
            </div>
        </div>
        `)
        
        let custom_js = window.site_params.get('ui.custom_js')
        if(custom_js) {
            let tmp_script = document.createElement('script')
            tmp_script.setAttribute('id', '_customjs')
            tmp_script.innerHTML = custom_js
    
            document.body.appendChild(tmp_script)
        }
    
        window.active_account = window.accounts.getActiveAccount()
        window.use_execute = window.site_params.get('internal.use_execute', '1') == '1'
        if(!window.active_account) {
            $('.wrapper .menu')[0].innerHTML = `
                <a href='site_pages/auth.html'>${_('navigation.authorize')}</a>
                <a href='site_pages/settings.html'>${_('navigation.my_settings')}</a>
            `
        } else {
            window.vk_api = new VkApi(window.active_account.vk_path, window.active_account.vk_token)
        }
    }

    reset_page() {
        $('#_main_page_script').remove()
        $('.page_content')[0].innerHTML = ``
        
        window.page_class = null
    }

    restart(add) {
        $('#_custom_css').remove()
        $('.dimmer').remove()
        $('.wrapper').remove()
        
        this.load_layout(add)
        window.page_class.render_page(add)
    }

    async go_to(url, history_log = true) {
        let main_part = ((new URL(url)).pathname.split('.')[0]).split('/')[2]

        if(main_part == 'site_pages') {
            main_part = ((new URL(url)).pathname.split('.')[0]).split('/')[3]
        }
        
        if(history_log) {
            push_state(url)
        }

        this.reset_page()
        await append_script(`assets/js/pages/${main_part}.js`, true) // т.н. костыль?
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.main_class.load_layout()
    window.page_class.render_page()

    $('textarea').trigger('input')
    $(document).trigger('scroll')
})
