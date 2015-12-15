var Map = require('ti.map');

var MapWindow = function(/*Object*/ _bounty) {
	var win = Ti.UI.createWindow({
		title:L('marked_at') + '\'' + _bounty.title + '\'' + ' at:',
		titleAttributes: {
			color: 'white' },
		barColor: '#6d0a0c',
		backgroundColor:'#fff'
	});	
	var navWin = Ti.UI.iOS.createNavigationWindow({
		modal: true,
		window: win
	});
	navWin.open();
	
	var b = Titanium.UI.createButton({
		title:L('close'),
		titleAttributes: {
			color: 'white' },
		style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
	});
	b.addEventListener('click',function() {
		navWin.close();
		//win.close();
	});
	win.setLeftNavButton(b);
	
	var ann = Map.createAnnotation({
		latitude:_bounty.capturedLat,
		longitude:_bounty.capturedLong,
		title:_bounty.name,
		subtitle:L('busted'),
		pincolor:Map.ANNOTATION_RED,
		animate:true
	});

	var mapview = Map.createView({
		mapType: Map.STANDARD_TYPE,
		region:{latitude:_bounty.capturedLat,
		longitude:_bounty.capturedLong,
		latitudeDelta:0.1, longitudeDelta:0.1},
		animate:true,
		regionFit:true,
		userLocation:false,
		annotations:[ann]
	});
	win.add(mapview);
	
	return win;
};

module.exports = MapWindow;