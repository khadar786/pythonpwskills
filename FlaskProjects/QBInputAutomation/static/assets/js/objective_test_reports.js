var app=angular.module('ObjectiveTestReportApp', ['ngSanitize','ui.bootstrap','angularUtils.directives.dirPagination']);
app.controller('ObjectiveTestReportCtrl',function($scope,$http,$timeout,$compile,$sce){
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	$scope.OTR_API='api/Objective_test_reports.php';
	$scope.SAPI='api/Service.php';
	$scope.courses=[];
	$scope.classes=[];
	$scope.sections=[];
	$scope.alltests=[];
	$scope.testdata=[];
	$scope.course_id="";
	$scope.class_id="";
	$scope.section_id="";
	$scope.test_id="";

	$scope.pagination = {
       current: 1
    };
	$scope.totalItems = 0;
	$scope.is_service_inprogress=true;
	$scope.loader=false;
	$scope.init=function(){
		$scope.loader=true;
		var params=$.param({"action":"courses"});
		$http({method:'POST',url:$scope.OTR_API,data:params}).success(function(data,status,headers,config){
			$scope.courses=data.courses;
			//$scope.classes=data.classes;

			if($scope.courses.length>0){
				$scope.course_id=$scope.courses[0].course_id;
				$scope.loadClasses();
			}

			/*if($scope.classes.length>0){
				$scope.class_id=$scope.classes[0].class_id;
				$scope.loadSections();
			}

			if($scope.courses.length==0 || $scope.classes.length==0){
				$scope.resetList();
			}*/

			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            	$scope.$apply();
        	}

			//$scope.loader=false;		
		}).error(function(data,status,headers,config) {
			$scope.resetList();
		});
	}
	//Sections
	$scope.loadClasses=function(){
		var params=$.param({"action":"classes",course_id:$scope.course_id});
		$http({method:'POST',url:$scope.OTR_API,data:params}).success(function(data,status,headers,config){
			$scope.classes=data.classes;
			console.log($scope.classes);
			if($scope.classes.length>0){
				$scope.class_id=$scope.classes[0].class_id;
				$scope.loadSections();
			}else{
				$scope.resetList();
			}

			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            	$scope.$apply();
        	}
		}).error(function(data,status,headers,config) {
			$scope.resetList();
		});
	}

	//Sections
	$scope.loadSections=function(){
		var params=$.param({"action":"sections",class_id:$scope.class_id});
		$http({method:'POST',url:$scope.OTR_API,data:params}).success(function(data,status,headers,config){
			$scope.sections=data.sections;

			if($scope.sections.length>0){
				$scope.LoadAllTests();
			}else{
				$scope.resetList();
			}

			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            	$scope.$apply();
        	}
		}).error(function(data,status,headers,config) {
			$scope.resetList();
		});
	}

	//Load All Tests
	$scope.LoadAllTests=function(){
		var params=$.param({"action":"testlist",course_id:$scope.course_id,class_id:$scope.class_id,section_id:$scope.section_id});
		$http({method:'POST',url:$scope.OTR_API,data:params}).success(function(data,status,headers,config){
			$scope.alltests=data.alltests;
			if($scope.alltests.length>0){
				$scope.LoadMockTests(1);
			}else{
				$scope.resetList();
			}
		}).error(function(data,status,headers,config) {
			$scope.resetList();
		});
		
	}

	//Load Mock Tests
	$scope.LoadMockTests=function(pageNumber){
		var params=$.param({"action":"testdata",course_id:$scope.course_id,class_id:$scope.class_id,section_id:$scope.section_id,test_id:$scope.test_id,pageNumber:pageNumber,pagesize:$scope.rpt_limit});
		$http({method:'POST',url:$scope.OTR_API,data:params}).success(function(data,status,headers,config){
			$scope.testdata=data.testdata;
			$scope.Start=parseInt(data.Start);
			$scope.totalItems=data.Total;
			$scope.pagination.current=pageNumber;
			$scope.is_service_inprogress=false;
			$scope.loader=false;
			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
    		}
		}).error(function(data,status,headers,config) {
			$scope.resetList();
		});
	}

	//pagination
    $scope.changeCTests=function(pageNumber){
    	$scope.LoadMockTests(pageNumber);
    };

    //begin:Filters
    $scope.getSelectedTest = function(){
		$scope.LoadMockTests(1);
	}

    $scope.LoadCourse=function()
	{
		$scope.loader=true;
		$scope.section_id='';
		$scope.test_id='';
		//$scope.LoadAllTests();
		$scope.loadClasses();
	};

	$scope.OnchangeClass=function()
	{
		$scope.loader=true;
		$scope.section_id='';
		$scope.test_id='';
		$scope.loadSections();
	}

	$scope.OnchangeClassSection=function()
	{	
		$scope.loader=true;
		//$scope.section_id='';
		$scope.test_id='';
		$scope.LoadMockTests(1);
	}

	//end:Filters

	$scope.resetList=function(){
		$scope.testdata=[];
		$scope.totalItems=0;
		$scope.pagination.current=1;
		$scope.is_service_inprogress=false;
		$scope.loader=false;
	}

	$scope.formatToRound = function(value){
		var RoundOut = Math.round(value*100)/100;	
		  return RoundOut;
	};

	$scope.init();
});
