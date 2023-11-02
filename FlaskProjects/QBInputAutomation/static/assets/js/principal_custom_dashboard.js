var googlecharts_ready = false;
google.charts.load('current', {'packages':['corechart', 'bar'],'callback':drawcharts});

var app=angular.module('PCDashboardApp', ['ngSanitize','ui.bootstrap','angularUtils.directives.dirPagination']);
app.controller('PCDashboardCtrl',function($scope,$http,$timeout,$compile,$sce){
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	$scope.OTR_API='api/Objective_test_reports.php';
	$scope.SAPI='api/Service.php';
	$scope.courses=[];
	$scope.classes=[];
	$scope.sections=[];
	$scope.alltests=[];
	$scope.test_info={};
	$scope.score_range="marks";
	$scope.course_id=course_id;
	$scope.class_id=class_id;
	$scope.section_id=(section_id>0)?section_id:"";
	$scope.test_id=test_id;
	$scope.pagination = {
        current: 1
    };
	$scope.totalItems = 0;
	$scope.loader=false;
	$scope.NoData=null;
	$scope.init=function(){
		$scope.loader=true;
		var params=$.param({"action":"testinfo","test_id":$scope.test_id,"course_id":$scope.course_id});
		$http({method:'POST',url:$scope.OTR_API,data:params}).success(function(data,status,headers,config){
			if(data.test_id!=""){
				$scope.test_info=data.test_info;
				$scope.course_id=$scope.test_info.course_id;
				//console.log($scope.test_info);
				$scope.loadCoursesAndClasses();
			}else{
				$scope.loader=false;
			}
		}).error(function(data,status,headers,config) {
			$scope.loader=false;
		});
	}

	//Courses and Classes
	$scope.loadCoursesAndClasses=function(){
		$scope.loader=true;
		var params=$.param({"action":"courses"});
		$http({method:'POST',url:$scope.OTR_API,data:params}).success(function(data,status,headers,config){
			$scope.courses=data.courses;
			//$scope.classes=data.classes;
			
			/*if($scope.classes.length>0){
				$scope.loadSections();
			}*/
			if($scope.courses.length>0){
				//$scope.course_id=$scope.courses[0].course_id;
				$scope.loadClasses();
			}

			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            	$scope.$apply();
        	}

			//$scope.loader=false;		
		}).error(function(data,status,headers,config) {
			$scope.loader=false;
		});
	}

	$scope.loadClasses=function(){
		var params=$.param({"action":"classes",course_id:$scope.course_id});
		$http({method:'POST',url:$scope.OTR_API,data:params}).success(function(data,status,headers,config){
			$scope.classes=data.classes;
			console.log($scope.classes);
			if($scope.classes.length>0){
				//$scope.class_id=$scope.classes[0].class_id;
				$scope.loadSections();
			}else{
				//$scope.resetList();
			}

			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            	$scope.$apply();
        	}
		}).error(function(data,status,headers,config) {
			//$scope.resetList();
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
				$scope.loader=false;
				$scope.NoData=true;
				$scope.test_id="";
				$scope.test_info={};
			}

			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            	$scope.$apply();
        	}
		}).error(function(data,status,headers,config) {
			$scope.loader=false;
		});
	}

	//Load All Tests
	$scope.LoadAllTests=function(){
		$scope.NoData=null;
		var params=$.param({"action":"testlist",course_id:$scope.course_id,class_id:$scope.class_id,section_id:$scope.section_id});
		$http({method:'POST',url:$scope.OTR_API,data:params}).success(function(data,status,headers,config){
			$scope.alltests=data.alltests;
			if($scope.alltests.length>0){
				//If Change the course
				if($scope.test_id==""){
					$scope.test_id=$scope.alltests[0].id;
					$scope.getTestInformation();
				}

				$scope.loadScores();
			}else{
				$scope.NoData=true;
				$scope.test_id="";
				$scope.test_info={};
				$scope.loader=false;
			}

			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            	$scope.$apply();
        	}
		}).error(function(data,status,headers,config) {
			$scope.loader=false;
		});
		
	}

	//Get Test Information
	$scope.getTestInformation=function(){
		var params=$.param({"action":"testinfo","test_id":$scope.test_id,"course_id":$scope.course_id});
		$http({method:'POST',url:$scope.OTR_API,data:params}).success(function(data,status,headers,config){
			if(data.test_id!=""){
				$scope.test_info=data.test_info;
				//$scope.course_id=$scope.test_info.course_id;
				$scope.loadScores();
			}else{
				$scope.loader=false;
			}
		}).error(function(data,status,headers,config) {
			$scope.loader=false;
		});
	}

	//Courses
	$scope.LoadCourse=function()
	{
		$scope.loader=true;
		//$scope.section_id='';
		$scope.test_id='';
		//$scope.LoadAllTests();
		$scope.loadClasses();
	};

	//Classes
	$scope.OnchangeClass=function()
	{
		$scope.loader=true;
		$scope.section_id='';
		$scope.test_id='';
		$scope.loadSections();
	}

	//Sections
	$scope.OnchangeClassSection=function()
	{	
		$scope.loader=true;
		$scope.getTestInformation();
	}

	$scope.getSelectedTest=function(){
		$scope.loader=true;
		$scope.getTestInformation();
	}

	$scope.changeScoreRange=function(score_range){
		$scope.score_range=score_range;
		$scope.LoadScoreHeatmap(1);
	}

	//pagination
    $scope.changeMTestsHeatmap=function(pageNumber){
    	$scope.LoadScoreHeatmap(pageNumber);
    };
    
	//Scores
	$scope.loadScores=function(){
		var params=$.param({"action":"testscores",course_id:$scope.course_id,class_id:$scope.class_id,section_id:$scope.section_id,test_id:$scope.test_id});
		$http({method:'POST',url:$scope.OTR_API,data:params}).success(function(data,status,headers,config){
			if(data.id!="") //this means no tests in the selected course
			{
				$scope.NoData=false;
				$scope.PCSTotals=data.course;
				$scope.PCSTotals['TotalMarksInCourse'] = parseFloat($scope.PCSTotals['TotalMarksInCourse']);
				$scope.PCSTotals['TopMarksInCourse'] = parseFloat($scope.PCSTotals['TopMarksInCourse']);
				$scope.PCSTotals['LeastMarksInCourse'] = parseFloat($scope.PCSTotals['LeastMarksInCourse']);
				$scope.PCSTotals['AvgMarksInCourse'] = parseFloat($scope.PCSTotals['AvgMarksInCourse']);
				$scope.Subjects = data.course.Subjects;		
				//$scope.StudentData = data.StudentData;
				$scope.LoadDistribution('marks');
			}else{
				$scope.NoData=true;
				$scope.loader=false;
			}

			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            	$scope.$apply();
        	}
		}).error(function(data,status,headers,config) {
			$scope.loader=false;
		});
	}

	$scope.LoadDistribution = function(score_range){
		var params=$.param({"action":"scores_destribution",course_id:$scope.course_id,class_id:$scope.class_id,section_id:$scope.section_id,test_id:$scope.test_id});
		$http({method:'POST',url:$scope.OTR_API,data:params}).success(function(data,status,headers,config){
			$scope.distos = data.dists;							
			var subni =  Object.keys($scope.distos);
			$scope.LoadScoreHeatmap(1);
			// console.log(subni);
			for (var i = 0; i < subni.length; i++) {
				var dist = $scope.distos[subni[i]];
				// console.log(dist);
				var ts  = subni[i].split("-");
				var sub = {id:ts[1],category:ts[0]};
				
				var chart_data=[];
				chart_data.push(["Percentage", "Student Count", { role: "style" } ]);
				for (var j = 0; j < dist.length; j++) {
				 	var distrow = dist[j];
				    chart_data.push([distrow.Percentage,parseInt(distrow.StudentCount),distrow.Color]);
				};
				//console.log(chart_data,sub);
				drawChapterChart({cdata:chart_data,sdata:sub});				
			};

			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            	$scope.$apply();
        	}
		}).error(function(data,status,headers,config) {
			$scope.loader=false;
		});
	}

	$scope.LoadScoreHeatmap=function(pageNumber){
		var params=$.param({"action":"scoreheatmap",course_id:$scope.course_id,class_id:$scope.class_id,section_id:$scope.section_id,test_id:$scope.test_id,score_range:$scope.score_range,page:pageNumber,pagesize:$scope.pt_limit});
		$http({method:'POST',url:$scope.OTR_API,data:params}).success(function(data,status,headers,config){

			$scope.StudentData = data.StudentData;
			$scope.Start = parseInt(data.Start);
			$scope.totalItems=data.total;
			$scope.pagination.current=pageNumber;

			$timeout(function() {
				$scope.heatmap("PDATA");
			}, 1000);
		}).error(function(data,status,headers,config) {
			$scope.loader=false;
		});
	}

	$scope.heatmap = function(tableClass){
		$("."+tableClass+" td").hottie({colorArray : ["#FBC5C5","#ADFAAB"], readValue : function(e) { return $(e).attr("data-hist");}});
		$(".my_speed").hottie({colorArray : ["#ADFAAB","#FBC5C5"], readValue : function(e) { return $(e).attr("data-value");}});
		// $scope.$apply();
		$("#report_download_link").attr("href", "download_custom_report_per_test.php?course_id="+$scope.course_id+"&class_id="+$scope.class_id+"&section_id="+$scope.section_id+"&test_id="+$scope.test_id);
		$scope.loader=false;
	};

	$scope.formatToRound = function(value){
		var RoundOut = Math.round(value*100)/100;	
		  return RoundOut;
	};

	$scope.getLength=function(value){
		return parseInt((value+$scope.Subjects.length));
	}

	$scope.init();
});
var charts = [];
function drawChapterChart(data) {
	var chart_data = data.cdata;
	var subject_data = data.sdata;
	//console.log(subject_data);
	if(chart_data==undefined || chart_data.length<2) {console.log(chart_data); return; }
 	

	var data = new google.visualization.arrayToDataTable(chart_data);
    var view = new google.visualization.DataView(data);     
    var options = {
        title: "Score Distribution",//+subject_data.category,
        width: '100%',
        height: 200,
		chartArea: {
			  height: '75%',
			  width: '90%',
			  top: '10%',
			  left: '8%'
			},
		hAxis: { minValue: 0, maxValue: 3 },
			vAxis: {
			//ticks: [0,1,2,3,4,5,6,7,8,9,10],
			//viewWindow:{min:0}, /*this also makes 0 = min value*/   
			//format: '0',
			gridlines: {color: '#ccc'}
			},	
        bar: {groupWidth: "50%"},
        legend: { position: "none" },
      };
      //console.log(data,view,options);
      var c = new google.visualization.ColumnChart(document.getElementById("coverage_chart_"+subject_data.id));  
      c.draw(view, options);
      charts.push(c);
}

function drawcharts()
{
  //calling angular method from javascript
  //please update element id where ng-app is, if changed.
  angular.element(document.getElementById('page-content-wrapper')).scope().LoadDistribution("marks");
}