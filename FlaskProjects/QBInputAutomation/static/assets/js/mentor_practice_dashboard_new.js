      //google.charts.load('current', {'packages':['bar','corechart']});
	  google.charts.load('visualization', '1.1', {'packages':['bar','corechart', 'controls']});
	  var chart_data = [],chart_type = "MT";
	  var app = angular.module('myApp', ['myApp.Controllers','ui.bootstrap','angularUtils.directives.dirPagination']);

		angular.module("myApp.Controllers",[]).controller('MentorTestCtrl',function($scope,$http,$filter,$timeout){
			$scope.subject_id=subject_id;
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

			$http.get("load_courses_data_user.php").then(function (response) {
				$scope.PCSCourses = response.data.courses;
				$scope.current_course = $scope.PCSCourses[0]; //set first course as current course
				$scope.course_id = $scope.current_course.course_cat_id;
				console.log($scope.course_id);
				$scope.loadAllClasses();
				if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
					$scope.$apply();
				}
			});

			$scope.LoadCourse = function(course)
			{
				$scope.tabloader=true;
				$scope.course_id = course;
				$http.get("change_current_course_status.php?course_id="+course).then(function (response) {
					$http.get("mentor_subjects.php?action=subjects&course_id="+$scope.course_id+"&user_id="+user_id).then(function (response) {
						//console.log(response.data[0].id);
						$scope.subject_id = response.data[0].id;
					});
				});

				$timeout(function(){
					$scope.loadAllClasses();
				},1000);

			};

			$scope.getChapters = function(){
				$http.get("load_mentor_adtv_chapters.php?subject_id="+$scope.subject_id+"&user_id="+user_id+"&class_id="+$scope.mentor_classes+"&section_id="+$scope.mentor_sections+"&course_id="+$scope.course_id)
				.then(function(response){
					$scope.psubject_chapters = response.data;
					$scope.adtv_chapter = $scope.psubject_chapters[0].id;
					//$scope.getTopics($scope.adtv_chapter);
					$scope.loadAdtvTests_HeatmapNew(1);
				}
				);
			}

			$scope.getTopics = function(adtv_chapter){
				$http.get("load_mentor_adtv_topics.php?chapter_id="+adtv_chapter)
				.then(function (response) {
					$scope.pchapter_topics = response.data;
					$scope.adtv_topic = $scope.pchapter_topics[0].id;
					$scope.adtv_topic_name = $scope.pchapter_topics[0].category;
					$scope.loadAdtvTests_HeatmapNew(1);
				}
				);
			}

			$scope.loadPracticeTests_Heatmap=function(page,pagesize,section_id){
				var start=(page>1)?((page-1)*pagesize):0;
				$http.get("load_practice_tests_heatmap_mentor.php?subject_id="+subject_id+"&user_id="+user_id+"&section_id="+section_id+"&start="+start+"&pagesize="+pagesize)
				.then(function (response) {
					$scope.PcTestsHeatmap = response.data;
					$timeout(function() {
						$scope.heatmap("pc_data")
					}, 1000);
				}
				);
			}

			

			$scope.loadPracticeTests_HeatmapNew=function(pageNumber){
				//console.log($scope.mentor_sections);
				$http.get("load_practice_tests_heatmap_mentor.php?subject_id="+$scope.subject_id+"&user_id="+user_id+"&class_id="+$scope.mentor_classes+"&section_id="+$scope.mentor_sections+"&course_id="+$scope.course_id+'&page='+pageNumber+'&pagesize='+$scope.pt_limit)
				.then(function (response) {
					$scope.PcTestsHeatmap = response.data.Students;
					$scope.Start = parseInt(response.data.Start);
					$scope.totalItems=response.data.total;
					$scope.pagination.current=pageNumber;
					$timeout(function() {
						$scope.heatmap("pc_data")
					}, 1000);

					if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
						$scope.$apply();
					}

					$scope.tabloader=false;
				});

			}

			
			$scope.loadAdtvTests_HeatmapNew=function(pageNumber){
				$scope.advt_tabloader=true;
				$scope.adtv_topic_name = $( "#adtv_topic option:selected" ).text();

				//console.log($scope.mentor_sections);
				$http.get("load_mentor_adtv_chapters_new.php?subject_id="+$scope.subject_id+"&user_id="+user_id+"&class_id="+$scope.mentor_classes+"&section_id="+$scope.mentor_sections+"&course_id="+$scope.course_id+"&chapter_id="+$scope.adtv_chapter+'&page='+pageNumber+'&pagesize='+$scope.adtv_limit)
				.then(function (response) {
					$scope.AdvtPcTestsHeatmap = response.data.Students;
					$scope.advt_Start = parseInt(response.data.Start);
					$scope.advt_totalItems=response.data.total;
					$scope.advt_pagination.current=pageNumber;
					$timeout(function() {
						$scope.heatmap("pc_data")
					}, 1000);

					if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
						$scope.$apply();
					}

					$scope.advt_tabloader=false;
				});



			}

			$scope.showAdvtPop = function(index){
				console.log(index);
				$("#myModalLabel").text($scope.AdvtPcTestsHeatmap[index].StudentName);
				$scope.current_topic_details = $scope.AdvtPcTestsHeatmap[index].details;
				$("#StudentAdvtModal").modal({
		          backdrop: 'static',
		          keyboard: false  // to prevent closing with Esc button (if you want this too)
		        });
			}

			$scope.loadPracticeTestsScores=function(section_id){
				$http.get("load_practice_tests_scores_mentor.php?subject_id="+subject_id+"&user_id="+user_id+"&section_id="+section_id+"&class_id="+$scope.mentor_classes)
				.then(function (response) {
					$scope.PcTotals = response.data.PcTotals;
					$scope.loadPracticeTests_HeatmapNew(1);
					}
				);
			}
			
			$scope.formatToRound = function(value){
				var RoundOut = Math.round(value*100)/100;	
				  return RoundOut;
			};

			$scope.heatmap = function(tableid){
				$("."+tableid+" td").hottie({colorArray : ["#FBC5C5","#ADFAAB"], readValue : function(e) { return $(e).attr("data-hist");}});
			};

			$scope.UpdateGraphs = function(chart_type){
				//console.log(chart_type);	
				//google.charts.setOnLoadCallback(function() {drawChaptersChart(chart_type);});
			};

			$scope.loadCourseSections=function(){
				$http.get("load_course_sections_mentor.php?course_id="+$scope.course_id+"&user_id="+user_id)
				.then(function (response) {
					$scope.mentor_sections = 0;
					$scope.MentorSections = response.data;
				}
				);
			}

			$scope.LoadClassWiseData=function(mentor_classes){
				$scope.loadCourseSections();
				//$scope.loadPracticeTestsScores(0);
				$scope.loadPracticeTests_HeatmapNew(1);
				//$scope.getChapters();
			};

			$scope.loadAllClasses=function(){
				$http.get("load_all_classes.php")
				.then(function (response) {
					$scope.MentorClasses = response.data;
					$scope.mentor_classes = $scope.MentorClasses[0].id;
					$timeout(function() {
						$scope.LoadClassWiseData($scope.mentor_classes);
					}, 1000);
				}
				);
			}

			
			//change pagination
			$scope.changePTestsHeatmap=function(page){
				$scope.loadPracticeTests_HeatmapNew(page);
			};

			$scope.changeAPTestsHeatmap=function(page){
				$scope.loadAdtvTests_HeatmapNew(page);
			};

			//change range
			$scope.pt_change=function(range){
				$scope.loadPracticeTests_HeatmapNew(1);
			}

			$scope.apt_change=function(range){
				$scope.loadAdtvTests_HeatmapNew(1);
			}

			

			//$scope.loadPracticeTests_Heatmap(1,10,0);

			//$scope.loadPracticeTests_HeatmapNew(1);

			$scope.LoadSectionWiseData=function(section_id){
				$scope.loadAdtvTests_HeatmapNew(1);
			}

		});

      

	function drawCoverageChart(section_id) {
		  var data = [],test_data = [],chart=[],view=[];
		  var options = {
		//title: "Density of Precious Metals, in g/cm^3",
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
			ticks: [0,10,20,30,40,50,60,70,80],
			gridlines: {color: '#ccc'}
			},	

		bar: {groupWidth: "50%"},
		legend: { position: "none" },
		};

		  $.post("load_practice_tests_coverage_data_mentor.php",{subject_id:subject_id,user_id:user_id,section_id:section_id},function(res){
				res = $.parseJSON(res);
				res = res.data;
				test_data = [["Percentage", "Student Count", { role: "style" } ]];
				//console.log(res);

				for (var j = 0; j< res.length; j++) {
					//console.log(res[j].TestName);
					if(res[j].Percentage === null)
					res[j].Percentage=0

					if(res[j].StudentCount === null)
					res[j].StudentCount=0

					test_data.push([res[j].Percentage,parseInt(res[j].StudentCount),res[j].Color]);
				}

				data = google.visualization.arrayToDataTable(test_data);
				view = new google.visualization.DataView(data);
				chart = new google.visualization.ColumnChart(document.getElementById("coverage_chart"));
				chart.draw(view, options);
			});

		}

	function drawSpeedChart(section_id) {

		  var data = [],test_data = [],chart=[],view=[];

		  var options = {

		//title: "Density of Precious Metals, in g/cm^3",

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

			ticks: [0,10,20,30,40,50,60,70,80],

			gridlines: {color: '#ccc'}

			},	

		bar: {groupWidth: "50%"},

		legend: { position: "none" },

		};

			$.post("load_practice_tests_speed_data_mentor.php",{subject_id:subject_id,user_id:user_id,section_id:section_id},function(res){

				res = $.parseJSON(res);

				res = res.data;

				test_data = [["Seconds", "Student Count", { role: "style" } ]];

				//console.log(res);

				for (var j = 0; j< res.length; j++) {

					if(res[j].Seconds === null)

					res[j].Seconds=0

					

					if(res[j].StudentCount === null)

					res[j].StudentCount=0

					

					//console.log(res[j].TestName);

					test_data.push([res[j].Seconds,parseInt(res[j].StudentCount),res[j].Color]);

				}

				data = google.visualization.arrayToDataTable(test_data);

				view = new google.visualization.DataView(data);

				chart = new google.visualization.ColumnChart(document.getElementById("speed_chart"));

				chart.draw(view, options);

			});

		  /*data = google.visualization.arrayToDataTable([

		["Seconds", "Student Count", { role: "style" } ],

		["30-60", 60, "color: #678DCC"],

		["60-90", 45, "color: #4BDA9C"],

		["90-120", 25, "color: #F19E9D"],

		["120-150", 35, "color: #E0C870"],

		[">150", 22, "color: #56BFCF"]

		]);*/

		}

	function drawTimeChart(section_id) {

		  var data = [],test_data = [],chart=[],view=[];

		  var options = {

		//title: "Density of Precious Metals, in g/cm^3",

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

			ticks: [0,10,20,30,40,50,60,70,80],

			gridlines: {color: '#ccc'}

			},	

		bar: {groupWidth: "50%"},

		legend: { position: "none" },

		};

		$.post("load_practice_tests_time_spent_data_mentor.php",{subject_id:subject_id,user_id:user_id,section_id:section_id},function(res){

				res = $.parseJSON(res);

				res = res.data;

				test_data = [["Seconds", "Student Count", { role: "style" } ]];

				//console.log(res);

				for (var j = 0; j< res.length; j++) {

					if(res[j].Seconds === null)

					res[j].Seconds=0

					

					if(res[j].StudentCount === null)

					res[j].StudentCount=0

					//console.log(res[j].TestName);

					test_data.push([res[j].Seconds,parseInt(res[j].StudentCount),res[j].Color]);

				}

				data = google.visualization.arrayToDataTable(test_data);

				view = new google.visualization.DataView(data);

				chart = new google.visualization.ColumnChart(document.getElementById("time_spent_chart"));

				chart.draw(view, options);

			});

		  /*data = google.visualization.arrayToDataTable([

		["Seconds", "Student Count", { role: "style" } ],

		[">10", 60, "color: #56BFCF"],

		["6-8", 45, "color: #F19E9D"],

		["4-6", 25, "color: #678DCC"],

		["2-4", 35, "color: #E0C870"],

		["0-2", 22, "color: #4BDA9C"]

		]);*/

		

		}

	var test_options = {

		  title: '',

		  curveType: 'function',

		  height: 300,

		  width:'100%',

			chartArea: {

			  height: '85%',

			  width: '90%',

			  top: '5%',

			  left: '5%'

			},

			/*animation: {

			  duration: 1000,

			  easing: 'out',

			  startup: true

			},*/

		  legend: { position: 'bottom' },

		  hAxis: { minValue: 0, maxValue: 9,textPosition: 'none' },

			/*vAxis: {

			ticks: [0,25,50,75,100],

			gridlines: {color: '#ccc'}

			},*/

			vAxes: {0: {viewWindowMode:'explicit',

						title: 'Aggregate Percentage & Accuracy',

                      /*viewWindow:{

                                  max:510,

                                  min:82

                                  },*/

								  ticks: [0,25,50,75,100],

                      gridlines: {color: '#ccc'}

                      },

					1: {gridlines: {color: '#ccc'},

						title: 'Speed',

                      format:"#"

                      }

                  },

			series: {0: {targetAxisIndex:0},

                   1:{targetAxisIndex:1},

                   2:{targetAxisIndex:0},

                  },

		  pointSize: 5,

		  colors: ['#4EC793', '#CAB158', '#E78989'],

		  enableInteractivity: true

		};	

	function drawCustomChart(section_id) {

		var options = test_options;

		var chart = [],data = [],test_data = [],test_data_dump = [];

		$.post("load_custom_tests_mentor.php",{subject_id:subject_id,user_id:user_id,section_id:section_id},function(res){

				res = $.parseJSON(res);

				test_data_dump = res.data;

				id = res.index;

				subject_id = res.subject_id;

				res = res.data;

				//test_data = [['Test Name', 'Aggregate Percentage', 'Speed','Accuracy']];

				//data = google.visualization.arrayToDataTable();

				data=new google.visualization.DataTable();

				data.addColumn('string', 'Test Name');

				data.addColumn('number', 'Aggregate Percentage');

				data.addColumn('number', 'Speed');

				data.addColumn('number', 'Accuracy');

				//data.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});

				//console.log(res);

				for (var j = 0; j< res.length; j++) {

					if(res[j].AggregatePercentage === null)

					res[j].AggregatePercentage=0

					

					if(res[j].Speed === null)

					res[j].Speed=0

					

					if(res[j].Accuracy === null)

					res[j].Accuracy=0

					//console.log(res[j].TestName);

					//test_data.push([res[j].TestName,parseInt(res[j].AggregatePercentage),parseInt(res[j].Speed),parseInt(res[j].Accuracy),getTooltip(res[j].TestName,parseInt(res[j].AggregatePercentage),parseInt(res[j].Speed),parseInt(res[j].Accuracy),true)]);

					test_data.push([res[j].TestName,parseInt(res[j].AggregatePercentage),parseInt(res[j].Speed),parseInt(res[j].Accuracy)]);

					

				}

				//alert('test');

				data.addRows(test_data);

				//data = google.visualization.arrayToDataTable(test_data);

				chart = new google.visualization.LineChart(document.getElementById('custom_chart'));

				

				google.visualization.events.addListener(chart, 'select', selectHandler);

			  // The select handler. Call the chart's getSelection() method

			  function selectHandler() {

				var selectedItem = chart.getSelection()[0];

				//console.log(selectedItem);

				//console.log(test_data_dump[selectedItem.row].TestID);

				//console.log(test_data_dump[selectedItem.row]);

				try {

				if (selectedItem)

				Show_Download_Paper(test_data_dump[selectedItem.row].TestGroupID,test_data_dump[selectedItem.row].TimeStamp,section_id);

				}catch(err) {

					//document.getElementById("demo").innerHTML = err.message;

				}

				//console.log(selectedItem.row);

				/*if (selectedItem) {

				  var value = data.getValue(selectedItem.row, selectedItem.column);

				 // console.log('The user selected ' + value);

				}*/

			  }

				chart.draw(data, options);

			});

	}

	function drawMockChart(section_id) {

		var options = test_options;

		var chart=[],data = [],test_data = [],test_data_dump = [];

		$.post("load_mock_tests_mentor.php",{subject_id:subject_id,user_id:user_id,section_id:section_id},function(res){

				res = $.parseJSON(res);

				test_data_dump = res.data;

				id = res.index;

				subject_id = res.subject_id;

				res = res.data;

				test_data = [['Test Name', 'Aggregate Percentage', 'Speed','Accuracy']];

				//console.log(res);

				for (var j = 0; j< res.length; j++) {

					if(res[j].AggregatePercentage === null)

					res[j].AggregatePercentage=0

					

					if(res[j].Speed === null)

					res[j].Speed=0

					

					if(res[j].Accuracy === null)

					res[j].Accuracy=0

					//console.log(res[j].TestName);

					test_data.push([res[j].TestName,parseInt(res[j].AggregatePercentage),parseInt(res[j].Speed),parseInt(res[j].Accuracy)]);

				}

				//alert('test');

				data = google.visualization.arrayToDataTable(test_data);

				chart = new google.visualization.LineChart(document.getElementById('Mock_chart'));

				// The select handler. Call the chart's getSelection() method

			  function selectHandler() {

				var selectedItem = chart.getSelection()[0];

				//console.log(test_data_dump[selectedItem.row].TestID);

				try {

				if (selectedItem)

				Show_Download_Paper(test_data_dump[selectedItem.row].TestGroupID,test_data_dump[selectedItem.row].TimeStamp,section_id);

				}catch(err) {

					//document.getElementById("demo").innerHTML = err.message;

				}

				

				//console.log(selectedItem.row);

				/*if (selectedItem) {

				  var value = data.getValue(test_data_dump[selectedItem.row].TestID, selectedItem.column);

				  console.log('The user selected ' + value);

				}*/

			  }

				google.visualization.events.addListener(chart, 'select', selectHandler);

				chart.draw(data, options);

			});

	}

	function printDiv() {

		var divToPrint=document.getElementById('PrintDiv');

			var TestTitle = $(".test-title").text();

			var uniqueName = new Date();

			var windowName = 'Print' + uniqueName.getTime();

		  //var newWin=window.open(TestTitle,'Print-Window');

			var newWin=window.open(TestTitle,windowName);

		  newWin.document.open();

		//newWin.document.title = TestTitle;

		  newWin.document.write('<html><head><link href="css/bootstrap.min.css" rel="stylesheet"><link href="css/style.css" rel="stylesheet" type="text/css"></head><body onload="window.print()"><h4>'+TestTitle+' Report</h4>'+divToPrint.innerHTML+'</body></html>');

		

		  newWin.document.close();

		  //setTimeout(function(){newWin.close();},10);



	}

	function Show_Download_Paper(TestConfigID,tdate,section_id)
	{

		$("#test_data tbody").html('');

		$(".test-chapters").html('');

		$.post("load_test_wise_class_performance_heatmap.php",{section_id:section_id,user_id:user_id,test_id:TestConfigID,tdate:tdate.split(' ')[0]},function(res){

			res = $.parseJSON(res);

			//console.log(res.TestName);

			$("#myModalLabel").text(res.TestName+" Report");

			$(".test-title").text(res.TestName);

			$(".test-date").text(res.start_date);

			$(".test-duration").text(res.testTime);

			$(".test-max-marks").text(formatToRoundNew(res.MaxMarks));

			$(".test-top-score").text(formatToRoundNew(res.TopScore));

			$(".test-least-score").text(formatToRoundNew(res.LeastScore));

			$(".test-avg-score").text(formatToRoundNew(res.AvgScore));

			$(".no-of-presents").text(res.NoOfPresents);

			$(".total-strength").text(res.TotalStrength);

			$(".no-of-absentees").text(res.TotalStrength-res.NoOfPresents);

			for (var j = 0; j < res.Chapters.length; j++) {

				var datahtml =

				"<span class='badge'>"+res.Chapters[j].category+"</span>";

				$(".test-chapters").append($(datahtml));

			}

			for (var i = 0; i < res.StudentData.length; i++) {

				if(res.StudentData[i].MARKS === null)

				res.StudentData[i].MARKS=0.00;

				

				if(res.StudentData[i].ACCURACY === null)

				res.StudentData[i].ACCURACY=0.00;

				

				if(res.StudentData[i].SPEED === null)

				res.StudentData[i].SPEED=0.00;

				

			var rowhtml =

                    "<tr><th>" + res.StudentData[i].StudentName +

                    //"</td><td data-mixedlinked='" + srow["mixedLinked"] + "'>" + srow["questionType"] +

                    "</th><td data-hist='"+res.StudentData[i].MARKS+"'>" + res.StudentData[i].MARKS +

                    "</td><td data-hist='"+res.StudentData[i].ACCURACY+"'>" + res.StudentData[i].ACCURACY +

                    "</td><th>" + res.StudentData[i].SPEED +

					" sec</th></tr>";

                $("#test_data tbody").append($(rowhtml));

			}

			$("#test_data td").hottie({colorArray : ["#FBC5C5","#ADFAAB"], readValue : function(e) { return $(e).attr("data-hist");}});

		});

		$(".modal-backdrop").show();

		$("#TestReportsModal").show();

	}

	function formatToRoundNew(value){

		var RoundOut = Math.round(value*100)/100;	

		return RoundOut;

	}

	var bar_chart_options = {

	  title: '',

	  height: '100%',

	  width: '100%',

	  chartArea: {

		  height: '100%',

		  width: '100%',

		  top: '20%',

		  left: '10%',

		  right: '10%'

		},

		

	  legend: { position: 'none' },

	  chart: { title: '',

			   subtitle: '' },

	  bars: 'horizontal', // Required for Material Bar Charts.

	  axes: {

		x: {

		  0: { side: 'top', label: ''} // Top x-axis.

		},

		y: {

		  0: { side: 'top', label: ''} // Top y-axis.

		}

	  },



	  bar: { groupWidth: "100%" }

	};

	var chart,chart1,chart2,chart3,chart4,chart5;

	var options,data;

	function drawChaptersChart(chart_type) {

		var test_data = [];

		if(chart_type == "MT"){

			options = bar_chart_options;

			$.post("load_tests_marks_mentor.php",{subject_id:subject_id,test_type:"MT"},function(res){

				res = $.parseJSON(res);

				res = res.data;

				test_data = [['Categories', 'Percentage']];

				//console.log(res);

				for (var j = 0; j< res.length; j++) {

					if(res[j].Percentage === null)

					res[j].Percentage=0

					//console.log(res[j].TestName);

					test_data.push([res[j].category,parseInt(res[j].Percentage)]);

				}

				//alert('test');

				data = google.visualization.arrayToDataTable(test_data);

				chart = new google.charts.Bar(document.getElementById('mock_marks_chart'));

				var numRows = data.getNumberOfRows();

				var expectedHeight = (numRows * 30)+40;

				setSize("mock_marks_chart", expectedHeight);

				chart.draw(data, options);

			});

			$.post("load_tests_speed_mentor.php",{subject_id:subject_id,test_type:"MT"},function(res){

				res = $.parseJSON(res);

				res = res.data;

				test_data = [['Categories', 'Speed']];

				//console.log(res);

				for (var j = 0; j< res.length; j++) {

					//console.log(res[j].TestName);

					test_data.push([res[j].category,parseInt(res[j].Speed)]);

				}

				//alert('test');

				data = google.visualization.arrayToDataTable(test_data);

				chart = new google.charts.Bar(document.getElementById('mock_speed_chart'));

				var numRows = data.getNumberOfRows();

				var expectedHeight = (numRows * 30)+40;

				setSize("mock_speed_chart", expectedHeight);

				chart.draw(data, options);

			});

			$.post("load_tests_accuracy_mentor.php",{subject_id:subject_id,test_type:"MT"},function(res){

				res = $.parseJSON(res);

				res = res.data;

				test_data = [['Categories', 'Accuracy']];

				//console.log(res);

				for (var j = 0; j< res.length; j++) {

					//console.log(res[j].TestName);

					test_data.push([res[j].category,parseInt(res[j].Accuracy)]);

				}

				//alert('test');

				data = google.visualization.arrayToDataTable(test_data);

				chart = new google.charts.Bar(document.getElementById('mock_accuracy_chart'));

				var numRows = data.getNumberOfRows();

				var expectedHeight = (numRows * 30)+40;

				setSize("mock_accuracy_chart", expectedHeight);

				chart.draw(data, options);

			});

			/*chart = new google.charts.Bar(document.getElementById('mock_marks_chart'));

			var numRows = data.getNumberOfRows();

			var expectedHeight = (numRows * 30)+40;

			setSize("mock_marks_chart", expectedHeight);

			chart.draw(data, options);

			chart1 = new google.charts.Bar(document.getElementById('mock_speed_chart'));

			setSize("mock_speed_chart", expectedHeight);

			chart1.draw(data, options);

			chart2 = new google.charts.Bar(document.getElementById('mock_accuracy_chart'));

			setSize("mock_accuracy_chart", expectedHeight);

			chart2.draw(data, options);*/

		}

		else{

			options = bar_chart_options;

			$.post("load_tests_marks_mentor.php",{subject_id:subject_id,test_type:"S"},function(res){

				res = $.parseJSON(res);

				res = res.data;

				test_data = [['Categories', 'Percentage']];

				//console.log(res);

				for (var j = 0; j< res.length; j++) {

					//console.log(res[j].TestName);

					test_data.push([res[j].category,parseInt(res[j].Percentage)]);

				}

				//alert('test');

				data = google.visualization.arrayToDataTable(test_data);

				chart = new google.charts.Bar(document.getElementById('custom_marks_chart'));

				var numRows = data.getNumberOfRows();

				var expectedHeight = (numRows * 30)+40;

				setSize("custom_marks_chart", expectedHeight);

				chart.draw(data, options);

			});

			$.post("load_tests_speed_mentor.php",{subject_id:subject_id,test_type:"S"},function(res){
				res = $.parseJSON(res);
				res = res.data;
				test_data = [['Categories', 'Speed']];
				//console.log(res);

				for (var j = 0; j< res.length; j++) {
					//console.log(res[j].TestName);
					test_data.push([res[j].category,parseInt(res[j].Speed)]);
				}

				//alert('test');

				data = google.visualization.arrayToDataTable(test_data);
				chart = new google.charts.Bar(document.getElementById('custom_speed_chart'));
				var numRows = data.getNumberOfRows();
				var expectedHeight = (numRows * 30)+40;
				setSize("custom_speed_chart", expectedHeight);
				chart.draw(data, options);
			});

			$.post("load_tests_accuracy_mentor.php",{subject_id:subject_id,test_type:"S"},function(res){
				res = $.parseJSON(res);
				res = res.data;
				test_data = [['Categories', 'Accuracy']];
				//console.log(res);

				for (var j = 0; j< res.length; j++) {
					//console.log(res[j].TestName);
					test_data.push([res[j].category,parseInt(res[j].Accuracy)]);
				}

				//alert('test');
				data = google.visualization.arrayToDataTable(test_data);
				chart = new google.charts.Bar(document.getElementById('custom_accuracy_chart'));
				var numRows = data.getNumberOfRows();
				var expectedHeight = (numRows * 30)+40;
				setSize("custom_accuracy_chart", expectedHeight);
				chart.draw(data, options);
			});

		}
	}

	var bar_chart_options_new = {
		  height: '80%',
          width: '100%',
		  chartArea: {
			  height: '80%',
			  width: '90%',
			  top: '10%',
			  left: '5%',

			 // right: '2%',

			 /* 'backgroundColor': {

				'fill': '#F4F4F4',

				'opacity': 100

			 },*/

			},

          legend: { position: 'top' },
          chart: { title: '',
                   subtitle: '' },
		  seriesType: 'bars',
		  vAxes: {0: {viewWindowMode:'explicit',
						title: 'Marks & Accuracy',
						ticks: [0,25,50,75,100],
                      gridlines: {color: '#ccc'},
                      },
					1: {gridlines: {color: '#ccc'},
					title: 'Speed',
                      format:"#"
                      },
                  },
			series: {0: {targetAxisIndex:0},
                   1:{targetAxisIndex:0},
                   2:{targetAxisIndex:1,type: 'line'}
                  },
		  colors: ['#4EC793', '#E78989','#CAB158'],
		   hAxis : { 
				textStyle : {
					fontSize: 12 // or the number you want
				}
			}

        }

	var options,data;

	function drawChaptersChartNew(chart_type,section_id) {
		var test_data = [];
		if(chart_type == "MT"){
			options = bar_chart_options_new;

			$.post("load_tests_marks_accuracy_speed_mentor.php",{subject_id:subject_id,test_type:"MT",user_id:user_id,section_id:section_id},function(res){
				res = $.parseJSON(res);
				res = res.data;
				test_data = [['Chapters', 'Marks', 'Accuracy', 'Speed']];
				//console.log(res);

				for (var j = 0; j< res.length; j++) {
					if(res[j].Percentage === null)
					res[j].Percentage=0;
					//console.log(res[j].TestName);
					test_data.push([res[j].category,parseInt(res[j].Percentage),parseInt(res[j].Accuracy),parseInt(res[j].Speed)]);
				}

				//alert('test');
				data = google.visualization.arrayToDataTable(test_data);
				chart = new google.visualization.ComboChart(document.getElementById('mock_marks_acc_speed_chart'));
				chart.draw(data, options);
			});

		}
		else{
			options = bar_chart_options_new;
			$.post("load_tests_marks_accuracy_speed_mentor.php",{subject_id:subject_id,test_type:"S",user_id:user_id,section_id:section_id},function(res){
				res = $.parseJSON(res);
				res = res.data;
				if(res.length==0){
					$("#custom_marks_acc_speed_chart").html('<div class="alert alert-danger">No Tests Found.</div>');
					//$("#cdetails_link_"+subject_id).hide();
					return false;
				}

				test_data = [['Chapters', 'Marks', 'Accuracy', 'Speed']];
				//console.log(res);
				for (var j = 0; j< res.length; j++) {
					//console.log(res[j].TestName);
					test_data.push([res[j].category,parseInt(res[j].Percentage),parseInt(res[j].Accuracy),parseInt(res[j].Speed)]);
				}

				//alert('test');
				data = google.visualization.arrayToDataTable(test_data);
				chart = new google.visualization.ComboChart(document.getElementById('custom_marks_acc_speed_chart'));

				chart.draw(data, options);
			});

		}

	}

	  $(function () {
		$(".close").click(function() {
			$("#TestReportsModal").hide();
			$(".modal-backdrop").hide();
		});

		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		  var target = $(e.target).attr("href") // activated tab
		  var section_id = $('#sections :selected').val();
		  		if(target == "#custom"){
			  		google.charts.setOnLoadCallback(function() {drawCustomChart(section_id);});
					//google.charts.setOnLoadCallback(function() {drawChaptersChart('S');});
			  		google.charts.setOnLoadCallback(function() {drawChaptersChartNew('S',section_id);});
				}else if(target == "#mock"){
					// google.charts.setOnLoadCallback(function() {drawChaptersChart('MT');});
					google.charts.setOnLoadCallback(function() {drawChaptersChartNew('MT',section_id);});
					google.charts.setOnLoadCallback(function() {drawMockChart(section_id);});
				}
				else{
					google.charts.setOnLoadCallback(function() {drawCoverageChart(section_id);});
					google.charts.setOnLoadCallback(function() {drawSpeedChart(section_id);});
					google.charts.setOnLoadCallback(function() {drawTimeChart(section_id);});

				}
		});

		$( "#menu-toggle-2" ).click(function() {
		  google.charts.setOnLoadCallback(function() {drawCoverageChart(0);});
		});
	});


function setSize(id,h) {
    var div=document.getElementById(id);
    h = h + "px";

    var w=parseInt(div.style.width);
    if($(this).width() >= 1200){
        w = 1200 + "px";
    }else{
        w = ($(this).width()-30) + "px";
    }

    $(div).height(h);
    $(div).width(w);
}

function getTooltip(tag,score,name,type)
{
	if(type==undefined || type==false)
	{
		var t = moment(tag);
		var ts1 = t.format('DD MMMM YYYY');
		var ts2 = t.format('HH:mm');
		var ts = ts1+", "+ts2;
		var rscore = Math.round(score*100)/100;
		return '<p class="tooltip-score">'+rscore+'%</p><p class="tooltip-name">'+name+'</p><p class="tooltip-ts">'+ts+'</p>';
	}
	else
	{
		var rscore = Math.round(score*100)/100;
		return '<p class="tooltip-score">'+name+'</p><p class="tooltip-name">'+rscore+'%</p><p class="tooltip-ts">'+tag+'</p>';
	}

}