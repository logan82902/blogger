var app = angular.module('bloggerApp', ['ngRoute']);

//Router Provider
app.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'pages/home.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
  
      .when('/blogList', {
        templateUrl: 'pages/blogList.html',
        controller : 'ListController',
        controllerAs: 'vm'
      })
  
      .when('/blogAdd', {
        templateUrl: 'pages/blogAdd.html',
        controller: 'AddController',
        controllerAs: 'vm'
      })
  
      .when('/blogEdit/:id', {
        templateUrl: 'pages/blogEdit.html',
        controller: 'EditController',
        controllerAs: 'vm'
      })
  
      .when('/blogDelete/:id', {
        templateUrl: 'pages/blogDelete.html',
        controller: 'DeleteController',
        controllerAs: 'vm'
      })

      .when('/register', {
        templateUrl: '/auth/register.view.html',
        controller: 'RegisterController',
        controllerAs: 'vm'
      })
  
      .when('/signOn', {
        templateUrl: '/auth/login.view.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })

      .when('/blogChat', {
        templateUrl: 'pages/blogChat.html',
        controller: 'ChatController',
        controllerAs: 'vm'
      })
  
      .otherwise({redirectTo: '/'});
  });
  
  //REST API functions
  function getAllBlogs($http) {
    return $http.get('/api/blogs');
  }
  
  function getBlogById($http, id) {
    return $http.get('/api/blogs/' + id);
  }
  
  function addBlog($http, authentication, data) {
    return $http.post('/api/blogs/', data, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
        
}
  
  function updateBlogById($http, authentication, id, data) {
    return $http.put('/api/blogs/' + id, data, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
  }
  
  function deleteBlogById($http, authentication, id) {
    return $http.delete('/api/blogs/' + id, { headers: { Authorization: 'Bearer ' + authentication.getToken() } })
        .then(function(response) {
            console.log("Delete request successful:", response);
            return response.data;
        })
        .catch(function(error) {
            console.error("Error deleting blog:", error);
            throw error;
        });
  }

  function getChat($http) {
    return $http.get('/api/chat');
  }

  function updateChat($http, authentication, data) {
    return $http.post('/api/chat', data, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
  }
  
  //Controllers
  app.controller('HomeController', function HomeController() {
    var vm = this;
    vm.pageHeader = {
        title: "MyBlog"
    };
  });
  
  app.controller('ListController', function ListController($http, authentication) {
    var vm = this;
    vm.pageHeader = {
        title: "Blog List"
    };
    vm.message = "Retrieving blogs";
    getAllBlogs($http)
        .then(function (response) {
            vm.blogs = response.data;
            console.log(response);
            vm.message = "";
        })
        .catch(function (error) {
            console.error("Error fetching blogs:", error);
            vm.message = "No blogs found. Click 'Add Blog' above to create one.";
        });

      vm.isAuthorized = function(userEmail) {
        if (authentication.isLoggedIn()) {
          var auth = authentication.currentUser().email;
          
          if (auth === userEmail) {
            return true;
          }
        }
        return false; 
      }
  });
  
  app.controller('AddController', [ '$http', '$location', 'authentication', function AddController($http, $location, authentication) {      
    var vm = this;
    vm.blog = {};
    vm.pageHeader = {
      title: 'Blog Add'
    };
    vm.message = "";
  
    vm.submit = function() {
      var data = vm.blog;
      data.title = userForm.title.value;
      data.text = userForm.text.value;
      data.userEmail = authentication.currentUser().email.toLowerCase();
      data.userName = capitalizeFirstLetterOfEachWord(authentication.currentUser().name);

      addBlog($http, authentication, data)
        .then(function(data) {
          $location.path('blogList');
        })
        , (function (e) {
          vm.message = "Could not add blog"
        });
    }
  }]);
  
  // Function to capitalize the first letter of each word
  function capitalizeFirstLetterOfEachWord(name) {
    return name.replace(/\b\w/g, function(match) {
      return match.toUpperCase();
    });
  }

  app.controller('EditController', [ '$http', '$routeParams', '$location', 'authentication', function EditController($http, $routeParams, $location, authentication) {
    var vm = this;
    vm.blog = {};
    vm.id = $routeParams.id;
    vm.pageHeader = {
      title: 'Blog Edit'
    };
    vm.message = "Getting Blog";
  
    getBlogById($http, vm.id)
      .then(function(data) {
        vm.blog = data.data;
        vm.message = "";
      })
      , (function (e) {
        vm.message = "Could not retrieve blog at ID " + vm.id;
      });
  
    vm.submit = function() {
      var data = vm.blog;
      data.title = userForm.title.value;
      data.text = userForm.text.value;
  
      updateBlogById($http, authentication, vm.id, data)
        .then(function(data) {
          vm.message = "";
          $location.path('blogList');
        })
        , (function (e) {
          vm.message = "Could not update blog at ID " + vm.id;
        });
    }
  }]);
  
  app.controller('DeleteController', [ '$http', '$routeParams', '$location', 'authentication', function DeleteController($http, $routeParams, $location, authentication) {
    var vm = this;
    vm.blog = {};
    vm.id = $routeParams.id;
    vm.pageHeader = {
      title: 'Blog Delete'
    };
    vm.message = "Getting Blog";
  
    getBlogById($http, vm.id)
    .then(function(data) {
      vm.blog = data.data;
      vm.message = "";
    })
    , (function (e) {
      vm.message = "Could not retrieve blog at ID " + vm.id;
    });
  
    vm.submit = function() {
      deleteBlogById($http, authentication, vm.id)
        .then(function(data) {
          $location.path('blogList');
        })
        , (function (e) {
          vm.message = "Could not delete blog"
        });
    }
  
    vm.cancel = function() {
      $location.path('blogList');
    }
    
  }]);

  app.controller('ChatController', ['$http', '$scope', '$interval', 'authentication', function ChatController($http, $scope, $interval, authentication) {
    var vm = this;
    
    vm.newMessage = ''; // Initialize newMessage to store the message being typed

    vm.isAuthorized = function(messageEmail) {
      var currentUser = authentication.currentUser();
      return currentUser && currentUser.email === messageEmail;
    };

    vm.pageHeader = {
      title: 'Chat'
    };

    vm.chat = []; 
    vm.isDeleting = false; 

    // Function to retrieve chat messages from the server
    function getChat() {
      $http.get('/api/chat')
        .then(function(response) {
          vm.chat = response.data; // Assign chat messages to vm.chat
        })
        .catch(function(error) {
          console.error("Error retrieving chat messages:", error);
        });
    }

    getChat();

    vm.handleKeyDown = function(event) {
      if (event.keyCode === 13) { // Check if the Enter key is pressed
        event.preventDefault(); // Prevent default form submission
        vm.submit(); // Call the submit method to send the message
      }
    };
    
  vm.submitInProgress = false;

vm.submit = function() {
  if (vm.submitInProgress) {
    return;
  }

  // Only post the message if it's not empty
  if (vm.newMessage.trim() !== '') {
    vm.submitInProgress = true; 

    var data = {
      chat: vm.newMessage,
      name: authentication.currentUser().name,
      email: authentication.currentUser().email
    };

    $http.post('/api/chat', data)
      .then(function(response) {
        getChat();
        vm.newMessage = ''; 
        vm.submitInProgress = false;
      })
  }
  document.getElementById('postField').focus();
};
    
vm.deleteMessage = function(messageId) {
  // Remove the message from the array immediately
  vm.chat = vm.chat.filter(function(message) {
      return message._id !== messageId;
  });

  // Then send the delete request to the server
  $http.delete('/api/chat/' + messageId)
      .then(function(response) {
        document.getElementById('postField').focus();
      })
      .catch(function(error) {
          console.error("Error deleting chat message:", error);
          getChat(); 
      });
};

  $interval(function() {
    getChat();
  }, 500);
}]);
