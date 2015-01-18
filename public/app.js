angular.module('codeview', ['ui.router', 'firebase', 'ui.ace'])

.config(function($stateProvider, $locationProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  }).state('find', {
    url: '/find/:type',
    templateUrl: 'templates/find.html',
    controller: 'FindCtrl'
  }).state('code', {
    url: '/code/:type',
    templateUrl: 'templates/code.html',
    controller: 'CodeCtrl'
  }).state('leaderboard', {
    url: '/leaderboard',
    templateUrl: 'templates/leaderboard.html',
    controller: 'LeaderboardCtrl'
  });

  $urlRouterProvider.otherwise('/');
})

.controller('HomeCtrl', function($scope, $http) {
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

  $http.get('/api/user').then(function(res) {
    $scope.user = res.data;
  });

  $scope.login = function() {
    $http.post('/api/logreg', {
      name: $scope.username,
      password: $scope.password
    }).then(function(res) {
      $scope.user = {
        name: 'me@ian.pw',
        password: 'asfkljadg'
      };
      console.log(res);
      if (res) {
      }
    });
  };

})

.controller('FindCtrl', function($scope, $stateParams) {
  var type = $scope.type = $stateParams.type;
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

  $scope.aceCons = {
    theme: 'ambiance',
    useWrapMode: true,
    rendererOptions: {
      fontSize: 13
    },
    onLoad: function(ace) {
      ace.$blockScrolling = Infinity;
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

  $scope.mycode = '// Enter your code here.';
  $scope.theircode = '// Enter your code here.';

  $scope.data = {};
  var room = Room('test');
  room.$loaded().then(function() {
    $scope.data = room;
    $scope.mycode = coder ? room.code : room.code2;
    $scope.theircode = coder ? room.code2 : room.code;
    $scope.updateLang();
  });
  room.$bindTo($scope, 'data');

  if (coder) {
    // Edit code only
    $scope.$watch('mycode', function() {
      if ($scope.mycode) {
        $scope.data.code = $scope.mycode;
      }
    });
    $scope.$watch('data', function() {
      $scope.theircode = $scope.data.code2;
    });
  } else {
    // Edit code 2 only
    $scope.$watch('mycode', function() {
      if ($scope.mycode) {
        $scope.data.code2 = $scope.mycode;
      }
    });
    $scope.$watch('data', function() {
      $scope.theircode = $scope.data.code;
    });
  }

  execute = function(code, person) {
    $(".footer").slideDown(500);
    if (person)
      $scope.myoutput = 'Running program...';
    else
      $scope.theiroutput = 'Running program';
    $http.post('/execute', {
      code: code,
      lang: $scope.data.lang.id
    }).
    success(function(data, status, headers, config) {
      var output = "";
      if (data.error || !data.output)
        output = data.error;
      else output = data.output + "\n" + data.status;
      console.log(data);
      if (person)
        $scope.myoutput = output;
      else
        $scope.theiroutput = output;
    }).
    error(function(data, status, headers, config) {
      alert("Failed to execute code");
    });
  }

  $scope.closeConsole = function() {
    $(".footer").slideUp(500);
  }


    $(".footer").slideUp(0);

  $scope.execute1 = function() {
    execute($scope.mycode, true);
  }

  $scope.execute2 = function() {
    execute($scope.theircode, false);
  }
  $scope.startmoxtra = function() {
    window.open("/moxtra/", "Voice Call", "width=600, height=500");
  }

  $scope.saved = function() {
    alert('Rating saved. Click a different rating to update it!');
  };

  $scope.tip = function() {
    var amount = prompt('Enter a tip amount: (Ex: 20.00)');
    $http.post('/tip', {
      amount: amount
    }).
    success(function(data, status, headers, config) {
      alert("$"+amount +" sent to " + data["first name"] + " " + 
        data["last name"] + "\n"+data.address.street+"\n" + 
        data.address.city + ", " + data.address.state + " " + data.address.zip+"\nid: "+
        data._id);
    }).
    error(function(data, status, headers, config) {
    alert("Failed to send tip");
    });
  }

  $scope.clear = function() {
    $scope.data = {
      lang: $scope.data.lang
    };
    $scope.mycode = '';
    $scope.theircode = '';
  };

  $scope.langs = [];
  $http.get('/langs').then(function(data) {
    $scope.langs = data.data;
  });
})

.controller('LeaderboardCtrl', function($scope, $http) {
  $scope.leaders = [];
  $http.get('/api/leaderboard').then(function(res) {
    var data = res.data;
    $scope.leaders = data;
  });
})

.factory('Room', function($firebase) {
  return function(room) {
    var ref = new Firebase("https://codeview1.firebaseio.com/rooms/").child(room);
    return $firebase(ref).$asObject();
  }
});
