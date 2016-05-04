// public/core.js
var gestionMemos = angular.module('gestionMemos', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('/memo')
        .success(function(data) {
            $scope.memos = data.memolist;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createMemo = function() {
        $http.post('/memo', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.memos = data.memolist;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteMemo = function(id) {
        $http.delete('/memo/' + id)
            .success(function(data) {
                $scope.memos = data.memolist;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}
