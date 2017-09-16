describe('Angular Desktop Notification', function () {
    var $q, $rootScope, $window;

    beforeEach(module('ngDesktopNotification'));

    beforeEach(module(function ($provide) {
        var Notification = function (title, options) {
            this.title = title;
            this.options = options;
            this.close = function () {};
        };
        Notification.permission = 'default';
        Notification.requestPermission = function () {};

        $window = { Notification: Notification };
        $provide.value('$window', $window);
    }));

    beforeEach(inject(function ($injector) {
        $q = $injector.get('$q');
        $rootScope = $injector.get('$rootScope');
        $window = $injector.get('$window');
        this.desktopNotification = $injector.get('desktopNotification');
    }));

    it('should exist', function () {
        expect(this.desktopNotification).toBeDefined();
    });

    describe('when browser supports Notification', function () {
        describe('.isSupported()', function () {
            beforeEach(function () {
                spyOn(this.desktopNotification, 'isSupported').and.callThrough();
            });

            it('should return true', function () {
                expect(this.desktopNotification.isSupported()).toBe(true);
            });
        });

        describe('.currentPermission()', function () {
            beforeEach(function () {
                spyOn(this.desktopNotification, 'currentPermission').and.callThrough();
            });

            it('should return \'default\' permission', function () {
                expect(this.desktopNotification.currentPermission()).toBe('default');
            });
        });

        describe('.requestPermission()', function () {
            beforeEach(function () {
                spyOn(this.desktopNotification, 'requestPermission').and.callThrough();
            });

            describe('with default permission', function () {
                beforeEach(function () {
                    spyOn($window.Notification, 'requestPermission').and.callFake(function () {
                        return $q.when('default');
                    });
                });

                it('should return a rejected promise with \'default\' permission', function () {
                    this.desktopNotification.requestPermission().catch(function (permission) {
                        expect(permission).toBe('default');
                    });

                    $rootScope.$digest(); // Triggers the promise
                    expect($window.Notification.requestPermission).toHaveBeenCalled();
                });
            });

            describe('with denied permission', function () {
                beforeEach(function () {
                    spyOn($window.Notification, 'requestPermission').and.callFake(function () {
                        return $q.when('denied');
                    });
                });

                it('should return a rejected promise with \'denied\' permission', function () {
                    this.desktopNotification.requestPermission().catch(function (permission) {
                        expect(permission).toBe('denied');
                    });

                    $rootScope.$digest(); // Triggers the promise
                    expect($window.Notification.requestPermission).toHaveBeenCalled();
                });
            });

            describe('with granted permission', function () {
                beforeEach(function () {
                    spyOn($window.Notification, 'requestPermission').and.callFake(function () {
                        return $q.when('granted');
                    });
                });

                it('should return a resolved promise with \'granted\' permission', function () {
                    this.desktopNotification.requestPermission().catch(function (permission) {
                        expect(permission).toBe('granted');
                    });

                    $rootScope.$digest(); // Triggers the promise
                    expect($window.Notification.requestPermission).toHaveBeenCalled();
                });
            });
        });

        describe('.showNotification(title, options)', function () {
            beforeEach(function () {
                this.title = 'Unit Test';
                this.options = {
                    icon: 'http://google.com/1234123',
                    body: 'I am the body of unit testing',
                    onClick: function () {
                        console.log('I am clicked!');;
                    }
                };
                $window.Notification.permission = 'granted';

                spyOn($window, 'Notification').and.callFake(function () {
                    return new $window.Notification(this.title, this.options);
                });
                spyOn(this.desktopNotification, 'show').and.callThrough();

                this.notif = this.desktopNotification.show(this.title, this.options);
            });

            xit('should instantiate the Notification constructor', function () {
                expect($window.Notification).toHaveBeenCalledWith(this.title, this.options);
            });

            xit('should return an instantiated Notification', function () {
                expect(this.notif instanceof Notification).toBeTruthy();
            });
        });
    });
});
