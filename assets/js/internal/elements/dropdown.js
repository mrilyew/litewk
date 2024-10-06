function _dropdown(el) {
    const dropdown_element = u(el)
    const trigger_selector = dropdown_element.attr('data-trigger')
    const event = dropdown_element.attr('data-type') ?? 'click'
    const pos = dropdown_element.attr('data-pos') ?? 'mouse'
    const prefer_direction = dropdown_element.attr('data-preferdirection')
    const trigger = u(trigger_selector)
    const trigger_dom = trigger.nodes[0]
    const X_OFFSET = 30
    const X_OFFSET_S = 50
    const Y_OFFSET = 20
    const Y_OFFSET_S = 50
    dropdown_element.addClass('inited')

    const _changePosition = function(e) {
        switch(prefer_direction) {
            default: 
                if(pos == 'element') {
                    const _y = trigger_dom.offsetTop - trigger_dom.scrollTop + trigger_dom.clientTop
                    const _x = trigger_dom.offsetLeft - trigger_dom.scrollLeft + trigger_dom.clientLeft
                    dropdown_element.attr('style', `top:${_y}px;left:${_x}px`)
                } else {
                    dropdown_element.attr('style', `top:${e.pageY + Y_OFFSET}px;left:${e.pageX - X_OFFSET}px`)
                }

                break
            case 'top':
                dropdown_element.attr('style', `top:${e.pageY - Y_OFFSET_S}px;left:${e.pageX - X_OFFSET_S}px`)
                break
        }
    }

    switch(event) {
        default:
        case 'click':
            trigger.on('click', (e) => {
                e.preventDefault()
                e.stopPropagation()

                dropdown_element.toggleClass('shown')
                _changePosition(e)

                Utils.applyAnimation(dropdown_element, 'fadeup')
            })
            break
        case 'hover':
            trigger.on('mouseenter', (e) => {
                e.preventDefault()
                e.stopPropagation()

                dropdown_element.addClass('shown').removeClass('animated')
                _changePosition(e)

                Utils.applyAnimation(dropdown_element, 'fadeup')
            })
            
            trigger.closest('.dropdown_root').on('mouseleave', (e) => {
                e.preventDefault()
                e.stopPropagation()
        
                dropdown_element.removeClass('shown')
                _changePosition(e)

                Utils.applyAnimation(dropdown_element, 'fadeup', 'remove')
            })

            break
    }

    dropdown_element.append(`<svg viewBox="0 0 18 10"><polygon points="0 10 9 0 18 10 0 10"/></svg>`)
}
