var db = require('lib/db');
					
var NoteTableView = {
	mkTable: function(/*Boolean*/ _audio) {
		var tv = Ti.UI.createTableView({
			backgroundColor: 'transparent',
			backgroundImage: '/images/texture.png',
		});
		var results = NoteTableView.populateData(_audio);
		tv.setData(results);
		return tv;
	},
	
	populateData: function(_audio) {
		return db.list(_audio);
	},
	
	populateSearchData: function(_audio, _search) {
		return db.listSearch(_audio, _search);
	},
	
	deleteData: function(bounty){
		db.del(bounty.id);
	},
	
	upDate: function(bounty, body, tags){
		db.upDate(bounty.id, body, tags);
	},
	
	upDateCoords: function(bounty, body, tags, coordLat, coordLong){
		db.upDateCoords(bounty.id, body, tags, coordLat, coordLong);
	}
};

module.exports = NoteTableView;