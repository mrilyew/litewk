window.templates.search_users_params = () => {
    return `
    <div class='search_param'>
        <b class='nobold'>${_('search.search_params_user_city')}</b>
        <input type='text' value='${window.main_url.getParam('sp_cityid') ?? ''}' data-setname='cityid' placeholder='${_('search.search_params_user_city_id')}'>
    </div>
    <div class='search_param'>
        <b class='nobold'>${_('search.search_params_user_sort')}</b>
        <select data-setname='sort'>
            <option value='0' ${window.main_url.getParam('sp_sort') != '1' ? 'selected' : ''}>${_('search.search_params_user_sort_popularity')}</option>
            <option value='1' ${window.main_url.getParam('sp_sort') == '1' ? 'selected' : ''}>${_('search.search_params_user_sort_regdate')}</option>
        </select>
    </div>
    <div class='search_param'>
        <b class='nobold'>${_('search.search_params_user_relation')}</b>
        <select data-setname='relation'>
            <option value='0' ${window.main_url.getParam('sp_relation', '0') == '0' ? 'selected' : ''}>${_('relation.not_picked_small')}</option>
            <option value='1' ${window.main_url.getParam('sp_relation', '0') == '1' ? 'selected' : ''}>${_('relation.single')}</option>
            <option value='2' ${window.main_url.getParam('sp_relation', '0') == '2' ? 'selected' : ''}>${_('relation.meets')}</option>
            <option value='3' ${window.main_url.getParam('sp_relation', '0') == '3' ? 'selected' : ''}>${_('relation.engaged')}</option>
            <option value='4' ${window.main_url.getParam('sp_relation', '0') == '4' ? 'selected' : ''}>${_('relation.married')}</option>
            <option value='5' ${window.main_url.getParam('sp_relation', '0') == '5' ? 'selected' : ''}>${_('relation.complicated')}</option>
            <option value='6' ${window.main_url.getParam('sp_relation', '0') == '6' ? 'selected' : ''}>${_('relation.active')}</option>
            <option value='7' ${window.main_url.getParam('sp_relation', '0') == '7' ? 'selected' : ''}>${_('relation.inlove')}</option>
        </select>
    </div>
    <div class='search_param ager'>
        <b class='nobold'>${_('search.search_params_user_age')}</b>

        <div class='flex_row' style='gap: 6px;'>
            <input type='text' value='${window.main_url.getParam('sp_age_from') ?? ''}' data-setname='age_from' placeholder='${_('search.search_params_user_from')}'>
            <input type='text' value='${window.main_url.getParam('sp_age_to') ?? ''}' data-setname='age_to' placeholder='${_('search.search_params_user_to')}'>
        </div>
    </div>
    <div class='search_param ager'>
        <b class='nobold'>${_('search.search_params_user_birthday')}</b>

        <input type='date' value='${window.main_url.getParam('sp_birth') ?? ''}' data-setname='birth'>
    </div>
    <div class='search_param'>
        <b class='nobold'>${_('search.search_params_user_gender')}</b>

        <label>
            <input type='radio' value='0' name='sp_gender' ${window.main_url.getParam('sp_gender') == 0 || !window.main_url.hasParam('sp_gender') ? 'checked' : ''} data-setname='gender'>
            ${_('search.search_params_user_gender_any')}
        </label>

        <label>
            <input type='radio' value='2' name='sp_gender' ${window.main_url.getParam('sp_gender') == 2 ? 'checked' : ''} data-setname='gender'>
            ${_('search.search_params_user_gender_male')}
        </label>

        <label>
            <input type='radio' value='1' name='sp_gender' ${window.main_url.getParam('sp_gender') == 1 ? 'checked' : ''} data-setname='gender'>
            ${_('search.search_params_user_gender_female')}
        </label>
    </div>
    <div class='search_param'>
        <b class='nobold'>${_('search.search_params_user_hometown')}</b>

        <input type='text' placeholder='${_('search.search_params_user_hometown')}' value='${window.main_url.hasParam('sp_hometown') ? window.main_url.getParam('sp_hometown') : ''}' data-setname='hometown'>
    </div>
    <div class='search_param'>
        <b class='nobold'>${_('search.search_params_user_additional')}</b>

        <div>
            <label>
                <input type='checkbox' value='1' ${window.main_url.getParam('sp_has_photo') == 1 ? 'checked' : ''} data-setname='has_photo'>
                ${_('search.search_params_user_has_photo')}
            </label>
            <label>
                <input type='checkbox' value='1' ${window.main_url.getParam('sp_has_online') == 1 ? 'checked' : ''} data-setname='has_online'>
                ${_('search.search_params_user_has_online')}
            </label>
        </div>
    </div>
    `    
}

window.templates.search_users_params_poll = () => {
    return `
    <div class='search_param'>
        <label>
            <input type='checkbox' value='1' ${window.main_url.getParam('sp_from_friends') == 1 ? 'checked' : ''} data-setname='from_friends'>
            ${_('polls.only_from_friends')}
        </label>
    </div>
    <div class='search_param'>
        <b class='nobold'>${_('search.search_params_user_city')}</b>
        <input type='text' value='${window.main_url.getParam('sp_cityid') ?? ''}' data-setname='cityid' placeholder='${_('search.search_params_user_city_id')}'>
    </div>
    <div class='search_param'>
        <b class='nobold'>${_('search.search_params_user_gender')}</b>

        <label>
            <input type='radio' value='0' name='sp_gender' ${window.main_url.getParam('sp_gender') == 0 || !window.main_url.hasParam('sp_gender') ? 'checked' : ''} data-setname='gender'>
            ${_('search.search_params_user_gender_any')}
        </label>

        <label>
            <input type='radio' value='2' name='sp_gender' ${window.main_url.getParam('sp_gender') == 2 ? 'checked' : ''} data-setname='gender'>
            ${_('search.search_params_user_gender_male')}
        </label>

        <label>
            <input type='radio' value='1' name='sp_gender' ${window.main_url.getParam('sp_gender') == 1 ? 'checked' : ''} data-setname='gender'>
            ${_('search.search_params_user_gender_female')}
        </label>
    </div>
    `
}
