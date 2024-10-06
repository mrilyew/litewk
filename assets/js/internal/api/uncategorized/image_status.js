class ImageStatus extends Hasable {
    type = 'image_status'
    table = 'image_statuses'

    async fromUserId(user_id) {
        const find_item = await this.findInCache(user_id)
        if(find_item) {
            this.info = find_item
            return
        }

        const popup = await window.vk_api.call('status.getImagePopup', {'user_id': user_id})
        this.info = popup
        this.info.id = user_id
        this.cacheEntity()
    }

    getIcon() {
        return this.info.popup.photo.images[2].url
    }

    getTitle() {
        return this.info.popup.title.escapeHtml()
    }

    getDescription() {
        return this.info.popup.text.formatText()
    }

    hasButtons() {
        return this.info.popup.buttons && this.info.popup.buttons.length > 0
    }

    getButtons() {
        return this.info.popup.buttons
    }
}
