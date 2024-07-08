class MessageBox {
    constructor(title, content, buttons, buttons_actions, additional = {}) {
        $('body').addClass('dimmed')
        $('.wrapper')[0].insertAdjacentHTML('beforeend', 
            `
                <div class='messagebox'>
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
    
                $('.messagebox_buttons')[0].insertAdjacentElement('beforeend', btn)
                btn = null
                i += 1
            })
    
            i = null
        }

        $('.messagebox_title #_close').on('click', (e) => {
            e.preventDefault()

            this.close()
        })
    }

    close()
    {
        document.onkeyup = null
        $('body').removeClass('dimmed')
        $('.wrapper .messagebox').remove()

        delete this
    }
}

class MessageWindow {
    constructor(title, func, additional = {}) {
        $('body').addClass('dimmed')
        $('.wrapper')[0].insertAdjacentHTML('beforeend', 
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
        $('.wrapper .fullscreen_view').remove()
    }
}
