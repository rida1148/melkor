"use strict";

var debug = require('debug')('melkor-startup'),
  moment = require('moment'),
  path = require('path'),
  waigo = require('waigo');


var fsUtils = waigo.load('support/fsUtils'),
  page = waigo.load('model/page');



/**
 * Setup globals and other stuff for the wiki.
 *
 * @param {Object} app The application.
 */
module.exports = function*(app) {
  debug('Wiki title: ' + app.config.wikiTitle);

  /** app.locals is passed to template within outputFormats' render() method */
  app.locals = {
    wikiTitle: app.config.wikiTitle,

    /**
     * Pretty-print a date.
     * @param {Date|String} date The date
     */
    prettyPrintDate: function(date) {
      return '<abbr title="' + date + '">' + moment(date).from() + '</abbr>';
    }
  };

  // create homepage if not already available
  debug('Check for homepage');

  try {
    yield page.load(app.config.wikiFolder, 'home');
  } catch (err) {
    if (err instanceof page.PageNotFoundError) {
      debug('Create homepage');

      // create a welcome page
      yield page.save(app.config.wikiFolder, 'home', {
        'title': 'Home',
        'body': yield fsUtils.fs.readFileAsync(
          path.join(__dirname, '..', '..', '..', 'data', 'home.md')
        )
      });
    } else {
      throw err;
    }
  }
};
