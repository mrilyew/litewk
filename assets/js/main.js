window.main_class = (function() {
    return {
        hash_params: {},
        counter: 0,
        counters: null,

        loadLayout: async function() {
            console.info('LiteWK startup')
    
            // Основные классы.
            let show_authuser_error = false
            window.saved_pages = []
            window.main_classes = {}
            window.site_params = new LocalStorageParams
            window.cache = new IndexDBWrapper('cache')
            window.left_menu = new LeftMenu
            window.accounts = new Accounts
            window.main_url = new BetterURL(location.href)

            await this.loadAdditionalScripts()
    
            // Если передан параметр "authuser" с id аккаунта.
            if(window.main_url.hasParam('authuser')) {
                const authuser = Number(window.main_url.getParam('authuser'))
                const accounts = window.accounts.getAccounts()
    
                // ID в смысле индекс элемента.
                if(authuser < window.consts.ACCOUNTS_MAX_COUNT) {
                    const probaly_account = accounts[authuser]
    
                    if(probaly_account) {
                        let probaly_account = Account.findViaToken(probaly_account.token)
                    
                        if(probaly_account) {
                            probaly_account.makeActive()
                        }
                    } else {
                        show_authuser_error = true
                    }
                } else {
                    // ID в смысле id аккаунта.
                    const probaly_account = accounts.find(acc => acc.info.id == authuser)
    
                    if(!probaly_account) {
                        show_authuser_error = true
                    } else {
                        probaly_account.makeActive()
                    }
                }
            }
    
            window.active_account = window.accounts.getActiveAccount()
            if(window.active_account) {
                window.vk_api = new VkApi(window.active_account.path, window.active_account.token)
            }
            
            window.use_execute = window.site_params.get('internal.use_execute', '1') == '1'
            window.lang = !window.site_params.get('lang') ? window.langs.find(item => item.lang_info.short_name == 'ru') : window.langs.find(item => item.lang_info.short_name == window.site_params.get('lang'))

            if(!window.lang) {
                console.info('Language has been reset')
                
                window.site_params.set('lang', 'qqx')
                window.lang = window.langs.find(item => item.__short_name == 'qqx')
            }

            document.querySelector('body').insertAdjacentHTML('afterbegin', window.templates.main(window.left_menu.getHTML()))
    
            // Кастомный JS
            let custom_js = window.site_params.get('ui.custom_js')
            if(custom_js) {
                let tmp_script = document.createElement('script')
                tmp_script.setAttribute('id', '_customjs')
                tmp_script.innerHTML = custom_js
        
                document.body.appendChild(tmp_script)
            }

            // Наконец переходим к самой странице.
            try {
                window.router.route(location.href)
            } catch(e) {
                Utils.add_onpage_error(`${_('errors.could_not_draw_page')}:<br>
                ${e.message}`)
            }
    
            if(show_authuser_error) {
                Utils.fastmessagebox_error(_('errors.error'), _('errors.no_account_with_id'))
            }
    
            setInterval(async () => {
                if(window.site_params.get('ux.online_status', 'none') == 'timeout' && window.active_account) {
                    await window.vk_api.call('account.setOnline')
    
                    console.log('5 minutes exceeded and online was called')
                }
            }, window.consts.ACCOUNTS_ONLINE_TIMEOUT);
    
            
            setInterval(async () => {
                await main_class.refreshCounters()
            }, window.consts.ACCOUNTS_COUNTERS_REFRESH_TIMEOUT);

            // чтоб глаза не мозолило колесо загрузки

            setTimeout(async () => {
                window.notificator = new LongPoll()
                await window.notificator.setup()
            }, 3000)
        },
        loadAdditionalScripts: async function() {
            if(window.site_params.get('ux.twemojify', '1') == '1') {
                await Utils.append_script('https://unpkg.com/twemoji@latest/dist/twemoji.min.js')
            }

            if(window.site_params.get('ui.lottie_sticker_animations', '1') == '1') {
                await Utils.append_script('https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.7.14/lottie.min.js')
            }
        },
        setupObservers: function() {
            if(!window.show_more_observer) {
                window.show_more_observer = new IntersectionObserver(entries => {
                    entries.forEach(x => {
                        if(x.isIntersecting) {
                            u(".show_more").trigger('click')
                        }
                    })
                }, {
                    root: null,
                    rootMargin: "0px",
                    threshold: 0
                })
            }
    
            if(!window.wall_observer) {
                window.wall_observer = new IntersectionObserver(entries => {
                    const wrapper = u('.absolute_zone_wrapper').nodes[0]

                    entries.forEach(x => {
                        if(!wrapper) {
                            return
                        }
                        
                        if(!x.isIntersecting) {
                            wrapper.classList.add('overscrolled')
                        } else {
                            wrapper.classList.remove('overscrolled')
                        }
                    })
                }, {
                    root: u('.absolute_zone')[0],
                    rootMargin: "0px",
                    threshold: 0
                })
            }
    
            if(u('.show_more').nodes[0] && window.site_params.get('ux.auto_scroll', '1') == '1') {
                window.show_more_observer.observe(u('.show_more').nodes[0])
            }
    
            if(u('.absolute_zone #_smaller_block').nodes[0] && u('.absolute_zone').nodes[0]) {
                window.wall_observer.observe(u('.absolute_zone #_smaller_block').nodes[0])
            }
        },
        addError: function(message, id, wait_time = 5000, type = '') {
            if(document.querySelectorAll(`*[data-errid='${id}']`).length > 0) {
                return
            }
            
            window.scrollTo(0, 0)
            u('.page_content').nodes[0].insertAdjacentHTML('afterbegin', `
                <div class='head_error ${type}' data-errid='${id}'>
                    <span>${message}</span>
                </div>
            `)
    
            setTimeout(() => {
                u(`div[data-errid='${id}']`).remove()
            }, wait_time)
        },
        addOnpageError: function(message) {
            u('.page_content').html('')
            u('.page_content').nodes[0].insertAdjacentHTML('beforeend', `
                <div class='onpage_error'>
                    ${message}
                </div>
            `)
        },
        addOnpageErrorWithTitle: function(title, message) {
            u('.page_content').html('')
            u('.page_content').nodes[0].insertAdjacentHTML('beforeend', `
                <div class='onpage_error with_title'>
                    <div class='onpage_error_title'>
                        ${title}
                    </div>

                    <div class='onpage_error_body'>
                        ${message}
                    </div>
                </div>
            `)
        },
        addErrorWithBackButton: function(message) {
            main_class.addOnpageErrorWithTitle(_('user_page.info'), `
                <span>${message}</span>
                <input type='button' id='__comeback' value='${_('messagebox.comeback')}'>
            `)
        },
        refreshCounters: async function() {
            if(!window.vk_api || window.site_params.get('ux.navigation_counters', '1') == '0') {
                return
            }

            let counters = await window.vk_api.call('account.getCounters', {}, false)
            if(!counters.response || counters.error) {
                return
            }

            window.main_class.counters = counters.response

            if(!window.edit_mode) {
                u('.main_wrapper .navigation').html(window.left_menu.getHTML())
            }
        },
        runTriggers: function () {
            u('textarea').trigger('input')
            u(document).trigger('scroll')
        },
        changeTitle: function(title, postfix, counter, favicon = null) {
            let final_title = ''

            if(!title) {
                final_title = document.title
            } else {
                final_title = title
            }

            if(postfix) {
                final_title += ' | ' + postfix
            }

            final_title = final_title.replace(window.consts.REGEX_REMOVE_COUNTERS, '')
            if(counter) {
                final_title = `(${counter}) ` + final_title
            }

            if(!favicon) {
                u('#_favicon_node').attr('href', location.pathname + 'assets/images/favicons/favicon.ico')
            }

            document.title = final_title
        },
        removeCountersTitle: function() {
            window.main_class.counter = 0
            document.title = document.title.replace(window.consts.REGEX_REMOVE_COUNTERS, '')
        },
        newNotification: function(title, description = null, avatar = null, right_additional = null, callback = null, timeout = 5000, side = 0, update_title = false) {
            const uid = 'notif' + Utils.random_int(0, 9999999)
            const template = window.templates._notification_bubble(title, description, avatar, right_additional, uid)
           
            if(side == 0) {
                u('.notification_global_wrap.left').append(template)
            } else {
                u('.notification_global_wrap.right').append(template)
            }

            function _getNode() {
                return u('#' + uid)
            }

            function _closeNotification(fade = true) {
                if(document.visibilityState != 'visible') {
                    return setTimeout(() => {_closeNotification()}, timeout);
                }
                
                window.main_class.removeCountersTitle()

                _getNode().addClass('disappears')
                if(fade) {
                    return setTimeout(() => {_getNode().remove()}, 450)
                } else {
                    _getNode().remove()
                }
            }

            if(update_title && document.visibilityState != 'visible') {
                window.main_class.counter += 1

                window.main_class.changeTitle(null, null, window.main_class.counter)
            }

            setTimeout(() => {_closeNotification()}, timeout)
            template.on('click', '#close', (e) => {
                _closeNotification(false)
            })

            template.on('click', (e) => {
                if(!template.hasClass('disappears')) {
                    if(callback) {
                        callback()
                    }

                    _closeNotification()
                }
            })
        },
        refresh_counters: async function() {
            return await this.refreshCounters()
        },
        init_observers: function() {
            return this.setupObservers()
        },
        add_onpage_error: function(message) {
            return this.addOnpageError(message)
        },
        add_error: function(message, id, wait_time = 5000, type = '') {
            return this.addError(message, id, wait_time, type)
        },
        startup: async function () {
            window.scrollTo(0, 0)
            await this.loadLayout()
            this.runTriggers()

            if(window.active_account) {
                setTimeout(() => {window.main_class.refreshCounters()}, 3000)
            }
        },
    }
})()
