		var custom_test_options = {
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
		var SERVICE_API_URL='api/Service.php';
		// angular app
		var app = angular.module('myApp', ['myApp.Controllers','ui.bootstrap','angularUtils.directives.dirPagination']);
		angular.module("myApp.Controllers",[]).controller('CustomTestCtrl',function($scope,$http,$filter,$timeout){
			$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
			$scope.test='###########';
			$scope.MockTotals={}
			$scope.user_id=user_id;
			$scope.subject_id=subject_id;
			$scope.NoData = false;
			//Heatmap
			$scope.pagination = {
        		current: 1
    		};

			$scope.course_id = course_id;
			//console.log($scope.course_id);
			$scope.totalItems = 0;

			$scope.user_chapters=[];
			$scope.total_chapters=0;
			$scope.loader = true;
			$scope.LoadCourses = function() {
		        $scope.loader = true;
		        var params = $.param({ "action": "studentcourses", "user_id": $scope.user_id});
		        $http({ method: 'POST', url: SERVICE_API_URL, data: params }).success(function(data, status, headers, config) {
		            //console.log(data);
		            $scope.st_courses = data.courses;
		            //$scope.course_id = $scope.st_courses[0].course_id;
		            $scope.LoadMockTests($scope.course_id,5,$scope.user_id);
		        }).error(function(response){
		            $scope.loader=false;
		        });
		    }
		    $scope.update_page = function(course_id) {
		        $scope.loader = true;
		        $scope.course_id = course_id;
		        var params = $.param({  "course_id":course_id});
		        $http({ method: 'POST', url: "change_current_course_status.php", data: params }).success(function(data, status, headers, config) {
		            console.log(data);
		            
		            //console.log($scope.course_id);
		            /*  $scope.homework = data.homework;*/
		            //$scope.loader = false;
		            $scope.LoadMockTests($scope.course_id,5,$scope.user_id);
		        }).error(function(response){
		            $scope.loader=false;
		        });
		    }
			$scope.LoadTestScores = function(test_id){
				$scope.loader=true;
				//console.log(test_id);
				$http.get("load_custom_test_data_scores.php?test_id="+test_id)
				.then(function (response) {
					$scope.TestData = response.data;
					$scope.Subjects = response.data.Subjects;
					$scope.TSubjects = response.data.TestSubjects;
					$scope.TestScores = response.data.Scores[0];
					//Student Chapterwise Report
					$scope.subject_id = $scope.TSubjects[0].id;
					$scope.getChaptersReport($scope.subject_id);
					$scope.LoadStrengthsWeaknessesMock(test_id);
					My_Subjects=$scope.Subjects;
					google.charts.setOnLoadCallback(drawMockCharts);
					}
				);
			};
			
			//Student Chapterwise Report
			$scope.getChaptersReport=function(sid){
				var current_test=$scope.current_test;
				$scope.currentPage = 1;
				var params = $.param({"subject_id":sid,"test_id":current_test});
				$http({method: 'POST', url: "student_chapterwise_performance_report.php", data: params}).success(function(data, status, headers, config){
					$scope.user_chapters=data.chapters;
					$scope.total_chapters=data.chapters.length;
					if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
		                    $scope.$apply();
		        	}
				});
				if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
		                    $scope.$apply();
		        }
			}

			$scope.pageChangeHandler=function(num){
				$scope.currentPage = num;
				if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
		                    $scope.$apply();
		        }
			};

			$scope.LoadStrengthsWeaknessesMock = function(test_id){
				$http.get("load_strengths_weaknesses_on_custom_test.php?test_type=S&user_id="+user_id+"&test_id="+test_id)
				.then(function (response) {
						$scope.MockScoredWell = response.data.ScoredWell;
						$scope.MockNeedToImprove = response.data.NeedToImprove;
					}
					
				);
				$scope.loader=false;
			};
			$scope.LoadMockTests = function(course_id,test_list_size,user_id){
				$scope.loader=false;
				$http.get("load_student_custom_tests_list.php?course_id="+course_id+"&size="+test_list_size+"&user_id="+user_id).then(function (response) {
					$scope.MTests = response.data;
					//console.log(response.data);
					if($scope.MTests.length==0) 
						{ $scope.NoData = true; console.log('No Tests in Selected Course : '+course_id); }
					else{ $scope.NoData = false; }
		
					for (var i = 0; i < $scope.MTests.length; i++) {
						$scope.MTests[i].Date = formatDate(new Date($scope.MTests[i].timestamp));
						$scope.MTests[i]["label"] = $scope.MTests[i].test_name + " [" +  $scope.MTests[i].Date + "]";	
					};

					//console.log(student_test_id);
					$scope.current_test=(student_test_id>0)?student_test_id.toString():$scope.MTests[0].id; //set first test as current test
					//$scope.current_test=$scope.MTests[0].id; //set first test as current test
					//console.log($scope.current_test);
					//student_test_id=0;
					//$scope.LoadScoreReports('marks');	
					$scope.LoadTestScores($scope.current_test);
					//$scope.LoadStrengthsWeaknessesMock($scope.MTests[0].id);
					$scope.loadMockTests_HeatmapNew(1);
					if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    	$scope.$apply();
        			}

					});
			};
			
			//Heatmap
			$scope.loadMockTests_Heatmap = function(page,pagesize){
				var start=(page>1)?((page-1)*pagesize):0;
				$http.get("load_custom_tests_heatmap.php?user_id="+$scope.user_id+"&start="+start+"&pagesize="+pagesize)
				.then(function (response) {
					var MTHData = response.data;
					//why here? processing data with javascript is easier than with PHP for this developer. NO.  processing data at server-side is costlier than at client-side.
					// console.log(MTHData);
					var tests = [];
					for (var i = 0; i < MTHData.sids.length; i++) {
						var sid = "s"+MTHData.sids[i];
						for (var j = 0; j < MTHData[sid].test.length; j++) {
							var sobj =  MTHData[sid].subject;
							var tobj =  MTHData[sid].test[j];
							
							if(tests["t"+tobj.test_id]==undefined)
							{
								var t = tobj.timestamp.split(/[- :]/);
								var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
								var test_data = {"TestName":tobj.test_name+" @ "+formatDate(d),"TestID":tobj.test_id,"Timestamp":tobj.timestamp,"OverAll":Math.round(tobj.Overall*100)/100,"Subjects":[]};
								tests["t"+tobj.test_id] = test_data;	
							}
							tests["t"+tobj.test_id].Subjects.push({"category":sobj.category,"Percentage":Math.round(tobj.Percentage*100)/100});
						};
	
					};
					$scope.MockTestsHeatmap=[];
					for(var key in tests){
						if(tests.hasOwnProperty(key))
						$scope.MockTestsHeatmap.push(tests[key]);
					}
	
					//$scope.MockTestsHeatmap
					//console.log($scope.MockTestsHeatmap);
				}
				);
				$timeout(function(){
					$scope.hottieApply();
				},500);
				
			}
			$scope.hm_limit = 10;	
			$scope.loadMockTests_HeatmapNew = function(pageNumber){
				$http.get("load_custom_tests_heatmap.php?user_id="+$scope.user_id+'&page='+pageNumber+"&pagesize="+$scope.hm_limit)
				.then(function (response) {
					var MTHData = response.data;
					$scope.Start = parseInt(response.data.Start);
					$scope.totalItems=response.data.total;
					$scope.pagination.current=pageNumber;
					//why here? processing data with javascript is easier than with PHP for this developer. NO.  processing data at server-side is costlier than at client-side.
					// console.log(MTHData);
					var tests = [];
					for (var i = 0; i < MTHData.sids.length; i++) {
						var sid = "s"+MTHData.sids[i];
						//console.log(MTHData[sid].test.length);
						//console.log(sid);
						for (var j = 0; j < MTHData[sid].test.length; j++) {
							var sobj =  MTHData[sid].subject;
							var tobj =  MTHData[sid].test[j];
							
								if(tests["t"+tobj.test_id]==undefined)
								{
									/*var t = tobj.timestamp.split(/[- :]/);
									var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
									var test_data = {"TestName":tobj.test_name+" @ "+formatDate(d),"TestID":tobj.test_id,"Timestamp":tobj.timestamp,"OverAll":Math.round(tobj.Overall*100)/100,"Subjects":[]};*/
									var d = formatDate(new Date(tobj.timestamp));
									var test_data = {"TestName":tobj.test_name+" @ "+d,"TestID":tobj.test_id,"review_test_link":tobj.review_test_link,"Timestamp":tobj.timestamp,"OverAll":Math.round(tobj.Overall*100)/100,"Subjects":[]};
									tests["t"+tobj.test_id] = test_data;	
								}
								tests["t"+tobj.test_id].Subjects.push({"id":sobj.id,"category":sobj.category,"Cat_Order":sobj.cat_order,"Percentage":(Math.round(tobj.Percentage*100)/100)+"%"});
							
						};
					};
					//console.log(tests);
					$scope.MockTestsHeatmap=[];
					/*for(var key in tests){
						if(tests.hasOwnProperty(key))
						$scope.MockTestsHeatmap.push(tests[key]);
					}*/
					//20/07/2018 chiranjeevi 
					for(var key in tests){
						//console.log(tests[key].Subjects);
						for (var k = 0; k < MTHData.sids.length; k++) {
							var sid = "s"+MTHData.sids[k];
							var sobj =  MTHData[sid].subject;
							//console.log(tests[key].Subjects.length);
							var found = tests[key].Subjects.find(function(element) {
								return element.id == sobj.id;
							});
							//console.log(found);
							if(!found){
							tests[key].Subjects.push({"id":sobj.id,"category":sobj.category,"Cat_Order":sobj.cat_order,"Percentage":"NA"});}
							tests[key].Subjects.sort(function(a, b){return a.Cat_Order - b.Cat_Order});
						}
						if(tests.hasOwnProperty(key)){
							$scope.MockTestsHeatmap.push(tests[key]);
						}
					}
					//console.log($scope.MockTestsHeatmap);
					$scope.MockTestsHeatmap.sort(function(p,q){
						var r = new Date(p.Timestamp);
						var s = new Date(q.Timestamp);
						return s-r;
					});
					//console.log($scope.MockTestsHeatmap);
					if ($scope.MockTestsHeatmap.length>0) {
						$timeout(function(){
							$scope.hottieApply();
						},500);
					}
					//$scope.MockTestsHeatmap
					//console.log($scope.MockTestsHeatmap);
				}
				);
				
			}

			//change the page
			$scope.changeMTestsHeatmap=function(page){
				$scope.loadMockTests_HeatmapNew(page);
			};
			//change the range
			$scope.heatmap_change=function(){
				$scope.loadMockTests_HeatmapNew(1);
			};
			//Heatmap end
			$scope.hottieApply=function(){
				$("#mc_data td").hottie({colorArray : ["#FBC5C5","#ADFAAB"], readValue : function(e) { return $(e).attr("data-hist");}});
			}
			
			$scope.formatToRound = function(value){
				var RoundOut = Math.round(value*100)/100;	
				  return RoundOut;
			};
			
			//$scope.loadMockTests_Heatmap(1,10);
			$scope.LoadCourses();
			
		});
		google.charts.load('current', {'packages':['corechart']});
		function drawMockCharts() {
        var options = custom_test_options;
		var chart=[],data=[],view = [],test_data = [];
		 //console.log(My_Subjects);
		 for (var i = 0; i < My_Subjects.length; i++) {
			var subject_id = My_Subjects[i]["id"];
			
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
		  var hh = date.getHours();var mm = date.getMinutes(); ss=date.getSeconds();

		  return "["+hh+":"+mm+":"+ss+"] "+day + ' ' + monthNames[monthIndex] + ' ' + year;
		}
		$(function () {
			/*setTimeout(function(){
			$(".nano").nanoScroller();},1000);*/
			$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			  var target = $(e.target).attr("href") // activated tab
				 //google.charts.setOnLoadCallback(drawCustomCharts);
				 //google.charts.setOnLoadCallback(drawMockChart);
				 $("#mc_data td").hottie({colorArray : ["#FBC5C5","#ADFAAB"], readValue : function(e) { return $(e).attr("data-hist");}});
			});
			$( "#menu-toggle-2" ).click(function() {
			  //google.charts.setOnLoadCallback(drawChart);
			});
		});