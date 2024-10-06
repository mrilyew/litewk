window.header = new class {
    toggleAccountActions() {
        u('.header_account').toggleClass('pressed')
        Utils.applyAnimation(u('.header_account_wrapper #header_actions'), 'fadeup')
    }

    hideAccountActions() {
        u('.header_account').removeClass('pressed')
        Utils.applyAnimation(u('.header_account_wrapper #header_actions'), 'fadeup', 'remove')
    }

    actSearch() {
        const search_node = u(`input[name='global_query']`)

        switch((window.router.currentRoute ? window.router.currentRoute.url : 'settings')) {
            default:
                this.search_state = 'default'
                search_node.attr('placeholder', _('navigation.my_search'))
                
                break
            case 'dev':
            case 'dev/query':
                this.search_state = 'documentation'
                search_node.attr('placeholder', _('documentations.search_by_documentation'))

                break
        }
    }

    checkHeader() {
        return
        if(document.body.scrollHeight > document.body.clientHeight) {
            u('.header').attr('style', `width: ${innerWidth - 5}px;`)
            return
        }

        u('.header').attr('style', `width: ${innerWidth}px;`)
    }
}
