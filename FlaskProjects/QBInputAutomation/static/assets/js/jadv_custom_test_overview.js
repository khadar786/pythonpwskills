var googlecharts_ready = false;
google.charts.load('current', {'packages':['corechart']});

var mock_test_options = {
    //title: "Density of Precious Metals, in g/cm^3",
    width: '100%',
    height: 200,
	chartArea: {
		  height: '75%',
		  width: '90%',
		  top: '10%',
		  left: '8%'
		},
	hAxis: { minValue: 0, maxValue: 1 },
		vAxis: {
		//ticks: [0,10,20,30,40,50,60,70,80],
		gridlines: {color: '#ccc'}
		},	
    bar: {groupWidth: "50%"},
    legend: { position: "none" },
  };
  var My_Subjects=[];
  var Colors=["#E0C870","#4BDA9C"];

var app=angular.module('CTOverviewApp', ['ngSanitize','ui.bootstrap','angularUtils.directives.dirPagination']);
app.controller('CTOverviewCtrl',function($scope,$http,$timeout,$compile,$sce){
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	$scope.OTR_API='api/Objective_test_reports.php';
	$scope.SAPI='api/Service.php';
	$scope.user_id=user_id;
	$scope.utid=utid;
	$scope.user_info={};
	$scope.user_test_info={};
	$scope.subject_id="";
	$scope.subjects={};
	$scope.test_type="MT";
	$scope.NoData="";
	$scope.loader=false;
	$scope.init=function(){
		$scope.loader=true;
		var params=$.param({"action":"user_test_info",user_id:$scope.user_id,utid:$scope.utid,"course_id":5686});
		$http({method:'POST',url:$scope.OTR_API,data:params}).success(function(data,status,headers,config){
			$scope.user_info=data.user_info;
			if(data.test_id!=""){
			  $scope.user_test_info=data.user_test_info;
			  $scope.NoData=false;
			  $scope.subjects=$scope.user_test_info.Subjects;
			  $scope.subject_id=$scope.subjects[0]['id'];
			  My_Subjects=$scope.subjects;
			  google.charts.setOnLoadCallback(drawMockCharts);

			  $scope.LoadStrengthsWeaknessesMock();
			}else{
				$scope.user_test_info={};
				$scope.subjects={};
				$scope.subject_id="";
				$scope.NoData=true;
				$scope.loader=false;
			}
		}).error(function(data,status,headers,config) {
			$scope.loader=false;
		});
	}

	$scope.LoadStrengthsWeaknessesMock = function(){
		var params=$.param({"action":"strengths_weaknesses",user_id:$scope.user_id,utid:$scope.utid,subject_id:$scope.subject_id,test_type:$scope.test_type,"course_id":5686});
		$http({method:'POST',url:$scope.OTR_API,data:params}).success(function(data,status,headers,config){
			$scope.MockScoredWell=data.scoredwell;
			$scope.MockNeedToImprove=data.needtoimprove;
			$scope.loader=false;
		}).error(function(data,status,headers,config) {
			$scope.loader=false;
		});
	};

	$scope.formatToRound = function(value){
        var RaoundOut = Math.round(value*100)/100;  
          return RaoundOut;
    };

	$scope.init();

});


function drawMockCharts() {
        var options = mock_test_options;
		var chart=[],data=[],view = [],test_data = [];
		// console.log(My_Subjects);
		 for (var i = 0; i < My_Subjects.length; i++) {
			var subject_id = My_Subjects[i]["id"];
			//console.log(subject_id);
			// $.post("load_mock_subject_scored_answred.php",{id:i,subject_id:subject_id,test_id:<?php echo $_GET["test_id"]?>},function(res){
				// res = $.parseJSON(res);
				// id = res.index;
				// subject_id = res.subject_id;
				res = [{"Name":"Attempted","count":My_Subjects[i]["Attempted"],"color":Colors[0]},{"Name":"Scored","count":My_Subjects[i]["Scored"],"color":Colors[1]}];
				test_data[i] = [["Percentage", "Count", { role: "style" } ]];
				//console.log(res);
				for (var j = 0; j< res.length; j++) {
					//console.log(res[j].TestName);
					test_data[i].push([res[j].Name,parseInt(res[j].count),res[j].color]);
				}
				//alert('test');
				data[i] = google.visualization.arrayToDataTable(test_data[i]);
				view[i] = new google.visualization.DataView(data[i]);
				chart[i] = new google.visualization.ColumnChart(document.getElementById('chart'+subject_id));
				chart[i].draw(view[i], options);
				//console.log(test_data[i]);
				//console.log("i="+id);
			// });
		 };
}

function drawMathsChart() {var data = google.visualization.arrayToDataTable([
        ["Percentage", "Count", { role: "style" } ],
        ["Scored", 60, "color: #4BDA9C"],
        ["Attempted", 80, "color: #E0C870"],
      ]);

      var view = new google.visualization.DataView(data);
      /*view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" },
                       2]);*/

      var options = mock_test_options;
      var chart = new google.visualization.ColumnChart(document.getElementById("maths_chart"));
      chart.draw(view, options);
 }
function drawPhysicsChart() {
	var data = google.visualization.arrayToDataTable([
					["Percentage", "Count", { role: "style" } ],
					["Scored", 30, "color: #4BDA9C"],
					["Attempted", 40, "color: #E0C870"],
	]);

	var view = new google.visualization.DataView(data);
	/*view.setColumns([0, 1,
	               { calc: "stringify",
	                 sourceColumn: 1,
	                 type: "string",
	                 role: "annotation" },
	               2]);*/

	var options = mock_test_options;
	var chart = new google.visualization.ColumnChart(document.getElementById("physics_chart"));
	chart.draw(view, options);
}
function drawChemistryChart() {
	var data = google.visualization.arrayToDataTable([
			["Percentage", "Count", { role: "style" } ],
			["Scored", 30, "color: #4BDA9C"],
			["Attempted", 40, "color: #E0C870"],
	]);

	var view = new google.visualization.DataView(data);
	/*view.setColumns([0, 1,
	               { calc: "stringify",
	                 sourceColumn: 1,
	                 type: "string",
	                 role: "annotation" },
	               2]);*/

	var options = mock_test_options;
	var chart = new google.visualization.ColumnChart(document.getElementById("chemistry_chart"));
	chart.draw(view, options);
}