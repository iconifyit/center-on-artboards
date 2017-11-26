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

        if ( app.documents.length > 0) {

            var doc  = app.activeDocument;

            var count = doc.artboards.length;

            if (doc.selection.length > 0) {
                alert(localize({en_US: 'Selection centering is not yet implemented'}));
                return;
            }

            Utils.showProgressBar(doc.artboards.length);

            for (i = 0; i < count; i++) {
                if (doc.selection.length) {
                    // var s = selection[i];
                    // s[x].position = [
                    //     Math.round((right - s[x].width)/2),
                    //     Math.round((bottom + s[x].height)/2)
                    // ];
                }
                else {
                    doc.artboards.setActiveArtboardIndex(i);
                    doc.selection = null;

                    var activeAB = doc.artboards[doc.artboards.getActiveArtboardIndex()];
                    var right    = activeAB.artboardRect[2];
                    var bottom   = activeAB.artboardRect[3];

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
                }
                redraw();
                Utils.updateProgress(Utils.i18n('Selection centered'));
            }
            Utils.progress.close();
        }
        else  {
            alert(Utils.i18n('There are no open documents'));
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