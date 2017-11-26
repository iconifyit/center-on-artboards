#target illustrator

#includepath "/Users/scott/github/iconify/jsx-common/";

#include "JSON.jsxinc";
#include "Utils.jsxinc";

var CONFIG = {
	LOGGING       : true,
	LOG_FOLDER    : '~/Desktop/ai-logs/',
	LOG_FILE_PATH : '~/Desktop/ai-logs/' + Utils.dateFormat(new Date()) + '-log.txt',
};

var logger = new Logger("ai-center", CONFIG.LOG_FOLDER);

Utils.displayAlertsOff();

/**
 * Options to try:
 * 1. List all group items
 * 2. List all selected items
 * 3. Loop through all boards, select group items, check name against selectedItems names.
 * *
 * 1. Loop through all
 */

app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
doc = app.activeDocument;

var sel    = doc.selection;
var items  = [];
var boards = [];

if ( ! sel.length ) alert('Nothing is selected');

logger.info(doc.groupItems.length);
logger.info('Start : ' + new Date().getTime());
for (item in doc.groupItems) {
    if (item.selected) {
        item.name = ('UUID-' + Utils.generateUUID()).toUpperCase();
        items.push(item.name);
    }
    logger.inspect(item);
}
logger.info('End : ' + new Date().getTime());

logger.info(items.join(' - '));

// /**
//  * Give names to all items in the selection.
//  */
// for (i = 0; i < sel.length; i++) {
//     var s = sel[i];
//     s.name = ('UUID-' + Utils.generateUUID()).toUpperCase();
//     items.push(s.name);
// }
//
// logger.info(items.join(' - '));
//
// /**
//  * Get the artboard index for each item in the selection.
//  */
// for (i = 0; i < items.length; i++) {
//     boards.push(Utils.getArtboardIndexItemByName(items[i]));
// }
//
// /**
//  *
//  */
// for (i = 0; i < doc.groupItems.length; i++) {
//     var item = doc.groupItems[i];
//     if (items.indexOf(item.name) != -1) {
//         item.selected = true;
//     }
// }
//
// // doc.selection = null;
//
// // var items = doc.groupItems;
// // for (i = 0; i < items.length; i++) {
// //     var item = items[i];
// //     if (items.indexOf(item.name) != -1) {
// //         item.selected = true;
// //     }
// // }
//
//
// logger.info(boards.join(' - '));

function centerGroupItemsOnArtboard(artboard) {
    doc.selection = null;
    doc.selectObjectsOnActiveArtboard();
    if (selection.length > 0) {
        selection.position = [
            Math.round((right - selection.width)/2),
            Math.round((bottom + selection.height)/2)
        ];
    }
}

/**
 * A wrapper for selected items.
 * @param name
 * @param item
 * @param artboard
 * @returns {{name: *, item: *, artboard: *}}
 * @constructor
 */
function SelectedItem(name, item, artboard) {

    this.name     = name;
    this.item     = item;
    this.artboard = artboard;

    var getUniqueName = function() {

    };

    var getArboard = function() {

    };

    var select = function() {

    };

    var unselect = function() {

    };

    return {
        name     : name,
        item     : item,
        artboard : artboard
    };
}

//
// for (i=0; i<sel.length; i++) {
//     logger.info('------------------------- selection ' + i + ' -----------------------------------');
//     var s = sel[i];
//     logger.info("activeArtbaord : " + Utils.getSelectionArtboard(s));
//     for (key in s) {
//         try {
//             logger.info(key + " : " + s[key]);
//         }
//         catch (e) {
//         }
//     }
// }
//
// for (s in sel) {
//     s.selected = true;
// }

//
// exit(0);
// if ( app.documents.length > 0) {
//
//     var doc  = app.activeDocument;
//
//     app.executeMenuCommand('fitall');
//
//     Utils.showProgressBar(doc.artboards.length);
//
//     if (app.activeDocument.selection.length > 0) {
//         var count = app.activeDocument.selection.length;
//         for (i=0; i<count; i++) {
//             for (x = 0 ; x < selection.length; x++) {
//                 try {
//                     Utils.updateProgressMessage(
//                         localize({en_US: 'Selection is %1' }, (Utils.isVisibleAndUnlocked(selection[x]) ? 'Visible' : 'Hidden'));
//                     );
//                     if (! Utils.isVisibleAndUnlocked(selection[x])) continue;
//                     selection[x].position = [
//                         Math.round((right - selection[x].width)/2),
//                         Math.round((bottom + selection[x].height)/2)
//                     ];
//                 }
//                 catch(e) {
//                     logger.error(e.message);
//                 }
//             }
//             redraw();
//             Utils.updateProgress(localize({en_US: 'Selection centered'}));
//         }
//     }
//     else {
//         var count = doc.artboards.length;
//         for (i = 0; i < count; i++) {
//
//             doc.artboards.setActiveArtboardIndex(i);
//
//             var activeAB = doc.artboards[doc.artboards.getActiveArtboardIndex()];
//             var right = activeAB.artboardRect[2];
//             var bottom = activeAB.artboardRect[3];
//
//             doc.selectObjectsOnActiveArtboard();
//
//             // If there are no visible items, update the progress bar and continue.
//             if (selection.length == 0) {
//                 Utils.updateProgress(
//                     Utils.i18n('Artboard %1 has no visible items. Skipping.', i)
//                 );
//                 continue;
//             }
//
//             for (x = 0 ; x < selection.length; x++) {
//                 try {
//                     app.executeMenuCommand('group');
//                     Utils.updateProgressMessage(Utlis.i18n('Grouping selection'));
//                     Utils.updateProgressMessage(
//                         localize({en_US: 'Selection is %1' }, (Utils.isVisibleAndUnlocked(selection[x]) ? 'Visible' : 'Hidden'));
//                     );
//                     if (! Utils.isVisibleAndUnlocked(selection[x])) continue;
//                     selection[x].position = [
//                         Math.round((right - selection[x].width)/2),
//                         Math.round((bottom + selection[x].height)/2)
//                     ];
//                 }
//                 catch(e) {
//                     logger.error(e.message);
//                 }
//             }
//             redraw();
//             Utils.updateProgress(localize({en_US: 'Selection centered'}));
//         }
//     }
//
//
//     Utils.progress.close();
// }
// else  {
// 	alert(Utils.i18n('There are no open documents'));
// }
//
// Utils.displayAlertsOn();