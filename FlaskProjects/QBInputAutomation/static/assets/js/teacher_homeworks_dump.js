var app=angular.module('myApp', ['ui.bootstrap','angularUtils.directives.dirPagination']);
app.controller('HomeworkCtrl',function($scope,$http,$timeout){
	//console.log('###');
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	$scope.tests=[];
	$scope.students=[];

	$scope.init=function(){

	},

	//Mark
	$scope.doMark=function(){
		
	}
});