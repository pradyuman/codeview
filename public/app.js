angular.module('codeview', ['ui.router'])

.config(function($stateProvider, $locationProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'templates/home.html'
  });

  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);

});
