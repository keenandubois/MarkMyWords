function ApplicationTabGroup(Window) {
	//create module instance
	var self = Ti.UI.createTabGroup();
	self.tabsBackgroundColor = 'white';
	self.barColor = 'white';

	//create app tabs
	var win1 = new Window(L('text')),
		win2 = new Window(L('audio'));
		
	var tab1 = Ti.UI.createTab({
		title: L('text'),
		icon: '/images/text.png',
		window: win1
	});
	win1.containingTab = tab1;

	var tab2 = Ti.UI.createTab({
		title: L('audio'),
		icon: '/images/audio.png',
		window: win2
	});
	win2.containingTab = tab2;

	self.addTab(tab1);
	self.addTab(tab2);

	return self;
};

module.exports = ApplicationTabGroup;
