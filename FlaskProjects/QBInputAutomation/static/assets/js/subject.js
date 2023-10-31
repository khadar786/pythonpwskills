//Custom Test App
var API_URL = site_url + 'api/AdaptiveService.php';
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

    $scope.getSubjectDetails = function() {
        var params = $.param({ "action": "subjectinfo", "user_id": $scope.user_id, "subject_id": $scope.subject_id, "course_id": $scope.course_id, "class_id": $scope.class_id });
        $http({ method: 'POST', url: API_URL, data: params }).success(function(data, status, headers, config) {
            $scope.subject = data.subjectinfo;
            $scope.chapters_count = data.chapter_count;
            $scope.topics_count = data.topics_count;
            $scope.subject_id = $scope.subject["subject_id"];
            $scope.LoadChapters();
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

    $scope.formatToRound = function(value){
        var RoundOut = Math.round(value*100)/100;    
          return RoundOut;
    };
    
    $scope.getSubjectDetails();

});