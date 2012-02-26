function(newDoc, oldDoc, userCtx) {
	if (userCtx.roles.indexOf('_admin') === -1) {
		throw({unauthorized : 'read-only, much sorries'});
	}
}