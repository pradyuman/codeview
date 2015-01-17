angular.module("firetube",[firebase]). controller("Firetube", ["$scope", "$firebase", function($scope, $firebase) {
var ref = new Firebase("https://sweltering-inferno-1134.firebaseio.com/");
scope.code = $firebase(ref);
$scope.addcode = function(s) {
if(s.keyCode != 13 ) return;
$scope.code.$add({
body: $scope.newcode;
});
$scope.newcode = "";
]);
