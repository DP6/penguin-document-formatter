/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */

const { receiveMessage } = require('./hub.js')
exports.receiveMessage = receiveMessage;
