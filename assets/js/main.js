window.main_class = new class {
    load_layout() {
        console.clear()
        console.log('Доброго времени суток.')

        // Main classes
        window.saved_pages = []
        window.main_classes = {}
        window.site_params = new LocalStorageParams
        window.left_menu = new LeftMenu
        window.router = new Router
        window.accounts = new Accounts
        window.active_account = window.accounts.getActiveAccount()
        window.main_url = new URL(location.href)
        window.use_execute = window.site_params.get('internal.use_execute', '1') == '1'
        window.lang = !window.site_params.get('lang') ? window.langs.find(item => item.lang_info.short_name == 'ru') : window.langs.find(item => item.lang_info.short_name == window.site_params.get('lang'))

        document.querySelector('body').insertAdjacentHTML('afterbegin', window.templates.main(window.left_menu.getHTML()))
        
        let custom_js = window.site_params.get('ui.custom_js')
        if(custom_js) {
            let tmp_script = document.createElement('script')
            tmp_script.setAttribute('id', '_customjs')
            tmp_script.innerHTML = custom_js
    
            document.body.appendChild(tmp_script)
        }

        if(!window.active_account) {
            $('.wrapper .menu')[0].innerHTML = `
                <a href='#login'>${_('navigation.authorize')}</a>
                <a href='#settings'>${_('navigation.my_settings')}</a>
            `
        } else {
            window.vk_api = new VkApi(window.active_account.path, window.active_account.token)
        }

        window.router.route(location.href)

        setInterval(async () => {
            if(window.site_params.get('ux.send_online', '1') == '1' && window.active_account) {
                await window.vk_api.call('account.setOnline')

                console.log('5 minutes exceeded and online was called')
            }
        }, 300000);

        
        setInterval(async () => {
            await this.refresh_counters()
        }, 60000);
    }

    
    init_observers() {
        if(window.site_params.get('ux.auto_scroll', '1') == '0' || $('.show_more')[0] == undefined) {
            return 
        }

        if(!window.show_more_observer) {
            window.show_more_observer = new IntersectionObserver(entries => {
                entries.forEach(x => {
                    if(x.isIntersecting) {
                        $(".show_more").click()
                    }
                })
            }, {
                root: null,
                rootMargin: "0px",
                threshold: 0
            })
        }

        window.show_more_observer.observe($('.show_more')[0])
    }

    add_error(message, id, wait_time = 5000, type = '') {
        if(document.querySelectorAll(`*[data-errid='${id}']`).length > 0) {
            return
        }
        
        window.scrollTo(0, 0)
        $('.page_content')[0].insertAdjacentHTML('afterbegin', `
            <div class='head_error ${type}' data-errid='${id}'>
                <span>${message}</span>
            </div>
        `)

        setTimeout(() => {
            $(`div[data-errid='${id}']`).remove()
        }, wait_time)
    }

    add_onpage_error(message) {
        $('.page_content')[0].innerHTML = ''
        $('.page_content')[0].insertAdjacentHTML('beforeend', `
            <div class='onpage_error'>
                ${message}
            </div>
        `)
    }

    async refresh_counters() {
        let counters = await window.vk_api.call('account.getCounters')
        counters = counters.response
    
        $('.counter').remove()
    
        if(counters.faves && $('.menu #_faves')[0]) {
            $('.menu #_faves')[0].innerHTML += `
                <span class='counter'>${counters.faves}</span>
            `
        }
        
        if(counters.messages && $('.menu #_messages')[0]) {
            $('.menu #_messages')[0].innerHTML += `
                <span class='counter'>${counters.messages}</span>
            `
        }
            
        if(counters.groups && $('.menu #_groups_invites')[0]) {
            $('.menu #_groups_invites')[0].innerHTML += `
                <span class='counter'>${counters.groups}</span>
            `
        }
                
        if(counters.notifications && $('.menu #_notifications')[0]) {
            $('.menu #_notifications')[0].innerHTML += `
                <span class='counter'>${counters.notifications}</span>
            `
        }
                    
        if(counters.videos && $('.menu #_videos')[0]) {
            $('.menu #_videos')[0].innerHTML += `
                <span class='counter'>${counters.videos}</span>
            `
        }
                        
        if(counters.photos && $('.menu #_photos')[0]) {
            $('.menu #_photos')[0].innerHTML += `
                <span class='counter'>${counters.photos}</span>
            `
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    window.main_class.load_layout()

    $('textarea').trigger('input')
    $(document).trigger('scroll')

    setTimeout(() => {window.main_class.refresh_counters()}, 3000)
})
