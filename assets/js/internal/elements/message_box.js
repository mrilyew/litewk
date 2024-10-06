class MessageBox {
    constructor(title, content, buttons, buttons_actions, additional = {}) {
        u('body').addClass('dimmed')
        
        this.random_id = Utils.random_int(0, 100000)
        const as_window = additional.as_window == 1
        const titleless = additional.no_title == 1

        let insert_node = u('.main_wrapper')

        if(as_window) {
            insert_node = u('.fullscreen_dimmer')
        }

        insert_node.append(`
            <div class='messagebox${as_window ? ' messagebox_window' : ''}${titleless ? ' messagebox_titleless' : ''}' id='msg${this.random_id}'>
                <div id='_close'>
                    <svg viewBox="0 0 15.22 15.2"><line x1="0.36" y1="0.35" x2="14.39" y2="14.85" style="fill:none;stroke-miterlimit:10"/><line x1="14.86" y1="0.35" x2="0.83" y2="14.85" style="fill:none;stroke-miterlimit:10"/></svg>
                </div>

                <div class='messagebox_title'>
                    <b ${additional.big_name ? `style='font-size: 14px;'` : ''}>${title}</b>
                </div>
                <div class='messagebox_body'>
                    ${content}
                </div>
                ${buttons ? `<div class='messagebox_buttons'></div>` : ''}
            </div>
        `)
        
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

                if(b.indexOf('|') != -1) {
                    const spli = b.split('|')
                    btn.setAttribute('value', spli[0])
                    btn.classList.add(spli[1])
                } else {
                    btn.setAttribute('value', b)
                }

                btn.onclick = buttons_actions[i]
    
                u(`#msg${this.random_id} .messagebox_buttons`).nodes[0].insertAdjacentElement('beforeend', btn)
                btn = null
                i += 1
            })
    
            i = null
        } else {
            u(`#msg${this.random_id} .messagebox_buttons`).remove()
        }

        u(`#msg${this.random_id} #_close`).on('click', (e) => {
            e.preventDefault()

            this.close()
        })

        //u('.fullscreen_dimmer').nodes[0].scrollTop = 0
        if(!window.messagebox_stack) {
            window.messagebox_stack = []
        }

        window.messagebox_stack.push(this)
        main_class.undom()
    }

    getNode() {
        return u(`#msg${this.random_id}`).nodes[0]
    }

    close() {
        document.onkeyup = null
        u('#msg'+this.random_id).remove()

        if(document.querySelectorAll('.messagebox').length < 1) {
            u('body').removeClass('dimmed')
        }

        const index_item = window.messagebox_stack.find(item => item.random_id == this.random_id)
        const index_of_item = window.messagebox_stack.indexOf(index_item)
        window.messagebox_stack = Utils.array_splice(window.messagebox_stack, index_of_item)
        
        delete this
    }

    static toggleCircle() {
        u('.load_circle').toggleClass('shown')
    }
}
