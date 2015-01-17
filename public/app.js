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
  var type = $stateParams.type || 'code';

  $scope.aceOpts = {
    theme: 'monokai',
    mode: 'javascript',
    rendererOptions: {
      fontSize: 16
    }
  };

  $scope.data = {};
  Room('test').$bindTo($scope, 'data');

})

.factory('Room', function($firebase) {
  return function(room) {
    var ref = new Firebase("https://codeview1.firebaseio.com/rooms/").child(room);
    return $firebase(ref).$asObject();
  }
});
