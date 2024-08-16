u(document).on('click', '#__clearrecentgroups', async (e) => {
    await window.vk_api.call('groups.removeRecents')

    window.router.restart()
})
