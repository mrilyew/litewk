if(!window.templates) {
    window.templates = {}
}

window.templates.paginator = (pagesCount, activePage, stepCount = 3) => {
    if(pagesCount < 2) {
        return ``
    }

    let template = `
        <div class='paginator' data-pagescount='${pagesCount}'></div>
    `

    //pagesCount -= 1

    let template_div = document.createElement('div')
    template_div.innerHTML = template

    let pages = []

    for(let t_page = (activePage - (stepCount - 1)); t_page <= (activePage + (stepCount - 1)); t_page++) {
        if(t_page < 1 || t_page > pagesCount) {
            continue
        }

        pages.push(t_page)
    }
        
    if(activePage > stepCount - 1) {
        window.main_url.searchParams.set('page', 1)

        template_div.querySelector('.paginator').innerHTML += `
            <a data-ignore='1' data-page='1' href='?page=1${window.main_url.hash}'>«</a>
        `
    }

    if(activePage > 1) {
        window.main_url.searchParams.set('page', activePage - 1)

        template_div.querySelector('.paginator').innerHTML += `
            <a data-ignore='1' data-page='${activePage - 1}' href='?page=${activePage - 1}${window.main_url.hash}'>‹</a>
        `
    }

    pages.forEach(page => {
        window.main_url.searchParams.set('page', page)

        template_div.querySelector('.paginator').innerHTML += `
            <a data-ignore='1' data-page='${page}' data-page='${activePage}' href='?page=${page}${window.main_url.hash}' ${activePage == page ? `class='active'` : ''}>${page}</a>
        `
    })

    if(activePage < pagesCount) {
        template_div.querySelector('.paginator').innerHTML += `
            <a data-ignore='1' data-page='${activePage + 1}' href='?page=${activePage + 1}${window.main_url.hash}'>›</a>
        `
    }

    if(activePage < pagesCount - (stepCount - 1)) {
        template_div.querySelector('.paginator').innerHTML += `
            <a data-ignore='1' data-page='${pagesCount}' href='?page=${pagesCount}${window.main_url.hash}'>»</a>
        `
    }

    return template_div.innerHTML
}
