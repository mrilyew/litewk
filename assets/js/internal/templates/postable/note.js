if(!window.templates) {
    window.templates = {}
}

window.templates.note = (note, owner) => {
    return `
        <a href='${note.getURL()}'>${note.getTitle()}</a>
    `
}
