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
})

.controller('CodeCtrl', function($scope, $stateParams, Room) {
  var coder = ($stateParams.type || 'code') === 'code';

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
  $scope.data = {};
  var room = Room('test');
  room.$loaded().then(function() {
    $scope.data = room;
    $scope.code = room.code;
  });
  room.$bindTo($scope, 'data');

  if (coder) {
    $scope.$watch('data', function() {
      $scope.code = $scope.data.code;
    });
  } else {
    $scope.$watch('code', function() {
      if ($scope.code) {
        $scope.data.code = $scope.code;
      }
    });
  }

})

.factory('Room', function($firebase) {
  return function(room) {
    var ref = new Firebase("https://codeview1.firebaseio.com/rooms/").child(room);
    return $firebase(ref).$asObject();
  }
});
