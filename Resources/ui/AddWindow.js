var NoteTable = require('ui/NoteTable');
var db = require('lib/db');

var AddWindow = function(/*Tab Object*/ containingTab, _audio) {
	var title;
	var hintText;
	var TA;
	
	// set up audio recorder, session, and directory
	Titanium.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_PLAY_AND_RECORD;
	audioRec = Ti.Media.createAudioRecorder({ 
			compression: Ti.Media.AUDIO_FORMAT_AAC,
			format: Ti.Media.AUDIO_FORMAT_MP4
	});
	console.log(Ti.Filesystem.applicationDataDirectory);
	var sound_folder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'recordings');
	if(!sound_folder.exists()) {
		sound_folder.createDirectory();
	}
	
	var audioRec;	
	var recBut;
	var soundFile;
	if(_audio){
		title = 'new_recording';
		hintText = 'recording_name';
		
		TA = Ti.UI.createTextArea({
			height: '55%',
			top: '7%',
			width: '95%',
			backgroundColor: '#26737373',
			keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
			returnKeyType:Titanium.UI.RETURNKEY_DONE,
			borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE 
		});
		
		recBut = Ti.UI.createButton({
			title:L('record'),
			image: '/images/record.png',
			top: '7%'
		});
		recBut.addEventListener('click', function(e) {
			if(audioRec.recording) {
				audioRec.pause();
				recBut.title = L('done_rec');
				recBut.image = 'images/done_rec.png';
			}
			else if(audioRec.paused) {
				recBut.title = L('done_rec');
				recBut.image = 'images/done_rec.png';
			}
			else if(!audioRec.recording){
				audioRec.start();
				recBut.title = L('pause');
				recBut.image = 'images/pause.png';
			}
		});
	}
	else{
		title = 'new_note';
		hintText = 'note_name';
		
		TA = Ti.UI.createTextArea({
			height: '74%',
			top: '2%',
			width: '95%',
			backgroundColor: '#26737373',
			keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
			returnKeyType:Titanium.UI.RETURNKEY_DONE,
			borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE
		});
	}
	
	var win = Ti.UI.createWindow({
		title:L(title),
		titleAttributes: {
			color: 'black' },
		layout:'vertical',
		barColor: 'white',
		backgroundColor: 'transparent',
		backgroundImage: 'images/texture.png'
	});
	
	var TF = Ti.UI.createTextField({
		height: '6%',
		top:'2%',
		width:'90%',
		borderColor: '26737373',
		keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType:Titanium.UI.RETURNKEY_DONE,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_LINE,
		hintText:L(hintText)
	});
	
	var tags = Ti.UI.createTextField({
		height: '6%',
		width:'90%',
		color: '#737373',
		font: {fontSize: 10},
		keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType:Titanium.UI.RETURNKEY_DONE,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
		hintText:L('tags')
	});
	win.add(TF);	
	if(_audio){
		win.add(audioRec);
		win.add(recBut);
	}
	win.add(TA);
	win.add(tags);
	
	// exit button -- this automatically saves whatever data is in the note, unless the note is unnamed
	var leftBut = Ti.UI.createButton({
		title: L('< ' + containingTab.title)
	});
	leftBut.addEventListener('click', function(e) {
		if(TF.value == '' || TF.value == ' '){
			// if they have no title, we don't save, and we alert them
			alert('All notes need a title!');
			TF.value = '';
			TA.value = '';
			tags.value = '';
			win.close(); 
		}
		else{
			// else we will save the note with various amounts of data attached
			var TagString = 'Tags: ' + tags.value;
			
			if(Ti.Geolocation.locationServicesEnabled) {
				// if they choose to enable geolocation, we get the coordinates
				Ti.Geolocation.getCurrentPosition(function(e) {
					if(!e.success || e.error) {
						// if we don't get coordinates successfully, we create an entry in the database without them
						if(_audio){
							// audio note, no coords			
							if(recBut.title !== L('record')){
								var tmpFile = audioRec.stop();
								var filename = (TF.value + ".mp4");
								soundFile = Ti.Filesystem.getFile(sound_folder.nativePath, filename);
								Ti.API.info('soundFile path is: ' + soundFile.nativePath);
								if(soundFile.write(tmpFile) == false){
									alert('Recording failed to write.');
								}
								db.addAudio(TF.value,_audio,TA.value,TagString,('/recordings/' + filename));
								filename = null;
								soundFile = null;
							}
							else{
								alert('You must record audio to save an audio note.');
							}
							TF.value = '';
							TA.value = '';
							tags.value = '';
							Ti.App.fireEvent('app:updateTables');
							win.close(); 
						}
						else{
							// text note, no coords
							db.add(TF.value,_audio,TA.value,TagString);
							TF.value = '';
							TA.value = '';
							tags.value = '';
							Ti.App.fireEvent('app:updateTables');
							win.close(); 
						}
					}
					else {
						// if we successfully get coordinates, we create an entry in the database with them
						Ti.API.info(e.coords);
						if(_audio){
							// audio note, coords
							if(recBut.title !== L('record')){
								var tmpFile = audioRec.stop();
								var filename = (TF.value + ".mp4");
								soundFile = Ti.Filesystem.getFile(sound_folder.nativePath, filename);
								Ti.API.info('soundFile path is: ' + soundFile.nativePath);
								if(soundFile.write(tmpFile) == false){
									alert('Recording failed to write.');
								}
								db.addAC(TF.value,_audio,TA.value,TagString,('/recordings/' + filename),e.coords.latitude,e.coords.longitude);
								filename = null;
								soundFile = null;								
							}
							else{
								alert('You must record audio to save an audio note.');
							}
							TF.value = '';
							TA.value = '';
							tags.value = '';
							Ti.App.fireEvent('app:updateTables');
							win.close(); 
						}
						else{
							// text note coords
							db.addCoords(TF.value,_audio,TA.value,TagString,e.coords.latitude,e.coords.longitude);
							TF.value = '';
							TA.value = '';
							tags.value = '';
							Ti.App.fireEvent('app:updateTables');
							win.close(); 
						}
					}
				});
			}
			else {
				// if they choose not to enable geolocation, we do not save coordinates
				alert('Please enable location services if you wish to track edits with GPS.');
				if(_audio){
					// audio note, geolocation disabled
					if(recBut.title !== L('record')){
						var tmpFile = audioRec.stop();
						var filename = (TF.value + ".mp4");
						soundFile = Ti.Filesystem.getFile(sound_folder.nativePath, filename);
						Ti.API.info('soundFile path is: ' + soundFile.nativePath);
						if(soundFile.write(tmpFile) == false){
							alert('Recording failed to write.');
						}
						db.addAudio(TF.value,_audio,TA.value,TagString,('/recordings/' + filename));
						filename = null;
						soundFile = null;								
					}
					else{
						alert('You must record audio to save an audio note.');
					}
					TF.value = '';
					TA.value = '';
					tags.value = '';
					Ti.App.fireEvent('app:updateTables');
					win.close(); 
				}
				else{
					// text note, geolocation disabled
					db.add(TF.value,_audio,TA.value,TagString);
					TF.value = '';
					TA.value = '';
					tags.value = '';
					Ti.App.fireEvent('app:updateTables');
					win.close();
				}
			}
		}
	});
	win.setLeftNavButton(leftBut);
	
	return win;
};

module.exports = AddWindow;
