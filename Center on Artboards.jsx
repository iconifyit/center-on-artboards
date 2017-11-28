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
#includepath "/Users/scott/github/iconify/jsx-common/";

#include "JSON.jsxinc";
#include "Utils.jsxinc";
#include "Logger.jsxinc";

/**
 * Name that script.
 */
#script "Ai Sessions";

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
    LOGFOLDER : "/Users/scott/Desktop/ai-logs"
};

// End global setup

var Module = (function(CONFIG) {

    // Create a logger instance.
    var logger = new Logger(CONFIG.APP_NAME, CONFIG.LOGFOLDER);

    /**
     * Create a new instance of this module.
     * @constructor
     */
    var Instance = function() {
        app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;

        if (app.documents.length > 0) {

            var doc   = app.activeDocument;
            var count = doc.artboards.length;

            if (doc.selection.length > 0) {
                alert(localize({en_US: 'Selection centering is not yet implemented'}));
                return;
            }

            Utils.showProgressBar(doc.artboards.length);

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

                for (x = 0 ; x < doc.selection.length; x++) {
                    try {
                        app.executeMenuCommand('group');
                        Utils.updateProgressMessage(localize({en_US: 'Grouping selection'}));
                        Utils.updateProgressMessage(
                            localize({en_US: 'Selection is %1'}, Utils.isVisibleAndUnlocked(doc.selection[x]) ? 'Visible' : 'Hidden')
                        );
                        if (! Utils.isVisibleAndUnlocked(doc.selection[x])) continue;
                        doc.selection[x].position = [
                            Math.round((right - doc.selection[x].width)/2),
                            Math.round((bottom + doc.selection[x].height)/2)
                        ];
                    }
                    catch(e) {
                        logger.error(e.message);
                    }
                }
                redraw();
                Utils.updateProgress(localize({en_US: 'Selection centered'}));
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