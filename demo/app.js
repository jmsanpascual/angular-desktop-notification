(function() {
    'use strict';

    angular
        .module('demo', ['ngDesktopNotification'])
        .controller('DemoController', DemoController);

    DemoController.$inject = ['$scope', 'desktopNotification'];

    function DemoController($scope, desktopNotification) {
        var vm = this,
            popup;

        vm.permission = undefined;
        vm.checkiFSupported = checkiFSupported;
        vm.requestPermission = requestPermission;
        vm.showNotification = showNotification;
        vm.showNotificationWithIcon = showNotificationWithIcon;
        vm.showNotificationWithClick = showNotificationWithClick;
        vm.openPopupWindow = openPopupWindow;
        vm.sendMessage = sendMessage;

        activate();

        function activate() {
            vm.isSupported = desktopNotification.isSupported();
            vm.permission = desktopNotification.currentPermission();
            vm.autoClose = true;
        }

        function checkiFSupported() {
            vm.isSupported = desktopNotification.isSupported();
            alert('Supported: ' + (vm.isSupported ? 'true' : 'false'));
        }

        function requestPermission() {
            desktopNotification.requestPermission().then(function (permission) {
                vm.permission = permission;
                alert('Permission: true');
            }, function (permission) {
                vm.permission = permission;

                if (vm.permission === 'denied') {
                    alert('Requesting permission again when the user has once blocked' +
                     ' the notification is not possible');
                } else {
                    alert('Permission: false');
                }
            });
        }

        function showNotification() {
            var notif = desktopNotification.show('1234', {
                body: 'I am a simple notification',
                autoClose: vm.autoClose
            });

            if (!notif) {
                alert('Desktop notification is either not supported or blocked.');
            }
        }

        function showNotificationWithIcon() {
            var notif = desktopNotification.show('Notification with Icon', {
                icon: 'assets/letter-j-32.ico',
                body: 'I have an icon!',
                autoClose: vm.autoClose
            });

            if (!notif) {
                alert('Desktop notification is either not supported or blocked.');
            }
        }

        function showNotificationWithClick() {
            var notif = desktopNotification.show('Notification with Click Event', {
                icon: 'assets/letter-j-32.ico',
                body: 'Click me!',
                autoClose: vm.autoClose,
                onClick: function (event) {
                    alert('Notification is clicked!');
                }
            });

            if (!notif) {
                alert('Desktop notification is either not supported or blocked.');
            }
        }

        function openPopupWindow() {
            if (popup) {
                alert('Popup is already open');
                return;
            }

            popup = window.open('message/message.html');
        }

        function sendMessage(message) {
            if (popup) {
                popup.postMessage(message, '*');
            }
        }
    }

})();
