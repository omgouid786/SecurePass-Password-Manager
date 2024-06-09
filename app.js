var app = angular.module('myApp', []);

app.controller('passwordController', function ($scope, $http) {
    $scope.passwords = [];
    $scope.newPassword = {};

    // Function to load passwords
    $scope.loadPasswords = function () {
        $http.get('/passwords')
            .then(function (response) {
                $scope.passwords = response.data;
            });
    };
    $scope.loadPasswords();

    // Function to save or update password
    $scope.saveCredential = function () {
        if ($scope.newPassword.id == null) {
            $http.post('/passwords', $scope.newPassword)
                .then(function (response) {
                    $scope.passwords.push(response.data);
                    $scope.newPassword = {};
                });
        } else {
            $http.put('/passwords/' + $scope.newPassword.id, $scope.newPassword)
                .then(function (response) {
                    $scope.loadPasswords();
                    $scope.newPassword = {};
                });
        }
    };

    // Function to delete password
    $scope.delete = function (id) {
        $http.delete('/passwords/' + id)
            .then(function (response) {
                $scope.loadPasswords();
            }, function (error) {
                console.error('Error deleting password:', error);
            });
    };

    // Function to edit password
    $scope.edit = function (id) {
        let password = $scope.passwords.find(password => password._id === id);
        if (password) {
            $scope.newPassword = angular.copy(password);
            $scope.newPassword.id = password._id;
        }
    };
});
