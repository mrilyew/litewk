window.templates.gift_fullsize = (gift) => {
    return `
        <div>
            <img src='${gift.getURL()}'>
            <span>${gift.getMessage()}</span>
            <span>${gift.getDate()}</span>
        </div>
    `
}
