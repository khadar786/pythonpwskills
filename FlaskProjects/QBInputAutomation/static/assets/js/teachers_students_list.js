//Custom Test App
  	var CustomApp= angular.module('CustomTestCtrlApp',['ui.bootstrap','ngSanitize','angularUtils.directives.dirPagination']);
  	CustomApp.controller('CustomTestCtrl',function($scope,$http,$timeout){
  		$scope.all_students=[];
  		$scope.allteachers=[];
  		$scope.courses=[];
	  	$scope.user_options=[{'title':'Teacher','value':'Teacher'},{'title':'Self','value':'Self'}];
	    $scope.status_options=[{'title':'Approved','value':'1'},{'title':'Pending','value':'0'}];
	    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	    $scope.loader_fa='<i class="fa fa-circle-o-notch fa-spin" style="font-size:15px"></i>';
	    $scope.tot_qcnt=0;
	    $scope.pagination = {
	            current: 1
	    };
	    $scope.range=10;
	    $scope.search_status=0;
	   	$scope.course_id = '';
	   	$scope.campus_id=campus_id;
	    //URLS
	    $scope.teacher_students_list_url="getTeachersStudentsList.php";
	    $scope.courses_url="getCoursesList.php";

	    //Custom Test List
		$scope.getUsersList=function(pageNumber){
			
			if($scope.search_status==0)
        	$scope.tabloader=true;

			if(!$.isEmptyObject($scope.libraryTemp)){
	          if(angular.isDefined($scope.searchText))
	            searchText=$scope.searchText;
	          else
	            searchText="";

	          if(angular.isDefined($scope.course_id))
	            course_id=$scope.course_id;
	          else
	            course_id="";

	          var params = $.param({'page':pageNumber,'range':$scope.range,'search':searchText,'campus_id':campus_id,'course_id':course_id,'class_id':$scope.mentor_classes,'section_id':$scope.mentor_sections});
	    	}else{
	    	  if(angular.isDefined($scope.searchText))
	            searchText=$scope.searchText;
	          else
	            searchText="";

	          if(angular.isDefined($scope.course_id))
	            course_id=$scope.course_id;
	          else
	            course_id="";
	    		var params = $.param({'page':pageNumber,'range':$scope.range,'search':searchText,'course_id':course_id,'class_id':$scope.mentor_classes,'section_id':$scope.mentor_sections});
	    	}

			$http({method:'POST',url: $scope.teacher_students_list_url,data: params}).success(function(response, status, headers, config) {
				$scope.all_students=response.all_students;
				$scope.allteachers = response.teachers;
				$scope.totalItems = response.total;
				$scope.pagination.current=pageNumber;
				$scope.start_from=response.start_from;
				$timeout(function(){$scope.tabloader=false;},1000);
				
		          //console.log($scope.mocklists[0]);
		          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
		           $scope.$apply();
		          }
			});
			
	    };
		$scope.getSections = function()
		{
			$scope.loadCourseSections();
			$scope.getList();
		}
		$scope.loadCourseSections = function(){
			//+"&user_id="+user_id
			$http.get("getSectionsList.php?class_id="+$scope.mentor_classes)
			.then(function (response) {
				console.log(response.data);
				$scope.mentor_sections = '';
				$scope.MentorSections = response.data.sections;
				$scope.getList();
			}
			);
		}
	    //Searching based on institute or course
		 $scope.searchDB = function(){
			 //alert($scope.searchText);
			 	var course,searchText;
				$scope.search_status=0;
				if(angular.isDefined($scope.courseid))
					course=$scope.courseid;
				else
					course="";
				
				if(angular.isDefined($scope.searchText))
					searchText=$scope.searchText;
				else
					searchText="";
					
		    //if($scope.searchText.length >= 1 || $scope.courseid!=""){
			 if(searchText.length >= 1 || course!="" || searchText.length <= 1){
				  if($.isEmptyObject($scope.libraryTemp)){
					  $scope.libraryTemp = $scope.data;
					  $scope.totalItemsTemp = $scope.totalItems;
					  $scope.data = {};
				  }
				  $scope.search_status=1;
				  $scope.getUsersList(1);
			  }else{
				  if(! $.isEmptyObject($scope.libraryTemp)){
					  $scope.data = $scope.libraryTemp ;
					  $scope.totalItems = $scope.totalItemsTemp;
					  $scope.libraryTemp = {};
				  }
			  }
		};

		$scope.pageChanged=function(pageNumber){
	      //console.log(pageNumber);
	      //$scope.pagination.current=pageNumber;
	      $scope.getUsersList(pageNumber);
	    };

	    //Get Range
	    $scope.getList=function(){
	    	//console.log($scope.range);
			console.log($scope.course_id);
	    	$scope.getUsersList(1);

	    }
		//Get Subject Class
	    $scope.getSubjectClass=function(subject){
	      //console.log(subject);
	      var str='';
	      if(subject.questions_size==subject.subject_qcnt){
	         str='label label-success';
	      }else{
	         str='label label-danger';
	      }

	      return str;
	    };

	    $scope.loadAllCampus=function(){
			$http.get("load_all_campus.php")
			.then(function (response) {
				$scope.campuss = response.data;
			}
			);
		}
	    
		$scope.loadAllClasses=function(){
			$http.get("load_all_classes.php?course_id="+$scope.course_id)
			.then(function (response) {
				$scope.MentorClasses = response.data;
				//$scope.mentor_classes = $scope.MentorClasses[0].id;
				$scope.mentor_classes = '';
				$scope.getUsersList(1);
			}
			);
		}

		
	    //Get Courses
      $scope.getCourses=function(){
        //$http({method: 'POST', url: $scope.courses_url, data: params}).success(function(response, status, headers, config) {
        var params = $.param({'ct_id':''});
        $http({method: 'POST', url: $scope.courses_url, data: params}).success(function(response, status, headers, config) {
          //Courses
          $scope.courses=response.courses;
          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                  $scope.$apply();
          }
        });
      };
      $scope.loadAllCampus();
      $scope.getCourses();
	  $scope.loadAllClasses();
  	});