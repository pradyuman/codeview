angular.module('codeview', ['ui.router', 'firebase', 'ui.ace'])

.config(function($stateProvider, $locationProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  }).state('code', {
    url: '/code/:type',
    templateUrl: 'templates/code.html',
    controller: 'CodeCtrl'
  });

  $urlRouterProvider.otherwise('/');
})

.controller('HomeCtrl', function($scope) {
  $scope.test = 'asdf';
  // Closes the sidebar menu
  $("#menu-close").click(function(hi) {
    hi.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
  });

  // Opens the sidebar menu
  $("#menu-toggle").click(function(hi) {
    hi.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
  });

  // Scrolls to the selected menu item on the page
  $(function() {
    $('a[href*=#]:not([href=#])').click(function() {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {

        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top
          }, 1000);
          return false;
        }
      }
    });
  });
})

.controller('CodeCtrl', function($scope, $stateParams, Room) {
  var coder = $scope.coder = (($stateParams.type || 'code') === 'code');

  $scope.aceOpts = {
    theme: 'monokai',
    mode: 'javascript',
    rendererOptions: {
      fontSize: 16
    },
    onLoad: function(e) {
      e.$blockScrolling = Infinity;
    }
  };

  $scope.code = '// Enter code here \n';
  $scope.code2 = '// Interviewer comments\n';
  $scope.data = {};
  var room = Room('test');
  room.$loaded().then(function() {
    $scope.data = room;
    $scope.code = room.code;
    $scope.code2 = room.code2;
  });
  room.$bindTo($scope, 'data');

  if (coder) {
    // Allow editing code
    $scope.$watch('code', function() {
      if ($scope.code) {
        $scope.data.code = $scope.code;
      }
    });
    $scope.$watch('code2', function() {
      if ($scope.code2) {
        $scope.data.code2 = $scope.code2;
      }
    });
  } else {
    // Only read code
    $scope.$watch('data', function() {
      $scope.code = $scope.data.code;
      $scope.code2 = $scope.data.code2;
    });
  }

})

.factory('Room', function($firebase) {
  return function(room) {
    var ref = new Firebase("https://codeview1.firebaseio.com/rooms/").child(room);
    return $firebase(ref).$asObject();
  }
});
