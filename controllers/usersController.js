module.exports = function(mongo) {
  if(!mongo) {
		throw "Missing mongo";
	}

	return {
    getAllUsersRouteHandler: getAllUsersRouteHandler,
    getUserRouteHandler: getUserRouteHandler,
    postUserRouteHandler: postUserRouteHandler
  };

  function getAllUsersRouteHandler(req, res, next) {
    mongo.collection('users').find({ }, { name: 1, provider: 1, _id: 1 }).toArray(function(err, items) {
			if (err) { return next(err); }
			res.render('users.html', { user: req.user, users: items });
		});
  }

	function getUserRouteHandler(req, res, next) {
    var ObjectID = require('mongodb').ObjectID;
		mongo.collection('users').findOne({ _id: new ObjectID(req.params.id) }, { name: 1, provider: 1, _id: 1, role: 1 }, function(err, item){
      if (err) { return next(err); }
			if(!item){
				var error = new Error("User not found");
				error.statusCode = 404;
				return next(error);
			}
			res.render('userDetail.html', { user: req.user, userName: item.name, userProvider: item.provider, role: item.role, userId: item._id });
		});
	}

	function postUserRouteHandler(req, res, next) {
		var ObjectID = require('mongodb').ObjectID;
		mongo.collection('users').findAndModify({ _id: new ObjectID(req.params.id) }, [], { $set: { role: req.body.role } }, { new: true }, function(err, item){
      if(err){ return next(err); }
      if (!item.value) {
        var error = new Error("User not found");
        error.statusCode = 404;
        return next(error);
      }
      res.render('userDetail.html', { user: req.user, userName: item.value.name, userProvider: item.value.provider, role: item.value.role, userId: item.value._id });
		});
	}
};
