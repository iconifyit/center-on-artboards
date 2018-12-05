/**
 * USAGE:
 *
 * 1. Place this script in Applications > Adobe Illustrator > Presets > en_US > Scripts
 * 2. Restart Adobe Illustrator to activate the script
 * 3. The script will be available under menu File > Scripts > Center on Artboards
 */
/**
 * LICENSE & COPYRIGHT
 *
 *   You are free to use, modify, and distribute this script as you see fit.
 *   No credit is required but would be greatly appreciated.
 *
 *   Scott Lewis - scott@iconify.it
 *   http://github.com/iconifyit
 *   http://iconify.it
 *
 *   THIS SCRIPT IS OFFERED AS-IS WITHOUT ANY WARRANTY OR GUARANTEES OF ANY KIND.
 *   YOU USE THIS SCRIPT COMPLETELY AT YOUR OWN RISK AND UNDER NO CIRCUMSTANCES WILL
 *   THE DEVELOPER AND/OR DISTRIBUTOR OF THIS SCRIPT BE HELD LIABLE FOR DAMAGES OF
 *   ANY KIND INCLUDING LOSS OF DATA OR DAMAGE TO HARDWARE OR SOFTWARE. IF YOU DO
 *   NOT AGREE TO THESE TERMS, DO NOT USE THIS SCRIPT.
 */

/**
 * Declare the target app.
 */
#target illustrator

/**
 * Include the libraries we need.
 */
#includepath "lib/";


#include "JSON.jsxinc";
#include "Utils.jsxinc";
#include "Logger.jsxinc";

/**
 * Name that script.
 */
#script "Center on Artboards";


/**
 * Disable Illustrator's alerts.
 */
Utils.displayAlertsOff();

/**
 * The config object for this script.
 * @type {{
 *     APP_NAME: string,
 *     LOGFOLDER: string
 * }}
 */
var CONFIG = {
    APP_NAME  : 'ai-center-items',
    LOGFOLDER : Folder.myDocuments + "/ai-logs",
    SCALE     : 100
};

// End global setup

var Module = (function(CONFIG) {

    // Create a logger instance.
    logger = new Logger(CONFIG.APP_NAME, CONFIG.LOGFOLDER);

    /**
     * Create a new instance of this module.
     * @constructor
     */
    var Instance = function() {
        app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;

        if (app.documents.length > 0) {

            var doc   = app.activeDocument;
            var count = doc.artboards.length;

            // TODO: Implement centering of only selected items.
            if (doc.selection.length > 0) {
                try {

                    var board  = doc.artboards[doc.artboards.getActiveArtboardIndex()];
                    var right  = board.artboardRect[2];
                    var bottom = board.artboardRect[3];

                    // If there are no visible items, update the progress bar and continue.
                    if (doc.selection.length == 0) return;

                    doc.selectObjectsOnActiveArtboard();
                    app.executeMenuCommand('group');

                    for (x = 0 ; x < doc.selection.length; x++) {
                        try {
                            if (! Utils.isVisibleAndUnlocked(doc.selection[x])) continue;
                            doc.selection[x].position = [
                                Math.round((right - doc.selection[x].width)/2),
                                Math.round((bottom + doc.selection[x].height)/2)
                            ];
                            if (typeof(doc.selection[x].resize) == "function"
                                && parseInt(CONFIG.SCALE) != 100) {

                                doc.selection[x].resize(CONFIG.SCALE, CONFIG.SCALE);
                            }
                        }
                        catch(e) {
                            logger.error(e.message);
                        }
                    }
                }
                catch(e) {
                    logger.error(e.message);
                }
                redraw();
                return;
            }
            else {
                Utils.showProgressBar(count);

                for (i = 0; i < count; i++) {
                    doc.artboards.setActiveArtboardIndex(i);
                    doc.selection = null;

                    var board  = doc.artboards[doc.artboards.getActiveArtboardIndex()];
                    var right  = board.artboardRect[2];
                    var bottom = board.artboardRect[3];

                    doc.selectObjectsOnActiveArtboard();

                    // If there are no visible items, update the progress bar and continue.
                    if (doc.selection.length == 0) {
                        Utils.updateProgress(
                            localize({en_US: 'Artboard %1 has no visible items. Skipping.'}, i)
                        );
                        continue;
                    }

                    app.executeMenuCommand('group');

                    try {
                        var selection = doc.selection[0];
                        if (! Utils.isVisibleAndUnlocked(selection)) {
                            logger.infolocalize({en_US: 'Artboard %1 has no visible items. Skipping.'}, i);
                            continue;
                        }
                        selection.position = [
                            Math.round((right - selection.width)/2),
                            Math.round((bottom + selection.height)/2)
                        ];
                        if (typeof(selection.resize) == "function"
                            && parseInt(CONFIG.SCALE) != 100) {

                            selection.resize(CONFIG.SCALE, CONFIG.SCALE);
                        }
                    }
                    catch(e) {
                        logger.error(e.message);
                        continue;
                    }
                    redraw();
                    Utils.updateProgress(localize({en_US: 'Items on artboard centered'}));
                }
            }
            Utils.progress.close();
        }
        else  {
            alert(localize({en_US: 'There are no open documents'}))
        }
    }

    /**
     * Returns the public module object.
     */
    return {
        /**
         * Runs the module code.
         */
        run: function() {
            new Instance();
        }
    }

})(CONFIG);

Module.run();

Utils.displayAlertsOn();