var API_URL = site_url + 'api/erp_api.php';
var Dashboard = angular.module('SubjectDashboardApp', ['ui.bootstrap', 'ngSanitize', 'angularUtils.directives.dirPagination']);
Dashboard.controller('SubjectDashboardCtrl', function($scope, $http, $timeout) {
    console.log('start');
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $scope.user_id = user_id;
    $scope.level = level;
    $scope.course_id = course_id;
    $scope.class_id = class_id;
    $scope.section_id = section_id.toString();

    $scope.subject_id = subject_id;
    $scope.MTests = [];
    $scope.subjects = [];
    $scope.homework = [];
    $scope.init_test = {};
    $scope.loader = true;
    $scope.result = {};
    $scope.modelchapterdata = {};

    $scope.student_adaptive_subject = subject_id;

    $scope.getAdaptiveSubjectwiseData = function() {
        var params = $.param({ "action": "olypiad_practice_subjectwise_data", "userid": $scope.user_id, "subject_id": $scope.subject_id, "course_id": $scope.course_id, "class_id": $scope.class_id });
        $http({ method: 'POST', url: API_URL, data: params }).success(function(data, status, headers, config) {
            $scope.subject_data = data.data;
            //$scope.LoadChapters();
        });
    }
    $scope.getStudentAdaptiveData = function() {
        var params = $.param({ "action": "student_olypiad_practice_data", "userid": $scope.user_id, "subject_id": $scope.subject_id, "course_id": $scope.course_id, "class_id": $scope.class_id });
        $http({ method: 'POST', url: API_URL, data: params }).success(function(data, status, headers, config) {
            $scope.chapters_data = data.data;
            //$scope.LoadChapters();
        });
    }

    $scope.LoadChapters = function() {
        $scope.loader = true;
        var params = $.param({ "action": "chapters", "user_id": $scope.user_id, "subject_id": $scope.subject_id, "course_id": $scope.course_id, "class_id": $scope.class_id, "start_from": 0,"view_source":"web" });
        $http({ method: 'POST', url: API_URL, data: params }).success(function(data, status, headers, config) {
            console.log(data);
            $scope.chapters = data.chapters;
            $scope.loader = false;
        });
    }
    $scope.loadSubjectChapter = function() {
    	$scope.subject_id = $scope.student_adaptive_subject;
    	$scope.getStudentAdaptiveData();
		$scope.getAdaptiveSubjectwiseData();
    }

    $scope.GetRowIndex = function(ind){
    	console.log(ind);
    	console.log($scope.chapters_data[ind]);

    	$scope.modelchapterdata = $scope.chapters_data[ind];
    }

    $scope.getStudentAdaptiveData();
    $scope.getAdaptiveSubjectwiseData();

});