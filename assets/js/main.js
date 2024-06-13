window.main_class = new class {
    load_layout() {
        window.saved_pages = []
        window.main_classes = {}

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

        window.s_url = new URL(location.href)
        window.accounts = new Accounts
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

        window.router.route(window.s_url.href)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.main_class.load_layout()

    $('textarea').trigger('input')
    $(document).trigger('scroll')
})
