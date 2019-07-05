import googleTagManager from 'googleTagManager';
import util from '../../util/util';
/**
 * Determine if tour should be shown based on
 * user's browser and is 'hidestore' key is in localStorage
 *
 * @param {Object} config
 *
 * @returns {Boolean}
 */
export function checkTourBuildTimestamp(config) {
  if (!util.browser.localStorage) return false;
  var hideTour = localStorage.getItem('hideTour');

  // Don't start tour if coming in via a permalink
  if (window.location.search && !config.parameters.tour) {
    return false;
  }

  if (hideTour && config.buildDate) {
    let buildDate = new Date(config.buildDate);
    let tourDate = new Date(hideTour);
    // Tour hidden when visiting fresh URL
    googleTagManager.pushEvent({
      event: 'tour_start_hidden',
      buildDate: buildDate,
      tourDate: tourDate
    });
    if (buildDate > tourDate) {
      localStorage.removeItem('hideTour');
      return true;
    } else {
      return false;
    }
  } else if (hideTour) {
    return false;
  } else {
    // Tour shown when visiting fresh URL
    googleTagManager.pushEvent({
      event: 'tour_start'
    });
    return true;
  }
}