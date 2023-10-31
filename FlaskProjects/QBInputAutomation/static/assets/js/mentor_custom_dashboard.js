      //google.charts.load('current', {'packages':['bar','corechart']});

google.charts.load('visualization', '1.1', {'packages':['bar','corechart', 'controls']});
	  var chart_data = [],chart_type = "MT";
	  var app = angular.module('myApp', ['myApp.Controllers','ui.bootstrap','angularUtils.directives.dirPagination']).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
	cfpLoadingBarProvider.includeBar = false;
  }]);

  //var app = angular.module('myApp', ['myApp.Controllers','ui.bootstrap','angularUtils.directives.dirPagination']);

		angular.module("myApp.Controllers",['angular-loading-bar']).controller('MentorTestCtrl',function($scope,$http,$timeout,cfpLoadingBar){
			$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
			$scope.chapter_users=[];
			$scope.test_list_size = 5;	
			$scope.subject_id=subject_id;
			$scope.class_section_id=section_id.toString();
			$scope.NoData=false;
			$scope.CNoData = true;
			$scope.loader=false;
			$scope.course_id = course_id;

			//Heatmap
			$scope.pagination = {
        		current: 1
    		};

			$scope.totalItems = 0;
			$scope.chapter_users=[];
			$scope.total_chapters=0;
			$scope.currentPage = 1;

			$scope.LoadClassWiseData=function(index){
				$scope.NoData = true;
				$scope.loader=true;
				$scope.current_course = $scope.PCSCourses[index]; //set first course as current course
				console.log($scope.current_course);
				$scope.course_id_index = index;
				$scope.course_id = $scope.current_course.id;
				$scope.subject_id =$scope.current_course.subject_id;
				$scope.mentor_classes = $scope.current_course.class_id;
				$scope.loadCourseSections();
				
			}
			
			$http.get("load_courses_custom_data_mentor.php").then(function (response) {
				$scope.PCSCourses = response.data;
				//console.log($scope.PCSCourses);
				var cindex = $scope.getIndex();
				console.log(cindex);
				$scope.current_course = $scope.PCSCourses[cindex]; //set first course as current course
				//console.log($scope.current_course);

				$scope.course_id_index = cindex;
				$scope.course_id = $scope.current_course.id;
				$scope.subject_id =$scope.current_course.subject_id;
				$scope.mentor_classes = $scope.current_course.class_id;
				//$scope.loadAllClasses();
				$scope.loader=true;
				$scope.LoadClassWiseData(cindex);
					if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
		                $scope.$apply();
		            }
			});
			$scope.getIndex = function(){
				var index = 0;
				angular.forEach($scope.PCSCourses, function(value, key) {
				  console.log(key + ': ' + value.id);
				  if(value.id == course_id && value.class_id == class_id){
						index = key;
					}
				});
				return index;
			}
			$scope.loadAllClasses=function(course_id){
				$http.get("load_all_classes.php")
				.then(function (response) {
					$scope.MentorClasses = response.data;
					//$scope.mentor_classes = $scope.MentorClasses[0].id;
					$scope.mentor_classes=(class_id>0)?class_id.toString():$scope.MentorClasses[0].class_id;
					class_id=0;
					$scope.LoadClassWiseData(course_id);
					if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
		                $scope.$apply();
		            }
				});
			}

			$scope.LoadMockTests = function(course_id){
				$scope.NoData = true;
				$http.get("load_custom_tests_list_mentor.php?course_id="+$scope.course_id+"&subject_id="+$scope.subject_id+"&class_id="+$scope.mentor_classes+"&section_id="+$scope.mentor_sections+"&size="+$scope.test_list_size).then(function (response) {
					$scope.MTests = response.data;
					if($scope.MTests.length==0) 
					{ 	$scope.NoData = true;
						console.log('No Tests in Selected Course : '+$scope.course_id); 
						$scope.loader=false;
					}
					else{ $scope.NoData = false; }
						if($scope.NoData == false){
							for (var i = 0; i < $scope.MTests.length; i++) {
								/*$scope.MTests[i].Date = formatDate(new Date($scope.MTests[i].timestamp));
								$scope.MTests[i]["label"] = $scope.MTests[i].test_name + " [" +  $scope.MTests[i].Date + "]";	*/
								$scope.MTests[i]["label"] = $scope.MTests[i].title;	
							};

							//$scope.current_test = $scope.MTests[0].id; //set first test as current test
							$scope.current_test=(test_id>0)?test_id.toString():$scope.MTests[0].id;
							test_id=0;
							$scope.LoadTestScores($scope.current_test);
						}
					});
			};

			$scope.LoadTestScores = function(test_id){
				$http.get("load_custom_test_data_scores_mentor.php?test_id="+$scope.current_test+"&course_id="+$scope.course_id+"&subject_id="+$scope.subject_id+"&class_id="+$scope.mentor_classes+"&section_id="+$scope.mentor_sections+"&user_id="+user_id)
				.then(function (response) {
					$scope.SubScore = response.data.topper_in_score;
					console.log($scope.SubScore);
					if($scope.SubScore[0] === null) 
					{ 
						$scope.NoData = true;
						 console.log('No Tests in Selected Course : '+$scope.course_id);
						 $scope.loader=false;
					}
					else{ $scope.NoData = false;
						if($scope.NoData == false){
							$("#report_download_link").attr("href", "download_subject_analysis_custom_report_per_test.php?course_id="+course_id+"&test_id="+$scope.current_test+"&subject_id="+$scope.subject_id+"&class_id="+$scope.mentor_classes+"&section_id="+$scope.mentor_sections+"&user_id="+user_id);
							  }

							for (var i = 0; i < $scope.MTests.length; i++) {
									/*$scope.MTests[i].Date = formatDate(new Date($scope.MTests[i].timestamp));

									$scope.MTests[i]["label"] = $scope.MTests[i].test_name + " [" +  $scope.MTests[i].Date + "]";	*/
									if($scope.current_test == $scope.MTests[i].id){
										$scope.current_test_title = $scope.MTests[i].title;
										$scope.current_test_start_date = $scope.MTests[i].S_Date;
										$scope.current_test_time = $scope.MTests[i].S_Time;
									}
								};

							$scope.SubAccuracy = response.data.toppers_in_accuracy;
							$scope.SubSpeed = response.data.toopers_in_speed;
							$scope.LoadDistribution();
							$scope.SpeedDistribution();
								$timeout(function() {
									$scope.LoadStrengthsWeaknessesMock();
								}, 1000);
						}
					});

				$scope.SpeedDistribution = function(){
				test_id = $scope.current_test;
				$http.get("load_mentor_subject_custom_speed_distribution.php?course_id="+$scope.course_id+"&test_id="+$scope.current_test+"&subject_id="+$scope.subject_id+"&user_id="+user_id+"&class_id="+$scope.mentor_classes+"&section_id="+$scope.mentor_sections).then(function(response)
				{		

					$scope.SubDist = response.data;	
					var Sub_chart_heads =  Object.keys($scope.SubDist);
					//console.log(Sub_chart_heads);
					for (var i = 0; i < Sub_chart_heads.length; i++) {
						var dist = $scope.SubDist[Sub_chart_heads[i]];
						//console.log(dist);
						var sub = {CategoryName:Sub_chart_heads[i],chart_type:"OVER ALL SUBJECT",category:"sub_chart_"+Sub_chart_heads[i],sdist:dist,data_type:"Minutes",Selected_Category:""};					
						var chart_data=[];
						chart_data.push(["Minutes", "Student Count", { role: "style" } ]);
						for (var j = 0; j < dist.length; j++) {
							var distrow = dist[j];
							chart_data.push([distrow.Minutes,parseInt(distrow.StudentCount),distrow.Color]);
						};

						 //console.log(chart_data,sub);
						drawChapterChart({cdata:chart_data,sdata:sub});				
					};
				});
			};

			$scope.LoadDistribution = function(){
				$timeout(function() { 
					$scope.LoadChapters();
				}, 500);

				test_id = $scope.current_test;
				$http.get("load_mentor_subject_custom_scores_distribution.php?course_id="+$scope.course_id+"&test_id="+$scope.current_test+"&subject_id="+$scope.subject_id+"&user_id="+user_id+"&class_id="+$scope.mentor_classes+"&section_id="+$scope.mentor_sections).then(function(response)
				{		
					$scope.SubDist = response.data;	
					var Sub_chart_heads =  Object.keys($scope.SubDist);
					//console.log(Sub_chart_heads);

					for (var i = 0; i < Sub_chart_heads.length; i++) {
						var dist = $scope.SubDist[Sub_chart_heads[i]];
						//console.log(dist);
						var sub = {CategoryName:Sub_chart_heads[i],chart_type:"OVER ALL SUBJECT",category:"sub_chart_"+Sub_chart_heads[i],sdist:dist,data_type:"Percentage",Selected_Category:""};

						var chart_data=[];
						chart_data.push(["Percentage", "Student Count", { role: "style" } ]);
						for (var j = 0; j < dist.length; j++) {
							var distrow = dist[j];
							chart_data.push([distrow.Percentage,parseInt(distrow.StudentCount),distrow.Color]);
						};

						 //console.log(chart_data,sub);
						drawChapterChart({cdata:chart_data,sdata:sub});				
					};

				});
			};

			

			$scope.LoadChapters = function(){
				test_id = $scope.current_test;
				$http.get("load_test_subject_custom_wise_topics.php?course_id="+$scope.course_id+"&subject_id="+$scope.subject_id+"&test_id="+$scope.current_test).then(function(response)
				{		

					//console.log(response.data);	
					$scope.SubjectTopics = response.data;
					if(response.data[0] === null) 
					{ $scope.CNoData = false; console.log('No Chapters Found '); }
					else{ $scope.CNoData = true;}	

					$scope.current_topic = $scope.SubjectTopics[0].id;
					$scope.chapter_id=$scope.SubjectTopics[0].id;	
					$scope.LoadChapterDistribution($scope.SubjectTopics[0].id,$scope.SubjectTopics[0].category);
					//Student Chapterwise Report
					$scope.getChaptersReport($scope.chapter_id);

				});
			};

			$scope.LoadChapterDistribution = function(topic_id,Selected_Category){
				$http.get("load_mentor_chapter_custom_scores_distribution.php?course_id="+$scope.course_id+"&test_id="+$scope.current_test+"&topic_id="+topic_id+"&user_id="+user_id+"&class_id="+$scope.mentor_classes+"&section_id="+$scope.mentor_sections+"&subject_id="+$scope.subject_id).then(function(response)
				{		

					//console.log(response.data);

					$scope.ChapDist = response.data;
					var Chap_chart_heads =  Object.keys($scope.ChapDist);
					//console.log(Sub_chart_heads);

					for (var i = 0; i < Chap_chart_heads.length; i++) {
						var dist = $scope.ChapDist[Chap_chart_heads[i]];
						//console.log(dist);

						var sub = {CategoryName:Chap_chart_heads[i],chart_type:"CHAPTER WISE",category:"chap_chart_"+Chap_chart_heads[i],sdist:dist,data_type:"Percentage",Selected_Category:Selected_Category};
				
						var chart_data=[];
						chart_data.push(["Percentage", "Student Count", { role: "style" } ]);
						for (var j = 0; j < dist.length; j++) {
							var distrow = dist[j];
							chart_data.push([distrow.Percentage,parseInt(distrow.StudentCount),distrow.Color]);
						};

						 //console.log(chart_data,sub);
						drawChapterChart({cdata:chart_data,sdata:sub});				
					};					
				});

				$scope.LoadChapterSpeedDistribution(topic_id,Selected_Category);
			};



			//Student Chapterwise Report

			$scope.getChaptersReport=function(chapter_id){
				/*console.log('chapter_id:'+chapter_id);

				console.log('test_id:'+$scope.current_test);

				console.log('class_id:'+$scope.mentor_classes);

				console.log('section:'+$scope.mentor_sections);

				console.log('user_id:'+user_id);*/

				$scope.currentPage = 1;
				var params = $.param({"chapter_id":chapter_id,"test_id":$scope.current_test,"class_id":$scope.mentor_classes,"section":$scope.mentor_sections,"user_id":user_id,"course_id":$scope.course_id,"subject_id":$scope.subject_id});

				$http({method: 'POST', url: "teacher_chapterwise_performance_report.php", data: params}).success(function(data, status, headers, config){
					$scope.chapter_users=data.chapters;
					$scope.total_chapters=data.chapters.length;
				});

			}



			$scope.pageChangeHandler=function(num){
				$scope.currentPage = num;
			};



			$scope.LoadChapterSpeedDistribution = function(topic_id,Selected_Category){
				$http.get("load_mentor_chapter_custom_speed_distribution.php?course_id="+$scope.course_id+"&test_id="+$scope.current_test+"&topic_id="+topic_id+"&user_id="+user_id+"&class_id="+$scope.mentor_classes+"&section_id="+$scope.mentor_sections+"&subject_id="+$scope.subject_id).then(function(response)
				{		

					//console.log(response.data);
					$scope.ChapDist = response.data;
					var Chap_chart_heads =  Object.keys($scope.ChapDist);
					//console.log(Sub_chart_heads);

					for (var i = 0; i < Chap_chart_heads.length; i++) {
						var dist = $scope.ChapDist[Chap_chart_heads[i]];
						//console.log(dist);
						var sub = {CategoryName:Chap_chart_heads[i],chart_type:"CHAPTER WISE",category:"chap_chart_"+Chap_chart_heads[i],sdist:dist,data_type:"Minutes",Selected_Category:Selected_Category};
					
						var chart_data=[];
						chart_data.push(["Minutes", "Student Count", { role: "style" } ]);
						for (var j = 0; j < dist.length; j++) {
							var distrow = dist[j];
							chart_data.push([distrow.Minutes,parseInt(distrow.StudentCount),distrow.Color]);
						};

						 //console.log(chart_data,sub);
						drawChapterChart({cdata:chart_data,sdata:sub});				
					};					

				});

			};

				//$scope.loadMockTests_Heatmap(1,10,0,test_id);

					/*google.charts.setOnLoadCallback(function() {drawSubAnaChart('sub_marks_chart');});

					google.charts.setOnLoadCallback(function() {drawSubAnaChart('sub_accuracy_chart');});

					google.charts.setOnLoadCallback(function() {drawSubAnaChart('sub_speed_chart');});

					google.charts.setOnLoadCallback(function() {drawSubAnaChart('chap_marks_chart');});

					google.charts.setOnLoadCallback(function() {drawSubAnaChart('chap_accuracy_chart');});

					google.charts.setOnLoadCallback(function() {drawSubAnaChart('chap_speed_chart');});*/
			};

			$scope.loadMockTests_Heatmap=function(page,pagesize){
				var start=(page>1)?((page-1)*pagesize):0;
				$http.get("load_custm_tests_heatmap_mentor.php?test_id="+$scope.current_test+"&subject_id="+$scope.subject_id+"&user_id="+user_id+"&class_id="+$scope.mentor_classes+"&section_id="+$scope.mentor_sections+"&start="+start+"&pagesize="+pagesize+"&course_id="+$scope.course_id)
				.then(function (response) {
					$scope.MTestsHeatmap = response.data.Students;
					$scope.Start = parseInt(response.data.Start);
					$timeout(function() {
						$scope.heatmap("m_data")
					}, 1000);
					
				}

				);

			}

			//loadMockTests Heatmap New

			$scope.loadMockTests_HeatmapNew=function(pageNumber){
				$http.get("load_custm_tests_heatmap_mentor.php?test_id="+$scope.current_test+"&subject_id="+$scope.subject_id+"&user_id="+user_id+"&class_id="+$scope.mentor_classes+"&section_id="+$scope.mentor_sections+"&course_id="+$scope.course_id+'&page='+pageNumber+'&pagesize='+$scope.mt_limit)
				.then(function (response) {
					$scope.MTestsHeatmap = response.data.Students;
					$scope.Start = parseInt(response.data.Start);
					$scope.totalItems=response.data.total;
					$scope.pagination.current=pageNumber;
					$timeout(function() {
						$scope.heatmap("m_data")
					}, 1000);
					$scope.loader=false;
				});

			}

			//Onchange Heatmap

			$scope.changeMTestsHeatmap=function(page){
				//console.log(page);
				$scope.loadMockTests_HeatmapNew(page);
				/*$timeout(function() {

						$scope.heatmap("m_data")

				}, 1000);*/
			}

			//Get limit range

			$scope.custom_change=function(range){
				//console.log(range);
				$scope.loadMockTests_HeatmapNew(1);
			}

			$scope.LoadStrengthsWeaknessesMock = function(){
				$http.get("load_strengths_weaknesses_on_custom_test_mentor.php?course_id="+$scope.course_id+"&test_type=MT&subject_id="+$scope.subject_id+"&user_id="+user_id+"&test_id="+$scope.current_test+"&class_id="+$scope.mentor_classes+"&section_id="+$scope.mentor_sections)
				.then(function (response) {
						$scope.MockScoredWell = response.data.ScoredWell;
						$scope.MockNeedToImprove = response.data.NeedToImprove;
						//$scope.loadMockTests_Heatmap(1,10);
						$scope.loadMockTests_HeatmapNew(1);
					}				
				);

			};

			$scope.formatToRound = function(value){
				var RoundOut = Math.round(value*100)/100;	
				  return RoundOut;
			};

			$scope.heatmap = function(tableid){
				$("#"+tableid+" td").hottie({colorArray : ["#FBC5C5","#ADFAAB"], readValue : function(e) { return $(e).attr("data-hist");}});
				$(".my_speed").hottie({colorArray : ["#ADFAAB","#FBC5C5"], readValue : function(e) { return $(e).attr("data-value");}});
			};

			$scope.UpdateGraphs = function(chart_type){
				//console.log(chart_type);	
				//google.charts.setOnLoadCallback(function() {drawChaptersChart(chart_type);});
			};

			$scope.loadCourseSections=function(){
				$http.get("load_course_sections_mentor.php?course_id="+$scope.course_id+"&class_id="+$scope.mentor_classes+"&user_id="+user_id)
				.then(function (response) {
					$scope.mentor_sections =(section_id>0)?section_id.toString():0;
					//$scope.mentor_sections = 0;
					$scope.MentorSections = response.data;
					$timeout(function() {
						$scope.LoadMockTests($scope.course_id);
						
					}, 1000);	
				}
				);
			}

			

			$scope.LoadSectionWiseData=function(section_id){
				$scope.LoadMockTests($scope.course_id);
				/*$scope.LoadTestScores($scope.current_test);
				$scope.class_section_id='';*/
			}

		});
		
		var charts = [];
		function drawChapterChart(data) {
			var test_data_dump = [];
			var chart_data = data.cdata;
			var subject_data = data.sdata;
			test_data_dump = data.sdata.sdist;
			if(chart_data==undefined || chart_data.length<2) {console.log(chart_data); return; }		

			var data = new google.visualization.arrayToDataTable(chart_data);
			var view = new google.visualization.DataView(data);     
			var options = {
				title: "Distribution",//+subject_data.category,
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
					gridlines: {color: '#ccc'}

					},	
				bar: {groupWidth: "50%"},
				legend: { position: "none" },
			  };

			  //console.log(data,view,options);

			  var c = new google.visualization.ColumnChart(document.getElementById(subject_data.category));  

			  function selectHandler() {
				try {
					var selectedItem = c.getSelection()[0];

					//console.log(test_data_dump);

					//console.log(test_data_dump[selectedItem.row].Percentage);

					var chart_type = subject_data.chart_type;
					if(chart_type == "CHAPTER WISE"){
						var Selected_Category = subject_data.Selected_Category;
					} else{
						var Selected_Category = "";
					}

					var data_type = subject_data.data_type;
					var scount_value = test_data_dump[selectedItem.row].StudentCount;

					if(data_type == "Minutes"){
						var data_range = test_data_dump[selectedItem.row].Minutes
					}else{
						var data_range = test_data_dump[selectedItem.row].Percentage;
					}

					var data_items = test_data_dump[selectedItem.row].Students;
					
					if (selectedItem){
							Show_Students(chart_type,scount_value,data_range,data_items,subject_data.CategoryName,data_type,Selected_Category);
						}
				}catch(err) {
					//console.log(err.message);
					//document.getElementById("demo").innerHTML = err.message;
				}
			  }

			  /*function(){

				  alert(chart.getSelection()[0].row);

				  c.setSelection();// nulls out the selection 

				  },*/
			  google.visualization.events.addListener(c, 'select', selectHandler);
			  c.draw(view, options);
			  charts.push(c);
		}

		function Show_Students(chart_type,scount_value,data_range,data_items,CategoryName,data_type,Selected_Category)
		{

			//console.log(data_items);
			$("#student_data tbody").html('');
			$("#myModalLabel").text(chart_type+" "+CategoryName);
			$("#student_field").text(CategoryName);
			$("#distribution_value").text(data_range);
			$("#scount_value").text(scount_value);
			if(Selected_Category!=""){
				$("#chp_dis").show();
				$("#Selected_Category").text(Selected_Category);
			}else{
				$("#chp_dis").hide();

			}

			/*if(CategoryName == "CHAPTER WISE" ){				
			}else{
				
			}*/

			for (var i = 0; i < data_items.length; i++) {
				if(data_type == "Minutes"){
					var rdata = data_items[i].Minutes;
					var rv = " s";
				}else{
					var rdata = data_items[i].Percentage;
					var rv = " %";
				}

			var rowhtml =
					"<tr><th>" + (i+1) +
                    "</th><th>" + data_items[i].StudentName +
	                "</th><td>" + formatToRoundNew(rdata) + rv +
                    "</td></tr>";
                $("#student_data tbody").append($(rowhtml));
			}

			$(".modal-backdrop").show();
			$("#StudentReportsModal").show();
		}

	function drawSubAnaChart(chart_type) {
		var data = google.visualization.arrayToDataTable([
        ["Percentage", "Student Count", { role: "style" } ],
        ["0%-25%", 45, "color: #4BDA9C"],
        ["26%-50%", 25, "color: #E0C870"],
        ["51%-75%", 35, "color: #678DCC"],
        ["76%-100%", 22, "color: #F19E9D"]
      ]);

      var view = new google.visualization.DataView(data);
      var options = {
        title: "Score Distribution",
		titleTextStyle: {
		  titleLeftMargin:25
		},

        width: '100%',
        height: 200,
		chartArea: {
			  height: '75%',
			  width: '90%',
			  top: '13%',
			  left: '8%'
			},

		hAxis: { minValue: 0, maxValue: 3 },
			vAxis: {
			ticks: [0,1,2,3,4,5,6,7,8,9,10],
			gridlines: {color: '#ccc'}
			},	
        bar: {groupWidth: "50%"},
        legend: { position: "none" },
      };

      var chart = new google.visualization.ColumnChart(document.getElementById(chart_type));
      chart.draw(view, options);
	  }	

    function formatDate(date) {
		var monthNames = [
		"January", "February", "March",
		"April", "May", "June", "July",
		"August", "September", "October",
		"November", "December"
		];

		var day = date.getDate();
		var monthIndex = date.getMonth();
		var year = date.getFullYear();
		return day + ' ' + monthNames[monthIndex] + ' ' + year;
	} 


	function formatToRoundNew(value){
		var RoundOut = Math.round(value*100)/100;	
		return RoundOut;
	}

	  $(function () {
		  $(".close").click(function() {
				$("#StudentReportsModal").hide();
				$(".modal-backdrop").hide();
			});

		  setTimeout(function(){
			//$(".nano").nanoScroller();
		  },1000);
		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		  var target = $(e.target).attr("href") // activated tab
		  var section_id = $('#sections :selected').val();
		  		if(target == "#custom"){
			  		//google.charts.setOnLoadCallback(function() {drawCustomChart(section_id);});
					//google.charts.setOnLoadCallback(function() {drawChaptersChart('S');});
			  		//google.charts.setOnLoadCallback(function() {drawChaptersChartNew('S',section_id);});
				}else if(target == "#mock"){
					// google.charts.setOnLoadCallback(function() {drawChaptersChart('MT');});
					//google.charts.setOnLoadCallback(function() {drawChaptersChartNew('MT',section_id);});
					//google.charts.setOnLoadCallback(function() {drawMockChart(section_id);});
				}
				else{
					//google.charts.setOnLoadCallback(function() {drawCoverageChart(section_id);});
					//google.charts.setOnLoadCallback(function() {drawSpeedChart(section_id);});
					//google.charts.setOnLoadCallback(function() {drawTimeChart(section_id);});
				}			
		});

	});



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
	}else
	{
		var rscore = Math.round(score*100)/100;
		return '<p class="tooltip-score">'+name+'</p><p class="tooltip-name">'+rscore+'%</p><p class="tooltip-ts">'+tag+'</p>';
	}

}