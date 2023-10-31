var LiveClass;
var API_URL='api/meetings_new.php';
var meeting_url='';
var meeting_id='';
var message='';
var meeting_info={};
var end_met_info={};
var is_met_running='';
var end_meet_status='';
(function($) {
	LiveClass={
		 startClass:function() {
		 	 console.log('######');
			 var params={
		      'calenderid':cid,
		      'tid':user_id,
		      'level':level,
		      'class_id':class_id,
		      'section_id':section_id,
		      'stream_id':stream_id,
		      'subject_id':subject_id,
		      'action':'create'
		    };
			  //START CLASS
			  jQuery.post(API_URL,params).done(function(data) {
			    	  var meeting_info=data;
					  is_met_running=meeting_info.data.is_running;
				      error=meeting_info.error;
				      msg=meeting_info.message;
				      meeting_url=meeting_info.data.meeting_url;
				      meeting_id=meeting_info.data.meeting_id;
				      message=meeting_info.data.message;
				      event_details=meeting_info.data.event;
				      $('#metting').attr('src',meeting_url);
			  });
		}
	};
	$(document).ready(function($){ 
		LiveClass.startClass();
	});
})(jQuery);
//Custom Test App
/*var API_URL='api/meetings_new.php';
var TeacherLiveClass= angular.module('TeacherLiveClassApp',['ui.bootstrap','ngSanitize','angularUtils.directives.dirPagination']);

TeacherLiveClass.controller('TeacherLiveClassCtrl',function($scope,$http,$timeout){
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	$scope.loader=false;
	$scope.cid=cid;
	$scope.is_exam=is_exam;
	$scope.is_metting=is_metting;
	$scope.is_running=is_running;
	$scope.class_id=class_id;
	$scope.section_id=section_id;
	$scope.stream_id=stream_id;
	$scope.subject_id=subject_id;
	$scope.teacher_id=teacher_id;
	$scope.user_id=user_id;
	$scope.level=level;
	$scope.meeting_url='';
	$scope.meeting_id='';
	$scope.message='';
	$scope.meeting_info={};
	$scope.end_met_info={};
	$scope.is_met_running='';
	$scope.end_meet_status='';

	//START CLASS
    $scope.startClass=function(){
    	$scope.loader=true;
	    var params=$.param({
	      'calenderid':$scope.cid,
	      'tid':$scope.user_id,
	      'level':$scope.level,
	      'class_id':$scope.class_id,
	      'section_id':$scope.section_id,
	      'stream_id':$scope.stream_id,
	      'subject_id':$scope.subject_id,
	      'action':'create'
	    });

	    $http({method:'POST',url:API_URL,data:params}).success(function(response,status,headers,config){
			  $scope.meeting_info=response;
			  console.log($scope.meeting_info);
			  $scope.is_met_running=$scope.meeting_info.data.is_running;
		      $scope.error=$scope.meeting_info.error;
		      $scope.msg=$scope.meeting_info.message;
		      $scope.meeting_url=$scope.meeting_info.data.meeting_url;
		      $scope.meeting_id=$scope.meeting_info.data.meeting_id;
		      $scope.message=$scope.meeting_info.data.message;
		      $scope.event_details=$scope.meeting_info.data.event;
		      $scope.loader=false;
		});
    }

    //END CLASS
	$scope.endMeting=function(){
		$scope.loader=true;
		var params=$.param({
	      'action':'end_meet',
	      'tid':$scope.user_id,
	      'meetingID':$scope.meeting_id,
	      'calenderid':$scope.cid
	    });
	    $http({method:'POST',url:API_URL,data:params}).success(function(response,status,headers,config){
	    	$scope.end_met_info=response;
			$scope.end_meet_status=$scope.end_met_info.data.end_meet_status;
		    $scope.error=$scope.end_met_info.error;
		    $scope.msg=$scope.end_met_info.message;
		    $scope.loader=false;
		    if($scope.end_meet_status){
		    	window.location.replace("teacher-dashboard");
		    }
	    });
	}

	$scope.trustSrc=function(src) {
    	return $sce.trustAsResourceUrl(src);
  	}

    //$scope.startClass();
});*/