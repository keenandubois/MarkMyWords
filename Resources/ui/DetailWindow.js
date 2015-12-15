var NoteTable = require('ui/NoteTable');
var MapWin = require('ui/MapWindow');
Ti.Geolocation.purpose = 'Locating note-taking position';


var DetailWindow = function(/*Object*/ _bounty, containingTab, tableview) {
	var win = Ti.UI.createWindow({
		title: _bounty.title,
		barColor: 'white',
		titleAttributes: {
			color: 'black' },
		backgroundColor: 'transparent',
		backgroundImage:'/images/texture.png'
	});
	var TA;
	var sound;
	var playBut;
	var stopBut;
	var playTime;
	if(_bounty.captured){
		TA = Ti.UI.createTextArea({
			height: '54%',
			top: '30%',
			width: '95%',
			backgroundColor: '#26737373',
			keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
			returnKeyType:Titanium.UI.RETURNKEY_DONE,
			borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
			value: _bounty.body
		});
		
		sound = Ti.Media.createSound({
			url: (Ti.Filesystem.applicationDataDirectory + _bounty.url),
			preload: true,
			looping: true,
			compression: Ti.Media.AUDIO_FORMAT_AAC,
			format: Ti.Media.AUDIO_FORMAT_MP4
		});
		
		playBut = Ti.UI.createButton({
			title:L('play'),
			image: '/images/play.png',
			layout: 'horizontal',
			backgroundColor: 'transparent',
			top: '6%',
			left: '20%',
			center: {y: '15%'}
		});
		win.add(playBut);
		playBut.addEventListener('click', function(e) {
			if(!sound.isPlaying()){
				playBut.image = '/images/pause.png';
				playBut.title = L('pause');
				sound.play();
			}
			else {
				playBut.image = 'images/play.png';
				playBut.title = L('play');
				sound.pause();
			}
		});
		
		stopBut = Ti.UI.createButton({
			title:L('stop'),
			image: '/images/stop.png',
			layout: 'horizontal',
			top: '6%',
			right: '20%',
			center: {y: '15%'}
		});
		win.add(stopBut);
		stopBut.addEventListener('click', function(e){
			sound.stop();
			playBut.image = '/images/play.png';
			playBut.title = L('play');
		});
	}
	else{
		TA = Ti.UI.createTextArea({
			height: '82%',
			top: '2%',
			width: '100%',
			backgroundColor: 'transparent',
			keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
			returnKeyType:Titanium.UI.RETURNKEY_DONE,
			borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
			value: _bounty.body
		});
	}
	
	var tags = Ti.UI.createTextField({
		height: '6%',
		width:'90%',
		top: '84%',
		color: '#737373',
		backgroundColor: 'transparent',
		font: {fontSize: 10},
		keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType:Titanium.UI.RETURNKEY_DONE,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
		value: _bounty.tags
	});
	win.add(TA);
	win.add(tags);

	var leftBut = Ti.UI.createButton({
		title: L('< ' + containingTab.title)
	});
	leftBut.addEventListener('click', function(e) {
		NoteTable.upDate(_bounty,TA.value,tags.value);
		win.close();
	});
	win.setLeftNavButton(leftBut);
	
	var mapButton = Ti.UI.createButton({
		title:L('map_button'),
		height:Ti.UI.SIZE,
		top: '92%',
		width:'40%'
	});
	win.add(mapButton);
	mapButton.addEventListener('click', function (e) {
		var map = new MapWin(_bounty);
		map.open({modal:true});
	});

	var deleteButton = Ti.UI.createButton({
		title:L('delete'),
		image: '/images/trash.png',
	});
	win.setRightNavButton(deleteButton);
	deleteButton.addEventListener('click', function(e){
		NoteTable.deleteData(_bounty);
		Ti.App.fireEvent('app:updateTables');
		win.close();
	});
	
	return win;
};
module.exports = DetailWindow;