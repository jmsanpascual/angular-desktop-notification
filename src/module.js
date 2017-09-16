'use strict';

var desktopNotification = require('./angular-desktop-notification');

angular
    .module('ngDesktopNotification', [])
    .provider('desktopNotification', desktopNotification)
    .constant('PERMISSIONS', {
        DEFAULT: 'default',
        GRANTED: 'granted',
        DENIED: 'denied'
    });
