var NoteTable = require('ui/NoteTable');
var DetailWindow = require('ui/DetailWindow');
var AddWindow = require('ui/AddWindow');

function ApplicationWindow(title) {
	_audio = (title == L("audio"));
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'transparent',
		backgroundImage:'/images/texture.png',
		barColor: 'white',
		titleAttributes: {
			color: 'black'
		}
	});

	var b = Titanium.UI.createButton({
		image: '/images/new_note.png',
		disabledColor: 'gray',
		selectedColor: 'blue',
		style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN	
	});	
	self.setRightNavButton(b);
	b.addEventListener('click', function(e) {
		self.containingTab.open(new AddWindow(self.containingTab, (title == L("audio"))));
	});

	var bt = NoteTable.mkTable(_audio);
	self.add(bt);
	bt.addEventListener('click', function(e) {
		self.containingTab.open(new DetailWindow(e.row, self.containingTab, bt));
	});
	
	Ti.App.addEventListener('databaseUpdated', function() {
		bt.setData(NoteTable.populateData(title == L("audio")));
	});
	
	return self;
};

module.exports = ApplicationWindow;
