angular.module('anguCows', ['ngResource']);

angular.module('anguCows').factory('Cow', function($resource){
  // This creates a minimal service that returns the cow resource
  // as 'Cow'
  return $resource('/cows/:id', { id: '@id' }, {
    // Add the PATCH method for update that ng-resource doesn't supply be default
    update: {
      method: 'PATCH', // this method issues a PATCH request
      url: '/cows/:id'
    }
  });  
  //return $resource('/cows/:id');
});

angular.module('anguCows').controller('RestController', ['Cow', '$scope', 

  function(Cow, $scope){
    $scope.testData = "This is test data";

    // we use the return value in the callback. This seems weird.
    // But when the callback runs the promise is already resolved,
    // so we can use the return value to set data on the 

    $scope.loadCows = function() {
      var cows = Cow.query(function() {$scope.cows = cows});
    }

    $scope.copyThisCowForEdit = function(cow) {
      $scope.edit_cow = JSON.parse(JSON.stringify(cow));
    }

    var replaceCow = function(cow) {
      newCows = [];
      $scope.cows.forEach(function(ele){
        if (ele.id == cow.id) {
          newCows.push(cow);
        }
        else {
          newCows.push(ele);
        }
      });

      $scope.cows = newCows;
    }

    $scope.saveEditedCow = function() {
      var retval = Cow.update($scope.edit_cow);
      retval.$promise.then(function(data){
        replaceCow(data);
      })
    }

    //Now do the initial setup

    $scope.loadCows();
  }

]);