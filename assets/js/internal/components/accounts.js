class Accounts {
    constructor()
    {
        return /*JSON.parse(window.site_params.get('accounts') ?? '{}')*/
    }

    async addAccount(path, token, make_active = true)
    {
        let possible_account = Account.findViaToken(token, true)

        if(possible_account) {
            possible_account.makeActive()
            window.active_account = possible_account

            return true
        }

        let new_account = new Account(path, token, [], [], 1)
        let result      = await new_account.takeInfo()

        if(!result) {
            return false
        }

        if(result.error) {
            Utils.fastmessagebox_error(_('errors.account_login_error'), _('errors.account_login_error_desc', result.error.error_msg))
            
            return false
        }

        new_account.append()
        if(make_active) {
            new_account.makeActive()
            window.active_account = new_account
        }
        
        return true
    }

    removeAccount(token)
    {
        let account = Account.findViaToken(token)
        account.remove()
        
        return true
    }

    setActiveAccount(token)
    {
        Accounts.logout()
        let account = Account.findViaToken(token)
        
        if(!account) {
            alert('no account')
            return false
        }

        window.cache.clearAllStores()
        window.site_params.set('active_account', account.token)
    }

    getActiveAccount()
    {
        return Account.findViaToken(window.site_params.get('active_account'))
    }

    getAccountsCount()
    {
        let accs = JSON.parse(window.site_params.get('accounts') ?? '[]')
        if(!accs) {return 0}

        accs = accs.filter(acc => !acc.is_hidden)

        return accs.length
    }

    getAccounts()
    {
        let accs_array = JSON.parse(window.site_params.get('accounts') ?? '[]')
        accs_array = accs_array.filter(acc => !acc.is_hidden)
        let return_array = []

        accs_array.forEach(acc => {
            return_array.push(Account.findViaToken(acc.vk_token))
        })

        return return_array
    }

    static async logout() {
        window.site_params.delete('active_account')
        window.account_vk_api = null
        window.vk_api = await Accounts.getAnonymousModule()
        window.main_class.counters = null
        window.cache.clearAllStores()
    }

    static async getAnonymousModule() {
        if(!window.anonym_vk_api) {
            window.anonym_vk_api = new AnonymousVkApi(window.consts.DEFAULT_VK_API_DOMAIN_FULL)

            if(!window.site_params.has('anonymous_token')) {
                await window.anonym_vk_api.recieveToken()
            } else {
                window.anonym_vk_api.api_token = window.site_params.get('anonymous_token')
            }
        }

        return window.anonym_vk_api
    }

    static async getAnonymousDocumentationModule() {
        if(!window.doc_vk_api) {
            window.doc_vk_api = new AnonymousDocumentationVkApi(window.consts.DEFAULT_VK_API_DOMAIN_FULL)

            if(!window.site_params.has('anonymous_docs_token')) {
                await window.doc_vk_api.recieveToken()
            } else {
                window.doc_vk_api.api_token = window.site_params.get('anonymous_docs_token')
            }
        }

        return window.doc_vk_api
    }
}

class Account {
    constructor(path, token, info = [], settings = [], uid = null) {
        this.path  = path
        this.token = token
        this.info  = info
        this.settings = settings

        if(!uid) {
            this.edit()
        } else {
            this.uid = uid
        }
    }

    static findViaToken(token, show_hidden = false) {
        let parsed_accounts = JSON.parse(window.site_params.get('accounts') ?? '[]')

        if(!show_hidden) {
            parsed_accounts = parsed_accounts.filter(acc => !acc.is_hidden)
        }
        
        let account = parsed_accounts.find(acc => acc.vk_token == token)
        if(!account) {
            return
        }

        return new this(account.vk_path, account.vk_token, account.vk_info, account.vk_settings, account.uid)
    }

