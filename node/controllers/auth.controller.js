exports.jwtAuth = (req, res, next) => {
	if (!req.authInfo.checkLocalScope(req.body.scope)) {
		res.writeHead(403, {
			'Content-Type': 'application/json'
		});
		console.error('[ERROR] User is not authorized.');
		next('[ERROR] User is not authorized.');
		res.end('{}');
	}
};