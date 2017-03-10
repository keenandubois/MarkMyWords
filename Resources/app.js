/*
 * A tabbed application, consisting of multiple stacks of windows associated with tabs in a tab group.
 * A starting point for tab-based application with multiple top-level windows.
 * Requires Titanium Mobile SDK 1.8.0+.
 */

//bootstrap and check dependencies
if (Ti.version < 1.8) {
  alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

// This is a single context application with mutliple windows in a stack
(function() {
  //determine platform and form factor and render approproate components
  var osname = Ti.Platform.osname,
    version = Ti.Platform.version,
    height = Ti.Platform.displayCaps.platformHeight,
    width = Ti.Platform.displayCaps.platformWidth;

  function checkTablet() {
    var platform = Ti.Platform.osname;

    switch (platform) {
      case 'ipad':
        return true;
      case 'android':
        var psc = Ti.Platform.Android.physicalSizeCategory;
        var tiAndroid = Ti.Platform.Android;
        return psc === tiAndroid.PHYSICAL_SIZE_CATEGORY_LARGE || psc === tiAndroid.PHYSICAL_SIZE_CATEGORY_XLARGE;
      default:
        return Math.min(
          Ti.Platform.displayCaps.platformHeight,
          Ti.Platform.displayCaps.platformWidth
        ) >= 400;
    }
  }

  var isTablet = checkTablet();

  var Window;
    Window = require('ui/ApplicationWindow');


  var ApplicationTabGroup = require('ui/ApplicationTabGroup');
  new ApplicationTabGroup(Window).open();
})();
