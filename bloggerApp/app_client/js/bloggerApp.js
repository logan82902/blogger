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
  
      .otherwise({redirectTo: '/'});
  });
  
  //REST API functions
  function getAllBlogs($http) {
    return $http.get('/api/blogs');
  }
  
  function getBlogById($http, id) {
    return $http.get('/api/blogs/' + id);
  }
  
  function addBlog($http, data) {
    return $http.post('/api/blogs/', data);
        
}
  
  function updateBlogById($http, id, data) {
    return $http.put('/api/blogs/' + id, data);
  }
  
  function deleteBlogById($http, id) {
    return $http.delete('/api/blogs/' + id);
  }
  
  //Controllers
  app.controller('HomeController', function HomeController() {
    var vm = this;
    vm.pageHeader = {
        title: "Logan's Blog App"
    };
    vm.message = "Welcome. Click 'Add Blog' above to add a new blog, or click 'List Blogs' to view and manage all of your current blogs.";
  });
  
  app.controller('ListController', function ListController($http) {
    var vm = this;
    vm.pageHeader = {
        title: "Blog List"
    };
    vm.message = "Retrieving blogs";
    getAllBlogs($http)
        .then(function (response) {
            vm.blogs = response.data;
            vm.message = "";
        })
        .catch(function (error) {
            console.error("Error fetching blogs:", error);
            vm.message = "No blogs found. Click 'Add Blog' above to create one.";
        });
  });
  
  app.controller('AddController', ['$http', '$location', function AddController($http, $location) {
    var vm = this;
    vm.blog = {};
    vm.pageHeader = {
        title: 'Blog Add'
    };
    vm.message = "";

    vm.submit = function () {
        var data = {
            title: vm.blog.title,
            text: vm.blog.text
        };

        addBlog($http, data)
            .then(function (addedBlog) {
                vm.blog = {};

                getAllBlogs($http)
                    .then(function (response) {
                        vm.blogs = response.data;
                        vm.message = "";
                        $location.path('blogList');
                    })
                    .catch(function (error) {
                        console.error("Error fetching blogs:", error);
                        vm.message = "Could not get blogs";
                    });
            })
            .catch(function (error) {
                console.error("Error adding blog:", error);
                vm.message = "Could not add blog";
            });
    };
}]);

  
  app.controller('EditController', [ '$http', '$routeParams', '$location', function EditController($http, $routeParams, $location) {
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
  
      updateBlogById($http, vm.id, data)
        .then(function(data) {
          vm.message = "";
          $location.path('blogList');
        })
        , (function (e) {
          vm.message = "Could not update blog at ID " + vm.id;
        });
    }
  }]);
  
  app.controller('DeleteController', [ '$http', '$routeParams', '$location', function DeleteController($http, $routeParams, $location) {
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
      deleteBlogById($http, vm.id)
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