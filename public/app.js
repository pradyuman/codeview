angular.module('codeview', ['ui.router', 'firebase', 'ui.ace'])

.config(function($stateProvider, $locationProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  }).state('code', {
    url: '/code/:type',
    templateUrl: 'templates/code.html',
    controller: 'CodeCtrl'
  });

  $urlRouterProvider.otherwise('/');
})

.controller('HomeCtrl', function($scope) {
  $scope.test = 'asdf';
  // Closes the sidebar menu
  $("#menu-close").click(function(hi) {
    hi.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
  });

  // Opens the sidebar menu
  $("#menu-toggle").click(function(hi) {
    hi.preventDefault();
    $("#sidebar-wrapper").toggleClass("active");
  });

  // Scrolls to the selected menu item on the page
  $(function() {
    $('a[href*=#]:not([href=#])').click(function() {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {

        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top
          }, 1000);
          return false;
        }
      }
    });
  });

  $("#validatedForm").submit(function(event) {

    var error = 0;

    clearerror("#erroremail");
    clearerror("#errorpassword");

    event.preventDefault();

    if (error != 1) {

      $("#submitButton").animate({
        "width": "240px"
      }, 800);
      $("#submitButton").val("Submitted successfully");

    }

    function isValidEmailAddress(emailAddress) {
      var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
      return pattern.test(emailAddress);
    };

    function isValidPassword(password) {
      var pattern = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/);
      return pattern.test(password);
    };

    function styleerror(errortype) {
      $(errortype).css("backgroundColor", "#CC6666");
      $(errortype).css("width", "240px");
      $(errortype).css("height", "20px");
      $(errortype).css("marginBottom", "10px");
      $(errortype).css("padding", "0px 5px 5px 15px");
    }

    function clearerror(errortype) {
      $(errortype).html("");
      $(errortype).css("backgroundColor", "none");
      $(errortype).css("width", "0");
      $(errortype).css("height", "0");
      $(errortype).css("marginBottom", "0");
      $(errortype).css("padding", "0");
    }

  });
})

.controller('CodeCtrl', function($scope, $stateParams, Room, $http) {
  var coder = $scope.coder = mycoder = (($stateParams.type || 'code') === 'code');

  var aces = [];

  $scope.aceOpts = {
    theme: 'monokai',
    useWrapMode: true,
    rendererOptions: {
      fontSize: 13
    },
    onLoad: function(ace) {
      ace.$blockScrolling = Infinity;
      aces.push(ace);
    }
  };

  $scope.updateLang = function() {
    try {
      var mode = $scope.data.lang.id.split('/')[0];
      for (var i = 0; i < aces.length; i++) {
        var ace = aces[i];
        ace.getSession().setMode('ace/mode/' + mode.toLowerCase());
      }
    } catch (e) {
      console.log(e);
    }
  };

  $scope.code = '// Enter code here \n';
  $scope.code2 = '// Interviewer comments\n';
  $scope.data = {};
  var room = Room('test');
  room.$loaded().then(function() {
    $scope.data = room;
    $scope.code = room.code;
    $scope.code2 = room.code2;
    $scope.updateLang();
  });
  room.$bindTo($scope, 'data');

  if (coder) {
    // Edit code only
    $scope.$watch('mycode', function() {
      if ($scope.code) {
        $scope.data.code = $scope.mycode;
      }
    });
    $scope.$watch('data', function() {
      $scope.theircode = $scope.data.code2;
    });
  } else {
    // Edit code 2 only
    $scope.$watch('mycode', function() {
      if ($scope.code2) {
        $scope.data.code2 = $scope.mycode;
      }
    });
    $scope.$watch('data', function() {
      $scope.theircode = $scope.data.code;
    });
  }

  execute = function(code) {
    $http.post('/execute', {
      code: code,
      lang: $scope.data.lang.id
    }).
    success(function(data, status, headers, config) {
      console.log(data);
    }).
    error(function(data, status, headers, config) {
      console.log(data);
    });
  }

  $scope.execute1 = function() {
    console.log($scope.code);
    execute($scope.code);
  }

  $scope.execute2 = function() {
    execute($scope.code2);
  }

  $scope.langs = [];
  $http.get('/langs').then(function(data) {
    $scope.langs = data.data;
  });
})

.factory('Room', function($firebase) {
  return function(room) {
    var ref = new Firebase("https://codeview1.firebaseio.com/rooms/").child(room);
    return $firebase(ref).$asObject();
  }
});
