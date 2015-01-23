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

    // Note we use the return value in the callback. This seems weird.
    // But when the callback runs the promise is resolved, so at that
    // point we can use its data on the return value to set data on the scope.
    // Look at what gets logged. It's an "array-like" object that also has a 
    // handle to the promise.
    // So we can use it directly in the ng-repeat but it's not a vanilla array.
    $scope.loadCows = function() {
      var cows = Cow.query(function() {
        $scope.cows = cows;
      });
    }

    // We clone the cow here so that we aren't editing
    // a reference to the cow in the table.
    // We won't update the table till we save
    $scope.copyThisCowForEdit = function(cow) {
      $scope.edit_cow = JSON.parse(JSON.stringify(cow));
    }

    // If the array were an array of primitives we could just use indexOf
    // to find the relevant index point 
    var findCow = function(cow) {
      var result = -1;
      var i = 0;
      var len = $scope.cows.length
      for(i = 0; i < len; i++) {
        if ($scope.cows[i].id === cow.id) {
          result = i;
          break;
        }
      }
      return result; 
    }

    var replaceCow = function(cow) {
      var index = findCow(cow);
      if (index > -1) {
        var result = $scope.cows.slice(0, index);
        result.push(cow);
        result = result.concat($scope.cows.slice(index + 1));
        $scope.cows = result;
      }
    }

    var saveEditedCow = function() {
      var retval = Cow.update($scope.edit_cow);
      retval.$promise.then(function(data){
        replaceCow(data);
        $scope.edit_cow = null;
      })
    }

    var saveNewCow = function() {
      var retval = Cow.save($scope.edit_cow);
      retval.$promise.then(function(data){
        $scope.cows.push(data);
        $scope.edit_cow = null;
      })
    }

    $scope.saveFormLabel = function() {
      if($scope.edit_cow && $scope.edit_cow.id) {
        return "Update cow";
      } else {
        return "Create cow";
      }
    }

    $scope.saveCowFromForm = function() {
      if($scope.edit_cow.id) {
        saveEditedCow();
      } else {
        saveNewCow();
      }
    }

    $scope.resetCowForm = function() {
      $scope.edit_cow = null;
    }

    var removeCowFromTable = function(cow) {
      $scope.cows = $scope.cows.filter(function(ele){
        return ele.id != cow.id;
      });
    }

    $scope.deleteCow = function(cow) {
      var retval = Cow.delete(cow);
      retval.$promise.then(function(data){
        removeCowFromTable(cow);
      });

    }

    //Now do the initial setup

    $scope.loadCows();
  }

]);