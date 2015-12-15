// database that includes name, captured, photo URL and lat/long

var db = Ti.Database.open('TiBountyHunter2');
db.execute('CREATE TABLE IF NOT EXISTS fugitives(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, captured INTEGER, body TEXT, tags TEXT, url TEXT, capturedLat REAL, capturedLong REAL);');
db.close();

exports.list = function(_audio) {
	var fugitiveList = [];
	var db = Ti.Database.open('TiBountyHunter2');
	var result = db.execute('SELECT * FROM fugitives WHERE captured = ? ORDER BY name ASC', (_audio) ? 1 : 0);
	while (result.isValidRow()) {
		fugitiveList.push({
			// add these attributes for the benefit of a table view
			title: result.fieldByName('name'),
			id: result.fieldByName('id'),
			hasChild:true,
			color: 'black',
			name: result.fieldByName('name'),
			captured: (Number(result.fieldByName('captured')) === 1),
			body: result.fieldByName('body'),
			tags: result.fieldByName('tags'),
			url: result.fieldByName('url'),
			capturedLat: Number(result.fieldByName('capturedLat')),
			capturedLong: Number(result.fieldByName('capturedLong'))
		});
		result.next();
	}
	result.close();
	db.close();

	return fugitiveList;
};

exports.add = function(_name,_audio,_body,_tags) {
	var db = Ti.Database.open('TiBountyHunter2');
	db.execute("INSERT INTO fugitives(name,captured,body,tags) VALUES(?,?,?,?)",_name,_audio,_body,_tags);
	db.close();

	//Dispatch a message to let others know the database has been updated
	Ti.App.fireEvent("databaseUpdated");
};

exports.addCoords = function(_name,_audio,_body,_tags,_lat,_lng) {
	var db = Ti.Database.open('TiBountyHunter2');
	db.execute("INSERT INTO fugitives(name,captured,body,tags,capturedLat,capturedLong) VALUES(?,?,?,?,?,?)",_name,_audio,_body,_tags,_lat,_lng);
	db.close();

	// Dispatch a message to let others know the database has been updated
	Ti.App.fireEvent("databaseUpdated");
};

exports.addAudio = function(_name,_audio,_body,_tags,_url) {
	var db = Ti.Database.open('TiBountyHunter2');
	db.execute("INSERT INTO fugitives(name,captured,body,tags,url) VALUES(?,?,?,?,?)",_name,_audio,_body,_tags,_url);
	db.close();

	// Dispatch a message to let others know the database has been updated
	Ti.App.fireEvent("databaseUpdated");
};

exports.addAC = function(_name,_audio,_body,_tags,_url,_lat,_lng) {
	var db = Ti.Database.open('TiBountyHunter2');
	db.execute("INSERT INTO fugitives(name,captured,body,tags,url,capturedLat,capturedLong) VALUES(?,?,?,?,?,?,?)",_name,_audio,_body,_tags,_url,_lat,_lng);
	db.close();

	// Dispatch a message to let others know the database has been updated
	Ti.App.fireEvent("databaseUpdated");
};


exports.del = function(_id) {
	var db = Ti.Database.open('TiBountyHunter2');
	db.execute("DELETE FROM fugitives WHERE id = ?",_id);
	db.close();

	// Dispatch a message to let others know the database has been updated
	Ti.App.fireEvent("databaseUpdated");
};

exports.upDate = function(_id,_body,_tags) {
	var db = Ti.Database.open('TiBountyHunter2');
	db.execute("UPDATE fugitives SET body = ?, tags = ? WHERE id = ?",_body,_tags,_id);
	db.close();

	// Dispatch a message to let others know the database has been updated
	Ti.App.fireEvent("databaseUpdated");
};

exports.upDateCoords = function(_id,_body,_tags,_lat,_lng) {
	var db = Ti.Database.open('TiBountyHunter2');
	db.execute("UPDATE fugitives SET body = ?, tags = ?, capturedLat = ?, capturedLong = ?  WHERE id = ?",_body,_tags,_lat,_lng,_id);
	db.close();

	// Dispatch a message to let others know the database has been updated
	Ti.App.fireEvent("databaseUpdated");
};