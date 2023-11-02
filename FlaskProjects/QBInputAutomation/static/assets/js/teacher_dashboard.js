//Custom Test App
var API_URL='api/Service.php';
var TeacherDashboard= angular.module('TeacherDashboardApp',['ui.bootstrap','ngSanitize','angularUtils.directives.dirPagination']);
TeacherDashboard.controller('TeacherDashboardCtrl',function($scope,$http,$timeout){
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	$scope.user_id=user_id;
	$scope.level=level;
	$scope.mls_id = mls_id;
    $scope.course_id=course_id;
    $scope.subject_id=subject_id;
    $scope.class_id=class_id;
	$scope.campus_id=campus_id;
	$scope.section_id=section_id.toString();
	$scope.MTests=[];
	$scope.classwork=[];
	$scope.homework=[];
	$scope.init_test={};
	$scope.loader=false;
	$scope.result={};
	$scope.LoadCourses = function() {
        $scope.loader = true;
        var params = $.param({ "action": "teacher_subjects", "user_id": $scope.user_id});
        $http({ method: 'POST', url: API_URL, data: params }).success(function(data, status, headers, config) {
            console.log(data);
            $scope.ts_courses = data.mls_subjects;
            $scope.mls_id = $scope.ts_courses[0].mls_id;
            $scope.course_id = $scope.ts_courses[0].course_id;
            $scope.subject_id = $scope.ts_courses[0].subject_id;
            $scope.class_id = $scope.ts_courses[0].class_id;
            $scope.section_id = $scope.ts_courses[0].section_ids.toString();
	        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
	            $scope.$apply();
	    	}
            $scope.LoadMockTests();
        }).error(function(response){
            $scope.loader=false;
        });
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
    	}
    }
    $scope.update_page = function(mls_id) {
        $scope.loader = true;
        console.log(mls_id);
        var params = $.param({  "mls_id":mls_id,"user_id": $scope.user_id});
        $http({ method: 'POST', url: "change_mentor_current_course_status.php", data: params }).success(function(data, status, headers, config) {
            console.log(data);
            $scope.mls_id = data.mls_id;
            $scope.course_id = data.course_id;
            $scope.subject_id = data.subject_id;
            $scope.class_id = data.class_id;
            $scope.section_id = data.section_ids.toString();
            $scope.LoadMockTests();
        }).error(function(response){
            $scope.loader=false;
        });
        
    }
	//Exams
	$scope.LoadMockTests=function(){
		$scope.loader=true;
		$http.get("load_custom_tests_list_mentor.php?course_id="+$scope.course_id+"&subject_id="+$scope.subject_id+"&class_id="+$scope.class_id).then(function (response) {
			$scope.MTests=response.data;
			$scope.getClassWorkList();
		});
	};

	//Class Work
	$scope.getClassWorkList=function(){
		var params = $.param({"action":"dialyscheduler","user_id":$scope.user_id,"level":$scope.level,"campus_id":$scope.campus_id});
		$http({method:'POST',url:API_URL,data:params}).success(function(data,status,headers,config){
			$scope.classwork=data.classwork;
			$scope.homework=data.homework;
			$scope.loader=false;
		});
	}

	//Event Details
	$scope.startClass=function(eIndex){
		$scope.mindex=eIndex;
		$scope.result={};
		//console.log($scope.classwork[eIndex]);
		var params=$.param({"action":"event_details","user_id":$scope.user_id,"level":$scope.level,"cid":$scope.classwork[eIndex].event_details.cid});
		$http({method:'POST',url:API_URL,data:params}).success(function(response,status,headers,config){
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
		form.action="teacher-live-class";
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