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
    constructor(path, token, info = []) {
        this.path  = path
        this.token = token
        this.info  = info
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

        return new this(account.vk_path, account.vk_token, account.vk_info)
    }

    async takeInfo() {
        let temporary_api = new VkApi(this.path, this.token)
        let info = await temporary_api.call('account.getProfileInfo', {})

        if(info.error) {
            return null
        }

        this.info = info.response
        return info.response
    }

    getInfo() {
        return {
            'vk_token': this.token,
            'vk_path': this.path,
            'vk_info': this.info,
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
            account.is_hidden = true
        } else {
            account.is_hidden = false
        }
 
        window.site_params.set('accounts', JSON.stringify(parsed_accounts))
    }
}