    static findViaUid(id, show_hidden = false) {
        let parsed_accounts = JSON.parse(window.site_params.get('accounts') ?? '[]')

        if(!show_hidden) {
            parsed_accounts = parsed_accounts.filter(acc => !acc.is_hidden)
        }
        
        const account = parsed_accounts.find(acc => acc.uid == id)
        if(!account) {
            return
        }

        let uid = account.uid
        if(!uid) {
            uid = Utils.random_int(0, 10000000)
        }

        return new this(account.vk_path, account.vk_token, account.vk_info, account.vk_settings, uid)
    }

    async takeInfo() {
        let temporary_api = new VkApi(this.path, this.token)
        let results = {}

        if(!window.settings_manager.getItem('internal.use_execute').isChecked()) {
            let info = await temporary_api.call({method: 'account.getProfileInfo', raw_result: true, flashError: true})
            let real_info = await temporary_api.call({method: 'users.get', params: {'user_ids': info.response.id, 'fields': window.consts.USER_FULL_FIELDS}, flashError: true, raw_result: true})
            let settings_info = await temporary_api.call({method: 'account.getInfo', params: {}, raw_result: true, flashError: true})

            if(info.error) {
                return info
            }

            real_info.votes = await temporary_api.call({method: 'account.getBalance', params: {}, flashError: true})
            real_info.client_id = await temporary_api.call({method: 'auth.getAccessTokenInfo', params: {}, flashError: true})

            if(real_info.votes) {
                real_info.votes = real_info.votes.votes
            }

            if(real_info.client_id) {
                real_info.client_id = real_info.app_id
            }

            this.info = info.response.merge(real_info.response[0])
            this.settings = settings_info

            results = {'info': this.info, 'settings': this.settings}
        } else {
            results = await temporary_api.call({method: 'execute', params: {'code': `
                var info = API.account.getProfileInfo();
                var real_info = API.users.get({"user_ids": info.id, "fields": "${window.consts.USER_FULL_FIELDS}"});
                real_info.votes = API.account.getBalance().votes;

                var settings = API.account.getInfo();
                settings.client_id = API.auth.getAccessTokenInfo().app_id;

                return {"info": info, "settings": settings, "real_info": real_info[0]};
            `}, raw_result: true, flashError: true})

            if(results.error) {
                return results
            }

            this.info = results.response.info.merge(results.response.real_info)
            this.settings = results.response.settings
        }
        
        return this.info
    }

    getInfo() {
        return {
            'vk_token': this.token,
            'vk_path': this.path,
            'vk_info': this.info,
            'vk_settings': this.settings,
            'uid': this.uid,
        }
    }

    getVkAccount() {
        let user = new User
        user.hydrate(this.info)

        return user
    }

    getVkInfo() {
        return this.info
    }

    append() {
        let parsed_accounts = JSON.parse(window.site_params.get('accounts') ?? '[]')

        parsed_accounts.push({
            'vk_token': this.token,
            'vk_path': this.path,
            'vk_info': this.info,
            'vk_settings': this.settings,
            'uid': Utils.random_int(0, 10000000),
        })

        window.site_params.set('accounts', JSON.stringify(parsed_accounts))
    }

    makeActive() {
        this.edit(null, null, null, false)

        window.site_params.set('active_account', this.token)
        window.account_vk_api = new VkApi(this.path, this.token)
        window.vk_api = window.account_vk_api
        window.active_account = this
    }

    remove() {
        this.edit(null, null, null, true)

        return true
    }

    edit(name, last_name, path, hidden = false) {
        let parsed_accounts = JSON.parse(window.site_params.get('accounts') ?? '[]')
        let index_of = parsed_accounts.findIndex(item => item.vk_token == this.token)
        
        let account = parsed_accounts[index_of]

        account.vk_info.first_name = name ? name : account.vk_info.first_name
        account.vk_info.last_name = last_name ? last_name : account.vk_info.last_name
        account.vk_path = path ? path : account.vk_path

        if(hidden) {
            parsed_accounts.splice(index_of, 1)
        } else {
            account.is_hidden = false
        }

        if(!account.uid) {
            account.uid = Utils.random_int(0, 10000000)
            this.uid = account.uid
        }
 
        window.site_params.set('accounts', JSON.stringify(parsed_accounts))
    }
}
