(function(window) {
    'use strict';

    window.angular
        .module('ngDesktopNotification', [])
        .factory('desktopNotification', desktopNotification)
        .constant('PERMISSIONS', {
            DEFAULT: 'default',
            GRANTED: 'granted',
            DENIED: 'denied'
        })
        .value('config', {
            autoClose: true,
            duration: 5,
            showOnPageHidden: false
        });

    desktopNotification.$inject = ['$q', '$timeout', 'config', 'PERMISSIONS'];

    /* @ngInject */
    function desktopNotification($q, $timeout, config, PERMISSIONS) {
        var Notification = window.Notification || window.mozNotification || window.webkitNotification,
            service = {
                isSupported: isSupported,
                currentPermission: currentPermission,
                requestPermission: requestPermission,
                show: showNotification,
                permissions: {
                    default: PERMISSIONS.DEFAULT,
                    granted: PERMISSIONS.GRANTED,
                    denied: PERMISSIONS.DENIED
                }
            };

        return service;

        // Public API

        function isSupported() {
            return ! (typeof Notification === undefined);
        }

        function currentPermission() {
            // Wrap with a function, so that we can extend this easily to
            // support getting permissions using older API versions
            return Notification.permission;
        }

        function requestPermission() {
            if (! isSupported()) $q.reject('Notification API not supported');

            var deferred = $q.defer();

            Notification.requestPermission().then(requestPermission);
            return deferred.promise;

            // Convert the ES6 promise to angular's $q promise
            function requestPermission(permission) {
                if (PERMISSIONS.GRANTED === permission) {
                    deferred.resolve(permission);
                } else {
                    deferred.reject(permission);
                }
            }
        }

        function showNotification(title, options) {
            // Ensures that options is always an object
            options = options || {};

            // Check first if supported, validate arguments, then check if
            // showOnPageHidden property is set to true, if yes then proceed
            // on checking if page is visible, lastly check if
            // notification is disabled by the client
            if (! isSupported() || ! _isArgsValid(title, options) ||
                _isPageVisible(options.showOnPageHidden) ||
                currentPermission() !== PERMISSIONS.GRANTED) return;

            var notification = new Notification(title, options),
                autoClose = (options.autoClose === undefined) ? config.autoClose : options.autoClose,
                duration = options.duration || config.duration;

            notification.onclick = options.onClick;

            // If autoClose is set to true, close the notification using the duration
            if (autoClose) _autoCloseAfter(notification, duration);

            return notification;
        }

        // Private functions

        function _isArgsValid(title, options) {
            var isTitleString = angular.isString(title),
                isOnClickFunction = (! options.onClick || angular.isFunction(options.onClick));

            return (isTitleString && isOnClickFunction);
        }

        function _isPageVisible(showOnPageHidden) {
            // Check both showOnPageHidden parameter and default
            if (! showOnPageHidden && ! config.showOnPageHidden) return;

            return ! (
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
})(window);
