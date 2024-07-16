class MessageBox {
    constructor(title, content, buttons, buttons_actions, additional = {}) {
        $('body').addClass('dimmed')
        
        this.random_id = Utils.random_int(0, 100000)
        $('.main_wrapper')[0].insertAdjacentHTML('beforeend', 
            `
                <div class='messagebox' id='msg${this.random_id}'>
                    <div class='messagebox_title'>
                        <span>${title}</span>

                        <a href='#' data-ignore='1' id='_close'>${_('messagebox.close')}</a>
                    </div>
                    <div class='messagebox_body'>
                        <span>${content}</span>
                    </div>
                    ${buttons ? `<div class='messagebox_buttons'></div>` : ''}
                </div>
            `
        )
        
        $('.dimmed .dimmer').on('click', (e) => {
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
    
                $(`#msg${this.random_id} .messagebox_buttons`)[0].insertAdjacentElement('beforeend', btn)
                btn = null
                i += 1
            })
    
            i = null
        }

        $(`#msg${this.random_id} .messagebox_title #_close`).on('click', (e) => {
            e.preventDefault()

            this.close()
        })
    }

    getNode() {
        return $(`#msg${this.random_id}`)[0]
    }

    close()
    {
        document.onkeyup = null

        $('.main_wrapper #msg'+this.random_id).remove()

        if(document.querySelectorAll('.messagebox').length < 1) {
            $('body').removeClass('dimmed')
        }

        delete this
    }
}

class MessageWindow {
    constructor(title, func, additional = {}) {
        $('body').addClass('dimmed')
        $('.main_wrapper')[0].insertAdjacentHTML('beforeend', 
            `
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

        $('.dimmed .dimmer').on('click', (e) => {
            this.close()
        })

        document.onkeyup = (e) => {
            if(!this) {
                return
            }

            if(e.keyCode == 27) {
                this.close()
            }
        }

        func($('.fullscreen_view')[0], additional)

        $('#_close').on('click', (e) => {
            e.preventDefault()

            this.close()
        })
    }

    close()
    {
        document.onkeyup = null
        $('body').removeClass('dimmed')
        $('.main_wrapper .fullscreen_view').remove()
    }
}
