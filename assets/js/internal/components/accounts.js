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

        let new_account = new Account(path, token)
        let result      = await new_account.takeInfo()

        if(!result) {
            return false
        }

        if(result.error) {
            Utils.fastmessagebox_error(_('errors.account_login_error'), _('errors.account_login_error_desc', result.error.error_msg))
            
            return false
        }

        console.log(result)
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
        let account = Account.findViaToken(token)
        
        if(!account) {
            alert('no account')
            return false
        }
        
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
}

class Account {
    constructor(path, token, info = [], settings = []) {
        this.path  = path
        this.token = token
        this.info  = info
        this.settings = settings
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

        return new this(account.vk_path, account.vk_token, account.vk_info, account.vk_settings)
    }

    async takeInfo() {
        let temporary_api = new VkApi(this.path, this.token)
        let results = {}

        if(!window.use_execute) {
            let info = await temporary_api.call('account.getProfileInfo', {}, false)
            let real_info = await temporary_api.call('users.get', {'user_ids': info.response.id, 'fields': window.consts.USER_FULL_FIELDS}, false)
            let settings_info = await temporary_api.call('account.getInfo', {}, false)

            if(info.error) {
                return info
            }

            this.info = info.response.merge(real_info.response[0])
            this.settings = settings_info

            results = {'info': this.info, 'settings': this.settings}
        } else {
            results = await temporary_api.call('execute', {'code': `
                var info = API.account.getProfileInfo();
                var real_info = API.users.get({"user_ids": info.id, "fields": "${window.consts.USER_FULL_FIELDS}"});

                var settings = API.account.getInfo();

                return {"info": info, "settings": settings, "real_info": real_info[0]};
            `}, false)

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
        })

        window.site_params.set('accounts', JSON.stringify(parsed_accounts))
    }

    makeActive() {
        this.edit(null, null, null, false)

        window.site_params.set('active_account', this.token)
        window.vk_api = new VkApi(this.path, this.token)
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
 
        window.site_params.set('accounts', JSON.stringify(parsed_accounts))
    }
}
