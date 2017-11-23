#target illustrator

#include "/Users/scott/github/iconify/jsx-common/JSON.jsxinc";
#include "/Users/scott/github/iconify/jsx-common/Utils.jsxinc";

var CONFIG = {
	LOGGING       : true,
	LOG_FOLDER    : '~/Desktop/ai-logs/',
	LOG_FILE_PATH : '~/Desktop/ai-logs/' + Utils.doDateFormat(new Date()) + '-log.txt',
};

var logger = new Logger("ai-center", CONFIG.LOG_FOLDER);

Utils.displayAlertsOff();

app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;

if ( app.documents.length > 0) {

    var doc  = app.activeDocument;

    Utils.showProgressBar(doc.artboards.length);

    var interrupt = false;

    app.executeMenuCommand('fitall');

    var count = doc.artboards.length;
    for (i = 0; i < count; i++) {

        // The interrupt is not working yet.
        if (interrupt) break;

    	doc.artboards.setActiveArtboardIndex(i);

		var activeAB = doc.artboards[doc.artboards.getActiveArtboardIndex()];
		var right = activeAB.artboardRect[2];
		var bottom = activeAB.artboardRect[3];

		doc.selectObjectsOnActiveArtboard();

        // If there are no visible items, update the progress bar and continue.
		if (selection.length == 0) {
            Utils.updateProgress(
                Utils.i18n('Artboard %1 has no visible items. Skipping.', i)
            );
            continue;
        }

		for (x = 0 ; x < selection.length; x++) {
            try {
                app.executeMenuCommand('group');
                Utils.updateProgressMessage(Utlis.i18n('Grouping selection'));
                Utils.updateProgressMessage(
                    Utils.i18n('Selection is ' + (Utils.isVisibleAndUnlocked(selection[x]) ? 'Visible' : 'Hidden'))
                );
                if (! Utils.isVisibleAndUnlocked(selection[x])) continue;
                selection[x].position = [
					Math.round((right - selection[x].width)/2),
					Math.round((bottom + selection[x].height)/2)
				];
            }
            catch(e) {
                logger.error(e.message);
            }
        }
        redraw();
        Utils.updateProgress(Utils.i18n('Selection centered'));
    }
    Utils.progress.close();
}
else  {  
	alert(Utils.i18n('There are no open documents'));
}

Utils.displayAlertsOn();