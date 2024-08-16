class MessageBox {
    constructor(title, content, buttons, buttons_actions, additional = {}) {
        u('body').addClass('dimmed')
        
        this.random_id = Utils.random_int(0, 100000)
        u('.main_wrapper').append(`
                <div class='messagebox' id='msg${this.random_id}'>
                    <div class='messagebox_title'>
                        <span>${title}</span>

                        <a href='#' data-ignore='1' id='_close'>${_('messagebox.close')}</a>
                    </div>
                    <div class='messagebox_body'>
                        ${content}
                    </div>
                    ${buttons ? `<div class='messagebox_buttons'></div>` : ''}
                </div>
            `
        )
        
        u('.dimmed .dimmer, .fullscreen_dimmer').on('click', (e) => {
            this.close()
        })
        
        document.onkeyup = (e) => {
            if(e.keyCode == 27) {
                this.close()
            }
        }

        if(buttons_actions) {
            let i = 0
            buttons.forEach(b => {
                let btn = document.createElement('input')
                //btn.setAttribute('class', 'showmore')
                btn.setAttribute('type', 'button')
                btn.setAttribute('value', b)
                btn.onclick = buttons_actions[i]
    
                u(`#msg${this.random_id} .messagebox_buttons`).nodes[0].insertAdjacentElement('beforeend', btn)
                btn = null
                i += 1
            })
    
            i = null
        }

        u(`#msg${this.random_id} .messagebox_title #_close`).on('click', (e) => {
            e.preventDefault()

            this.close()
        })
    }

    getNode() {
        return u(`#msg${this.random_id}`).nodes[0]
    }

    close()
    {
        document.onkeyup = null
        u('.main_wrapper #msg'+this.random_id).remove()

        if(document.querySelectorAll('.messagebox').length < 1) {
            u('body').removeClass('dimmed')
        }

        delete this
    }
}

class MessageWindow {
    constructor(title, func, additional = {}) {
        u('body').addClass('dimmed')
        u('.fullscreen_dimmer').append(`
            <div class='fullscreen_view'>
                <div class='fullscreen_view_title'>
                    <span>${title}</span>

                    <div class='fullscreen_buttons'>
                        <a href='#' data-ignore='1' id='_close'><span>${_('messagebox.close')}</span></a>
                    </div>
                </div>
                <div class='fullscreen_view_body'></div>
            </div>
            `
        )

        u('.fullscreen_dimmer').on('click', (e) => {
            if(e.target.classList.contains('fullscreen_dimmer')) {
                this.close()
            }
        })

        document.onkeyup = (e) => {
            if(!this) {
                return
            }

            if(e.keyCode == 27) {
                this.close()
            }
        }

        func(u('.fullscreen_view').nodes[0], additional)

        u('#_close').on('click', (e) => {
            e.preventDefault()

            this.close()
        })
    }

    close()
    {
        document.onkeyup = null
        u('body').removeClass('dimmed')
        u('.fullscreen_dimmer .fullscreen_view').remove()
    }
}
