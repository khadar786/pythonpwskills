//Custom Test App
var API_URL = 'api/AdaptiveService.php';
var SERVICE_API_URL='api/Service.php';
var StudentDashboard = angular.module('StudentDashboardApp', ['ui.bootstrap', 'ngSanitize', 'angularUtils.directives.dirPagination']);
StudentDashboard.controller('StudentDashboardCtrl', function($scope, $http, $timeout) {
    //console.log('start');
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $scope.user_id = user_id;
    $scope.level = level;
    $scope.course_id = course_id;
    $scope.class_id = class_id;
    $scope.section_id = section_id.toString();
    $scope.MTests = [];
    $scope.subjects = [];
    $scope.classwork=[];
    $scope.homework=[];
    $scope.init_test = {};
    $scope.loader = true;
    $scope.result = {};

    $scope.LoadSubjects = function() {
        $scope.loader = true;
        var params = $.param({ "action": "subjects", "user_id": $scope.user_id, "course_id": $scope.course_id });
        $http({ method: 'POST', url: API_URL, data: params }).success(function(data, status, headers, config) {
            console.log(data);
            $scope.subjects = data.subjects;
            /*  $scope.homework = data.homework;*/
            //$scope.loader = false;

            $scope.getClassWorkList();
        }).error(function(response){
            $scope.loader=false;
        });
    }

    //Class Work
    $scope.getClassWorkList=function(){
        var params = $.param({"action":"dialyscheduler","user_id":$scope.user_id,"level":$scope.level});
        $http({method:'POST',url:SERVICE_API_URL,data:params})
        .success(function(data,status,headers,config){
            $scope.classwork=data.classwork;
            $scope.homework=data.homework;
            $scope.loader=false;
        }).error(function(response){
            $scope.loader=false;
        });
    }

    //Event Details
    $scope.startClass=function(eIndex){
        $scope.mindex=eIndex;
        $scope.result={};
        //console.log($scope.classwork[eIndex]);
        var params=$.param({"action":"event_details","user_id":$scope.user_id,"level":$scope.level,"cid":$scope.classwork[eIndex].event_details.cid});
        $http({method:'POST',url:SERVICE_API_URL,data:params}).success(function(response,status,headers,config){
            $scope.result=response.data;
            //console.log($scope.result);
            if($scope.result.comming_soon==false && $scope.result.is_running==true){
              $scope.classwork[$scope.mindex].event_details.comming_soon=$scope.result.comming_soon;
              $scope.classwork[$scope.mindex].event_details.is_exam=$scope.result.is_exam;
              $scope.classwork[$scope.mindex].event_details.is_metting=$scope.result.is_metting;
              $scope.classwork[$scope.mindex].event_details.is_running=$scope.result.is_running;
              $scope.classwork[$scope.mindex].event_details.show_block=$scope.result.show_block;
              $scope.goToLiveClass($scope.mindex);
            }else{
              $scope.showEventAlert();
            }
        });
    }

    //Go to Live Class
    $scope.goToLiveClass=function(eIndex){
        var data=$scope.classwork[eIndex].event_details;
        var form = document.createElement("form");
        form.action="join-live-class";
        form.method="POST";
        form.target="_self";
        for(var key in data){
          //console.log(key+"=="+data[key]);
          var input = document.createElement("textarea");
          input.name = key;
          input.value = typeof data[key] === "object" ? JSON.stringify(data[key]):data[key];
          form.appendChild(input);
        }
        
        form.style.display = 'none';
        document.body.appendChild(form);
        form.submit();
    }

    //Show Alert
    $scope.showEventAlert=function(){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please wait class not started yet.',
          footer: ''
        })
    }

    $scope.LoadSubjects();
});