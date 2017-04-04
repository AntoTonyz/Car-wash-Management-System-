/**
 * Created by hobbit on 18/11/16.
 */
angular.module('starter.controllers',['angularUtils.directives.dirPagination'])

    .controller('menuController',function ($scope, $state, $ionicLoading, $http, toastr,$ionicModal,$ionicPopup) {


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

                    startSession(data.id);
                    toastr.success(data.message,'Success');
                    //go to client menu page..
                    $state.go('mainMenu');
                    $scope.profile.FisrtName = data.first;
                    $scope.profile.SecondName = data.last;
                    console.info($scope.profile.FisrtName)
                }else if(data.status == 'incorrect'){
                    toastr.error(data.message,'Error!');
                }
            })
        }
        $scope.allImages = '/cars/www/img/car-wash.png';

        var set_default_values =  function () {
            $ionicLoading.show();

            //    load account data to the edit form
            $scope.profile = {};
            $scope.profile.FisrtName = sessionStorage.first;
            $scope.profile.SecondName = sessionStorage.last;
            $scope.profile.username = sessionStorage.username;
            $scope.profile.email = sessionStorage.email;
            $scope.profile.phone_number = sessionStorage.phone;
            $scope.profile.user_id = sessionStorage.user_id;
            $scope.profile.created = sessionStorage.created;

            // wash form
            $scope.wash = {};
            $scope.wash.user_id = sessionStorage.user_id;
            $ionicLoading.hide();
        };

        //update user profile
        $scope.profile_update = function(data){
            $ionicLoading.show();//loading spinner
            console.info(data);
            $http({
                url:url+'UpdateProfile',
                method:'POST',
                data:data,
                headers:{
                    ContentType:'application/x-www-form-urlencoded'
                }
            }).success(function (data) {
                $ionicLoading.hide();
                //if correct login details
                if(data.status == 'correct'){

                    toastr.success(data.message,'Success');
                    //go to client menu page..
                    // $state.go('mainMenu');

                }else if(data.status == 'incorrect'){
                    toastr.error(data.message,'Error!');
                }
            })
        };

        //save expense
        $scope.createExpense = function (newExpense) {
            $ionicLoading.show();
            if (newExpense ==undefined){
                toastr.error('Please provide expense details');
                $ionicLoading.hide();
                return;
            }
            if (newExpense.name == undefined || newExpense.description == undefined || newExpense.amount == undefined){
                toastr.error('Please provide expense details');
                $ionicLoading.hide();
                return;
            }
            $http({
                url:url+'CreateExpense',
                method: 'POST',
                data: newExpense,
                headers:{
                    ContentType:'application/x-www-form-urlencoded'
                }
            }).success(function (data) {
                $ionicLoading.hide();
                if (data.status == 'correct'){
                    toastr.success(data.message,'Success');
                    $state.go('myExpenses');
                }
            })
        };

        //calling the modal for adding an expensse
        $ionicModal.fromTemplateUrl('templates/modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();

        };
        /*// Cleanup the modal when we're done with it!
         $scope.$on('$destroy', function() {
         $scope.modal.remove();
         });*/
        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

        //get debit balance
        $scope.client = function (data) {
            $ionicLoading.show();

            var p = data.user;
            console.info(p);
            $http({
                url:url+'GetDebit/'+p,
                method: 'GET',
            }).success(function (data) {

                console.info(data);
                $scope.name = data[1].FullName;
                $scope.phone = data[1].phone_number;
                $scope.amount = data[0].balance;
                console.info($scope.amount);
            })
            $ionicLoading.hide();
        }



        //post the car wash sale
        $scope.wash_car =function (wash) {
            $ionicLoading.show();
            if (wash == undefined){
                toastr.error('Please provide wash details');
                $ionicLoading.hide();
                return;
            }
            if (wash.registration_number == undefined || wash.washer == undefined || wash.washType == undefined || wash.washer == '' || wash.washType == ''){
                toastr.error('Please provide wash details');
                $ionicLoading.hide();
                return;
            }
            $http({
                url:url+'RecordWash',
                method:'POST',
                data:wash,
                headers:{
                    ContentType:'application/x-www-form-urlenconded'
                }
            }).success(function (data) {
                $ionicLoading.hide();
                if (data.status == 'correct'){
                    toastr.success(data.message,'Success');
                }else if(data.status == 'incorrect'){
                    toastr.error(data.message,'Error!');
                }
            })
        }





        //to get the general customer
        $scope.showSelectValue = function(mySelect) {
            console.log(mySelect);
        }

        //get wash type price
        $scope.showWashValue = function(wash) {
            console.log(wash.washType);

            $http({
                url:url+'GetNonGeneralPrice/'+wash.washType,
                method:'GET'
            }).success(function (data) {
                $scope.NonGeneralAmount = data[0].amount;

            })
        }

        //get reconciliations




        //post general customer information
        $scope.general_customer = function (customer) {
            $ionicLoading.show();
            if (customer == undefined){
                toastr.error('Please provide customer details');
                $ionicLoading.hide();
                return;
            }
            if (customer.FullName == undefined || customer.email == undefined || customer.phone_number == undefined ){
                toastr.error('Please provide customer details');
                $ionicLoading.hide();
                return;
            }
            $http({
                url:url+'AddCustomer',
                method: 'POST',
                data: customer,
                headers:{
                    ContentType:'application/x-www-form-urlenconded'
                }
            }).success(function (data) {
                $ionicLoading.hide();
                if (data.status == 'correct'){
                    toastr.success(data.message, 'Success');
                    $state.go('generalCustomer');
                }else if (data.status == 'incorrect'){
                    toastr.error(data.message, 'Error!');
                    $state.go('generalCustomer');
                }
            })
        };

        //pay customer credit
        $scope.Pay_debit = function (data) {
            $ionicLoading.show();

            $http({
                url:url+'PayDebit',
                method: 'POST',
                data: data,
                headers:{
                    ContentType:'application/x-www-form-urlenconded'
                }
            }).success(function (data) {
                $ionicLoading.hide();
                if (data.status == 'correct'){
                    toastr.success(data.message,'Success');
                }else if (data.status == 'incorrect'){
                    toastr.error(data.message,'Error!');
                }
            })
        }

        //logout the user
        $scope.logout = function () {
            $ionicLoading.show();
            sessionStorage.clear();
            toastr.success('You have logged out successfully');
            $state.go('login');
            $ionicLoading.hide();
        }

        // search for general
        $scope.customerID = function (ID) {
            console.info(ID.ID);
            $http({
                url: url+ 'GetGeneralCustomer/'+ID.ID,
                method: 'GET'
            }).success(function (data) {
                console.log(data);
                if (data.status == 'correct'){
                    $scope.Full = data[1].FullName;
                    $scope.CustID = data[1].customer_id;
                    $scope.Phone = data[1].phone_number;
                    $scope.id_number = data[1].id_number;
                    $scope.reg = data[1].registration_number;
                    $scope.WashType = data[0];
                    $scope.Btn = true;
                    console.info($scope.CustID);


                    $scope.showWash1Value = function(wash1) {
                        console.log(wash1);

                        $http({
                            url:url+'GetGeneralPrice/'+wash1.washType+'/'+ID.ID,
                            method:'GET'
                        }).success(function (data) {
                            console.info(data);
                            if (data == null || data == ''){
                                $scope.GeneralAmount = 0;

                            }else {
                                $scope.GeneralAmount = data.rate;

                            }

                        })
                    }
                }else if (data.status == 'incorrect'){
                    $scope.Btn = false;
                    toastr.error(data.message,'Error!');
                }

                $scope.wash_car1 = function (wash1) {
                    $ionicLoading.show();
                    if (wash1 == undefined){
                        toastr.error('Please provide wash details');
                        $ionicLoading.hide();
                        return;
                    }
                    if (wash1.registration_number == undefined || wash1.washer == undefined || wash1.washType == undefined || wash1.washer == '' || wash1.washType == ''){
                        toastr.error('Please provide wash details');
                        $ionicLoading.hide();
                        return;
                    }
                    $http({
                        url: url+'RecordWashGeneral/'+ID.ID,
                        method: 'POST',
                        data:wash1,
                        headers:{
                            ContentType:'application/x-www-form-urlenconded'
                        }
                    }).success(function (data) {
                        $ionicLoading.hide();
                        if (data.status == 'correct'){
                            toastr.success(data.message,'Success');
                        }else if(data.status == 'incorrect'){
                            toastr.error(data.message,'Error!');
                        }
                    })
                }
            })
        }

        //get customers
        $ionicLoading.show();
        $http({
            url:url+'getCustomers',
            method: 'GET'
        }).success(function (data) {
            $ionicLoading.hide();
            $scope.customers = data;
        })

        //get washers

        $http({
            url:url+'GetWashers',
            method: 'GET'
        }).success(function (data) {
            $scope.washers = data;
        })


        $http({
            url:url+'LoadWashType',
            method:'GET'
        }).success(function (data) {
            $scope.CarWashType =data;
        });

        //get the wash types
        $http({
            url:url+'GetWashTypes',
            method:'GET'
        }).success(function (data) {
            $scope.WashType =data;
        });

        $http({
            url:url+'user/'+sessionStorage.user_id,
            method: 'GET'
        }).success(function (data) {
            $scope.first = data.FisrtName;
            $scope.last = data.LastName;
            console.info(data);
        });

        //get Car types
        $http({
            url:url+'LoadCarType',
            method: 'GET'
        }).success(function (data) {
            $scope.CarType = data;
        });

        $scope.washCar = function () {
            $state.go('washcar');
            $scope.user_id = sessionStorage.user_id;
            console.info($scope.user_id)
        }

        //to get washers commissions
        $ionicLoading.show();
        $http({
            url:url+'myCommission?user_id='+sessionStorage.user_id,
            method:'GET'
        }).then(function (data) {
            console.info(data);
            var res = data.data;
            var commissions = [];
            if(res.hasOwnProperty('count'))
            {
                for(var i=0;i<res.count.length;i++)
                {
                    var ite = {'count':res['count'][i],'created_at':res['date'][i],'commission':res['commission'][i]};
                    commissions.push(ite);
                }
            }
            $scope.commissions = commissions;
            $ionicLoading.hide();

            $scope.total_commission = 0;
        }, function (err) {
            console.error('error encountered error => '+err.statusText);
        });

        $scope.getTimeAgo = function(last_updated_time ){
            return moment(last_updated_time).fromNow();
        };


        $scope.my_profile = function () {
            $state.go('my_profile');
        }

        $scope.generalCustomer = function () {
            $ionicLoading.show();
            $http({
                url:url+'getCustomers',
                method: 'GET'
            }).success(function (data) {
                $ionicLoading.hide();
                $scope.customers = data;
                $state.go('generalCustomer');
            })

        }

        $scope.settlePayment = function () {
            $state.go('settlePayment');
        }

        //credit customer
        $scope.Prices = function () {
            $state.go('customerPrice');
        }
            $scope.customerPrice = function (cust) {
                $ionicLoading.show();
                if (cust == undefined){
                    toastr.error('Please provide customer price details');
                    $ionicLoading.hide();
                    return;
                }
                if (cust.id == undefined || cust.rate == undefined || cust.washType == undefined|| cust.washType == ''){
                    toastr.error('Please provide customer price details');
                    $ionicLoading.hide();
                    return;
                }
                $http({
                    url:url+'CustomerPrice',
                    method: 'POST',
                    data: cust,
                    headers:{
                        ContentType:'application/x-www-form-urlencoded'
                    }
                }).success(function (data) {
                    $ionicLoading.hide();

                    if (data.status == 'correct'){
                        toastr.success(data.message,'Success');
                        $state.go('customerPrice');
                    }
                })
            };




        //reconciliation

        $scope.myCommission = function () {
            $state.go('myCommissions');

        }
        $scope.showCommissionValue = function (commission) {
            $ionicLoading.show();
            console.info(commission)
            $http({
                url:url+'GetReconciliations/'+commission.id,
                method:'GET'
            }).success(function (data) {
                $ionicLoading.hide();
                $scope.data = data[0];
                $scope.date = data[1];
                $scope.first = data[0].FisrtName;
                $scope.last = data[0].SecondName;
                console.info($scope.data);


                $scope.Cash = function (data) {
                    console.info(data);
                    $http({
                        url:url+'AmountSubmitted/'+$scope.data.id,
                        method: 'POST',
                        data: data,
                        headers:{
                            ContentType:'application/x-www-form-urlencoded'
                        }
                    }).success(function (data) {
                        $ionicLoading.hide();

                        if (data.status == 'correct'){
                            toastr.success(data.message,'Success');
                            $state.go('myCommissions');
                        }
                    })
                }
            });
        }



        //add washer
        $scope.addWasher = function () {
            $ionicLoading.show();
            $http({
                url:url+'GetAllWashers',
                method: 'GET'
            }).success(function (data) {
                $scope.allWashers = data;
                console.info($scope.allWashers)
                $state.go('addWasher');
            });

        }
        $ionicLoading.show();
        $http({
            url:url+'GetAllWashers',
            method: 'GET'
        }).success(function (data) {
            $scope.allWashers = data;
            console.info($scope.allWashers)

        });
        //save a new washer to the company
