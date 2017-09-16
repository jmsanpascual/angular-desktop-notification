(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

desktopNotification.$inject = [];

/* @ngInject */
function desktopNotification() {
    var settings = {
        autoClose: true,
        duration: 5,
        showOnPageHidden: false
    };

    return {
        config: config,
        $get: ['$q', '$timeout', '$window', 'PERMISSIONS', factory]
    };

    function config(options) {
        for (var key in options) {
            if (settings.hasOwnProperty(key) && options[key] != undefined) {
                settings[key] = options[key];
            }
        }
    }

    function factory($q, $timeout, $window, PERMISSIONS) {
        var Notification = $window.Notification
                || $window.mozNotification
                || $window.webkitNotification;
        var service = {
            isSupported: isSupported,
            currentPermission: currentPermission,
            requestPermission: requestPermission,
            show: showNotification,
            permissions: {
                'default': PERMISSIONS.DEFAULT,
                'granted': PERMISSIONS.GRANTED,
                'denied': PERMISSIONS.DENIED
            }
        };

        return service;

        // Public API

        function isSupported() {
            return !(typeof Notification === 'undefined');
        }

        function currentPermission() {
            // Wrap with a function, so that we can extend this easily to
            // support getting permissions using older API versions
            return (Notification || {}).permission;
        }

        function requestPermission() {
            if (!isSupported()) return $q.reject('Notification API not supported');

            var deferred = $q.defer();

            // Convert the ES6 promise to angular's $q promise
            Notification.requestPermission().then(function (permission) {
                if (PERMISSIONS.GRANTED === permission) {
                    deferred.resolve(permission);
                } else {
                    deferred.reject(permission);
                }
            });

            return deferred.promise;
        }

        function showNotification(title, options) {
            // Ensures that options is always an object
            options = options || {};

            // Check first if supported, validate arguments, then check if
            // showOnPageHidden property is set to true, if yes then proceed
            // on checking if page is visible, lastly check if
            // notification is disabled by the client
            if (!isSupported() || !_isArgsValid(title, options) ||
                    _isPageVisible(options.showOnPageHidden) ||
                    currentPermission() !== PERMISSIONS.GRANTED) return;

            var notification = new Notification(title, options);
            var duration = options.duration || settings.duration;
            var autoClose = (options.autoClose === undefined)
                    ? settings.autoClose : options.autoClose;

            notification.onclick = options.onClick;

            // If autoClose is set to true, close the notification using the duration
            if (autoClose) _autoCloseAfter(notification, duration);

            return notification;
        }

        // Private functions

        function _isArgsValid(title, options) {
            var isTitleString = angular.isString(title),
                isOnClickFunction = (!options.onClick || angular.isFunction(options.onClick));

            return (isTitleString && isOnClickFunction);
        }

        function _isPageVisible(showOnPageHidden) {
            // Check both showOnPageHidden parameter and default
            if (!showOnPageHidden && !settings.showOnPageHidden) return;

            return !(
                window.document.hidden ||
                // Uncomment when MS support is added
                // window.document.msHidden ||
                window.document.mozHidden ||
                window.document.webkitHidden
            );
        }

        function _autoCloseAfter(notification, duration) {
            var durationInMs = duration * 1000;
            $timeout(notification.close.bind(notification), durationInMs, false);
        }
    }
}

module.exports = desktopNotification;

},{}],2:[function(require,module,exports){
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

},{"./angular-desktop-notification":1}]},{},[2]);
