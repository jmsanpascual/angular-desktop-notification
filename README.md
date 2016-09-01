# Angular Desktop Notification
A simple HTML5 notification for Angular 1

## Getting Started
1. Download this repository by pressing the green button on the upper right corner.
2. Then extract it to your project folder.
3. Include angular.js and angular-desktop-notification.js to your index page.

  ```html
  <script type="text/javascript" src="angular.js"></script>
  <script type="text/javascript" src="angular-desktop-notification.js"></script>
  ```
4. Add the ngDesktopNotification module to you application.
  
  ```javascript
  angular.module('myApp', ['ngDesktopNotification']);
  ```
5. You can now use the injectable service 'desktopNotification'.

  ```javascript
  angular.module('myApp').controller(function (desktopNotification) {
    desktopNotification.show('My Notification');
  });
  ```

## How to use
A simple usage would be, request the permission and display the notification in the success callback
```javascript
desktopNotification.requestPermission().then(function (permission) {
  // User allowed the notification
  desktopNotification.show('Hello', {
    body: 'I am an HTML5 notification'
  });
}, function (permission) {
  // User denied the notification
});
```

## API Documentation

This method returns true if the browser supports the Notification API, false otherwise
```javascript
desktopNotification.isSupported();
```

This method will get the current permission set in the browser which could be one of the ff.
- desktopNotification.permissions.default
- desktopNotification.permissions.denied
- desktopNotification.permissions.granted
```javascript
desktopNotification.currentPermission();
```

This method returns a $q promise, if the user allowed the notification the successCallback will be executed, errorCallback will be executed otherwise
```javascript
desktopNotification.requestPermission().then(successCallback, errorCallback);
```

This method will display the notification using the parameter values
- title - should be a string
- options - should be an object with the ff. properties
  - options.body - the message of the notification
  - options.icon - a string path of an icon, jpg and etc.
  - options.autoClose - a boolean property that will close the notification after the duration specified (Defaults to true)
  - options.duration - an integer that will set the seconds before the notification is automatically closed (Defaults to 5)
  - options.showOnPageHidden - a boolean property that will only show the notification if the page is hidden (Defaults to false)
```javascript
desktopNotification.show(title, options);
```

## Limitations
Angular Desktop Notification is not supported in all browsers.  
Please see [supported browser versions] (http://caniuse.com/#feat=notifications) for more information on the official support specification.

## Inspirations and Motivations 
- https://github.com/sagiegurari/angular-web-notification
- https://github.com/ttsvetko/HTML5-Desktop-Notifications

## License
This project is licensed under the MIT License - see the [LICENSE] (https://github.com/jmsanpascual/angular-desktop-notification/blob/master/LICENSE) file for details

## TODO
- Unit tests
- Support for older browser versions and IE
