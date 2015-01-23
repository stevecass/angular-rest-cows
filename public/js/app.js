angular.module('anguCows', ['ngResource']);

angular.module('anguCows').controller('RestController', ['$scope', '$http', '$resource', 
  function($scope, $http, $resource){
     $scope.testData = "This is test data";
  }
]);