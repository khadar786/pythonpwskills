var chart_data = [],chart_type = "MT";
var app = angular.module('myApp', ['myApp.Controllers','ui.bootstrap','angularUtils.directives.dirPagination']);
angular.module("myApp.Controllers",[]).controller('MentorTestCtrl',function($scope,$http,$filter,$timeout){
	$scope.course_id=course_id;
	$scope.subject_id=subject_id;
	$scope.user_id=user_id;
	//Heatmap
	$scope.pagination = {
		current: 1
	};

	$scope.advt_pagination = {
		current: 1
	};

	$scope.tabloader=true;
	$scope.advt_tabloader=true;
	$scope.totalItems = 0;
	$scope.advt_totalItems = 0;
	$scope.adtv_limit=10;
	$scope.loader=true;

	$http.get("load_courses_custom_data_mentor.php").then(function (response) {
		$scope.PCSCourses = response.data;
		$scope.current_course = $scope.PCSCourses[0]; //set first course as current course
		console.log($scope.current_course);
		$scope.course_id_index = 0;
		$scope.course_id = $scope.current_course.id;
		$scope.adaptive_actions = $scope.current_course.adaptive_actions;
		$scope.is_olympiad = $scope.current_course.is_olympiad;
		$scope.subject_id =$scope.current_course.subject_id;
		$scope.mentor_classes = $scope.current_course.class_id;
		$scope.LoadClassWiseData(0);
			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
	            $scope.$apply();
	        }
		});

	/*$scope.loadAllClasses=function(){
		$scope.loader=true;
		$http.get("mentor_load_all_classes.php")
		.then(function (response) {
			$scope.MentorClasses = response.data;
			//console.log($scope.MentorClasses[0]);
			$scope.mentor_classes=$scope.MentorClasses[0].class_id;
			$timeout(function() {
				$scope.LoadClassWiseData($scope.mentor_classes);
			}, 1000);
		});
	}*/

	$scope.LoadClassWiseData=function(index){
		$scope.loader=true;
		$scope.current_course = $scope.PCSCourses[index]; //set first course as current course
		console.log($scope.current_course);
		$scope.course_id_index = index;
		$scope.course_id = $scope.current_course.id;
		$scope.adaptive_actions = $scope.current_course.adaptive_actions;
		$scope.is_olympiad = $scope.current_course.is_olympiad;
		$scope.subject_id =$scope.current_course.subject_id;
		$scope.mentor_classes = $scope.current_course.class_id;
		$scope.loadCourseSections();
		//$scope.loadPracticeTestsScores(0);
		//$scope.loadPracticeTests_HeatmapNew(1);
		//$scope.getChapters();
	};

	$scope.loadCourseSections=function(){
		$http.get("load_course_sections_mentor.php?course_id="+$scope.course_id+"&class_id="+$scope.mentor_classes+"&user_id="+$scope.user_id)
		.then(function (response) {
			$scope.mentor_sections = 0;
			$scope.MentorSections = response.data;
			$scope.getChapters();
		}
		);
	}

	$scope.getChapters = function(){
		$http.get("load_mentor_adtv_chapters.php?subject_id="+$scope.subject_id+"&user_id="+$scope.user_id+"&class_id="+$scope.mentor_classes+"&section_id="+$scope.mentor_sections+"&course_id="+$scope.course_id)
		.then(function(response){
			$scope.psubject_chapters = response.data;
			if($scope.psubject_chapters.length>0){
				$scope.adtv_chapter = $scope.psubject_chapters[0].id;
			}
			//$scope.getTopics($scope.adtv_chapter);
			$scope.loadAdtvTests_HeatmapNew(1);
		}
		);
	}

	$scope.loadAdtvTests_HeatmapNew=function(pageNumber){
		$scope.adtv_topic_name = $( "#adtv_topic option:selected" ).text();

		if($scope.is_olympiad == 1){
			var service_url = "load_mentor_adtv_chapters_olympiad.php";
		}else{
			var service_url = "load_mentor_adtv_chapters_new.php";
		}
		//console.log($scope.mentor_sections);
		$http.get(service_url+"?subject_id="+$scope.subject_id+"&user_id="+user_id+"&class_id="+$scope.mentor_classes+"&section_id="+$scope.mentor_sections+"&course_id="+$scope.course_id+"&chapter_id="+$scope.adtv_chapter+'&page='+pageNumber+'&pagesize='+$scope.adtv_limit)
		.then(function (response) {
			$scope.AdvtPcTestsHeatmap = response.data.Students;
			$scope.advt_Start = parseInt(response.data.Start);
			$scope.advt_totalItems=response.data.total;
			$scope.advt_pagination.current=pageNumber;
			$scope.loader=false;
			$timeout(function() {
				$scope.heatmap("pc_data")
			}, 1000);

			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
				$scope.$apply();
			}
		});
	}

	$scope.changeAPTestsHeatmap=function(page){
		$scope.loader=true;
		$scope.loadAdtvTests_HeatmapNew(page);
	};

	$scope.LoadSectionWiseData=function(section_id){
		$scope.loader=true;
		$scope.loadAdtvTests_HeatmapNew(1);
	}

	$scope.getTopics = function(adtv_chapter){
		$scope.loader=true;
		$http.get("load_mentor_adtv_topics.php?chapter_id="+adtv_chapter)
		.then(function (response) {
			$scope.pchapter_topics = response.data;
			if($scope.pchapter_topics.length>0){
				$scope.adtv_topic = $scope.pchapter_topics[0].id;
				$scope.adtv_topic_name = $scope.pchapter_topics[0].category;
			}
			$scope.loadAdtvTests_HeatmapNew(1);
		}
		);
	}

	$scope.showAdvtPop = function(index){
		//console.log(index);
		$("#myModalLabel").text($scope.AdvtPcTestsHeatmap[index].StudentName);
		$scope.current_topic_details = $scope.AdvtPcTestsHeatmap[index].details;
        $('#StudentAdvtModal').modal('show');
        /*$('#StudentAdvtModal').modal({show:true});
		$('#StudentAdvtModal').on('show.bs.modal', function () {
			setTimeout(function(){
				$('#StudentAdvtModal').removeClass('in');
			},1000);
		});*/
	}

	$scope.formatToRound = function(value){
		var RoundOut = Math.round(value*100)/100;	
		  return RoundOut;
	};

	$scope.heatmap = function(tableid){
		$("."+tableid+" td").hottie({colorArray : ["#FBC5C5","#ADFAAB"], readValue : function(e) { return $(e).attr("data-hist");}});
	};

	//$scope.loadAllClasses();
});