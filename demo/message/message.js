(function() {
    'use strict';

    angular
        .module('message', ['ngDesktopNotification'])
        .controller('MessageController', MessageController);

    MessageController.$inject = ['desktopNotification'];

    /* @ngInject */
    function MessageController(desktopNotification) {
        var vm = this;

        window.addEventListener('message', receiveMessage, false);

        function receiveMessage(event) {
            var message = event.data;

            desktopNotification.show('Im at message.html (Click to focus)', {
                body: message,
                showOnPageHidden: true,
                onClick: function (event) {
                    window.focus();
                }
            });
        }
    }
})();
