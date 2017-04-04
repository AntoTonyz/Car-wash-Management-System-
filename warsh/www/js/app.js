// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngAnimate','toastr','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
      .state('login',{
        url:'/login',
        cache: false,
        templateUrl:'templates/login.html',
        controller:'menuController'
      })
      .state('mainMenu',{
        url: '/mainMenu',
        cache: false,
        templateUrl: 'templates/menu.html',
        controller: 'menuController'
      })
      .state('generalCustomer',{
          url: '/generalCustomer',
          cache: false,
          templateUrl: 'templates/customer.html',
          controller: 'menuController'
      })
      .state('washcar',{
        url: '/washcar',
        cache: false,
        templateUrl: 'templates/wash.html',
        controller: 'menuController'
      })
      .state('my_profile',{
          url: '/my_profile',
          cache: false,
          templateUrl: 'templates/my_profile.html',
          controller: 'menuController'
      })
      .state('settlePayment',{
          url: '/SettlePayment',
          cache: false,
          templateUrl: 'templates/settlePayment.html',
          controller: 'menuController'
      })
      .state('myCommissions',{
          url: '/myCommission',
          cache: false,
          templateUrl: 'templates/myCommission.html',
          controller: 'menuController'
      })
      .state('myExpenses',{
          url: '/myExpense',
          cache: false,
          templateUrl: 'templates/myExpense.html',
          controller: 'menuController'
      })
      .state('myWashTypes',{
          url: '/myWashTypes',
          cache: false,
          templateUrl: 'templates/washTypes.html',
          controller: 'menuController'
      })
      .state('customerPrice',{
          url: '/customerPrice',
          cache:false,
          templateUrl: 'templates/customerPrices.html',
          controller: 'menuController'
      })
      .state('addWasher',{
          url: '/addWasher',
          cache: false,
          templateUrl: 'templates/washers.html',
          controller: 'menuController'
      })

  // if none of the above states are matched, use this as the fallback
    if(sessionStorage.user_id === null){
        $urlRouterProvider.otherwise('/login');
    }else{
        $urlRouterProvider.otherwise('/mainMenu');
    }

    if(window.plugins && window.plugins.AdMob) {
        var admob_key = device.platform == "Android" ? "ca-app-pub-5937503853869293~1356593762" : "ca-app-pub-5937503853869293~1356593762";
        var admob = window.plugins.AdMob;
        admob.createBannerView(
            {
                'publisherId': admob_key,
                'adSize': admob.AD_SIZE.BANNER,
                'bannerAtTop': false
            },
            function() {
                admob.requestAd(
                    { 'isTesting': false },
                    function() {
                        admob.showAd(true);
                    },
                    function() { console.log('failed to request ad'); }
                );
            },
            function() { console.log('failed to create banner view'); }
        );
    }

});
