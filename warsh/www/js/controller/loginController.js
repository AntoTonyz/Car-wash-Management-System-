angular.module('starter.controllers', [])
.controller('loginController',function ($scope, $http, $ionicPopup, $state, $ionicLoading, toastr) {

    //login logic
    $scope.login = function(LoginData){
        //show loading
        $ionicLoading.show();
        if (LoginData ==undefined){
            toastr.error('Please provide login details');
            $ionicLoading.hide();
            return;
        }
        if (LoginData.username == undefined || LoginData.password == undefined){
            toastr.error('Please provide login details');
            $ionicLoading.hide();
            return;
        }

        //start the session
        var startSession = function (user_id) {
            $http({
                url:url+'startSession/'+user_id,
                method: 'GET'
            }).success(function (data) {
                //store the session data....
                sessionStorage.setItem('user_id',data.user_id);
                sessionStorage.setItem('username',data.username);
                sessionStorage.setItem('first',data.FisrtName);
                sessionStorage.setItem('last',data.SecondName);
                sessionStorage.setItem('phone',data.phone_number);
                sessionStorage.setItem('created',data.created_at);
                sessionStorage.setItem('loggedIn',true);
                sessionStorage.setItem('email',data.email);
                sessionStorage.setItem('organisation_id',data.org_id);

            });
        };

        $http({
            method:'POST',
            url:url+'postLogin',
            data:LoginData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function (data) {
            $ionicLoading.hide();
            //if correct login details
            if(data.status == 'correct'){
                //start session...
                console.info(data.id)
                startSession(data.id);
                toastr.success(data.message,'Success');
                //go to client menu page..
                $state.go('mainMenu');

            }else if(data.status == 'incorrect'){
                toastr.error(data.message,'Error!');
            }
        })
    }

})