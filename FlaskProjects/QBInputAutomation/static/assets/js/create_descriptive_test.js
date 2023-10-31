//Custom Test App
var API_URL='api/DescriptiveTestService.php';
//wizard setup
var _ctwizardEl;
var _ctformEl;
var _ctwizard;
var _ctavatar;
var _ctvalidations = [];
_ctwizardEl = KTUtil.getById('kt_wizard');
_ctformEl = KTUtil.getById('kt_form');
var service_root='descriptive_services/';
var composeapp= angular.module('CustomTestComposerApp',['ui.bootstrap','ngSanitize','angularUtils.directives.dirPagination']);
composeapp.directive('ngFile', ['$parse', function ($parse) {
 return {
  restrict: 'A',
  link: function(scope, element, attrs) {
   element.bind('change', function(){
    $parse(attrs.ngFile).assign(scope,element[0].files[0])
    scope.$apply();
   });
  }
 };
}]);

composeapp.controller('CustomTestComposerCtrl',function($scope,$http,$timeout,$sce){
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	  //URLS
	  $scope.test_assign_to_url=service_root+"testAssignToStudents.php";
	  $scope.test_assign_to_student_url=service_root+"getAssignedStudents.php";
	  $scope.test_unassign_to_student_url=service_root+"getUnassignedStudents.php";
	  $scope.test_question_parts_url=service_root+"getQuestionParts.php";
	  $scope.loader_fa='<i class="fa fa-circle-o-notch fa-spin" style="font-size:15px"></i>';
	  $scope.loader=false;
	  $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	  $scope.user_id=user_id;
	  $scope.level=level;
	  $scope.testconfig={};
	  $scope.questions={};
	  $scope.Qrows=[];
	  $scope.overall_composed_questions=0;
	  $scope.course_title="";
	  $scope.ct_id=test_id;
	  $scope.current_course=null;
	  $scope.courses=[];
	  $scope.subjects=[];
	  $scope.all_subjects=[];
	  $scope.selected_subjects=[];
	  $scope.total_subjects_qcnt=0;
	  $scope.for_total_score = 0;
	  $scope.testSize = 0;
	  $scope.selected_qcnt=0;
      $scope.selected_q=[];
      $scope.dqmbtn=false;
      $scope.uploadbtn=false;

      //Subject Config
      $scope.subject_index=null;
      $scope.subject_id=null;
      $scope.current_subject={};
 

      //Setp 3
      $scope.data = [];
      $scope.libraryTemp = {};
      $scope.totalItemsTemp = {};
      $scope.totalItems = 0;
      $scope.users_pagination = {
            current: 1
        };
      $scope.selected_students_cnt=0;
      $scope.selected_students=[];
      $scope.assigned_students=0;
      $scope.selected_assigned_students_cnt=0;
	  $scope.selected_assigned_students=[];
	  $scope.tot_users = 0;
      //Step 4
      $scope.publishconfig={};

      $scope.Steps = {"create_test":false,"compose_qs":false,"assign_test":false,"publish":false};
      $scope.notify_options={
      	icon: 'glyphicon glyphicon-warning-sign',
      	title:'Error',
      	message:'',
      	type:'danger',
      	spacing: 10,
      	z_index: 9999,
      	timer: 1000,
      };

	  $scope._initWizard=function(){
	  	$scope.loader=true;

	  	// Initialize form wizard
		_wizard = new KTWizard(_ctwizardEl, {
			startStep: 1, // initial active step number
			clickableSteps: false  // allow step clicking
		});

		// Validation before going to next page
		_wizard.on('beforeNext', function (wizard) {
			_ctvalidations[wizard.getStep() - 1].validate().then(function(status) {
				 var edata="";
				 if(status=='Valid'){
				 	//Custom Stetp Validation
				 	if(wizard.getStep()==1){
			           
				 	}else if(wizard.getStep()==2){
				 		
				 	}else if(wizard.getStep()==3){

				 	}else if(wizard.getStep()==4){

				 	}

			 		if(edata!=""){
				        Swal.fire({
				        	title: '<strong>Please fix the following issues:</strong>',
			                icon: "error",
			                html:edata,
			                buttonsStyling: false,
			                confirmButtonText: "Ok, got it!",
							customClass: {
								confirmButton: "btn font-weight-bold btn-light"
							}
			            }).then(function() {
							//KTUtil.scrollTop();
						});

						_wizard.stop();
		            }


		            if(wizard.getStep()==1){
		            	$("#next-step").attr('disabled',true);
		            	$scope.step_loader = true;
		            	$scope.loader=true;
			            /*var params=$.param({'course_id':$scope.current_course,
	                                  'ct_id':$scope.ct_id,
	                                  'title':$scope.title,
	                                  'testSize':$scope.testSize,
	                                  'subject_id':$scope.subject_id,
	                                  'test_type_id':$scope.testType,
	                                  'action':'createDescriptiveTest',
	                                  'user_id':$scope.user_id,
	                                  'level':$scope.level
	                                });*/
			            var params=$.param({'course_id':$scope.current_course,
	                                  'ct_id':$scope.ct_id,
	                                  'title':$scope.title,
	                                  'subject_id':$scope.subject_id,
	                                  'test_type_id':$scope.testType,
	                                  'action':'createDescriptiveTest',
	                                  'user_id':$scope.user_id,
	                                  'level':$scope.level
	                                });

					  //Save or Update
		              $http({method: 'POST',url:API_URL,data: params}).success(function(response, status, headers, config) {
		                  if(response.ct_id>0){
		                  	$scope.testconfig=response.testconfig;
		                    $scope.subject_id=response.subject_id;
		                    $scope.ct_id=response.ct_id;
		                    $scope.Qrows=response.questions;
		                    $scope.Steps.create_test=true;
		                    $scope.Return_Status=true;

		               		if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
		                         $scope.$apply();
		                    }
		                    _wizard.goNext();
		               		KTUtil.scrollTop();
		               		$("#next-step").attr('disabled',false);
		               		$scope.step_loader = false;
		               		$scope.loader=false;
		                  }
		              });
		            }else if(wizard.getStep()==2){
		            	var error="";
		            	if($scope.testconfig.testSize==0){
		            		error+="Questions are required<br>";
		            	}

		            	if($scope.testconfig.is_uploaded==0){
		            		error+="Upload question paper is required<br>";
		            	}

		            	var qerror="";
		            	$.each($scope.Qrows, function(index, element) {
		            		if(element.questionParts>0){
		            			if(element.marks_per_question>element.total_marks){
		            				qerror+="<b>Qno "+(index+1)+"<b/> alloted max marks ("+element.marks_per_question+") should be equal to Q.Parts total marks ("+element.total_marks+")<br>";
		            			}
		            		}
		            	});
		            	error+=qerror;

		            	if(error!=""){
		            		Swal.fire({
					        	title: '<strong>Please fix the following issues:</strong>',
				                icon: "error",
				                html:error,
				                buttonsStyling: false,
				                confirmButtonText: "Ok, got it!",
								customClass: {
									confirmButton: "btn font-weight-bold btn-light"
								}
				            }).then(function() {
								//KTUtil.scrollTop();
							});

		            		return;
		            	}

		            	if($scope.testconfig.testSize>0 && $scope.testconfig.is_uploaded>0){
		            		$scope.isAssignAllSelected =false;
		            		$scope.isAllSelected =false;
		            		$scope.selected_assigned_students_cnt=0;
		            		$scope.selected_students_cnt=0;
		            		$scope.getStudents();
		            		_wizard.goNext();
		            	}else{
		            		$scope.Return_Status=false;
							_wizard.stop();
		            	}

		            	/*if($scope.overall_composed_questions==0){
		            		error+="Questions are required<br>";
		            	}

		            	if(error!=""){
		            		Swal.fire({
					        	title: '<strong>Please fix the following issues:</strong>',
				                icon: "error",
				                html:error,
				                buttonsStyling: false,
				                confirmButtonText: "Ok, got it!",
								customClass: {
									confirmButton: "btn font-weight-bold btn-light"
								}
				            }).then(function() {
								//KTUtil.scrollTop();
							});

		            		return;
		            	}

		            	if($scope.overall_composed_questions==$scope.testSize){
		            		//$scope.setDates();
		            		$scope.isAssignAllSelected =false;
		            		$scope.isAllSelected =false;
		            		$scope.selected_assigned_students_cnt=0;
		            		$scope.selected_students_cnt=0;
		            		$scope.getStudents();
		            		_wizard.goNext();
		            	}else{
		            		var edata = "You didn't reach your questions limit. Composed questions <span class='label label-inline label-success font-weight-bold'>"+$scope.overall_composed_questions+"</span><br> you required questions <span class='label label-inline label-warning font-weight-bold'>"+($scope.testSize-$scope.overall_composed_questions)+"</span>";
		            		bootbox.alert({
			                      message:edata,
			                      // size:"small",
			                      title:"Please fix the following issues:",
			                      backdrop:true
			                  });

			                  $scope.Return_Status=false;

							_wizard.stop();
			            }*/

		            }else if(wizard.getStep()==3){
		            	var edata="";
		            	//assigned_students
			            if($scope.tot_users==0){
			              edata += "<b style='color:red;'>Please assign to sections for this </b><span class='label label-inline label-success font-weight-bold'>"+$scope.title+"</span>";
			              if(edata!= ""){
			                  bootbox.alert({
			                      message:edata,
			                      // size:"small",
			                      title:"Please fix the following issues:",
			                      backdrop:true
			                  });
			                  $scope.Return_Status=false;
			                  _wizard.stop();
			              }
			            }else{
			              _wizard.goNext();
			            }
			           
			            _wizard.goNext();
		            }else{
		            	//console.log("test");

		            }
             	 	

				 	//console.log(wizard.getStep());
				 	//console.log('####');
				 	//_wizard.goNext();
					//KTUtil.scrollTop();
				}else{
				 	Swal.fire({
		                text: "Sorry, looks like there are some errors detected, please try again.",
		                icon: "error",
		                buttonsStyling: false,
		                confirmButtonText: "Ok, got it!",
						customClass: {
							confirmButton: "btn font-weight-bold btn-light"
						}
		            }).then(function() {
						KTUtil.scrollTop();
					});
				}
			});

			_wizard.stop();  // Don't go to the next step
		});	
		
		// Change Event
		_wizard.on('change', function (wizard) {
			KTUtil.scrollTop();
		});

		
		$scope.getCourses();
	  }

	  //Formvalidation
	  $scope._initFormValidation=function(){
	  	// Validation Rules For Step 1
	  	_ctvalidations.push(FormValidation.formValidation(
			_ctformEl,
			{
				fields:{
					title:{
						validators: {
							notEmpty: {
								message: 'Test name is required'
							},
							stringLength: {
		                        min: 4,
		                        message: 'Minimum 4 letters required'
		                    }
						}
					},
					testType:{
						validators: {
							notEmpty: {
								message: 'Test type is required'
							}
						}
					},
					subject_id:{
						validators: {
							notEmpty: {
								message: 'Subject is required'
							}
						}
					}
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));

	  	// Validation Rules For Step 2
		_ctvalidations.push(FormValidation.formValidation(
			_ctformEl,
			{
				fields:{},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));

		// Validation Rules For Step 3
		_ctvalidations.push(FormValidation.formValidation(
			_ctformEl,
			{
				fields:{},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));

		// Validation Rules For Step 4
		_ctvalidations.push(FormValidation.formValidation(
			_ctformEl,
			{
				fields:{},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));

	  }

	  //Get Courses
      $scope.getCourses=function(){
        var params = $.param({'ct_id':$scope.ct_id,'action':'courses','user_id':$scope.user_id,'level':$scope.level});
        $http({method: 'POST',url:API_URL,data:params}).success(function(response, status, headers, config) {
          //Courses
          $scope.courses=response.courses;
          $scope.test_types=response.test_types;
          if($scope.ct_id>0){
          	$scope.testconfig=response.testconfig;
            $scope.current_course=response.testconfig.course_id;
            $scope.course_id=$scope.current_course;
            $scope.course_title=response.testconfig.course_title;
            $scope.title=response.testconfig.title;
            $scope.testType=response.testconfig.test_type_id;
            $scope.subject_id=response.testconfig.subject_id;
           	//$scope.getSubjects($scope.course_id);
          }else{
          	if($scope.level==2){
          		$scope.testconfig=response.testconfig;
           		$scope.current_course=response.testconfig.course_id;
            	$scope.course_id=$scope.current_course;
            	$scope.course_title=response.testconfig.course_title;
          	}
          }

          $scope.getSubjects();
          $scope.publishconfig=response.publish_config;
          
          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                  $scope.$apply();
          }
          //console.log($scope.courses);
        });
      };
      $scope.getCourse = function(){
      	var index = $("#subject_id").val();
      	var test_type_index = $("#testType").val();
		console.log();
		$scope.current_course=$scope.subjects[index].course_id;
		$scope.course_id = $scope.current_course;
		$scope.current_subject = $scope.subjects[index].subject_name;
		$scope.current_test_type = $scope.test_types[test_type_index].test_type;
      }
      //Get Subjects based on Course
      $scope.getSubjects=function(){
        $scope.subjects_loader=true;
        //$scope.current_course=course_id;
        var params = $.param({'ct_id':$scope.ct_id,'course_id':$scope.course_id,'action':'getsubjects','user_id':$scope.user_id,'level':$scope.level});
        $http({method: 'POST',url:API_URL,data: params}).success(function(response, status, headers, config) {
          $scope.subjects=response.subjects;
          $scope.subject_err=response.error;
          $scope.loader=false;
          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
              $scope.$apply();
          }
          
        });
      };


	// Get Sections on course
	$scope.getSections=function(course_id){
		var params = $.param({'course_id':course_id,'action':'getsubjects','user_id':$scope.user_id,'level':$scope.level});
        $http({method: 'POST', url: "getSectionsList.php",data: params}).success(function(response, status, headers, config) {
			$scope.sections=response.sections;	
			$("#section_id option").remove();
			for(var k=0;k<$scope.sections.length;k++){
				$('#section_id').append('<option value="'+$scope.sections[k].section_id+'">'+$scope.sections[k].section_name+'</option>');
			}
			$('#section_id').multiselect('destroy');
			$('#section_id').multiselect({		
				nonSelectedText: 'Select Section',
				dropRight: true,
				includeSelectAllOption: true,
				numberDisplayed: 5				
			});
			$scope.getStudents(1);
			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
			  $scope.$apply();
			}
          
        });
	};

    $scope.files = [];

    $scope.uploadedFile = function(element) {
          $scope.currentFile = element.files[0];
          $scope.files = element.files;
    };
    // publish submit btn start
    $scope.publishtest_config = function(){
    	//console.log('test test');
    	//Publish
        var edata="";
        if($scope.publishconfig.test_status==false){
          return true;
        }else{
            if(angular.isUndefined($scope.publishconfig.start_date) || $scope.publishconfig.start_date=="")
            {
              edata += "<b style='color:red;'>Please provide start date </b>";
            }

            if(angular.isUndefined($scope.publishconfig.end_date) || $scope.publishconfig.end_date=="")
            {
              edata += "<b style='color:red;'>Please provide end date </b>";
            }

            if(edata!= ""){
				Swal.fire({
				  icon: 'error',
				  title: 'Please fix the following issues',
				  html: edata,
				  footer: ''
				})

                $scope.Return_Status=false;
                return false;
            }else{
              $scope.publishconfig.start_date=$("#start_date").val();
              $scope.publishconfig.end_date=$("#end_date").val();
              //console.log( $scope.publishconfig.start_date+'---'+$scope.publishconfig.end_date);
              var startTime = new Date($scope.publishconfig.start_date);
              var endTime = new Date($scope.publishconfig.end_date);
              //console.log("s"+startTime+'----'+endTime);
              var difference = endTime.getTime()-startTime.getTime(); // This will give difference in milliseconds
              var resultInMinutes = Math.round(difference / 60000);
              var exam_expiry_time=exam_start_time="";
              
              
              var current_date =new Date();

              if(resultInMinutes>0){

                  //Test Expiry Date
                  var hourDiff = endTime - startTime; //in ms
                  var secDiff = hourDiff / 1000; //in s
                  var minDiff = hourDiff / 60 / 1000; //in minutes
                  var hDiff = hourDiff / 3600 / 1000; //in hours
                  //var humanReadable = {};
                  //humanReadable.hours = Math.floor(hDiff);
                  //humanReadable.minutes = minDiff - 60 * humanReadable.hours;
                  var hours = Math.floor(hDiff);
                  var minutes = minDiff-(60 * hours);
                  var seconds = secDiff-(60 * hours * minutes);
                  exam_expiry_time=hours+" Hrs "+minutes+" Min ";

                  //Test Start Time
                  var current_hourDiff =startTime-current_date; //in ms
                  if(current_hourDiff>0){
                    var current_minDiff = current_hourDiff / 60 / 1000; //in minutes
                    var current_hDiff =current_hourDiff / 3600 / 1000; //in hours

                    var current_hours = Math.floor(current_hDiff);
                    var current_minutes = Math.round(current_minDiff-(60 * current_hours));
                    exam_start_time=current_hours+" Hrs "+current_minutes+" Min ";
                  }else{
                    exam_start_time=0+" Hrs "+0+" Min ";
                  }
                  
              }else{
                exam_expiry_time=0+" Hrs "+0+" Min ";
                exam_start_time=0+" Hrs "+0+" Min ";
              }

              //Confimation for publishing test
              bootbox.confirm({
                title: " Are you sure do you want to publish <span class='label label-inline label-success font-weight-bold'>"+$scope.title+"</span> ?" ,
                message:"Users can start the test with in <span class='label label-inline label-success font-weight-bold'>"+exam_start_time+"</span><br>Test expires on <span class='label label-inline label-danger font-weight-bold'>"+exam_expiry_time+"</span>",
                buttons: {
                  cancel: {
                    label: '<i class="fa fa-times"></i> Cancel'
                  },
                  confirm: {
                    label: '<i class="fa fa-check"></i> Confirm'
                  }
                },
                callback: function (result) {
                  //console.log('This feature comming soon');
                  if(result==true){
                     //console.log('This was logged in the callback: ' + result);
                     $scope.publishTestConfig();
                  }
                }
              });

              return false;
            }

        }
    }
    // publish submit btn end
    //Publish Test
    $scope.publishTestConfig=function(){
      //publish_processing
      //publish_loading_img
      //publish_success
      $("#publish_processing").modal({
          backdrop: 'static',
          keyboard: false  // to prevent closing with Esc button (if you want this too)
      });
      $scope.publish_loading_img=true;

      var params = $.param({'ct_id':$scope.ct_id,
                          'publishconfig':$scope.publishconfig,
                          'title':$scope.title,
                          'action':'publish_test'
                        });
      //Save or Update
        $http({method: 'POST',url:API_URL,data: params}).success(function(response, status, headers, config) {
      

            if(response.update_status==true){
              $scope.publish_loading_img=false;
              $scope.publish_success_msg=$scope.title+" Published Successfully";
              $scope.publish_success=true;

              $timeout(function(){
                $("#publish_processing").modal('hide');
                $('.modal-backdrop').remove();
                location.replace("descriptive-test-list");
              },2000);
            }
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                 $scope.$apply();
            }
      });
    }



    $scope.pagination = {
            current: 1
      };

    

    $scope.pageChanged=function(pageNumber){
      renderQuestions();
      if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
           $scope.$apply();
      }
    };
    $scope.pageChangedQ=function(pageNumber){
      renderQuestions();
    }

    $scope.UnassignedStudents=function(){
		$scope.tabloader=true;
		$scope.currentPage = 1;
		var params=$.param({course_id:$scope.course_id,'subject_id':$scope.subject_id,test_id:$scope.ct_id});
		$http({method: 'POST',url:$scope.test_unassign_to_student_url,data: params}).success(function(data, status, headers, config) {
	      	//console.log(data);
			$scope.UnAssignData = data.users;
	      	$scope.AllUnassignedStudents=data.users;
	      	$scope.totalItems=data.tot_users;
	      	$scope.tabloader=false;
			if($scope.totalItems>0){
				$scope.chapter_unuprocess=false;
			}else{
				$scope.chapter_unuprocess=true;
			}
	      	if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
				$scope.$apply();
			}
	    });
	}
  $scope.AssignedStudents=function(){
		$scope.user_tabloader=true;
		$scope.chapter_uprocess=false;
		var params=$.param({course_id:$scope.course_id,'subject_id':$scope.subject_id,test_id:$scope.ct_id});
		$http({method: 'POST',url:$scope.test_assign_to_student_url,data: params}).success(function(data, status, headers, config) {
	      	//console.log(data);
	      	$scope.AllAssignedStudents=data.users;
			$scope.AssignedData = data.users;
			$scope.tot_users=data.tot_users;
	      	$scope.user_tabloader=false;
			$scope.ucurrentPage = 1;
			if($scope.tot_users>0){
				$scope.chapter_uprocess=false;
			}else{
				$scope.chapter_uprocess=true;
			}
	      	if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
				$scope.$apply();
			}
	    });
	}
	  $scope.getStudents = function(){
		$scope.UnassignedStudents(); 
		$scope.AssignedStudents(); 
	  }
    $scope.userToggleAll = function() {
          //alert(toggleStatus+'tt');
         var toggleStatus = $scope.isAllSelected;
         
         angular.forEach($scope.UnAssignData, function(itm){ 
          //alert(itm.done+'tt');
         itm.done_status = toggleStatus; });
         $scope.getStudentsSelectedCount();   
      }
    
      $scope.userOptionToggled = function(){
        $scope.isAllSelected = $scope.UnAssignData.every(function(itm){ return itm.done_status; })
        $scope.getStudentsSelectedCount();
      }

      $scope.getStudentsSelectedCount=function(){
        var selectedSIds = [];
        $scope.selected_students_cnt=0;
        $scope.selected_students=[];
        angular.forEach($scope.UnAssignData, function(itm,key){ 
            if(itm.done_status==true)
            selectedSIds.push(itm.section_id);
        });

        $scope.selected_students_cnt=selectedSIds.length;
        $scope.selected_students=selectedSIds;
        //console.log($scope.selected_students_cnt);
      }
      
      $scope.checkStudentsSelectedCount=function(){
        var selectedSIds = [];
        $scope.selected_students=[];
        angular.forEach($scope.UnAssignData, function(itm,key){ 
            if(itm.done_status==true)
            selectedSIds.push(itm.section_id);
        });
        $scope.ck_selected_students_cnt=selectedSIds.length;
        $scope.selected_students=selectedSIds;
        return  $scope.ck_selected_students_cnt;
      };
	  // Assign button code start
	  $scope.userAssignToggleAll = function() {
          //alert(toggleStatus+'tt');
         var toggleStatus = $scope.isAssignAllSelected;
         
         angular.forEach($scope.AssignedData, function(itm){ 
          //alert(itm.done+'tt');
         itm.done_status = toggleStatus; });
         $scope.getStudentsAssinedSelectedCount();   
      }
	  $scope.userOptionAssignToggled = function(){
        $scope.isAssignAllSelected = $scope.AssignedData.every(function(itm){ return itm.done_status; })
        $scope.getStudentsAssinedSelectedCount();
      }
	  $scope.getStudentsAssinedSelectedCount=function(){
        var selectedAssingedSIds = [];
        $scope.selected_assigned_students_cnt=0;
        $scope.selected_assigned_students=[];
        angular.forEach($scope.AssignedData, function(itm,key){ 
            if(itm.done_status==true)
            selectedAssingedSIds.push(itm.section_id);
        });

        $scope.selected_assigned_students_cnt=selectedAssingedSIds.length;
        $scope.selected_assigned_students=selectedAssingedSIds;
        //console.log($scope.selected_students_cnt);
      }
	  $scope.checkStudentsassignedSelectedCount=function(){
        var selectedAssingedSIds = [];
        $scope.selected_assigned_students=[];
        angular.forEach($scope.AssignedData, function(itm,key){ 
            if(itm.done_status==true)
            selectedAssingedSIds.push(itm.section_id);
        });
        $scope.ck_selected_assigned_students_cnt=selectedAssingedSIds.length;
        $scope.selected_assigned_students=selectedAssingedSIds;
        return  $scope.ck_selected_assigned_students_cnt;
      };
	  // Assign button code end
    //Assign to Selected Users
    $scope.assignToEnroll=function(param){
      var edata = "";
      if(param=="selected_enroll"){
        var ck_selected_students_cnt=$scope.checkStudentsSelectedCount();
        if($scope.selected_students_cnt==0 && ck_selected_students_cnt==0){
          edata += "<b style='color:red;'>Please select section</b> <br/>";
        }
      }

      if(edata!= ""){
          bootbox.alert({
              message:"Please fix the following issues:<br/>"+edata,
              // size:"small",
              title:$scope.title,
              backdrop:true
          });

          return false;
       }

      $("#assign_processing").modal({
          backdrop: 'static',
          keyboard: false  // to prevent closing with Esc button (if you want this too)
      });
      $scope.assign_loading_img=true;

      var params = $.param({'course_id':$scope.current_course,'subject_id':$scope.subject_id,'test_id':$scope.ct_id,'students':$scope.selected_students,'assignto':param});
      $http({method: 'POST',url:$scope.test_assign_to_url,data:params}).success(function(response, status, headers, config) {
          $scope.assign_loading_img=false;
          $scope.assign_loading_msg=true;
          $scope.no_of_add_cnt=response.add_cnt;
          $scope.no_of_remove_cnt=response.removed_cnt;
          $scope.no_of_exist_cnt=response.exist_cnt;
          $scope.no_of_users_enroll_msg=" Assigned successfully";
          $scope.no_of_users_exist_msg="  already existed";
          $scope.no_of_users_unenroll_msg="  Unassigned successfully";
          //$scope.assign_message=response.message;
          $scope.isAllSelected =false;
          $scope.selected_students_cnt=0;
          $scope.selected_students=[];
          
		  $timeout(function() {
				$("#assign_processing").modal("hide");
			}, 1000);
		  $scope.UnassignedStudents();
          $scope.AssignedStudents();
			
          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
              $scope.$apply();
          }
       }); 
    };
	
	$scope.assignToUnroll=function(param){
      var edata = "";
      if(param=="selected_unassign"){
        var ck_selected_assigned_students_cnt=$scope.checkStudentsassignedSelectedCount();
        if($scope.selected_assigned_students==0 && ck_selected_assigned_students_cnt==0){
          edata += "<b style='color:red;'>Please select section</b> <br/>";
        }
        var selected_assigned_students=($scope.selected_assigned_students>0)?$scope.selected_assigned_students:ck_selected_assigned_students_cnt;
      }else{
        var selected_assigned_students=$scope.tot_users;
      }

      if(edata!= ""){
	      	Swal.fire({
			  title:$scope.title,
			  html:"Please fix the following issues:<br/>"+edata,
			  icon: 'warning',
			  showCancelButton: false,
			  cancelButtonColor: '#d33',
			});

          /*bootbox.alert({
              message:"Please fix the following issues:<br/>"+edata,
              // size:"small",
              title:$scope.title,
              backdrop:true
          });*/

          return false;
       }


       Swal.fire({
		  title: 'Unassign <span class="label-inline label-danger font-weight-bold">'+$scope.selected_assigned_students_cnt+' sections</span>',
		  html:" Are you sure do you want to unassign this sections from <span class='label label-inline label-warning font-weight-bold'>"+$scope.title+"</span> ?",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
		  if(result.value) {
		  	$scope.deleteUnrollUsers(param);
		  }
		});

      /* bootbox.confirm({
          title: "Unassign <span class='label-inline label-danger font-weight-bold'>"+$scope.selected_assigned_students_cnt+" students</span>",
          backdrop:true,
          message:" Are you sure do you want to unassign this sections from <span class='label label-inline label-warning font-weight-bold'>"+$scope.title+"</span> ?",
          buttons: {
            cancel: {
              label: '<i class="fa fa-times"></i> Cancel'
            },
            confirm: {
              label: '<i class="fa fa-check"></i> Confirm'
            }
          },
          callback: function (result) {
            //console.log('This feature comming soon');
            if(result==true){
               //$scope.deleteQuestion(index);
               $scope.deleteUnrollUsers(param);
            }
          }
      });*/

    }
	$scope.deleteUnrollUsers=function(param){
      $("#assign_processing").modal({
          backdrop: 'static',
          keyboard: false  // to prevent closing with Esc button (if you want this too)
      });
      $scope.assign_loading_img=true;

      var params = $.param({'course_id':$scope.current_course,'test_id':$scope.ct_id,'students':$scope.selected_assigned_students,'assignto':param});
      $http({method: 'POST',url:$scope.test_assign_to_url,data:params}).success(function(response, status, headers, config) {
          $scope.assign_loading_img=false;
          $scope.assign_loading_msg=true;
          $scope.no_of_add_cnt=response.add_cnt;
          $scope.no_of_remove_cnt=response.removed_cnt;
          $scope.no_of_exist_cnt=response.exist_cnt;
          $scope.no_of_users_enroll_msg=" Unassigned successfully";
          $scope.no_of_users_exist_msg="  already existed";
          $scope.no_of_users_unenroll_msg="  Unassigned successfully";
          //$scope.assign_message=response.message;
          $scope.isAssignAllSelected =false;
          $scope.selected_assigned_students_cnt=0;
          $scope.selected_assigned_students=[];
			$timeout(function() {
				$("#assign_processing").modal("hide");
			}, 1000);
		  $scope.UnassignedStudents();
          $scope.AssignedStudents();
		  
          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
              $scope.$apply();
          }
       }); 
    }

    //Set Dates
    $scope.setDates=function(){
      $scope.publishconfig.start_date=$("#start_date").val();
      $scope.publishconfig.end_date=$("#end_date").val();
      //console.log($scope.publishconfig.start_date+"-----"+$scope.publishconfig.end_date);
      /*if(angular.isDefined($scope.publishconfig.start_date) && angular.isDefined($scope.publishconfig.end_date)){
       // $scope.course_disable=false;
      }*/
       if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
             $scope.$apply();
       }
    };

   
	$scope.addQuestions = function() {
		$scope.nq=null;
		$scope.marks_per_question=null;
		$scope.addsubmitbtn=false;
		$scope.nq_err="";
		$('#addquestions').modal('show');
	}

	$scope.submitQ=function(){
		$scope.nq_err="";
		if(angular.isUndefined($scope.nq) || $scope.nq=="undefined" || $scope.nq==null){
			$scope.nq_err+="No of questions are required<br>";
		}

		if(angular.isUndefined($scope.marks_per_question) || $scope.marks_per_question=="undefined" || $scope.marks_per_question==null){
			$scope.nq_err+="Marks per question is required<br>";
		}

		if($scope.nq_err!=""){
			$scope.notify_options.type='danger';
			$scope.notify_options.title='Error';
			$scope.notify_options.message=$scope.nq_err;
			$scope.notifyAlerts();
			return;
		}
		
		
		if($scope.addsubmitbtn){
			return;
		}
		$scope.addsubmitbtn=true;

		var params=$.param({
							'test_id':$scope.ct_id,
							'nq':$scope.nq,
							'marks_per_question':$scope.marks_per_question,
							'course_id':$scope.testconfig.course_id,
							'subject_id':$scope.testconfig.subject_id,
							'action':'addQuestions'
						});

		$http({method: 'POST',url:API_URL,data:params})
		.success(function(response, status, headers, config){
			$scope.Qrows=response.questions;
			$scope.testconfig.testSize=response.test_details.testSize;
			$scope.testconfig.for_total_score=response.test_details.for_total_score;
			if(response.qadded){
				$scope.addsubmitbtn=false;
				$scope.notify_options.type='success';
				$scope.notify_options.title='Success';
				$scope.notify_options.message=$scope.nq+' questions added successfully!';
				$scope.notifyAlerts();
				$('#addquestions').modal('hide');	
			}

			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest'){
			  $scope.$apply();
			}
		})
		.error(function(response){

		});
	}

	$scope.addParts=function(pindex){
		$scope.pnq=null;
		$scope.pmarks_per_question=null;
		$scope.is_choice='Y';
		////$("input[name='is_choice'][value='Y']").prop('checked',true);
		$scope.pindex=null;
		$scope.paddsubmitbtn=false;
		$scope.pnq_err="";
		$scope.pindex=pindex;
		$scope.qparent={};
		$scope.qparent=$scope.Qrows[$scope.pindex];

		$('#addpartsq').modal('show');
		if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest'){
			  $scope.$apply();
		}
	}

	$scope.psubmitQ=function(){
		//console.log($scope.is_choice);
		//console.log($scope.Qrows[$scope.pindex]);
		$scope.pnq_err="";
		if(angular.isUndefined($scope.pnq) || $scope.pnq=="undefined" || $scope.pnq==null){
			$scope.pnq_err+="No of questions are required<br>";
		}

		if(angular.isUndefined($scope.pmarks_per_question) || $scope.pmarks_per_question=="undefined" || $scope.pmarks_per_question==null){
			$scope.pnq_err+="Marks per question is required<br>";
		}

		if($scope.pnq==1 && $scope.is_choice=='Y'){
			$scope.pnq_err+="Choice Questions should be required 2 or more<br>";
		}

		if($scope.Qrows[$scope.pindex].is_have_choice=='Y' && $scope.is_choice=='Y'){
			$scope.pnq_err+="Choice Questions already existed<br>";
		}

		if($scope.pnq_err!=""){
			$scope.notify_options.type='danger';
			$scope.notify_options.title='Error Q'+($scope.pindex+1)+' parts';
			$scope.notify_options.message=$scope.pnq_err;
			$scope.notifyAlerts();
			return;
		}

		if($scope.is_choice=='Y'){
			var total_marks=parseInt($scope.Qrows[$scope.pindex].total_marks)+$scope.pmarks_per_question;
		}else if($scope.is_choice=='N'){
			var total_marks=parseInt($scope.Qrows[$scope.pindex].total_marks)+($scope.pnq*$scope.pmarks_per_question);
		}
		
		if(total_marks>$scope.Qrows[$scope.pindex].marks_per_question){
			$scope.pnq_err+="<b>"+($scope.pindex+1)+" Q.Parts<b/> total marks ("+total_marks+") greater than <b>Qno "+($scope.pindex+1)+"<b/> alloted max marks ("+$scope.Qrows[$scope.pindex].marks_per_question+") <br>";
		}

		/*var total_qparts_score=($scope.pnq*$scope.pmarks_per_question);
		if($scope.is_choice=='Y'){
			if($scope.pmarks_per_question>$scope.Qrows[$scope.pindex].marks_per_question){
				$scope.pnq_err+="<b>"+($scope.pindex+1)+" Q.Parts<b/> total marks ("+$scope.pmarks_per_question+") greater than <b>Qno "+($scope.pindex+1)+"<b/> alloted max marks ("+$scope.Qrows[$scope.pindex].marks_per_question+") <br>";
			}
		}else if($scope.is_choice=='N'){
			if(total_qparts_score>$scope.Qrows[$scope.pindex].marks_per_question){
				$scope.pnq_err+="<b>"+($scope.pindex+1)+" Q.Parts<b/> total marks ("+total_qparts_score+") greater than <b>Qno "+($scope.pindex+1)+"<b/> alloted max marks ("+$scope.Qrows[$scope.pindex].marks_per_question+") <br>";
			}
		}*/

		

		if($scope.pnq_err!=""){
			$scope.notify_options.type='danger';
			$scope.notify_options.title='Error Q'+($scope.pindex+1)+'';
			$scope.notify_options.message=$scope.pnq_err;
			$scope.notifyAlerts();
			return;
		}
		//console.log($scope.Qrows[$scope.pindex]);

		
		
		if($scope.paddsubmitbtn){
			return;
		}
		$scope.paddsubmitbtn=true;

		var params=$.param({
							'test_id':$scope.ct_id,
							'nq':$scope.pnq,
							'marks_per_question':$scope.pmarks_per_question,
							'is_choice':$scope.is_choice,
							'course_id':$scope.testconfig.course_id,
							'subject_id':$scope.testconfig.subject_id,
							'pindex':$scope.pindex,
							'parent_id':$scope.qparent.mid,
							'action':'addQParts'
						});

		$http({method: 'POST',url:API_URL,data:params})
		.success(function(response, status, headers, config){
			$scope.Qrows[$scope.pindex]=response.qdetails;
			$scope.testconfig.testSize=response.test_details.testSize;
			$scope.testconfig.for_total_score=response.test_details.for_total_score;
			if(response.qadded){
				$scope.paddsubmitbtn=false;
				$scope.notify_options.type='success';
				$scope.notify_options.title='Success';
				$scope.notify_options.message='Q'+($scope.pindex+1)+' '+$scope.pnq+' parts added successfully!';
				$scope.notifyAlerts();
				$('#addpartsq').modal('hide');
			}

			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest'){
			  $scope.$apply();
			}
		})
		.error(function(response){
			$scope.paddsubmitbtn=false;
		});
	}
	
	$scope.uploadQuestionPaper=function(){
		 var error="";
		 if(angular.isUndefined($scope.uploadfile) || $scope.uploadfile=="undefined" || $scope.uploadfile==null){
			error+="File is required";
		}

		if(error!=""){
			Swal.fire({
			  icon: 'error',
			  title: 'Please fix below error',
			  text:error,
			  footer: ''
			})

			return;
		}

		if($scope.uploadbtn){
			return;
		}
		$scope.uploadbtn=true;

		 var fd=new FormData();
		 fd.append('file',$scope.uploadfile);
		 fd.append('test_id',$scope.ct_id);
		 fd.append('course_id',$scope.testconfig.course_id);
		 fd.append('subject_id',$scope.testconfig.subject_id);
		 fd.append('action','uploadQPaper');

		 $http({method: 'POST',url:API_URL,data:fd,headers: {'Content-Type': undefined},})
		.success(function(response, status, headers, config){
			$scope.uploadbtn=false;
			if(response.is_uploaded){
				$scope.testconfig.is_uploaded=response.test_details.is_uploaded;
				$scope.testconfig.test_attached_file=response.test_details.test_attached_file;

				$scope.notify_options.type='success';
				$scope.notify_options.title='Success';
				$scope.notify_options.message='File uploaded successfully!';
				$scope.notifyAlerts();
			}
		

			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest'){
			  $scope.$apply();
			}
		}).error(function(response){
			$scope.uploadbtn=false;
		});
	}

	$scope.notifyAlerts=function(){
		$.notify({
				// options
				icon: 'glyphicon glyphicon-warning-sign',
				title: $scope.notify_options.title,
				message: $scope.notify_options.message 
			},{
				// settings
				element: 'body',
				position: null,
				type: $scope.notify_options.type,
				allow_dismiss:$scope.notify_options.allow_dismiss,
				newest_on_top: false,
				showProgressbar: false,
				placement: {
					from: "top",
					align: "right"
				},
				offset: 20,
				spacing: $scope.notify_options.spacing,
				z_index: $scope.notify_options.z_index,
				timer: $scope.notify_options.timer,
				mouse_over: null,
				animate: {
					enter: 'animated fadeInDown',
					exit: 'animated fadeOutUp'
				}
			});
	}

	$scope.qToggleAll=function(){
		var toggleStatus = $scope.isQAllSelected;
		angular.forEach($scope.Qrows, function(itm){ 
         itm.done_status=toggleStatus; 
       });
	   $scope.getQSelectedCount();
	}

	$scope.qOptionToggled=function(){
		 $scope.isQAllSelected=$scope.Qrows.every(function(itm){return itm.done_status;})
		 $scope.getQSelectedCount();
	}

	$scope.getQSelectedCount=function(){
        var selectedQIds = [];
        $scope.selected_qcnt=0;
        $scope.selected_q=[];
        angular.forEach($scope.Qrows,function(itm,key){ 
            if(itm.done_status==true)
            selectedQIds.push(itm.mid);
        });

        $scope.selected_qcnt=selectedQIds.length;
        $scope.selected_q=selectedQIds;
        //console.log($scope.selected_qcnt);
        if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest'){
			  $scope.$apply();
		}
    }

	$scope.removeQuestions=function(index){
		$scope.delq={};
		$scope.delq=$scope.Qrows[index];
		Swal.fire({
		  title: 'Are you sure?',
		  html:"You want to delete this <b>Q"+(index+1)+"</b> !",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
		  if(result.value) {
		  	$scope.loader=true;
		  	$scope.removeQ(index);
		  }else{
		  	$scope.loader=false;
		  }
		});
	}

	$scope.removeSQuestions=function(pindex,sindex){
		$scope.delq={};
		$scope.delsq={};
		$scope.delq=$scope.Qrows[pindex];
		$scope.delsq=$scope.Qrows[pindex]['subquestions'][sindex];

		var msg="";
		if($scope.delsq.is_choice=='Y'){
			var qlist=[];
			$.each($scope.Qrows[pindex]['subquestions'], function(index, element) {
				if(element.is_choice=='Y'){
					qlist.push("Q"+(pindex+1)+"."+(index+1));
				}
			});
			msg="You want to delete this <b> "+qlist.join(',')+" </b>choice questions !";
		}else{
			msg="You want to delete this <b>Q"+(pindex+1)+"."+(sindex+1)+"</b> !";
		}

		Swal.fire({
		  title: 'Are you sure?',
		  html:msg,
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
		  if(result.value) {
		  	$scope.loader=true;
		  	$scope.removeSQ(pindex,sindex);
		  }else{
		  	$scope.loader=false;
		  }
		});
	}

	$scope.removeQ=function(index){
		var params=$.param({
							'test_id':$scope.ct_id,
							'course_id':$scope.testconfig.course_id,
							'subject_id':$scope.testconfig.subject_id,
							'parent_id':$scope.delq.mid,
							'pindex':index,
							'action':'delQuestions'
						});

		$http({method: 'POST',url:API_URL,data:params})
		.success(function(response, status, headers, config){
			$scope.loader=false;
			$scope.Qrows=response.questions;
			$scope.testconfig.testSize=response.test_details.testSize;
			$scope.testconfig.for_total_score=response.test_details.for_total_score;
			if(response.qdel){
				$scope.notify_options.type='success';
				$scope.notify_options.title='Success';
				var qmsg='Q'+(index+1);
				$scope.notify_options.message=qmsg+' deleted successfully!';
				$scope.notifyAlerts();
			}

			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest'){
			  $scope.$apply();
			}
		})
		.error(function(response){
			$scope.loader=false;
		});
	}

	$scope.removeSQ=function(index,sindex){
		var params=$.param({
							'test_id':$scope.ct_id,
							'course_id':$scope.testconfig.course_id,
							'subject_id':$scope.testconfig.subject_id,
							'parent_id':$scope.delq.mid,
							'smid':$scope.delsq.mid,
							'pindex':index,
							'sindex':sindex,
							'is_choice':$scope.delsq.is_choice,
							'choice_group':$scope.delsq.choice_group,
							'action':'delSQuestion'
						});

		$http({method: 'POST',url:API_URL,data:params})
		.success(function(response, status, headers, config){
			$scope.loader=false;
			$scope.Qrows[index]=response.qdetails;
			$scope.testconfig.testSize=response.test_details.testSize;
			$scope.testconfig.for_total_score=response.test_details.for_total_score;
			if(response.qdel){
				$scope.notify_options.type='success';
				$scope.notify_options.title='Success';
				var qmsg='Q'+(index+1)+"."+(sindex+1);
				$scope.notify_options.message=qmsg+' deleted successfully!';
				$scope.notifyAlerts();
			}

			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest'){
			  $scope.$apply();
			}
		})
		.error(function(response){
			$scope.loader=false;
		});

	}

	$scope.delMQuestions=function(){
		if($scope.selected_qcnt==0){
			$scope.notify_options.type='danger';
			$scope.notify_options.title='Error';
			$scope.notify_options.message='Please select questions!';
			$scope.notifyAlerts();
			return;
		}

		if($scope.dqmbtn){
			return;
		}
		$scope.dqmbtn=true;
		var params=$.param({
							'test_id':$scope.ct_id,
							'course_id':$scope.testconfig.course_id,
							'subject_id':$scope.testconfig.subject_id,
							'qids':$scope.selected_q,
							'action':'delMQ'
						});

		$http({method: 'POST',url:API_URL,data:params})
		.success(function(response, status, headers, config){
			$scope.loader=false;
			$scope.Qrows=response.questions;
			$scope.testconfig.testSize=response.test_details.testSize;
			$scope.testconfig.for_total_score=response.test_details.for_total_score;
			if(response.qdel){
				$scope.notify_options.type='success';
				$scope.notify_options.title='Success';
				var qmsg=response.qids_str;
				$scope.notify_options.message=qmsg+' deleted successfully!';
				$scope.notifyAlerts();
			}

			$scope.selected_qcnt=0;
        	$scope.selected_q=[];
			$scope.dqmbtn=false;

			if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest'){
			  $scope.$apply();
			}
		})
		.error(function(response){
			$scope.loader=false;
			$scope.dqmbtn=false;
		});
		//$scope.selected_qcnt=selectedQIds.length;
       // $scope.selected_q=selectedQIds;
	}

	$scope.viewQPaper=function(){
		$('#paperQ').modal('show');
	}

  	$scope.trustSrc = function(src) {
  		var newsrc='descriptive_papers/'+src;
    	return $sce.trustAsResourceUrl(newsrc);
  	}


  	$scope.viewEnrolledStudents=function(class_id,section_id){
    	$scope.CisAllSelected = false;
    	$scope.students =[];
    	$("#assigned_students").modal({
          backdrop: 'static',
          keyboard: false  // to prevent closing with Esc button (if you want this too)
      });
      $scope.cselected_students_cnt = 0;	
      $scope.ctot_users = 0;
      $scope.assign_loading_img=true;
      var params = $.param({'course_id':$scope.current_course,'test_id':$scope.ct_id,'section_id':section_id,'class_id':class_id,'page':1,'range':10});
      $http({method: 'POST',url:service_root+"getStudents.php",data:params}).success(function(response, status, headers, config) {
          $scope.assign_loading_img=false;
          $scope.students = response.students;
          $scope.cassigned_students=response.assigned_students;
          $scope.cselected_students_cnt = response.assigned_students;
          $scope.ctotalItems = response.total;
          //console.log($scope.students);
          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
              $scope.$apply();
          }
       }); 
    }

    //Assign to Selected Users
    $scope.CassignToEnroll=function(param){
      $('#assigned_students').modal('hide');
      var edata = "";
      if(param=="selected_enroll"){
        var ck_selected_assigned_students_cnt=$scope.ClcheckStudentsassignedSelectedCount();
        //console.log(ck_selected_assigned_students_cnt);
        if($scope.cselected_students_cnt == 0 && ck_selected_assigned_students_cnt==0){
          edata += "<b style='color:red;'>Please select section</b> <br/>";
        }
      }

      if(edata!= ""){

		Swal.fire({
	    	title: $scope.title,
	        icon: "error",
	        html:"Please fix the following issues:<br/>"+edata,
	        buttonsStyling: false,
	        confirmButtonText: "Ok, got it!",
			customClass: {
				confirmButton: "btn font-weight-bold btn-light"
			}
	    });
          return false;
       }

      $("#assign_processing").modal({
          backdrop: 'static',
          keyboard: false  // to prevent closing with Esc button (if you want this too)
      });
      $scope.assign_loading_img=true;

      var params = $.param({'course_id':$scope.current_course,'test_id':$scope.ct_id,'students':$scope.cselected_students,'param':param});
      $http({method: 'POST',url:service_root+"Assign_remove_students.php",data:params}).success(function(response, status, headers, config) {
      $scope.assign_loading_img=false;
      $scope.assign_loading_msg=true;
      $scope.assign_update = true;
		$timeout(function() {
			$("#assign_processing").modal("hide");
			$scope.assign_update = false;
		}, 1000);
		  $scope.UnassignedStudents();
          $scope.AssignedStudents();
		  
          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
              $scope.$apply();
          }
       }); 
    };

    $scope.CassignToUnroll=function(param){
      var edata = "";
      if(param=="selected_uneroll"){
        var ck_selected_assigned_students_cnt=$scope.ClcheckStudentsassignedSelectedCount();
        //console.log(ck_selected_assigned_students_cnt);
        if($scope.cselected_students_cnt == 0 && ck_selected_assigned_students_cnt==0){
          edata += "<b style='color:red;'>Please select student</b> <br/>";
        }
        var selected_assigned_students=($scope.cselected_students_cnt>0)?$scope.cselected_students_cnt:ck_selected_assigned_students_cnt;
      }else{
        var selected_assigned_students=$scope.ctot_users;
      }

      if(edata!= ""){
      	  Swal.fire({
	    	title: $scope.title,
	        icon: "error",
	        html:"Please fix the following issues:<br/>"+edata,
	        buttonsStyling: false,
	        confirmButtonText: "Ok, got it!",
			customClass: {
				confirmButton: "btn font-weight-bold btn-light"
			}
	      });
          return false;
       }

       Swal.fire({
		  title: "Unassign <span class='label-inline label-danger font-weight-bold'>"+$scope.cselected_students_cnt+" students</span>",
		  html:" Are you sure do you want to unassign students from <span class='label label-inline label-warning font-weight-bold'>"+$scope.title+"</span> ?",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
		  if(result.value) {
		  	$scope.CdeleteUnrollUsers("RemoveData");
		  }
		});

    }

    $scope.CuserToggleAll = function() {
          //alert(toggleStatus+'tt');
         var toggleStatus = $scope.CisAllSelected;
         angular.forEach($scope.students, function(itm){ 
          //alert(itm.done+'tt');
         itm.done_status = toggleStatus; });
         $scope.CgetStudentsSelectedCount();   
    }

	$scope.CuserOptionToggled = function(){
	    $scope.CisAllSelected = $scope.students.every(function(itm){ return itm.done_status; });
	    $scope.CgetStudentsSelectedCount();
	}

	$scope.CgetStudentsSelectedCount=function(){
        var selectedSIds = [];
        $scope.cselected_students_cnt=0;
        $scope.cselected_students=[];
        angular.forEach($scope.students, function(itm,key){ 
            if(itm.done_status==true)
            selectedSIds.push(itm.id);
        });

        $scope.cselected_students_cnt=selectedSIds.length;
        $scope.cselected_students=selectedSIds;
        console.log($scope.cselected_students);
      }

    $scope.ClcheckStudentsassignedSelectedCount=function(){
        var selectedAssingedSIds = [];
        $scope.cselected_assigned_students=[];
        angular.forEach($scope.students, function(itm,key){ 
            if(itm.done_status==true)
            selectedAssingedSIds.push(itm.id);
        });
        $scope.clck_selected_assigned_students_cnt=selectedAssingedSIds.length;
        $scope.cselected_assigned_students=selectedAssingedSIds;
        return  $scope.clck_selected_assigned_students_cnt;
    };

    $scope.CdeleteUnrollUsers=function(param){
      $('#assigned_students').modal('hide');
      $("#assign_processing").modal({
          backdrop: 'static',
          keyboard: false  // to prevent closing with Esc button (if you want this too)
      });
      $scope.assign_loading_img=true;
      var params = $.param({'course_id':$scope.current_course,'test_id':$scope.ct_id,'students':$scope.cselected_students,'param':param});
      $http({method: 'POST',url:service_root+"Assign_remove_students.php",data:params}).success(function(response, status, headers, config) {
      $scope.assign_loading_img=false;
      $scope.assign_loading_msg=true;
      $scope.assign_update = true;
		$timeout(function() {
			$("#assign_processing").modal("hide");
			$scope.assign_update = false;
		}, 1000);
		  $scope.UnassignedStudents();
          $scope.AssignedStudents();
		  
          if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
              $scope.$apply();
          }
       }); 
  	}

	$scope._initWizard();
	$scope._initFormValidation();
});
  $(document).ready(function(){
  	jQuery('#start_date').datetimepicker({
	  format:'Y-m-d H:i',
	  minDate:0,
  	  onShow:function( ct ){
	   this.setOptions({
	    maxDate:jQuery('#end_date').val()?jQuery('#end_date').val():false
	   })
	   setDates();
	  },
	  timepicker:true,
	  step:10
	  //minTime:0
	});

  	$("#start_date").on("change", function (e) {
        $('#end_date').attr('disabled',false);
        jQuery('#end_date').val("");
        var datetime= jQuery('#start_date').val();
        var endd=datetime.split(' ')[0];

        var thirtyMinutes = 5 * 60 * 1000; // convert 5 minutes to milliseconds
		var date1 = new Date(datetime);
		var date2 = new Date(date1.getTime() + thirtyMinutes);
		//console.log(date1);
		var hrs = date2.getHours();
		var mins = date2.getMinutes();

        jQuery('#end_date').datetimepicker({
        	format:'Y-m-d H:i',
			  onShow:function( ct ){
			   this.setOptions({
			    minDate:endd
			   })
			  },
			  timepicker:true,
			  step:10,
        	  minTime:hrs+":"+mins
	    });
    });
    $("#end_date").on("change", function (e) {
/*    	jQuery('#end_date').datetimepicker({
    		timepicker:true,
        	minTime:"00:00"
	    });*/
        setDates();
    });
    $('#end_date').attr('disabled',true);
   

	setDates=function(){
      angular.element(document.getElementById('CustomTestComposerCtrl')).scope().setDates();
    }

    setDates();
  	/*$('#end_date').attr('disabled',true);
    $('#start_date').datetimepicker({
      format: "YYYY-MM-DD HH:mm",
      sideBySide: true
    }).data("DateTimePicker").minDate(moment().format('YYYY-MM-DD HH:mm'));
    $('#end_date').datetimepicker({
          format: "YYYY-MM-DD HH:mm",
          sideBySide: true,
          useCurrent: false, //Important! See issue #1075
    });*/
   /* $('#end_date').attr('disabled',true);
    $('#start_date').datetimepicker({
      format: 'yyyy-mm-dd hh:ii',
	    autoclose: true,
	    pickerPosition: 'bottom-left',
    });
    //.data("DateTimePicker").minDate(moment().format('YYYY-MM-DD HH:mm'));
    $('#end_date').datetimepicker({
          format: 'yyyy-mm-d hh:ii',
            autoclose: true,
            pickerPosition: 'bottom-left',
    });
    $('#start_date').on('change.datetimepicker', function (e) {
    	console.log("test");
    	console.log(e);
            $('#end_date').datetimepicker({
            	minDate: e.timeStamp,
            	format: 'yyyy-mm-dd hh:ii',
				autoclose: true,
				pickerPosition: 'bottom-left',
            });
            setDates();
    });
    $('#end_date').on('change.datetimepicker', function (e) {
        $('#start_date').datetimepicker({
        	maxDate: e.timeStamp,
        	format: 'yyyy-mm-dd hh:ii',
			autoclose: true,
			pickerPosition: 'bottom-left',
        });
        setDates();
    });*/
   /* $("#start_date").on("dp.change", function (e) {
        $('#end_date').data("DateTimePicker");
        $('#end_date').attr('disabled',false);
        setDates();
    });
    $("#end_date").on("dp.change", function (e) {
        $('#start_date').data("DateTimePicker");
         setDates();
    });*/

    /*setDates=function(){
      angular.element(document.getElementById('CustomTestComposerCtrl')).scope().setDates();
    }

    setDates();*/
  });

function onlyNumbers(event) {
  var charCode = (event.which) ? event.which : event.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57)){ return false;}
  else{return true;}
}