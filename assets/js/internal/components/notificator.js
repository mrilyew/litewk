class LongPoll {
    async setup() {
        if(window.site_params.get('ux.live_notifications', '0') == '0') {
            return
        }

        const id_ = window.active_account.getVkAccount().getId()
        const proxy_url = window.site_params.get('internal.proxy_url', 'https://api.allorigins.win/get?url=')
        if(proxy_url == '' || proxy_url.indexOf('allorigins.win') != -1) {
            console.error(`Notificator | Can't create notificator: need to use local proxy.`)
            return
        }

        const base = await window.vk_api.call('execute', {'code' : `
            var lp = API.messages.getLongPollServer();
            var queue = API.queue.subscribe({'queue_ids': "imagestatus_${id_},ftoggles_${id_}_2274003,accountsettings_${id_},onlfriends_${id_},accountcounters_${id_},calls_${id_}"});

            return {"lp": lp, "queue": queue};
        `})

        const lp_base = base.lp
        const queue_base = base.queue
        /*const evt = new EventSource(proxy_url.replace('proxy', 'event-source') + encodeURIComponent(`https://api.vk.com/pushsse/ruim?key=${lp_base.key}&mode=746&ts=${lp_base.ts}&uid=${id_}&version=13`))
        
        this.evt = evt
        evt.onmessage = (event) => {
            console.info(`Longpoll | Got message: `, event)
        }*/

        this.base_url = queue_base.base_url
        this.main_queues = queue_base.queues
        const all_keys = []
        const all_ts = []

        this.main_queues.forEach(el => {all_keys.push(el.key)})
        this.main_queues.forEach(el => {all_ts.push(el.timestamp)})

        this.all_keys = all_keys.join('')
        this.all_ts = all_ts.join('_')

        this.checkUpdates()
    }

    closeConnection() {
        this.evt.close()
    }

    async checkUpdates() {
        if(window.site_params.get('ux.live_notifications', '0') == '0') {
            console.info('Notificator | Disabled.')
            return
        }

        const act  = 'a_check'
        const wait = 60
        const acc_id = window.active_account.getVkAccount().getId()

        let path = `${this.base_url}?act=${act}&key=${this.all_keys}&id=${acc_id}&ts=${this.all_ts}&wait=${wait}`
        path = window.site_params.get('internal.proxy_url', 'https://api.allorigins.win/get?url=') + encodeURIComponent(path)

        const result = JSON.parse(await Utils.jsonp(path, 2000000000))
        const all_ts = []
        let events = []

        result.forEach(el => {all_ts.push(el.ts)})
        result.forEach(el => {events = events.concat(el.events)})

        if(result.failed) {
            console.log(`Notificator | Got error, `, result)
            return
        }

        console.log(`Notificator | Got events: `, events)
        this.all_ts = all_ts.join('_')

        await this.checkUpdates()
    }
}

class LPEvent {
    constructor(eventer) {
        this.event = eventer
    }
}
