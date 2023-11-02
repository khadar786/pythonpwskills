//Custom Test App
var API_URL = 'api/AdaptiveService.php';
var SERVICE_API_URL='api/Service.php';
var StudentDashboard = angular.module('StudentDashboardApp', ['ui.bootstrap', 'sun.scrollable','ngSanitize', 'angularUtils.directives.dirPagination']);
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

    /*$scope.LoadSubjects = function() {
        $scope.loader = true;
        var params = $.param({ "action": "subjects", "user_id": $scope.user_id, "course_id": $scope.course_id });
        $http({ method: 'POST', url: API_URL, data: params }).success(function(data, status, headers, config) {
            $scope.subjects = data.subjects;
            $scope.getExams($scope.course_id,$scope.user_id);
        }).error(function(response){
            $scope.loader=false;
        });
    }*/
    $scope.LoadSubjects = function() {
        $scope.loader = true;
        var params = $.param({ "action": "subjectsNew", "user_id": $scope.user_id, "course_id": $scope.course_id,"class_id":$scope.class_id  });
        $http({ method: 'POST', url: API_URL, data: params }).success(function(data, status, headers, config) {
            $scope.loader = false;
            $scope.subjects = data.subjects;
            $scope.getExams($scope.course_id,$scope.user_id);
        }).error(function(response){
            $scope.loader=false;
        });
    }

    $scope.LoadCourses = function() {
        $scope.loader = true;
        var params = $.param({ "action": "studentcourses", "user_id": $scope.user_id});
        $http({ method: 'POST', url: SERVICE_API_URL, data: params }).success(function(data, status, headers, config) {
            //console.log(data);
            $scope.st_courses = data.courses;
            if($scope.st_courses.length>0){
                $scope.course_id = $scope.st_courses[0].course_id;
                $scope.LoadSubjects();
            }
            //console.log($scope.course_id);
            /*  $scope.homework = data.homework;*/
            $scope.loader = false;
            
        }).error(function(response){
            $scope.loader=false;
        });
    }
    $scope.update_page = function(course_id) {
        $scope.loader = true;
        $scope.course_id = course_id;
        var params = $.param({  "course_id":course_id});
        $http({ method: 'POST', url: "change_current_course_status.php", data: params }).success(function(data, status, headers, config) {
            //console.log(data);
            //console.log($scope.course_id);
            /*  $scope.homework = data.homework;*/
            $scope.loader = false;
            $('#course_name').html($('#course_id :selected').text());
            $scope.LoadSubjects();
            //$scope.getClassWorkList();
            $scope.getExams($scope.course_id,$scope.user_id);
        }).error(function(response){
            $scope.loader=false;
        });
    }

    /*$scope.LoadSubjects = function() {
        $scope.loader = true;
        var params = $.param({ "action": "subjects", "user_id": $scope.user_id, "course_id": $scope.course_id });
        $http({ method: 'POST', url: API_URL, data: params }).success(function(data, status, headers, config) {
            console.log(data);
            $scope.subjects = data.subjects;
            //$scope.loader = false;
            //$scope.getClassWorkList();
            //$scope.getExams($scope.course_id,$scope.user_id);
        }).error(function(response){
            $scope.loader=false;
        });
    }*/

    $scope.getExams = function(course_id,user_id){
        if(course_id == 5686){
          var action = "jee_adv_exams"; 
        }else{
          var action = "exams"; 
        }
        var params = $.param({"action":action,"user_id":$scope.user_id,"level":$scope.level,"class_id": $scope.class_id,"course_id": $scope.course_id,"section_id":$scope.section_id});
        $http({method:'POST',url:SERVICE_API_URL,data:params})
        .success(function(data,status,headers,config){
            $scope.MTests=data.exams;
            //console.log($scope.MTests);
            //$scope.getClassWorkList();
        }).error(function(response){
            $scope.loader=false;
        });
    }
    $scope.TakeMyTest = function(index){
        if($scope.course_id == 5686){
        var test_page = "jadv-taketest"; 
      }else{
        var test_page = "taketest"; 
      }

      if($scope.user_id==34){
      	var test_page = "taketest-new";
      }

        $scope.TestInfo = $scope.MTests[index];
        console.log($scope.TestInfo);
        var obj = { "id":parseInt($scope.TestInfo.id),"title":$scope.TestInfo.title, "questionType":"S","testSize":$scope.TestInfo.testSize,"testTime":$scope.TestInfo.testTime,"marks_per_question":$scope.TestInfo.marks_per_question,"for_total_score":$scope.TestInfo.for_total_score,"common_paper":$scope.TestInfo.common_paper,"negativeMarks":$scope.TestInfo.negativeMarks,"categories":$scope.TestInfo.categories,"course_id":$scope.TestInfo.course_id,"is_jee_new_pattern":$scope.TestInfo.is_jee_new_pattern,"is_neet_new_pattern":$scope.TestInfo.is_neet_new_pattern,"nav_tab_visibility":$scope.TestInfo.nav_tab_visibility,'source_type':$scope.TestInfo.source_type,'UserTestPause':$scope.TestInfo.UserTestPause,'test_remaing_duration':$scope.TestInfo.test_remaing_duration,'end_date':$scope.TestInfo.end_date,'start_date':$scope.TestInfo.start_date,'subject_id':$scope.TestInfo.subject_id,'test_mode':$scope.TestInfo.test_mode};
            var config = {data:(JSON.stringify(obj))};
            console.log(config);
            open('POST', test_page, config , '_self');
    }
    //Class Work
    $scope.getClassWorkList=function(){
        var params = $.param({"action":"dialyscheduler","user_id":$scope.user_id,"level":$scope.level,campus_id:campus_id});
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

    $scope.LoadCourses();

});
jQuery(document).ready(function(){
    open = function(verb, url, data, target) {
      var form = document.createElement("form");
      form.action = url;
      form.method = verb;
      form.target = target || "_self";
      if (data) {
        for (var key in data) {
          var input = document.createElement("textarea");
          input.name = key;
          input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
          form.appendChild(input);
        }
      }
      form.style.display = 'none';
      document.body.appendChild(form);
      form.submit();
    };
});