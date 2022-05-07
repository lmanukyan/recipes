const SiteRoles = {
    administrator: 'Ադմինիստրատոր',
    moderator: 'Մոդերատոր',
    editor: 'Հեղինակ'
}

export const SiteRolesArray = (() => {
    let rolesArray = [];
	for(let key in SiteRoles){
		rolesArray.push({id: key, label: SiteRoles[key]})
	}
	return rolesArray;
})()

export const getRoleLabel = (id) => SiteRoles[id];