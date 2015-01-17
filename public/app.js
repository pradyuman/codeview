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

.controller('CodeCtrl', function($scope, $stateParams, $firebase) {
  var ref = new Firebase('https://codeview1.firebaseio.com/room');
  var sync = $firebase(ref);
  var type = $stateParams.type || 'code';
  var syncObject = sync.$asObject();
  syncObject.$bindTo($scope, 'data');
  $scope.data = 'test';

  $scope.aceOpts = {
    theme: 'monokai',
    mode: 'javascript',
    rendererOptions: {
      fontSize: 16
    }
  };

  $scope.aceLoaded = function(editor) {
    editor.setReadOnly(true);
    console.log(editor);
    editor.setFontSize(12);
  };

});