//save washType
        $scope.saveWasher = function (customer) {
            $ionicLoading.show();
            if (customer == undefined){
                toastr.error('Please provide washers details');
                $ionicLoading.hide();
                return;
            }
            if (customer.FisrtName == undefined || customer.SecondName == undefined || customer.email == undefined || customer.phone_number == undefined){
                toastr.error('Please provide washers details');
                $ionicLoading.hide();
                return;
            }
            $http({
                url:url+'SaveWasher',
                method: 'POST',
                data: customer,
                headers:{
                    ContentType:'application/x-www-form-urlencoded'
                }
            }).success(function (data) {
                $ionicLoading.hide();
                if (data.status == 'correct'){
                    toastr.success(data.message,'Success');
                    $state.go('addWasher');
                }
            })
                .error(function () {
                    console.info('error');
                })
        };
        //get credit customers prices
        $ionicLoading.show();
        $http({
            url:url+'CreditCustomers',
            method: 'GET'
        }).success(function (data) {
            $ionicLoading.hide();
            $scope.creditCustomers = data;

        });

        //to wash type

        $http({
            url:url+'GetWashTypes',
            method:'GET'
        }).success(function (data) {
            $scope.washTypes = data;
            $scope.my_washTypes = function () {
                $state.go('myWashTypes');
            }
        });

        //save washType
        $scope.createWashType = function (newWashType) {
            $ionicLoading.show();
            if (newWashType == undefined){
                toastr.error('Please provide wash type details');
                $ionicLoading.hide();
                return;
            }
            if (newWashType.name == undefined || newWashType.amount == undefined || newWashType.commission == undefined){
                toastr.error('Please provide wash type details');
                $ionicLoading.hide();
                return;
            }
            $http({
                url:url+'CreateWashType',
                method: 'POST',
                data: newWashType,
                headers:{
                    ContentType:'application/x-www-form-urlencoded'
                }
            }).success(function (data) {
                $ionicLoading.hide();
                if (data.status == 'correct'){
                    toastr.success(data.message,'Success');
                    $state.go('myWashTypes');
                }
            })
                .error(function () {
                    console.info('error');
                })
        };


        $ionicModal.fromTemplateUrl('templates/modal1.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal1 = modal;
        });
        $scope.openModal = function() {
            $scope.modal1.show();
        };
        $scope.closeModal = function() {
            $scope.modal1.hide();

        };
        /*// Cleanup the modal when we're done with it!
         $scope.$on('$destroy', function() {
         $scope.modal.remove();
         });*/
        // Execute action on hide modal
        $scope.$on('modal1.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal1.removed', function() {
            // Execute action
        });

        //modal for customers
        $ionicModal.fromTemplateUrl('templates/modal2.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal2 = modal;
        });
        $scope.openModal = function() {
            $scope.modal2.show();
        };
        $scope.closeModal = function() {
            $scope.modal2.hide();

        };
        /*// Cleanup the modal when we're done with it!
         $scope.$on('$destroy', function() {
         $scope.modal.remove();
         });*/
        // Execute action on hide modal
        $scope.$on('modal2.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal2.removed', function() {
            // Execute action
        });

        $ionicModal.fromTemplateUrl('templates/modal3.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal3 = modal;
        });
        $scope.openModal = function() {
            $scope.modal3.show();
        };
        $scope.closeModal = function() {
            $scope.modal3.hide();

        };
        /*// Cleanup the modal when we're done with it!
         $scope.$on('$destroy', function() {
         $scope.modal.remove();
         });*/
        // Execute action on hide modal
        $scope.$on('modal3.hidden', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal3.removed', function() {
            // Execute action
        });


        $http({
            url:url+'getExpense',
            method: 'GET'
        }).success(function (data) {
            $scope.expenses = data;
            $scope.myExpenses = function () {
                $state.go('myExpenses');
                //get expenses

            }
        });

        set_default_values();

    })