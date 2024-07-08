class LocalStorageParams {
    constructor(section = 'params') {
        this.section = section

        if(localStorage.getItem(section) == undefined) {
            localStorage.setItem(section, '{}')
        }
    }

    set(param, value) {
        let params = JSON.parse(localStorage.getItem(this.section)) ?? {}
        params[param] = value

        localStorage.setItem(this.section, JSON.stringify(params))
    }

    get(param, def = null) {
        let params = JSON.parse(localStorage.getItem(this.section) ?? {})

        if(params[param] == '0') {
            return '0'
        }

        return params[param] ? params[param] : def
    }

    has(param) {
        let params = JSON.parse(localStorage.getItem(this.section) ?? {})

        return params[param] != null || params[param] != undefined
    }

    is(param, value) {
        let params = JSON.parse(localStorage.params ?? {})

        return params[param] != value
    }

    delete(param) {
        this.set(param, undefined)
        return 1
    }

    deleteAll() {
        localStorage.removeItem(this.section)
    }
}
