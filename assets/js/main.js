window.main_class = new class {
    load_layout() {
        console.clear()
        console.log('Доброго времени суток.')

        let show_authuser_error = false
        // Main classes
        window.saved_pages = []
        window.main_classes = {}
        window.site_params = new LocalStorageParams
        window.left_menu = new LeftMenu
        window.router = new Router
        window.accounts = new Accounts
        window.main_url = new BetterURL(location.href)

        if(window.main_url.hasParam('authuser')) {
            let accs = window.accounts.getAccounts()
            let maybe_found_account = accs[Number(window.main_url.getParam('authuser'))]

            if(maybe_found_account) {
                let maybe_account = Account.findViaToken(maybe_found_account.token)
            
                if(maybe_account) {
                    maybe_account.makeActive()
                }
            } else {
                show_authuser_error = true
            }
        }

        window.active_account = window.accounts.getActiveAccount()

        window.use_execute = window.site_params.get('internal.use_execute', '1') == '1'
        window.lang = !window.site_params.get('lang') ? window.langs.find(item => item.lang_info.short_name == 'ru') : window.langs.find(item => item.lang_info.short_name == window.site_params.get('lang'))

        document.querySelector('body').insertAdjacentHTML('afterbegin', window.templates.main(window.left_menu.getHTML()))
        if(!window.active_account) {
            $('.main_wrapper .navigation')[0].innerHTML = `
                <a href='#login'>${_('navigation.authorize')}</a>
                <a href='#settings'>${_('navigation.my_settings')}</a>
            `
        } else {
            window.vk_api = new VkApi(window.active_account.path, window.active_account.token)
        }

        let custom_js = window.site_params.get('ui.custom_js')
        if(custom_js) {
            let tmp_script = document.createElement('script')
            tmp_script.setAttribute('id', '_customjs')
            tmp_script.innerHTML = custom_js
    
            document.body.appendChild(tmp_script)
        }

        try {
            window.router.route(location.href)
        } catch(e) {
            Utils.add_onpage_error(`${_('errors.could_not_draw_page')}:<br>
            ${e.message}`)
        }

        if(show_authuser_error) {
            let msg = new MessageBox(_('errors.error'), _('errors.no_account_with_id'), ['OK'], [() => {msg.close()}])
        }

        setInterval(async () => {
            if(window.site_params.get('ux.online_status', 'none') == 'timeout' && window.active_account) {
                await window.vk_api.call('account.setOnline')

                console.log('5 minutes exceeded and online was called')
            }
        }, 300000);

        
        setInterval(async () => {
            await this.refresh_counters()
        }, 60000);
    }

    
    init_observers() {
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

        if(!window.wall_observer) {
            window.wall_observer = new IntersectionObserver(Utils.debounce(entries => {
                const wrapper = $('.default_wrapper')[0]
                entries.forEach(x => {
                    requestAnimationFrame(() => {
                        if(!x.isIntersecting) {
                            wrapper.classList.add('overscrolled')
                        } else {
                            wrapper.classList.remove('overscrolled')
                        }
                    })
                })
            }), {
                root: null,
                rootMargin: "10px",
                threshold: 0
            })
        }

        if($('.show_more')[0] && window.site_params.get('ux.auto_scroll', '1') == '1') {
            window.show_more_observer.observe($('.show_more')[0])
        }

        if($('#_smaller_block')[0] && $('.default_wrapper')[0]) {
            //window.wall_observer.observe($('#_smaller_block')[0])
        }
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
    
        if(counters.faves && $('.navigation #_faves')[0]) {
            $('.navigation #_faves')[0].innerHTML += `
                <span class='counter'>${counters.faves}</span>
            `
        }
        
        if(counters.messages && $('.navigation #_messages')[0]) {
            $('.navigation #_messages')[0].innerHTML += `
                <span class='counter'>${counters.messages}</span>
            `
        }
            
        if(counters.groups && $('.navigation #_groups_invites')[0]) {
            $('.navigation #_groups_invites')[0].innerHTML += `
                <span class='counter'>${counters.groups}</span>
            `
        }
                
        if(counters.menu_notifications_badge && $('.navigation #_notifications')[0]) {
            $('.navigation #_notifications')[0].innerHTML += `
                <span class='counter'>${counters.menu_notifications_badge}</span>
            `

            //document.title = `(${counters.menu_notifications_badge}) ` + document.title
        }
                    
        if(counters.videos && $('.navigation #_videos')[0]) {
            $('.navigation #_videos')[0].innerHTML += `
                <span class='counter'>${counters.videos}</span>
            `
        }
                        
        if(counters.photos && $('.navigation #_photos')[0]) {
            $('.navigation #_photos')[0].innerHTML += `
                <span class='counter'>${counters.photos}</span>
            `
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    window.main_class.load_layout()

    $('textarea').trigger('input')
    $(document).trigger('scroll')

    if(window.active_account) {
        setTimeout(() => {window.main_class.refresh_counters()}, 3000)
    }
})
