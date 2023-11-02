var app=angular.module('ResourceApp', ['ngSanitize','ui.bootstrap','angularUtils.directives.dirPagination']);
app.controller('ResourceCtrl',function($scope,$http,$timeout,$compile,$sce){
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	$scope.SAPI='api/Service.php';
	$scope.RAPI='api/Resource.php';
	$scope.ERPAPI='api/erp_api.php';
	$scope.subject_id=subject_id;
	$scope.class_id=class_id;
	$scope.chapter_id="";
	$scope.chapters=[];
	$scope.chapter_cnt=0;
	$scope.topics=[];
	$scope.topic_cnt=0;
	$scope.perpage=20;
	$scope.start_from=0;
	$scope.init_chapter={};
	$scope.loader=null;
	$scope.load_data=null;
	$scope.loadmore=false;
	$scope.loadbtn=false;

	/*$scope.getChapterList=function(){
		$scope.loader=true;
		$scope.load_data=true;
		var params=$.param({"action":"getchapterwithsub","subject_id":$scope.subject_id,"class_id":$scope.class_id});
		$http({method:'POST',url:$scope.ERPAPI,data:params}).success(function(data,status,headers,config){
			$scope.chapters=data.data;
			if($scope.chapters.length>0){
				$scope.init_chapter=$scope.chapters[0];
				$scope.chapter_id=$scope.init_chapter.chapter_id;
				$scope.getTopics();
			}else{
				$scope.loader=false;
				$scope.chapters=[];
			}
		}).error(function(data,status,headers,config) {
			$scope.loader=false;
		});
	}*/

	$scope.getChapterList=function(){
		$scope.loader=true;
		$scope.load_data=true;
		$scope.loadbtn=true;
		var params=$.param({"action":"getchapterwithsub","subject_id":$scope.subject_id,"class_id":$scope.class_id,"start_from":$scope.start_from,"perpage":$scope.perpage});
		$http({method:'POST',url:$scope.RAPI,data:params}).success(function(data,status,headers,config){
			angular.forEach(data.chapters,function (value, key) { 
                $scope.chapters.push(value); 
            });
			$scope.chapter_cnt=data.chapter_cnt;
			$scope.start_from=$scope.chapters.length;
			
			if($scope.chapters.length==$scope.chapter_cnt){
				$scope.loadmore=false;
			}else{
				$scope.loadmore=true;
			}

			$scope.loader=false;
			$scope.loadbtn=false;
			$scope.load_data=false;
		}).error(function(data,status,headers,config) {
			$scope.loader=false;
			$scope.loadbtn=false;
		});
	}

	/*$scope.getTopics=function(){
		$scope.loadbtn=true;
		var params=$.param({"action":"chapter_topics","chapter_id":$scope.chapter_id,"start_from":$scope.start_from,"perpage":$scope.perpage});
		$http({method:'POST',url:$scope.RAPI,data:params}).success(function(data,status,headers,config){
			angular.forEach(data.topics,function (value, key) { 
                $scope.topics.push(value); 
            });
			$scope.topic_cnt=data.topic_cnt;
			$scope.start_from=$scope.topics.length;
			
			if($scope.topics.length==$scope.topic_cnt){
				$scope.loadmore=false;
			}else{
				$scope.loadmore=true;
			}

			$scope.loader=false;
			$scope.loadbtn=false;
			$scope.load_data=false;
		}).error(function(data,status,headers,config) {
			$scope.loader=false;
			$scope.loadbtn=false;
		});
	}*/

	$scope.onChangeSubjectAndClass=function(){
		$scope.topics=[];
		$scope.chapters=[];
		$scope.init_chapter={};
		$scope.loadmore=false;
		$scope.loadbtn=false;
		$scope.topic_cnt=0;
		$scope.start_from=0;
		$scope.load_data=null;
		$scope.loader=true;
		$scope.getChapterList();
	}

	/*$scope.onChangeChapter=function(){
		$scope.topics=[];
		$scope.loadmore=false;
		$scope.loadbtn=false;
		$scope.topic_cnt=0;
		$scope.start_from=0;
		$scope.load_data=null;
		$scope.loader=true;
		$scope.getTopics();
	}*/

	$scope.loadMore=function(){
		$scope.loader=true;
		//$scope.getTopics();
		$scope.getChapterList();
	}

	//Init
	$scope.getChapterList();
});