// Либы для js, выполняющие данную задачу, не то, что мне нужно. Так что обошёлся без них
// Данный алгоритм портирован из php в js, и спижжен из другого проекта на букву о. За код ниже я не отвечаю.

window.templates._masonry = (images, maxWidth, maxHeight) => {
    function calculateMultiThumbsHeight(ratios, maxWidth, marginWidth) 
    {
        return (maxWidth - (ratios.length - 1) * marginWidth) / ratios.arraySum()
    }

    function extractSubArr(arr, from, to)
    {
        return arr.slice(from, arr.length - from - (arr.length - to))
    }

    if(!maxWidth) {
        maxWidth = window.consts.MASONRY_MAX_WIDTH_DEFAULT
    }

    if(!maxHeight) {
        maxHeight = window.consts.MASONRY_MAX_HEIGHT_DEFAULT
    }

    const formatted_images = []
    images.forEach(image => {
        let tdom = document.createElement('div')
        tdom.innerHTML = `<div class='masonry_element'>${image}</div>`
        tdom = tdom.firstChild

        const height = Number(tdom.querySelector('.ordinary_attachment').dataset.height)
        const width = Number(tdom.querySelector('.ordinary_attachment').dataset.width)

        const ratio = (width / height).toFixed(2)

        let orientation = 'wide'

        if(ratio >= window.consts.MASONRY_WIDE_RATIO) {
            orientation = 'wide'
        } else if(ratio >= window.consts.MASONRY_REGULAR_RATIO) {
            orientation = 'regular'
        } else {
            orientation = 'slim'
        }

        formatted_images.push({
            'dom': tdom,
            'height': height,
            'width': width,
            'ratio': parseFloat(ratio),
            'orientation': orientation,
        })
    })

    const ratios = formatted_images.map(item => item.ratio)
    const averageRatio = (ratios.arraySum() / ratios.length)
    const maxRatio = maxWidth / maxHeight
    const marginWidth = window.consts.MASONRY_MARGIN_WIDTH
    const marginHeight = window.consts.MASONRY_MARGIN_HEIGHT
    const orientations = formatted_images.map(item => item.orientation)
    const count = formatted_images.length 
    let end = document.createElement('div')

    console.log(orientations)
    switch(count) {
        // ###
        // ###
        case 1:
            let finalHeight = maxHeight / 1.5
            formatted_images[0].dom.setAttribute('style', `width:${Math.ceil(maxWidth / 2)}px;height:${Math.ceil(finalHeight)}px;`)
            
            if(formatted_images[0].dom.querySelector('#_photo')) {
                formatted_images[0].dom.querySelector('#_photo').setAttribute('style', `width:${Math.ceil(maxWidth / 2)}px;height:${Math.ceil(finalHeight)}px;`)
            }

            if(formatted_images[0].dom.querySelector('#_vid')) {
                formatted_images[0].dom.querySelector('#_vid').setAttribute('style', `width:${Math.ceil(maxWidth / 2)}px;height:${Math.ceil(finalHeight)}px;`)
            }
            
            maxHeight = finalHeight
            break
        case 2:
            if(orientations.isEqual(['wide', 'wide']) || orientations.isEqual(['regular', 'regular']) && averageRatio > (1.4 * maxRatio) && Math.abs(formatted_images[0].ratio - formatted_images[1].ratio) < 0.2) {
                let computedHeight = Math.ceil(Math.min(maxWidth / formatted_images[0].ratio, Math.min(maxWidth / formatted_images[1].ratio, (maxHeight - marginHeight) / 2)))

                formatted_images[0].dom.setAttribute('style', `width:${Math.ceil(maxWidth)}px;height:${Math.ceil(computedHeight)}px;`)
                formatted_images[1].dom.setAttribute('style', `width:${Math.ceil(maxWidth)}px;height:${Math.ceil(computedHeight)}px;`)
            } else if(orientations.isEqual(['wide', 'wide']) || orientations.isEqual(['regular', 'regular'])) {
                // #### ####
                // #### ####
                // #### ####
                let computedWidth = (maxWidth - marginWidth) / 2
                let computedHeight_ = Math.min(computedWidth / formatted_images[0].ratio, Math.min(computedWidth / formatted_images[1].ratio, maxHeight))
                
                maxHeight = computedHeight_
                formatted_images[0].dom.setAttribute('style', `width:${Math.ceil(computedWidth)}px;min-height:${computedHeight_}px;height:${computedHeight_}px;`)
                formatted_images[1].dom.setAttribute('style', `width:${Math.ceil(computedWidth)}px;min-height:${computedHeight_}px;height:${computedHeight_}px;`)
            } else {
                let w0 = (
                    (maxWidth - marginWidth) / formatted_images[1].ratio / ( (1 / formatted_images[0].ratio) + (1 / formatted_images[1].ratio))
                )
                let w1 = maxWidth - w0 - marginWidth
                let height = Math.min(maxHeight, Math.min(w0 / formatted_images[0].ratio, w1 / formatted_images[1].ratio))

                maxHeight = height
                formatted_images[0].dom.setAttribute('style', `width:${Math.ceil(w0)}px;height:${Math.ceil(height)}px;`)
                formatted_images[1].dom.setAttribute('style', `width:${Math.ceil(w1)}px;height:${Math.ceil(height)}px;`)
            }

            break
        case 3:
            if(orientations.isEqual(['wide', 'wide', 'wide'])) {
                const upperImageHeight = Math.min(maxWidth / formatted_images[0].ratio, (maxHeight - marginHeight) * (2 / 3))
                const secondaryImageWidth = (maxWidth - marginWidth) / 2
                const secondaryImageHeight  = Math.min(maxHeight - upperImageHeight - marginHeight, Math.min(secondaryImageWidth / formatted_images[1].ratio, secondaryImageWidth / formatted_images[2].ratio))

                formatted_images[0].dom.setAttribute('style', `width:${maxWidth}px;height:${upperImageHeight}px;`)
                formatted_images[1].dom.setAttribute('style', `width:${secondaryImageWidth}px;height:${secondaryImageHeight}px;`)
                formatted_images[2].dom.setAttribute('style', `width:${secondaryImageWidth + marginWidth}px;height:${secondaryImageHeight}px;`)
            } else {
                // ### ###
                // ###
                // ### ###
                // ###
                // ### ###
                const upperImageWidth = Math.min(maxHeight * formatted_images[0].ratio, (maxWidth - marginWidth) * (3 / 5))
                const secondImageHeight = (formatted_images[1].ratio * (maxHeight - marginHeight) / (formatted_images[2].ratio + formatted_images[1].ratio))
                const firstImageHeight  = maxHeight - marginHeight - secondImageHeight
                const secondaryWidth = Math.min(maxWidth - marginWidth - upperImageWidth, Math.min(secondImageHeight * formatted_images[2].ratio, firstImageHeight * formatted_images[1].ratio))

                maxWidth = upperImageWidth + secondaryWidth + marginWidth
                formatted_images[0].dom.setAttribute('style', `width:${Math.ceil(upperImageWidth)}px;height:${maxHeight}px;`)
                formatted_images[1].dom.setAttribute('style', `width:${Math.ceil(secondaryWidth)}px;height:${Math.ceil(secondImageHeight)}px;`)
                formatted_images[2].dom.setAttribute('style', `width:${Math.ceil(secondaryWidth)}px;height:${Math.ceil(firstImageHeight)}px;`)
            }

            break
        case 4:
            // ########
            // ## ## ##
            if(orientations.isEqual(['wide', 'wide', 'wide', 'wide'])) {
                const upperImageHeight = Math.min(maxWidth / formatted_images[0].ratio, (maxHeight - marginHeight) / (2 / 3))
                let heightFirst = (maxWidth - 2 * marginWidth) / (ratios.arraySum() - formatted_images[0].ratio)
                const widthZero  = heightFirst * formatted_images[1].ratio
                const widthFirst  = heightFirst * formatted_images[2].ratio
                const widthSecond  = heightFirst * formatted_images[3].ratio
                //heightFirst = Math.min(maxHeight - marginHeight - upperImageHeight, heightFirst)

                maxHeight = Math.ceil(upperImageHeight + marginHeight + heightFirst)

                formatted_images[0].dom.setAttribute('style', `width:${Math.ceil(maxWidth)}px;height:${upperImageHeight}px;`)
                formatted_images[1].dom.setAttribute('style', `width:${Math.ceil(widthZero)}px;height:${Math.ceil(heightFirst)}px;`)
                formatted_images[2].dom.setAttribute('style', `width:${Math.ceil(widthFirst)}px;height:${Math.ceil(heightFirst)}px;`)
                formatted_images[3].dom.setAttribute('style', `width:${Math.ceil(widthSecond)}px;height:${Math.ceil(heightFirst)}px;`)
            } else if(orientations.isEqual(['slim', 'wide', 'slim', 'slim'])) {
                /*
                ### ##
                ###
                ### ##
                ###
                ### ##
                */
                const upperWidth = Math.min(maxWidth * formatted_images[0].ratio, (maxWidth - marginWidth)/* * (2 / 3)*/)
                let widthMain = (maxHeight - 2 * marginHeight) / (1 / formatted_images[1].ratio + 1 / formatted_images[2].ratio + 1 / formatted_images[3].ratio)
                const heightZero = widthMain / formatted_images[1].ratio
                const heightFirst = widthMain / formatted_images[2].ratio
                const heightSecond = widthMain / formatted_images[3].ratio
                widthMain = Math.min(widthMain, maxWidth - marginWidth - upperWidth)

                formatted_images[0].dom.setAttribute('style', `width:${Math.ceil(upperWidth)}px;height:${Math.ceil(maxHeight)}px;`)
                formatted_images[1].dom.setAttribute('style', `width:${Math.ceil(widthMain)}px;height:${Math.ceil(heightZero)}px;`)
                formatted_images[2].dom.setAttribute('style', `width:${Math.ceil(widthMain)}px;height:${Math.ceil(heightFirst)}px;`)
                formatted_images[3].dom.setAttribute('style', `width:${Math.ceil(widthMain)}px;height:${Math.ceil(heightSecond)}px;`)
            } else {
                /*
                ### ###
                ### ###

                ### ###
                ### ###
                */
                const allHeight = maxHeight / 2
                const allWidth = (maxWidth / 2)

                formatted_images[0].dom.setAttribute('style', `width:${Math.ceil(allWidth)}px;height:${Math.ceil(allHeight)}px;`)
                formatted_images[1].dom.setAttribute('style', `width:${Math.ceil(allWidth)}px;height:${Math.ceil(allHeight)}px;`)
                formatted_images[2].dom.setAttribute('style', `width:${Math.ceil(allWidth)}px;height:${Math.ceil(allHeight)}px;`)
                formatted_images[3].dom.setAttribute('style', `width:${Math.ceil(allWidth)}px;height:${Math.ceil(allHeight)}px;`)
            }

            break
        default:
            // neibu
            const ratiosCropped = []
            if(averageRatio > 1.1) {
                ratios.forEach(ratio => {
                    ratiosCropped.push(Math.max(ratio, 1.0))
                })
            } else {
                ratios.forEach(ratio => {
                    ratiosCropped.push(Math.min(ratio, 1.0))
                })
            }

            const tries = []
            let firstLine, secondLine, thirdLine = null

            firstLine = count
            tries[firstLine] = [calculateMultiThumbsHeight(ratiosCropped, maxWidth, marginWidth)]

            for(let firstLine = 1; firstLine < (count - 1); firstLine++) {
                secondLine = count - firstLine
                
                tries[firstLine + '&' + secondLine] = [
                    calculateMultiThumbsHeight(ratiosCropped.slice(0, firstLine), maxWidth, marginWidth),
                    calculateMultiThumbsHeight(ratiosCropped.slice(firstLine), maxWidth, marginWidth)
                ]
            }

            for(let firstLine = 1; firstLine < (count - 2); firstLine++) {
                for(let secondLine = 1; secondLine < (count - secondLine - 1); secondLine++) {
                    thirdLine = count - firstLine - secondLine

                    tries[firstLine + '&' + secondLine + '&' + thirdLine] = [
                        calculateMultiThumbsHeight(ratiosCropped.slice(0, firstLine), maxWidth, marginWidth),
                        calculateMultiThumbsHeight(extractSubArr(ratiosCropped, firstLine, firstLine + secondLine), maxWidth, marginWidth),
                        calculateMultiThumbsHeight(extractSubArr(ratiosCropped, firstLine + secondLine, ratiosCropped.length), maxWidth, marginWidth)
                    ]
                }
            }

            let optimalConfiguration = null
            let optimalDifference = null

            Object.entries(tries).forEach(ar => {
                let config = ar[0].split('&')
                let heights = ar[1]

                let confH = marginHeight * (heights.length - 1)
                heights.forEach(h => {
                    confH += h
                })

                let confDiff = Math.abs(confH - maxHeight)
                if(config.length > 1) {
                    if(config[0] > config[1] || config.length >= 2 && config[1] > config[2]) {
                        confDiff *= 1.1
                    }
                }

                if(!optimalConfiguration || confDiff < optimalDifference) {
                    optimalConfiguration = config
                    optimalDifference = confDiff
                }
            })

            const thumbs_remain = images
            const ratiosRemains = ratiosCropped
            const optHeights = tries[optimalConfiguration.join('&')]

            let totalHeight = 0.0
            let counter = 0
            
            for(let i = 0; i < optimalConfiguration.length; i++) {
                let lineChunksNum = optimalConfiguration[i]
                let lineThumbs = []
                for(let j = 0; j < lineChunksNum; j++) {
                    lineThumbs.push(thumbs_remain.shift())
                }

                let lineHeight = optHeights[i]
                totalHeight += lineHeight
                let totalWidth = 0

                for(let j = 0; j < lineThumbs.length; j++) {
                    thumbRatio = ratiosRemains.shift()
                    let w = 0
                    if(j == lineThumbs.length - 1) {
                        w = maxWidth - totalWidth
                    } else {
                        w = thumbRatio * lineHeight
                    }

                    totalWidth += Math.ceil(w)

                    formatted_images[counter].dom.setAttribute('style', `width:${Math.ceil(w)}px;height:${Math.ceil(lineHeight)}px;`)
                
                    counter += 1
                }
            }

            maxHeight = Math.ceil(totalHeight + marginHeight * (optHeights.length - 1))
        }

    end.innerHTML = `<div style='height: ${maxHeight}px;max-width: ${maxWidth}px' class='attachments_masonry'></div>`
    end = end.firstChild
    end.setAttribute('data-orientations', orientations.toString())

    formatted_images.forEach(imager => {
        end.insertAdjacentElement('beforeend', imager.dom)
    })

    return end.outerHTML
}
