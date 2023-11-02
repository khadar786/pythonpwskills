//"use strict";

// Class Definition
/*var KTAddUser = function () {
	// Private Variables
	var _wizardEl;
	var _formEl;
	var _wizard;
	var _avatar;
	var _validations = [];

	// Private Functions
	var _initWizard = function () {
		// Initialize form wizard
		_wizard = new KTWizard(_wizardEl, {
			startStep: 1, // initial active step number
			clickableSteps: true  // allow step clicking
		});

		// Validation before going to next page
		_wizard.on('beforeNext', function (wizard) {
			_validations[wizard.getStep() - 1].validate().then(function(status) {
		        if (status == 'Valid') {
					_wizard.goNext();
					KTUtil.scrollTop();
				} else {
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
	}

	var _initValidations = function () {
		// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/

		// Validation Rules For Step 1
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					firstname: {
						validators: {
							notEmpty: {
								message: 'First Name is required'
							}
						}
					},
					lastname: {
						validators: {
							notEmpty: {
								message: 'Last Name is required'
							}
						}
					},
					companyname: {
						validators: {
							notEmpty: {
								message: 'Company Name is required'
							}
						}
					},
					phone: {
						validators: {
							notEmpty: {
								message: 'Phone is required'
							},
							phone: {
								country: 'US',
								message: 'The value is not a valid US phone number. (e.g 5554443333)'
							}
						}
					},
					email: {
						validators: {
							notEmpty: {
								message: 'Email is required'
							},
							emailAddress: {
								message: 'The value is not a valid email address'
							}
						}
					},
					companywebsite: {
						validators: {
							notEmpty: {
								message: 'Website URL is required'
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

		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					// Step 2
					communication: {
						validators: {
							choice: {
								min: 1,
								message: 'Please select at least 1 option'
							}
						}
					},
					language: {
						validators: {
							notEmpty: {
								message: 'Please select a language'
							}
						}
					},
					timezone: {
						validators: {
							notEmpty: {
								message: 'Please select a timezone'
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

		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					address1: {
						validators: {
							notEmpty: {
								message: 'Address is required'
							}
						}
					},
					postcode: {
						validators: {
							notEmpty: {
								message: 'Postcode is required'
							}
						}
					},
					city: {
						validators: {
							notEmpty: {
								message: 'City is required'
							}
						}
					},
					state: {
						validators: {
							notEmpty: {
								message: 'state is required'
							}
						}
					},
					country: {
						validators: {
							notEmpty: {
								message: 'Country is required'
							}
						}
					},
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		));
	}

	var _initAvatar = function () {
		_avatar = new KTImageInput('kt_user_add_avatar');
	}

	return {
		// public functions
		init: function () {
			_wizardEl = KTUtil.getById('kt_wizard');
			_formEl = KTUtil.getById('kt_form');

			_initWizard();
			_initValidations();
			_initAvatar();
		}
	};
}();

jQuery(document).ready(function () {
	KTAddUser.init();
});*/

//Custom Test App
var API_URL = 'api/CustomTestService.php';
//wizard setup
var _ctwizardEl;
var _ctformEl;
var _ctwizard;
var _ctavatar;
var _ctvalidations = [];
_ctwizardEl = KTUtil.getById('kt_wizard');
_ctformEl = KTUtil.getById('kt_form');
var service_root = 'compose_services/';
var composeapp = angular.module('CustomTestComposerApp', ['ui.bootstrap', 'ngSanitize', 'angularUtils.directives.dirPagination']);
composeapp.controller('CustomTestComposerCtrl', function($scope, $http, $timeout) {
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    //URLS
    $scope.courses_url = service_root + "getCoursesList.php";
    $scope.students_url = service_root + "getStudents.php";
    $scope.subjects_url = service_root + "getSubjectsWithChapters.php";
    $scope.single_subject_url = service_root + "getSingleSubjectsWithChapters.php";
    $scope.create_test_url = service_root + "createCustomTest.php";
    $scope.delete_subject_url = service_root + "deleteSubject.php";
    $scope.getchapter_questions_url = service_root + "getChapterQuestions.php";
    $scope.savequestions_url = service_root + "saveQuestions.php";
    $scope.viewquestions_url = service_root + "getcomposeQuestions.php";
    $scope.delete_q_url = service_root + "deleteQuestion.php";
    $scope.test_assign_to_url = service_root + "testAssignToStudents.php";
    $scope.publish_test_url = service_root + "publish_test.php";
    $scope.singleuser_enroolorunenroll_url = service_root + "single_user_doaction.php";
    $scope.add_question_url = service_root + "add_question_to_test.php";

    $scope.Current_Step = 0;
    $scope.Step_Direction = 0;
    $scope.Return_Status = false;
    $scope.negative_marks_data = [{ 'value': 1, 'title': '1/1 -ve Marking' },
        { 'value': 0.5, 'title': '1/2 -ve Marking' },
        { 'value': 0.33, 'title': '1/3 -ve Marking' },
        { 'value': 0.25, 'title': '1/4 -ve Marking' }
    ];
    $scope.loader_fa = '<i class="fa fa-circle-o-notch fa-spin" style="font-size:15px"></i>';
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $scope.user_id = user_id;
    $scope.level = level;
    $scope.testconfig = {};
    $scope.course_title = "";
    $scope.ct_id = test_id;
    $scope.current_course = null;
    $scope.courses = [];
    $scope.subjects = [];
    $scope.all_subjects = [];
    $scope.selected_subjects = [];
    $scope.total_subjects_qcnt = 0;
    $scope.for_total_score = 0;
    $scope.marks_per_question = 4;
    $scope.testSize = 90;
    $scope.testType='Online';
    $scope.campus_id=campus_id;

    //Step2
    $scope.tabsloader = false;
    $scope.tabs_options = false;
    $scope.tabs_options_success = false;
    $scope.addTab = false;
    $scope.pickingTab = false;
    $scope.questionsTab = false;
    $scope.auto_generatedTab = false;
    $scope.question_bank_status = true;
    $scope.question_list = '';
    $scope.selected_chapter = 'Please select chapter';
    $scope.viewquestions_tabloader = false;
    $scope.students_tabloader = false;


    //Subject Config
    $scope.subject_index = null;
    $scope.subject_id = null;
    $scope.current_subject = {};
    $scope.classes = [];
    $scope.subject_chapters = [];
    $scope.topics = [];
    $scope.all_subject_chapters = [];

    //Subject wise total selected questions
    $scope.total_selected_q = 0;
    $scope.requiredQ = 0;
    $scope.requiredMCQ = 0;
    $scope.requiredNUM = 0;
    $scope.subject_questions_list = "";
    $scope.selected_sub_qcount = 0;

    //Overall Questions ids
    $scope.allselectedQ = [];
    $scope.overall_composed_qcnt = 0;
    $scope.overall_remain_selected_q = 0;
    $scope.overall_composed_questions = 0
    $scope.overall_questions_list = "";


    //Chapter Config
    $scope.chapter_index = null;
    $scope.class_index = null;
    $scope.topic_index = null;
    $scope.current_chapter = {};
    $scope.chapter_id = null;
    $scope.chapterQ = [];
    $scope.overall_chapterQ = [];
    $scope.chapterQcnt = 0;

    //Setp 3
    $scope.data = [];
    $scope.libraryTemp = {};
    $scope.totalItemsTemp = {};
    $scope.totalItems = 0;
    $scope.users_pagination = {
        current: 1
    };
    $scope.selected_students_cnt = 0;
    $scope.selected_students = [];
    $scope.assigned_students = 0;
    $scope.selected_assigned_students_cnt = 0;
    $scope.selected_assigned_students = [];
    $scope.tot_users = 0;
    $scope.ctot_users = 0;
    $scope.subject_index = 0;
    //Step 4
    $scope.publishconfig = {};

    $scope.Steps = { "create_test": false, "compose_qs": false, "assign_test": false, "publish": false };

    $scope.course_list = ['3955', '3956'];
    $scope.current_subject_remain_q = 0;
    $scope.current_subject_mcq_q = 0;
    $scope.current_subject_num_q = 0;
    $scope._initWizard = function() {
        // Initialize form wizard
        _wizard = new KTWizard(_ctwizardEl, {
            startStep: 1, // initial active step number
            clickableSteps: false // allow step clicking
        });

        // Validation before going to next page
        _wizard.on('beforeNext', function(wizard) {
            _ctvalidations[wizard.getStep() - 1].validate().then(function(status) {
                var edata = "";
                if (status == 'Valid') {
                    //Custom Stetp Validation
                    if (wizard.getStep() == 1) {
                        if ($scope.selected_subjects.length == 0) {
                            edata += "<b style='color:red;'>Select Subjects</b> <br/>";
                        }

                        if ($scope.total_subjects_qcnt > $scope.testSize) {
                            edata += "<b style='color:red;'>Your questions limit exceeded</b> <br/>";
                        }

                        if ($scope.total_subjects_qcnt < $scope.testSize && $scope.selected_subjects.length > 0) {
                            edata += "Your questions limit not reached. Selected questions <span class='label label-success'>" + $scope.total_subjects_qcnt + "</span><br> you required questions <span class='label label-warning'>" + $scope.testSize + "</span>";
                        }


                    } else if (wizard.getStep() == 2) {


                    } else if (wizard.getStep() == 3) {

                    } else if (wizard.getStep() == 4) {

                    }

                    if (edata != "") {
                        Swal.fire({
                            title: '<strong>Please fix the following issues:</strong>',
                            icon: "error",
                            html: edata,
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

                    if (wizard.getStep() == 1) {
                        $("#next-step").attr('disabled', true);
                        $scope.step_loader = true;
                        var params = $.param({
                            'course_id': $scope.current_course,
                            'is_jee_new_pattern': $scope.is_jee_new_pattern,
                            'is_neet_new_pattern': $scope.is_neet_new_pattern,
                            'ct_id': $scope.ct_id,
                            'title': $scope.title,
                            'testType': $scope.testType,
                            'source_type': $scope.source_type,
                            'campus_id':$scope.campus_id,
                            'testSize': $scope.testSize,
                            'testTime': $scope.testTime,
                            'negativeMarks': $scope.negativeMarks,
                            'marks_per_question': $scope.marks_per_question,
                            'for_total_score': $scope.for_total_score,
                            "selected_subjects": JSON.stringify($scope.selected_subjects),
                            "subjects": JSON.stringify($scope.subjects),
                            'action': 'createCustomTest',
                            'user_id': $scope.user_id,
                            'level': $scope.level
                        });
                        
                        //Save or Update
                        $http({ method: 'POST', url: API_URL, data: params }).success(function(response, status, headers, config) {
                            if (response.ct_id > 0) {
                                $scope.selected_subjects = response.selected_subjects;
                                $scope.subjects = response.subjects;
                                $scope.ct_id = response.ct_id;
                                $scope.Steps.create_test = true;
                                $scope.Return_Status = true;

                                $timeout(function() {
                                    $scope.subject_index = response.subject_index;
                                    $scope.getSubjectChapters($scope.subject_index);
                                }, 500);
                                $timeout(function() {
                                    $scope.compose_type = 'picking';
                                    $scope.getComposingTemplate('picking');
                                }, 1000);

                                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                    $scope.$apply();
                                }
                                _wizard.goNext();
                                KTUtil.scrollTop();
                                $("#next-step").attr('disabled', false);
                                $scope.step_loader = false;
                            }
                        });
                    } else if (wizard.getStep() == 2) {
                        if ($scope.overall_composed_questions == $scope.testSize) {
                            //$scope.setDates();
                            $scope.isAssignAllSelected = false;
                            $scope.isAllSelected = false;
                            $scope.selected_assigned_students_cnt = 0;
                            $scope.selected_students_cnt = 0;

                            if ($scope.level !=5 ) {
                                Swal.fire({
                                    text: "Sorry, you have no permission to access this page.",
                                    icon: "error",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it!",
                                    customClass: {
                                        confirmButton: "btn font-weight-bold btn-light"
                                    }
                                }).then(function() {
                                    window.location.href = "teacher-custom-test-list";
                                });
                            } else {
                                $scope.getStudents();
                                _wizard.goNext();
                            }

                           

                        } else {
                            var edata = "You didn't reach your questions limit. Composed questions <span class='label label-inline label-success font-weight-bold'>" + $scope.overall_composed_questions + "</span><br> you required questions <span class='label label-inline label-warning font-weight-bold'>" + ($scope.testSize - $scope.overall_composed_questions) + "</span>";
                            bootbox.alert({
                                message: edata,
                                // size:"small",
                                title: "Please fix the following issues:",
                                backdrop: true
                            });

                            $scope.Return_Status = false;

                            _wizard.stop();
                        }

                    } else if (wizard.getStep() == 3) {
                        var edata = "";
                        //assigned_students
                        if ($scope.tot_users == 0) {
                            edata += "<b style='color:red;'>Please assign to sections for this </b><span class='label label-inline label-success font-weight-bold'>" + $scope.title + "</span>";
                            if (edata != "") {
                                bootbox.alert({
                                    message: edata,
                                    // size:"small",
                                    title: "Please fix the following issues:",
                                    backdrop: true
                                });
                                $scope.Return_Status = false;
                                _wizard.stop();
                            }
                        } else {
                            _wizard.goNext();
                        }

                        _wizard.goNext();
                    } else {
                        //console.log("test");

                    }


                    //console.log(wizard.getStep());
                    //console.log('####');
                    //_wizard.goNext();
                    //KTUtil.scrollTop();
                } else {
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

            _wizard.stop(); // Don't go to the next step
        });

        // Change Event
        _wizard.on('change', function(wizard) {
            KTUtil.scrollTop();
        });


        $scope.getCourses();
    }

    //Formvalidation
    $scope._initFormValidation = function() {
        // Validation Rules For Step 1
        _ctvalidations.push(FormValidation.formValidation(
            _ctformEl, {
                fields: {
                    title: {
                        validators: {
                            notEmpty: {
                                message: 'Test name is required'
                            },
                            stringLength: {
                                min: 5,
                                message: 'minimum 5 letters required'
                            }
                        }
                    },
                    testSize: {
                        validators: {
                            notEmpty: {
                                message: 'Total questions is required'
                            }
                        }
                    },
                    testTime: {
                        validators: {
                            notEmpty: {
                                message: 'Duration is required'
                            }
                        }
                    },
                    marks_per_question: {
                        validators: {
                            notEmpty: {
                                message: 'Marks per question is required'
                            }
                        }
                    },
                    course_id: {
                        validators: {
                            notEmpty: {
                                message: 'Course is required'
                            }
                        }
                    },
                    testType: {
                        validators: {
                            notEmpty: {
                                message: 'Test Mode is required'
                            }
                        }
                    },
                    source_type: {
                        validators: {
                            notEmpty: {
                                message: 'Source type is required'
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
            _ctformEl, {
                fields: {},
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        ));

        // Validation Rules For Step 3
        _ctvalidations.push(FormValidation.formValidation(
            _ctformEl, {
                fields: {},
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        ));

        // Validation Rules For Step 4
        _ctvalidations.push(FormValidation.formValidation(
            _ctformEl, {
                fields: {},
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        ));
    }
    $scope.update_for_total_score = function() {
            if ($scope.course_id == 3956 && $scope.testSize == 90) {
                $scope.for_total_score = ($scope.testSize - 15) * $scope.marks_per_question;
            } else if ($scope.course_id == 3955 && $scope.testSize == 200) {
                $scope.for_total_score = ($scope.testSize - 20) * $scope.marks_per_question;
            } else {
                $scope.for_total_score = $scope.testSize * $scope.marks_per_question;
            }
        }
        //Get Courses
    $scope.getCourses = function() {
        var params = $.param({ 'ct_id': $scope.ct_id, 'action': 'courses', 'user_id': $scope.user_id, 'level': $scope.level });
        $http({ method: 'POST', url: API_URL, data: params }).success(function(response, status, headers, config) {
            //Courses
            $scope.courses = response.courses;
            if ($scope.ct_id > 0) {
                $scope.current_course = response.testconfig.course_id;
                $scope.course_id = $scope.current_course;
                $scope.course_title = response.testconfig.course_title;
                $scope.title = response.testconfig.title;
                $scope.testSize = response.testconfig.testSize;
                $scope.testTime = response.testconfig.testTime;
                $scope.is_jee_new_pattern = response.testconfig.is_jee_new_pattern;
                $scope.is_neet_new_pattern = response.testconfig.is_neet_new_pattern;
                $scope.negativeMarks = response.testconfig.negativeMarks;
                $scope.marks_per_question = response.testconfig.marks_per_question;
                //$scope.for_total_score=($scope.marks_per_question*$scope.testSize);
                $scope.for_total_score = response.testconfig.for_total_score;
                $scope.testType=response.testconfig.testType;
                $scope.source_type=response.testconfig.source_type;

                //Picking,adding and auto genrated analysis
                $scope.overall_composed_qcnt = $scope.testSize;
                $scope.overall_composed_questions = response.testconfig.number_of_q;
                $scope.overall_remain_selected_q = ($scope.testSize - $scope.overall_composed_questions);
                $scope.overall_questions_list = response.testconfig.comman_qlist;

                $scope.getSubjects($scope.course_id);
            }
            $scope.publishconfig = response.publish_config;

            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
            //console.log($scope.courses);
        });
    };

    //Get Subjects based on Course
    $scope.getSubjects = function(course_id) {
        if ($scope.course_id == 3956 && $scope.testSize == 90) {
            $scope.is_jee_new_pattern = 1;
        } else {
            $scope.is_jee_new_pattern = 0;
        }
        if ($scope.course_id == 3955 && $scope.testSize == 200) {
            $scope.is_neet_new_pattern = 1;
        } else {
            $scope.is_neet_new_pattern = 0;
        }
        $scope.subjects_loader = true;
        $scope.current_course = course_id;
        var params = $.param({ 'course_id': course_id, 'ct_id': $scope.ct_id, 'action': 'getsubjects', 'user_id': $scope.user_id, 'level': $scope.level,'campus_id':$scope.campus_id,'source_type':$scope.source_type});
        $http({ method: 'POST', url: API_URL, data: params }).success(function(response, status, headers, config) {
            $scope.subjects = response.subjects;
            $scope.all_subjects = response.all_subjects;
            $scope.subject_err = response.error;
            $scope.subjects_loader = false;
            $scope.total_subjects_qcnt = response.total_subjects_qcnt;
            $scope.selected_subjects = response.selected_subjects;
            // jee mains new pattern 16/02/2021
            $scope.update_for_total_score();

            if ($scope.level != 4 && $scope.selected_subjects.length != 0) {
                $scope.step_loader = true;
                $("#next-step").click();
                $("#prev-step").attr('disabled', true);
            }
            //$scope.getStudents(1);
            //$scope.getClassIds();
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }

        });
    };

    //Get All Classes
    $scope.getClassIds = function() {
        $http({ method: 'POST', url: "getClassList.php" }).success(function(response, status, headers, config) {
            $scope.Classes_data = response.ClassIds;
            $("#ClassIds option").remove();
            for (var k = 0; k < $scope.Classes_data.length; k++) {
                $('#ClassIds').append('<option value="' + $scope.Classes_data[k].id + '">' + $scope.Classes_data[k].class_name + '</option>');
            }
            $('#ClassIds').multiselect('destroy');
            $('#ClassIds').multiselect({
                nonSelectedText: 'Select Class',
                dropRight: true,
                includeSelectAllOption: true,
                numberDisplayed: 5
            });

            //$scope.getSections($scope.current_course);
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }

        });

    };

    // Get Sections on course
    $scope.getSections = function(course_id) {
        var params = $.param({ 'course_id': course_id, 'action': 'getsubjects', 'user_id': $scope.user_id, 'level': $scope.level });
        $http({ method: 'POST', url: "getSectionsList.php", data: params }).success(function(response, status, headers, config) {
            $scope.sections = response.sections;
            $("#section_id option").remove();
            for (var k = 0; k < $scope.sections.length; k++) {
                $('#section_id').append('<option value="' + $scope.sections[k].section_id + '">' + $scope.sections[k].section_name + '</option>');
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

    //Select Subject
    $scope.selectSubject = function(key_index) {
        $("#next-step").attr('disabled', false);
        $scope.sub_key_index = key_index;
        var edata = "";
        var subject_name = $scope.subjects[key_index].category;
        if ($scope.subjects[key_index].selected_qcnt > $scope.testSize) {
            edata += "<b style='color:red;'>Questions Limit Exceeded</b> <br/>";
        }
        /* if($scope.subjects[key_index].selected_qcnt>$scope.subjects[key_index].total_qcnt){
           edata += "<b style='color:red;'>Questions Limit Exceeded</b> <br/>";
         }*/

        if (edata != "") {
            $scope.subjects[key_index].selected_qcnt = 0;
            $('#row_' + key_index).addClass('table-danger');

            Swal.fire({
                title: '<strong>' + subject_name + '</strong>',
                icon: "error",
                html: edata,
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn font-weight-bold btn-light"
                }
            }).then(function() {
                //KTUtil.scrollTop();
                $scope.subjects[key_index].subject_done_status = false;
                $timeout(function() { $('#row_' + $scope.sub_key_index).removeClass('table-danger'); }, 500);
            });

            /*bootbox.alert({
                message:"Please fix the following issues:<br/>"+edata,
                // size:"small",
                title:subject_name,
                backdrop:true,
                callback: function(){
                    $scope.subjects[key_index].subject_done_status=false;
                    $timeout(function(){$('#row_'+$scope.sub_key_index).removeClass('danger');},500);
                }
            });*/
            return false;
        }
        //console.log($scope.subjects[key_index].assigned_by_uid);
        var teacher_required = "";
        if ($scope.subjects[key_index].assigned_by_uid == 0) { teacher_required = "<b style='color:red;'>Please select teacher!</b><br/>"; }
        //Question exceed
        if ($scope.subjects[key_index].selected_qcnt > 0 && $scope.subjects[key_index].assigned_by_uid != 0) {
            $scope.subjects[key_index].edit_icon = true;
            //console.log($scope.subjects[key_index].total_qcnt+"---"+$scope.subjects[key_index].edit_icon);
            $scope.getSubjectQcount();
        } else {
            $('#row_' + key_index).addClass('table-danger');
            Swal.fire({
                title: '<strong>' + subject_name + '</strong>',
                icon: "error",
                html: teacher_required + "<b style='color:red;'>Please provide the questions !</b>",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn font-weight-bold btn-light"
                }
            }).then(function() {
                //KTUtil.scrollTop();
                $scope.subjects[key_index].subject_done_status = false;
                $timeout(function() { $('#row_' + $scope.sub_key_index).removeClass('table-danger'); }, 500);
            });

            /*bootbox.alert({
               message:"<b style='color:red;'>Please provide the questions !</b>",
               // size:"small",
               title:subject_name,
               backdrop:true,
               callback: function(){
                   //$scope.diff_allchapters[key_index].diff_done_status=false;
                   $timeout(function(){$('#row_'+$scope.sub_key_index).removeClass('danger');},500);
               }
            });*/
            $scope.subjects[key_index].subject_done_status = false;
        }

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };

    //Edit Subject
    $scope.editSubject = function(key_index) {
        $scope.sub_key_index = key_index;
        $scope.subjects[key_index].edit_icon = false;
        $scope.subjects[key_index].subject_done_status = false;
        $scope.subjects[key_index].selected_qcnt = 0;
        $scope.getSubjectQcount();
    };

    //Confirmation Delete Subject
    $scope.confirmDeleteSubject = function(key_index) {
        $scope.confirm_sub_key_index = key_index;

        bootbox.confirm({
            title: " Are you sure do you want to delete " + $scope.subjects[$scope.confirm_sub_key_index].category + " ?",
            message: "<b>Your composed questions will be deleted from " + $scope.title + "</b>",
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> Cancel'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Confirm'
                }
            },
            callback: function(result) {
                //console.log('This feature comming soon');
                if (result == true) {
                    //console.log('This was logged in the callback: ' + result);
                    $scope.deleteSubject($scope.confirm_sub_key_index);
                }
            }
        });
    };

    //Edit Subject
    $scope.deleteSubject = function(key_index) {
        $scope.sub_key_index = key_index;
        $scope.subjects_loader = true;
        var params = $.param({ 'ct_id': $scope.ct_id, "subject": angular.toJson($scope.subjects[key_index]), 'action': 'delete_subject' });
        $http({ method: 'POST', url: API_URL, data: params }).success(function(response, status, headers, config) {

            $scope.subjects[$scope.sub_key_index].subject_done_status = false;
            $scope.subjects[$scope.sub_key_index].edit_icon = false;
            $scope.subjects[$scope.sub_key_index].selected = false;
            $scope.subjects[$scope.sub_key_index].selected_qcnt = 0;
            $scope.subjects[$scope.sub_key_index].selected_q = [];
            $scope.subjects[$scope.sub_key_index].mid = 0;
            $scope.subjects[$scope.sub_key_index].comman_qlist = "";
            $scope.subjects[$scope.sub_key_index].number_of_q = 0;

            if ($scope.ct_id > 0) {
                //Picking,adding and auto genrated analysis
                $scope.overall_composed_qcnt = $scope.testSize;
                $scope.overall_composed_questions = response.testconfig.number_of_q;
                $scope.overall_remain_selected_q = ($scope.testSize - $scope.overall_composed_questions);
                $scope.overall_questions_list = response.testconfig.comman_qlist;
                //$scope.getStudents(1);
            }

            $scope.getSubjectQcount();
            $timeout(function() {
                $scope.subjects_loader = false;
            }, 3000);

        });
    };

    //Total  questions count
    $scope.getSubjectQcount = function() {
        $scope.total_subjectQ = 0;
        $scope.remain_selected_q = 0;
        $scope.selected_subjects = [];
        angular.forEach($scope.subjects, function(itm, key) {
            if (itm.subject_done_status == true) {
                $scope.total_subjectQ += itm.selected_qcnt;
                $scope.selected_subjects.push(itm);
            }
        });
        //$scope.composed_questions
        $scope.total_subjects_qcnt = $scope.total_subjectQ;
        //console.log($scope.selected_subjects[0].category);
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };


    //Get selected subject chapters
    $scope.getSubjectChapters = function(subject_index) {
        //$('input[name=compose_type]').attr('checked',false);
        $scope.compose_type = false;
        if (subject_index != null) {
            $scope.class_index = '';
            $scope.class_id = '';
            $scope.chapter_id = '';
            $scope.chapter_index = '';
            $scope.topic_index = '';
            $scope.composing_subject_successfully = "";
            $scope.tabsloader = true;
            $scope.questionsTab = false;
            //Initail
            $scope.subject_index = subject_index;
            $scope.all_subject_chapters = [];
            $scope.classes = [];
            $scope.subject_chapters = [];
            $scope.topics = [];
            $scope.current_subject_remain_q = 0;
            //console.log(subject_index);
            //Current Subject info
            $scope.current_subject = $scope.selected_subjects[subject_index];
            //console.log($scope.selected_subjects);
            $scope.subject_id = $scope.current_subject.id;

            var index = $scope.current_subject.index;

            /*console.log($scope.subject_id);
            console.log($scope.user_id);
            console.log($scope.current_subject.assigned_by_uid);*/

            //Single Subject Information
            var params = $.param({ 'ct_id': $scope.ct_id, 'mid': $scope.current_subject.mid, 'subject_index': $scope.subject_index, 'index': index, 'action': 'single_subject', 'user_id': $scope.user_id, 'level': $scope.level });
            $http({ method: 'POST', url: API_URL, data: params }).success(function(response, status, headers, config) {
                //Questions Analysis
                $scope.selected_subjects[$scope.subject_index].number_of_q = response.subject[$scope.subject_index].number_of_q;
                $scope.selected_subjects[$scope.subject_index].number_of_smcq = response.subject[$scope.subject_index].number_of_smcq;
                $scope.selected_subjects[$scope.subject_index].number_of_snumq = response.subject[$scope.subject_index].number_of_snumq;
                $scope.selected_subjects[$scope.subject_index].selected_q = response.subject[$scope.subject_index].selected_q;
                $scope.selected_subjects[$scope.subject_index].comman_qlist = response.subject[$scope.subject_index].comman_qlist;

                $scope.selected_subjects[$scope.subject_index].number_of_spaq = response.subject[$scope.subject_index].number_of_spaq;
                $scope.selected_subjects[$scope.subject_index].number_of_spbq = response.subject[$scope.subject_index].number_of_spbq;

                $scope.selected_subjects[$scope.subject_index].mtotal_qcnt = response.subject[$scope.subject_index].mtotal_qcnt;
                $scope.selected_subjects[$scope.subject_index].ntotal_qcnt = response.subject[$scope.subject_index].ntotal_qcnt;

                $scope.current_subject_remain_q = $scope.selected_subjects[$scope.subject_index].number_of_q;
                //Subjects
                var index = $scope.current_subject.index;
                $scope.subjects[index].number_of_q = response.subject[$scope.subject_index].number_of_q;
                $scope.subjects[index].number_of_smcq = response.subject[$scope.subject_index].number_of_smcq;
                $scope.subjects[index].number_of_snumq = response.subject[$scope.subject_index].number_of_snumq;
                $scope.subjects[index].selected_q = response.subject[$scope.subject_index].selected_q;
                $scope.subjects[index].comman_qlist = response.subject[$scope.subject_index].comman_qlist;

                $scope.subjects[index].number_of_spaq = response.subject[$scope.subject_index].number_of_spaq;
                $scope.subjects[index].number_of_spbq = response.subject[$scope.subject_index].number_of_spbq;

                $scope.subjects[index].mtotal_qcnt = response.subject[$scope.subject_index].mtotal_qcnt;
                $scope.subjects[index].ntotal_qcnt = response.subject[$scope.subject_index].ntotal_qcnt;


                $scope.current_subject.number_of_q = response.subject[$scope.subject_index].number_of_q;
                $scope.current_subject.number_of_smcq = response.subject[$scope.subject_index].number_of_smcq;
                $scope.current_subject.number_of_snumq = response.subject[$scope.subject_index].number_of_snumq;
                $scope.current_subject.selected_q = response.subject[$scope.subject_index].selected_q;
                $scope.current_subject.comman_qlist = response.subject[$scope.subject_index].comman_qlist;
                $scope.current_subject.assigned_by_uid = parseInt(response.subject[$scope.subject_index].assigned_by_uid);

                $scope.current_subject.number_of_spaq = response.subject[$scope.subject_index].number_of_spaq;
                $scope.current_subject.number_of_spbq = response.subject[$scope.subject_index].number_of_spbq;

                $scope.current_subject.number_of_spaq_arr = response.subject[$scope.subject_index].number_of_spaq_arr;
                $scope.current_subject.number_of_spbq_arr = response.subject[$scope.subject_index].number_of_spbq_arr;

                $scope.current_subject.mtotal_qcnt = response.subject[$scope.subject_index].mtotal_qcnt;
                $scope.current_subject.ntotal_qcnt = response.subject[$scope.subject_index].ntotal_qcnt;


                $scope.total_selected_q = $scope.current_subject.number_of_q;
                $scope.current_subject_selected_qcnt = 0;
                $scope.requiredQ = ($scope.current_subject.selected_qcnt - $scope.current_subject.number_of_q);
                $scope.requiredMCQ = (20 - $scope.current_subject.number_of_smcq);
                $scope.requiredNUMQ = (10 - $scope.current_subject.number_of_snumq);
                $scope.current_subject_selected_mcqcnt = 0;
                $scope.current_subject_selected_numqcnt = 0;
                $scope.subject_questions_list = $scope.current_subject.comman_qlist;

                $scope.requiredPAQ = (35 - $scope.current_subject.number_of_spaq);
                $scope.requiredPBQ = (15 - $scope.current_subject.number_of_spbq);

                //Current Subject Chapters info
                $scope.selected_subjects[$scope.subject_index].chapters = response.subject[$scope.subject_index].chapters;
                $scope.selected_subjects[$scope.subject_index].classes = response.subject[$scope.subject_index].classes;
                $scope.subjects[index].chapters = response.subject[$scope.subject_index].chapters;
                $scope.subjects[index].classes = response.subject[$scope.subject_index].classes;
                $scope.current_subject.chapters = response.subject[$scope.subject_index].chapters;
                $scope.current_subject.classes = response.subject[$scope.subject_index].classes;
                //$scope.subject_chapters=$scope.current_subject.chapters;
                $scope.classes = $scope.current_subject.classes;
                $timeout(() => {
                    jQuery('#auto_class_id').selectpicker('refresh');
                }, 1000);


                $scope.all_subjects[$scope.current_subject.id].chapters = response.single_allchapters;
                $scope.all_subject_chapters = $scope.all_subjects[$scope.current_subject.id].chapters;

                /*console.log($scope.subject_id);
          console.log($scope.user_id);
          console.log($scope.current_subject.assigned_by_uid);*/

                console.log($scope.current_subject.number_of_spaq);
                console.log($scope.current_subject.number_of_spbq);

                //Manage Tabs Options
                if ($scope.requiredQ > 0) {
                    $scope.tabs_options = true;
                    $scope.tabs_options_success = false;
                } else {
                    $scope.composing_subject_successfully = $scope.current_subject.category + " composed successfully";
                    $scope.tabs_options = false;
                    $scope.tabs_options_success = true;
                }

                $timeout(function() {
                    $scope.tabsloader = false;
                }, 1000);

                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }

            });

        } else {
            $scope.subject_index = '';
            $scope.subject_id = '';
            $scope.chapter_id = '';
            $scope.class_index = '';
            $scope.chapter_index = '';
            $scope.topic_index = '';
            $scope.compose_type = '';
            //$scope.subject_chapters=[];
            $scope.pickingTab = false;
            $scope.addTab = false;
            $scope.autogeneratedTab = false;
            $scope.questionsTab = false;
            $scope.composing_subject_successfully = "";
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        }
        $scope.compose_type = 'picking';
        $scope.getComposingTemplate('picking');
    }

    //Step 2 start
    //Get Composing Template
    $scope.getComposingTemplate = function(compose_type) {
        //console.log(compose_type);
        switch (compose_type) {
            case 'add':
                $scope.addTab = true;
                $scope.pickingTab = false;
                $scope.questionsTab = false;
                $scope.autogeneratedTab = false;
                $scope.tinymceLoad();
                //$scope.clearAddTabInfo();
                break;
            case 'picking':
                $scope.addTab = false;
                $scope.pickingTab = true;
                $scope.questionsTab = false;
                $scope.autogeneratedTab = false;
                $scope.clearPickTabInfo();
                //$scope.clearAllTabs();
                break;
            case 'auto_generated':
                $scope.addTab = false;
                $scope.pickingTab = false;
                $scope.questionsTab = false;
                $scope.autogeneratedTab = true;
                break;
            default:
                break;

                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }

        }

        //console.log($scope.compose_type);
    }



    //Get Class
    $scope.getClass = function(class_index) {
        if (class_index != null) {
            $scope.questionsTab = false;
            $scope.chapter_index = '';
            $scope.chapter_id = '';
            $scope.topic_index = '';
            $scope.topic_id = '';
            $scope.subject_chapters = [];
            $scope.topics = [];
            $scope.class_index = class_index;
            $scope.class_id = $scope.classes[class_index].class_id;
            $scope.add_chapter_index = '';
            $scope.add_topic_index = '';
            $scope.topics = [];
            $scope.add_chapter = '';
            //Get Current Subject Questions
            $scope.subject_chapters = $scope.classes[$scope.class_index].chapters;
            //console.log($scope.classes[$scope.class_index]);
        } else {
            $scope.class_index = '';
            $scope.chapter_index = '';
            $scope.chapter_id = '';
            $scope.class_id = '';
            $scope.topic_index = '';
            $scope.subject_chapters = [];
            $scope.topics = [];
            $scope.questionsTab = false;
            $scope.chapterQ = [];
            $scope.overall_chapterQ = [];
            $scope.chapterQcnt = 0;
            $scope.add_chapter = '';
            $scope.add_chapter_index = '';
            $scope.add_topic_index = '';
            $scope.topics = [];
            if ($scope.current_subject_selected_qcnt > 0) {
                $scope.resetSubjectChapters();
            }
        }
    };

    $scope.getAutoGenerateClass = function(auto_class_id) {
        if (auto_class_id.length > 0) {
            $scope.questionsTab = false;
            $scope.chapter_index = '';
            $scope.chapter_id = '';
            $scope.topic_index = '';
            $scope.topic_id = '';
            $scope.subject_chapters = [];
            $scope.topics = [];

            if (auto_class_id.length == 1) {
                let class_id = auto_class_id[0];
                let class_index = $scope.classes.findIndex(cls => cls.class_id == class_id);
                //console.log(class_index);
                $scope.class_index = class_index;
                $scope.class_id = $scope.classes[class_index].class_id;
                $scope.add_chapter_index = '';
                $scope.add_topic_index = '';
                $scope.topics = [];
                $scope.add_chapter = '';
                //Get Current Subject Questions
                $scope.subject_chapters = $scope.classes[$scope.class_index].chapters;
            } else {
                const chapters = [];
                const cls_indexes = [];
                auto_class_id.forEach((value, key) => {
                    let clsIndex = $scope.classes.findIndex(cls => cls.class_id == value);
                    let class_info = $scope.classes[clsIndex];
                    for (let i = 0; i < $scope.classes[clsIndex].chapters.length; i++) {
                        $scope.classes[clsIndex].chapters[i].class_name = class_info.class_name;
                        chapters.push($scope.classes[clsIndex].chapters[i]);
                    }
                });

                $scope.add_chapter_index = '';
                $scope.add_topic_index = '';
                $scope.topics = [];
                $scope.add_chapter = '';
                //Get Current Subject Questions
                $scope.subject_chapters = chapters;
            }

        } else {
            $scope.class_index = '';
            $scope.chapter_index = '';
            $scope.chapter_id = '';
            $scope.class_id = '';
            $scope.topic_index = '';
            $scope.subject_chapters = [];
            $scope.topics = [];
            $scope.questionsTab = false;
            $scope.chapterQ = [];
            $scope.overall_chapterQ = [];
            $scope.chapterQcnt = 0;
            $scope.add_chapter = '';
            $scope.add_chapter_index = '';
            $scope.add_topic_index = '';
            $scope.topics = [];
            if ($scope.current_subject_selected_qcnt > 0) {
                $scope.resetSubjectChapters();
            }
        }
    }

    //Get Class
    $scope.getAutoGenerateClassOld = function(class_index) {
        if (class_index != null) {
            $scope.questionsTab = false;
            $scope.chapter_index = '';
            $scope.chapter_id = '';
            $scope.topic_index = '';
            $scope.topic_id = '';
            $scope.subject_chapters = [];
            $scope.topics = [];
            $scope.class_index = class_index;
            $scope.class_id = $scope.classes[class_index].class_id;
            $scope.add_chapter_index = '';
            $scope.add_topic_index = '';
            $scope.topics = [];
            $scope.add_chapter = '';
            //Get Current Subject Questions
            $scope.subject_chapters = $scope.classes[$scope.class_index].chapters;
            //console.log($scope.classes[$scope.class_index]);
        } else {
            $scope.class_index = '';
            $scope.chapter_index = '';
            $scope.chapter_id = '';
            $scope.class_id = '';
            $scope.topic_index = '';
            $scope.subject_chapters = [];
            $scope.topics = [];
            $scope.questionsTab = false;
            $scope.chapterQ = [];
            $scope.overall_chapterQ = [];
            $scope.chapterQcnt = 0;
            $scope.add_chapter = '';
            $scope.add_chapter_index = '';
            $scope.add_topic_index = '';
            $scope.topics = [];
            if ($scope.current_subject_selected_qcnt > 0) {
                $scope.resetSubjectChapters();
            }
        }
    };

    $scope.chapter_check = function(ckey) {
        //console.log($scope.subject_chapters[ckey]);
        $scope.chapter_data = $scope.subject_chapters[ckey];
        $scope.current_chapter_name = $scope.chapter_data.category;
        if ($scope.subject_chapters[ckey].topics.length != 0) {
            for (var i = 0; i < $scope.subject_chapters[ckey].topics.length; i++) {
                //console.log($scope.subject_chapters[ckey].topics[i]);
                $scope.subject_chapters[ckey].topics[i].topic_selected = false;
                $scope.subject_chapters[ckey].topics[i].qchoicetype = "";
                $scope.subject_chapters[ckey].topics[i].total_questions_selected = 0;
                $scope.subject_chapters[ckey].topics[i].type_of_question_id = "";
                $('#topic_selected_' + ckey + '_' + i).attr("disabled", false);
                $('#topic_qt_selected_' + ckey + '_' + i).attr("disabled", false);
            }
        }
        if ($scope.chapter_data.chapter_selected == false) {
            $scope.chapter_data.qchoicetype = "";
            $scope.chapter_data.total_questions_selected = 0;
            $scope.chapter_data.type_of_question_id = "";
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
            $('#chapter_selected_' + ckey).attr("disabled", false);
            $('#chapter_qt_selected_' + ckey).attr("disabled", false);
            //console.log($scope.subject_chapters[ckey]);
            $scope.checkSelectedChapterAndTopic(ckey, "NA");
            return false;
        }

        var error_message = "";
        if ($scope.chapter_data.qchoicetype == "") {
            error_message = error_message + "<b style='color:red;'>Select Question type!</b>";
        } else if ($scope.chapter_data.total_questions_selected == 0) {
            error_message = error_message + "<b style='color:red;'>Please provide the questions !</b>";
        } else {
            error_message = "";
        }

        if (($scope.chapter_data.qchoicetype == "" || $scope.chapter_data.total_questions_selected == 0) && $scope.chapter_data.chapter_selected == true) {

            $('#chapter_row_' + ckey).addClass('table-danger');
            Swal.fire({
                title: '<strong>' + $scope.current_chapter_name + '</strong>',
                icon: "error",
                html: error_message,
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn font-weight-bold btn-light"
                }
            }).then(function() {
                $scope.chapter_data.chapter_selected = false;
                $timeout(function() { $('#chapter_row_' + ckey).removeClass('table-danger'); }, 500);
            });
        } else if ($scope.chapter_data.qchoicetype == 'M' && (parseInt($scope.chapter_data.total_questions_selected) > parseInt($scope.chapter_data.mtotal_qcnt))) {

            $('#chapter_row_' + ckey).addClass('table-danger');
            Swal.fire({
                title: '<strong>' + $scope.current_chapter_name + '</strong>',
                icon: "error",
                html: "<b style='color:red;'>Your multiple choice questions limit exceeded!</b>",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn font-weight-bold btn-light"
                }
            }).then(function() {
                $scope.chapter_data.chapter_selected = false;
                $timeout(function() { $('#chapter_row_' + ckey).removeClass('table-danger'); }, 500);
            });
        } else if ($scope.chapter_data.qchoicetype == 'N' && (parseInt($scope.chapter_data.total_questions_selected) > parseInt($scope.chapter_data.ntotal_qcnt))) {

            $('#chapter_row_' + ckey).addClass('table-danger');
            Swal.fire({
                title: '<strong>' + $scope.current_chapter_name + '</strong>',
                icon: "error",
                html: "<b style='color:red;'>Your numerical questions limit exceeded!</b>",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn font-weight-bold btn-light"
                }
            }).then(function() {
                $scope.chapter_data.chapter_selected = false;
                $timeout(function() { $('#chapter_row_' + ckey).removeClass('table-danger'); }, 500);
            });
        } else {
            $('#chapter_selected_' + ckey).attr("disabled", true);
            $('#chapter_qt_selected_' + ckey).attr("disabled", true);
            $scope.checkSelectedChapterAndTopic(ckey, "NA");
        }
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
        //console.log($scope.subject_chapters[ckey]);
    }
    $scope.topic_check = function(ckey, tkey) {
        //console.log($scope.subject_chapters[ckey].topics[tkey]);
        $scope.topic_data = $scope.subject_chapters[ckey].topics[tkey];
        $scope.current_topic_name = $scope.topic_data.topic;
        $scope.subject_chapters[ckey].chapter_selected = false;
        $scope.subject_chapters[ckey].qchoicetype = "";
        $scope.subject_chapters[ckey].total_questions_selected = 0;
        $scope.subject_chapters[ckey].type_of_question_id = "";
        $('#chapter_selected_' + ckey).attr("disabled", false);
        $('#chapter_qt_selected_' + ckey).attr("disabled", false);
        if ($scope.topic_data.topic_selected == false) {
            $scope.topic_data.qchoicetype = "";
            $scope.topic_data.total_questions_selected = 0;
            $scope.topic_data.type_of_question_id = "";
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
            $('#topic_selected_' + ckey + '_' + tkey).attr("disabled", false);
            $('#topic_qt_selected_' + ckey + '_' + tkey).attr("disabled", false);
            //console.log($scope.subject_chapters[ckey].topics[tkey]);
            $scope.checkSelectedChapterAndTopic(ckey, tkey);
            return false;
        }
        var error_message = "";
        if ($scope.topic_data.qchoicetype == "") {
            error_message = error_message + "<b style='color:red;'>Select Question type!</b>";
        } else if ($scope.topic_data.total_questions_selected == 0) {
            error_message = error_message + "<b style='color:red;'>Please provide the questions !</b>";
        } else {
            error_message = "";
        }
        console.log($scope.topic_data.qchoicetype);
        console.log($scope.topic_data.mtotal_qcnt);
        console.log($scope.topic_data.ntotal_qcnt);
        console.log($scope.topic_data.total_questions_selected);
        if (($scope.topic_data.qchoicetype == "" || $scope.topic_data.total_questions_selected == 0) && $scope.topic_data.topic_selected == true) {

            $('#topic_row_' + ckey + '_' + tkey).addClass('table-danger');
            Swal.fire({
                title: '<strong>' + $scope.current_topic_name + '</strong>',
                icon: "error",
                html: error_message,
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn font-weight-bold btn-light"
                }
            }).then(function() {
                $scope.topic_data.topic_selected = false;
                $timeout(function() { $('#topic_row_' + ckey + '_' + tkey).removeClass('table-danger'); }, 500);
            });
        } else if ($scope.topic_data.qchoicetype == 'M' && (parseInt($scope.topic_data.total_questions_selected) > parseInt($scope.topic_data.mtotal_qcnt))) {

            $('#topic_row_' + ckey + '_' + tkey).addClass('table-danger');
            Swal.fire({
                title: '<strong>' + $scope.current_topic_name + '</strong>',
                icon: "error",
                html: "<b style='color:red;'>Your multiple choice questions limit exceeded!</b>",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn font-weight-bold btn-light"
                }
            }).then(function() {
                $scope.topic_data.topic_selected = false;
                $timeout(function() { $('#topic_row_' + ckey + '_' + tkey).removeClass('table-danger'); }, 500);
                $scope.resetChapterTopicSelected(ckey, tkey);
            });
        } else if ($scope.topic_data.qchoicetype == 'N' && (parseInt($scope.topic_data.total_questions_selected) > parseInt($scope.topic_data.ntotal_qcnt))) {

            $('#topic_row_' + ckey + '_' + tkey).addClass('table-danger');
            Swal.fire({
                title: '<strong>' + $scope.current_topic_name + '</strong>',
                icon: "error",
                html: "<b style='color:red;'>Your numerical questions limit exceeded!</b>",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn font-weight-bold btn-light"
                }
            }).then(function() {
                $scope.topic_data.topic_selected = false;
                $timeout(function() { $('#topic_row_' + ckey + '_' + tkey).removeClass('table-danger'); }, 500);
                $scope.resetChapterTopicSelected(ckey, tkey);
            });
        } else {
            $('#topic_selected_' + ckey + '_' + tkey).attr("disabled", true);
            $('#topic_qt_selected_' + ckey + '_' + tkey).attr("disabled", true);
            $scope.checkSelectedChapterAndTopic(ckey, tkey);
        }
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    }

    $scope.checkSelectedChapterAndTopic = function(ckey, tkey) {
        //console.log($scope.subject_chapters);
        //console.log($scope.requiredQ);
        //console.log($scope.current_subject_remain_q);
        var total_selected_q = 0;
        var number_of_smcq = 0;
        var number_of_snumq = 0;
        var number_of_spaq = 0;
        var number_of_spbq = 0;
        for (var i = 0; i < $scope.subject_chapters.length; i++) {
            if ($scope.subject_chapters[i].chapter_selected == true) {
                //console.log($scope.subject_chapters[i]);
                total_selected_q = total_selected_q + parseInt($scope.subject_chapters[i].total_questions_selected);
                if ($scope.subject_chapters[i].qchoicetype == "M") {
                    number_of_smcq = number_of_smcq + parseInt($scope.subject_chapters[i].total_questions_selected);
                }
                if ($scope.subject_chapters[i].qchoicetype == "N") {
                    number_of_snumq = number_of_snumq + parseInt($scope.subject_chapters[i].total_questions_selected);
                }

                if (number_of_spaq == 35 && number_of_spbq <= 15 && $scope.is_neet_new_pattern == 1) {
                    number_of_spbq = number_of_spbq + parseInt($scope.subject_chapters[i].total_questions_selected);
                }
                if (number_of_spaq < 35 && $scope.is_neet_new_pattern == 1) {
                    number_of_spaq = number_of_spaq + parseInt($scope.subject_chapters[i].total_questions_selected);
                }

            } else {
                if ($scope.subject_chapters[i].topics.length != 0) {
                    for (var j = 0; j < $scope.subject_chapters[i].topics.length; j++) {
                        if ($scope.subject_chapters[i].topics[j].topic_selected == true) {
                            //console.log($scope.subject_chapters[i].topics[j]);
                            total_selected_q = total_selected_q + parseInt($scope.subject_chapters[i].topics[j].total_questions_selected);
                            if ($scope.subject_chapters[i].topics[j].qchoicetype == "M") {
                                number_of_smcq = number_of_smcq + parseInt($scope.subject_chapters[i].topics[j].total_questions_selected);
                            }
                            if ($scope.subject_chapters[i].topics[j].qchoicetype == "N") {
                                number_of_snumq = number_of_snumq + parseInt($scope.subject_chapters[i].topics[j].total_questions_selected);
                            }
                            if (number_of_spaq == 35 && number_of_spbq <= 15 && $scope.is_neet_new_pattern == 1) {
                                number_of_spbq = number_of_spbq + parseInt($scope.subject_chapters[i].topics[j].total_questions_selected);
                            }
                            if (number_of_spaq < 35 && $scope.is_neet_new_pattern == 1) {
                                number_of_spaq = number_of_spaq + parseInt($scope.subject_chapters[i].topics[j].total_questions_selected);
                            }
                        } else {

                        }
                    }
                }
            }
        }
        /*$scope.current_subject_remain_q = $scope.current_subject_remain_q+total_selected_q;
        $scope.current_subject.number_of_smcq = $scope.current_subject.number_of_smcq+number_of_smcq;
        $scope.current_subject.number_of_snumq = $scope.current_subject.number_of_snumq+number_of_snumq;
        $scope.current_subject.number_of_spaq = $scope.current_subject.number_of_spaq+number_of_spaq;
        $scope.current_subject.number_of_spbq = $scope.current_subject.number_of_spbq+number_of_spbq;*/

        $scope.current_subject_remain_q = total_selected_q;
        $scope.current_subject.number_of_smcq = number_of_smcq;
        $scope.current_subject.number_of_snumq = number_of_snumq;
        $scope.current_subject.number_of_spaq = number_of_spaq;
        $scope.current_subject.number_of_spbq = number_of_spbq;

        if ($scope.current_subject_remain_q > $scope.current_subject.selected_qcnt) {
            var error_message = "<b style='color:red;'>Your questions limit exceeded</b>";
            Swal.fire({
                title: '<strong>Error</strong>',
                icon: "error",
                html: error_message,
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn font-weight-bold btn-light"
                }
            }).then(function() {
                $scope.resetChapterTopicSelected(ckey, tkey);
            });
        }
        if ($scope.current_subject.number_of_smcq > 20 && $scope.is_jee_new_pattern == 1) {
            var error_message = "<b style='color:red;'>MCQ questions limit exceeded</b>";
            Swal.fire({
                title: '<strong>Error</strong>',
                icon: "error",
                html: error_message,
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn font-weight-bold btn-light"
                }
            }).then(function() {
                $scope.resetChapterTopicSelected(ckey, tkey);
            });
        }
        if ($scope.current_subject.number_of_snumq > 10 && $scope.is_jee_new_pattern == 1) {
            var error_message = "<b style='color:red;'>Numeric questions limit exceeded</b>";
            Swal.fire({
                title: '<strong>Error</strong>',
                icon: "error",
                html: error_message,
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn font-weight-bold btn-light"
                }
            }).then(function() {
                $scope.resetChapterTopicSelected(ckey, tkey);
            });
        }
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
        console.log($scope.requiredQ);
        console.log($scope.current_subject_remain_q);
    }
    $scope.resetChapterTopicSelected = function(ckey, tkey){
        console.log("reset chaptes");
        $scope.chapter_data = $scope.subject_chapters[ckey];
        $scope.chapter_data.chapter_selected = false;
        $scope.chapter_data.qchoicetype = "";
        $scope.chapter_data.total_questions_selected = 0;
        $scope.chapter_data.type_of_question_id = "";

        $('#chapter_selected_' + ckey).attr("disabled", false);
        $('#chapter_qt_selected_' + ckey).attr("disabled", false);
        $scope.chapter_check(ckey);
        $scope.resetChapterTopicSelected_topics(ckey, tkey);
        
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    }
    $scope.resetChapterTopicSelected_topics = function(ckey, tkey){
        console.log("reset topics");
        $scope.topic_data = $scope.subject_chapters[ckey].topics[tkey];
        $scope.topic_data.topic_selected = false;
        $scope.topic_data.qchoicetype = "";
        $scope.topic_data.total_questions_selected = 0;
        $scope.topic_data.type_of_question_id = "";
        
        $('#topic_selected_' + ckey + '_' + tkey).attr("disabled", false);
        $('#topic_qt_selected_' + ckey + '_' + tkey).attr("disabled", false);
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    }

    //Get selected subject chapters
    $scope.resetSubjectChapters = function() {
        var index = $scope.current_subject.index;
        //Single Subject Information
        var params = $.param({ 'ct_id': $scope.ct_id, 'mid': $scope.current_subject.mid, 'subject_index': $scope.subject_index, 'index': index, 'action': 'single_subject', 'user_id': $scope.user_id, 'level': $scope.level });
        $http({ method: 'POST', url: API_URL, data: params }).success(function(response, status, headers, config) {
            //Questions Analysis
            $scope.selected_subjects[$scope.subject_index].number_of_q = response.subject[$scope.subject_index].number_of_q;
            $scope.selected_subjects[$scope.subject_index].number_of_smcq = response.subject[$scope.subject_index].number_of_smcq;
            $scope.selected_subjects[$scope.subject_index].number_of_snumq = response.subject[$scope.subject_index].number_of_snumq;
            $scope.selected_subjects[$scope.subject_index].selected_q = response.subject[$scope.subject_index].selected_q;
            $scope.selected_subjects[$scope.subject_index].comman_qlist = response.subject[$scope.subject_index].comman_qlist;

            $scope.selected_subjects[$scope.subject_index].number_of_spaq = response.subject[$scope.subject_index].number_of_spaq;
            $scope.selected_subjects[$scope.subject_index].number_of_spbq = response.subject[$scope.subject_index].number_of_spbq;

            //Subjects
            var index = $scope.current_subject.index;
            $scope.subjects[index].number_of_q = response.subject[$scope.subject_index].number_of_q;
            $scope.subjects[index].number_of_smcq = response.subject[$scope.subject_index].number_of_smcq;
            $scope.subjects[index].number_of_snumq = response.subject[$scope.subject_index].number_of_snumq;
            $scope.subjects[index].selected_q = response.subject[$scope.subject_index].selected_q;
            $scope.subjects[index].comman_qlist = response.subject[$scope.subject_index].comman_qlist;

            $scope.subjects[index].number_of_spaq = response.subject[$scope.subject_index].number_of_spaq;
            $scope.subjects[index].number_of_spbq = response.subject[$scope.subject_index].number_of_spbq;


            $scope.current_subject.number_of_q = response.subject[$scope.subject_index].number_of_q;
            $scope.current_subject.selected_q = response.subject[$scope.subject_index].selected_q;
            $scope.current_subject.number_of_smcq = response.subject[$scope.subject_index].number_of_smcq;
            $scope.current_subject.number_of_snumq = response.subject[$scope.subject_index].number_of_snumq;
            $scope.current_subject.comman_qlist = response.subject[$scope.subject_index].comman_qlist;

            $scope.current_subject.number_of_spaq = response.subject[$scope.subject_index].number_of_spaq;
            $scope.current_subject.number_of_spbq = response.subject[$scope.subject_index].number_of_spbq;

            $scope.total_selected_q = $scope.current_subject.number_of_q;
            $scope.current_subject_selected_qcnt = 0;
            $scope.requiredQ = ($scope.current_subject.selected_qcnt - $scope.current_subject.number_of_q);
            $scope.requiredMCQ = (20 - $scope.current_subject.number_of_smcq);
            $scope.requiredNUMQ = (10 - $scope.current_subject.number_of_snumq);
            $scope.requiredPAQ = (35 - $scope.current_subject.number_of_spaq);
            $scope.requiredPBQ = (15 - $scope.current_subject.number_of_spbq);
            $scope.current_subject_selected_mcqcnt = 0;
            $scope.current_subject_selected_numqcnt = 0;
            $scope.subject_questions_list = $scope.current_subject.comman_qlist;

            //Current Subject Chapters info
            $scope.selected_subjects[$scope.subject_index].chapters = response.subject[$scope.subject_index].chapters;
            $scope.selected_subjects[$scope.subject_index].classes = response.subject[$scope.subject_index].classes;
            $scope.subjects[index].chapters = response.subject[$scope.subject_index].chapters;
            $scope.subjects[index].classes = response.subject[$scope.subject_index].classes;
            $scope.current_subject.chapters = response.subject[$scope.subject_index].chapters;
            $scope.current_subject.classes = response.subject[$scope.subject_index].classes;
            $scope.classes = $scope.current_subject.classes;

            $scope.all_subjects[$scope.current_subject.id].chapters = response.single_allchapters;
            $scope.all_subject_chapters = $scope.all_subjects[$scope.current_subject.id].chapters;

            if ($scope.class_index != null && $scope.class_index != "")
                $scope.subject_chapters = $scope.classes[$scope.class_index].chapters;

            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }

        });
    }

    $scope.reset = function() {
        $scope.subject_index = '';
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    }

    $scope.defaultset = function() {
        $timeout(function() {
            $scope.chapter_index = '0';
        }, 1000);
    }

    $scope.$watch('chapter_index', function() {
        //console.log($scope.chapter_index);
    });


    //Add Tab start
    //Get Class
    $scope.show_solution_type = '';
    $scope.files = [];
    $scope.getAddModuleClass = function(class_index) {
        if (class_index != null) {
            $scope.add_chapter_index = '';
            $scope.add_chapter_id = '';
            $scope.add_topic_index = '';
            $scope.add_topic_id = '';
            $scope.subject_chapters = [];
            $scope.topics = [];
            $scope.add_class_index = class_index;
            $scope.add_class_id = $scope.classes[class_index].class_id;
            //Get Current Subject Questions
            $scope.subject_chapters = $scope.classes[$scope.add_class_index].chapters;
        } else {
            $scope.add_class_index = '';
            $scope.add_chapter_index = '';
            $scope.add_chapter_id = '';
            $scope.add_class_id = '';
            $scope.add_topic_index = '';
            $scope.subject_chapters = [];
            $scope.topics = [];
        }
    };
    //Get Topics
    $scope.getAddModuleTopics = function(chapter_index) {
            if (chapter_index != null && chapter_index != "") {
                $scope.add_chapter_index = '';
                $scope.add_topic_index = '';
                $scope.add_topic_id = '';
                //Initial
                $scope.add_chapter_index = chapter_index;

                //Current Chapter Info
                $scope.current_chapter = $scope.subject_chapters[chapter_index];
                $scope.add_chapter_id = $scope.current_chapter.id;

                //Initialize topics
                $scope.topics = [];
                $scope.topics = $scope.current_chapter.topics;
            } else {
                $scope.add_chapter_index = '';
                $scope.add_topic_index = '';
                $scope.topics = [];
            }
        }
        //Get Subject Chapters From Add Tab
    $scope.getAddTabSubjectChapters = function(subject_index) {
        $scope.add_subject_chapters = [];
        $scope.add_subject_index = null;
        $scope.add_current_subject = {};

        //Current Subject info
        $scope.add_subject_index = subject_index;
        $scope.add_current_subject = $scope.selected_subjects[subject_index];
        $scope.add_subject_id = $scope.add_current_subject.id;

        var index = $scope.add_current_subject.index;

        //console.log($scope.subject_chapters);
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    }

    $scope.getSolutionType = function(solution_type) {
        if (solution_type != null) {
            $scope.show_solution_type = solution_type;
        } else {
            $scope.show_solution_type = '';
        }

    };

    $scope.uploadedFile = function(element) {
        $scope.currentFile = element.files[0];
        $scope.files = element.files;
    };
    // publish submit btn start
    $scope.publishtest_config = function() {
            console.log('test test');
            //Publish
            var edata = "";
            if ($scope.publishconfig.test_status == false) {
                return true;
            } else {
                if (angular.isUndefined($scope.publishconfig.start_date) || $scope.publishconfig.start_date == "") {
                    edata += "<b style='color:red;'>Please provide start date </b>";
                }

                if (angular.isUndefined($scope.publishconfig.end_date) || $scope.publishconfig.end_date == "") {
                    edata += "<b style='color:red;'>Please provide end date </b>";
                }


                if (edata != "") {
                    bootbox.alert({
                        message: edata,
                        // size:"small",
                        title: "Please fix the following issues:",
                        backdrop: true
                    });
                    $scope.Return_Status = false;
                    return false;
                } else {
                    $scope.publishconfig.start_date = $("#start_date").val();
                    $scope.publishconfig.end_date = $("#end_date").val();
                    console.log($scope.publishconfig.start_date + '---' + $scope.publishconfig.end_date);
                    var startTime = new Date($scope.publishconfig.start_date);
                    var endTime = new Date($scope.publishconfig.end_date);
                    //console.log("s"+startTime+'----'+endTime);
                    var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
                    var resultInMinutes = Math.round(difference / 60000);
                    var exam_expiry_time = exam_start_time = "";

                    //Publish time
                    var publish_err_msg = publish_err_title = "";
                    /*if(resultInMinutes>$scope.testTime){
                    	publish_err_msg+="<b>Publish time("+resultInMinutes+" mins)</b> is greater than <b>Test Duration time("+$scope.testTime+" mins)</b> then test should not be published";
                    }

                    if(resultInMinutes<$scope.testTime){
                    	publish_err_msg+="<b>Test Duration time("+$scope.testTime+" mins)</b> is greater than <b>Publish time("+resultInMinutes+" mins)</b> then test should not be published";
                    }*/

                    if (publish_err_msg != "") {
                        publish_err_title += "Test Duration(" + $scope.testTime + ") mins";
                        Swal.fire({
                            title: publish_err_title,
                            html: publish_err_msg,
                            icon: "error",
                            showCancelButton: true,
                            showConfirmButton: false,
                            cancelButtonColor: '#d33'
                        });

                        $scope.Return_Status = false;
                        return false;
                    }

                    var current_date = new Date();
                    if (resultInMinutes > 0) {

                        //Test Expiry Date
                        var hourDiff = endTime - startTime; //in ms
                        var secDiff = hourDiff / 1000; //in s
                        var minDiff = hourDiff / 60 / 1000; //in minutes
                        var hDiff = hourDiff / 3600 / 1000; //in hours
                        //var humanReadable = {};
                        //humanReadable.hours = Math.floor(hDiff);
                        //humanReadable.minutes = minDiff - 60 * humanReadable.hours;
                        var hours = Math.floor(hDiff);
                        var minutes = minDiff - (60 * hours);
                        var seconds = secDiff - (60 * hours * minutes);
                        exam_expiry_time = hours + " Hrs " + minutes + " Min ";

                        //Test Start Time
                        var current_hourDiff = startTime - current_date; //in ms
                        if (current_hourDiff > 0) {
                            var current_minDiff = current_hourDiff / 60 / 1000; //in minutes
                            var current_hDiff = current_hourDiff / 3600 / 1000; //in hours

                            var current_hours = Math.floor(current_hDiff);
                            var current_minutes = Math.round(current_minDiff - (60 * current_hours));
                            exam_start_time = current_hours + " Hrs " + current_minutes + " Min ";
                        } else {
                            exam_start_time = 0 + " Hrs " + 0 + " Min ";
                        }

                    } else {
                        exam_expiry_time = 0 + " Hrs " + 0 + " Min ";
                        exam_start_time = 0 + " Hrs " + 0 + " Min ";
                    }

                    //Confimation for publishing test
                    bootbox.confirm({
                        title: " Are you sure do you want to publish <span class='label label-inline label-success font-weight-bold'>" + $scope.title + "</span> ?",
                        message: "Users can start the test with in <span class='label label-inline label-success font-weight-bold'>" + exam_start_time + "</span><br>Test expires on <span class='label label-inline label-danger font-weight-bold'>" + exam_expiry_time + "</span>",
                        buttons: {
                            cancel: {
                                label: '<i class="fa fa-times"></i> Cancel'
                            },
                            confirm: {
                                label: '<i class="fa fa-check"></i> Confirm'
                            }
                        },
                        callback: function(result) {
                            //console.log('This feature comming soon');
                            if (result == true) {
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
    $scope.publishTestConfig = function() {
        //publish_processing
        //publish_loading_img
        //publish_success
        $("#publish_processing").modal({
            backdrop: 'static',
            keyboard: false // to prevent closing with Esc button (if you want this too)
        });
        $scope.publish_loading_img = true;

        var params = $.param({
            'ct_id': $scope.ct_id,
            'publishconfig': $scope.publishconfig,
            'is_jee_new_pattern':$scope.is_jee_new_pattern,
            'is_neet_new_pattern':$scope.is_neet_new_pattern,
            'title': $scope.title,
            'testType': $scope.testType,
            'source_type': $scope.source_type,
            'campus_id':$scope.campus_id,
            'action': 'publish_test'
        });
        //Save or Update
        $http({ method: 'POST', url: API_URL, data: params }).success(function(response, status, headers, config) {


            if (response.update_status == true) {
                $scope.publish_loading_img = false;
                $scope.publish_success_msg = $scope.title + " Published Successfully";
                $scope.publish_success = true;

                $timeout(function() {
                    $("#publish_processing").modal('hide');
                    $('.modal-backdrop').remove();
                    location.replace("custom-test-list");
                }, 2000);
            }
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        });
    }
    $scope.submitData = function() {
            console.log($scope.qchoice_type);
        }
        //Submit Compose Form
    $scope.submitComposeForm = function() {

        console.log($scope.qchoice_type);

        tinyMCE.triggerSave();
        $scope.uploadfile = '';
        if ($scope.solution_type == "IMAGE") {
            $scope.uploadfile = $scope.files[0];
        }
        $scope.submitted = true;



        var edata = "";
        if (angular.isUndefined($scope.qchoice_type) || $scope.qchoice_type == "") {
            edata += "<b style='color:red;'>Please Select Question Type</b> <br/>";
        }

        if (angular.isUndefined($scope.add_class_index) || $scope.add_class_index == "") {
            edata += "<b style='color:red;'>Please Select Class</b> <br/>";
        }
        if (angular.isUndefined($scope.add_chapter) || $scope.add_chapter == "") {
            edata += "<b style='color:red;'>Please Select Chapter</b> <br/>";
        }
        if (angular.isUndefined($scope.add_topic_index) || $scope.add_topic_index == "") {
            edata += "<b style='color:red;'>Please Select Topic</b> <br/>";
        }

        if ($("#question").val() == "") { edata += "<b style='color:red;'>Please Enter Question</b> <br/>"; }
        if (angular.isUndefined($scope.qchoice_type) || $scope.qchoice_type == "M" || $scope.qchoice_type == "MC") {
            if ($("#answer").val() != "NA") {

                if ($("#ans1").val() == "") { edata += "<b style='color:red;'>Please Enter Option A</b> <br/>"; }
                if ($("#ans2").val() == "") { edata += "<b style='color:red;'>Please Enter Option B</b> <br/>"; }
                if ($("#ans3").val() == "") { edata += "<b style='color:red;'>Please Enter Option C</b> <br/>"; }
                if ($("#ans4").val() == "") { edata += "<b style='color:red;'>Please Enter Option D</b> <br/>"; }
            }

            if (angular.isUndefined($scope.answer) || $scope.answer == "") {
                edata += "<b style='color:red;'>Please Select Currect Answer</b> <br/>";
            }
        } else {
            if (angular.isUndefined($scope.numeric_answer) || $scope.numeric_answer == "") {
                edata += "<b style='color:red;'>Please Enter Numeric Answer</b> <br/>";
            } else {
                var reg = /^-?[0-9]\d*(\.\d+)?$/;
                if (reg.test($scope.numeric_answer) == false) {
                    edata += "<b style='color:red;'>Please Enter Valid Numeric Value!</b> <br/>";
                }
            }
        }

        // if(angular.isUndefined($scope.answer) || $scope.answer==""){
        //      edata += "<b style='color:red;'>Please Choose Currect Answer</b> <br/>";
        // }

        if (angular.isUndefined($scope.solution_type) || $scope.solution_type == "") {
            edata += "<b style='color:red;'>Please provide solution type</b> <br/>";
        }

        if ($scope.solution_type != "") {

            if ($scope.solution_type == "CONTENT" && $("#solution").val() == "") {
                edata += "<b style='color:red;'>Please provide content</b> <br/>";
            }

            if ($scope.solution_type == "VIDEO" && $scope.video == "") {
                edata += "<b style='color:red;'>Please provide video id</b> <br/>";
            }

            if ($scope.solution_type == "IMAGE" && $scope.uploadfile == "") {
                edata += "<b style='color:red;'>Please upload solution image</b> <br/>";
            }

        }
        //$scope.uploadfile = $scope.files[0];
        if (edata != "") {
            //$("#error_message").html(edata);
            bootbox.alert({
                message: "Please fix the following issues:<br/>" + edata,
                // size:"small",
                backdrop: true,
            });
            return false;
        }
        var formData = new FormData();
        formData.append("image", $scope.uploadfile);
        $scope.add_tabloader = true;
        var class_id = $scope.classes[$scope.add_class_index].id;
        var chapter_id = $scope.subject_chapters[$scope.add_chapter_index].id;
        var topic_id = ($scope.add_topic_index != "") ? $scope.topics[$scope.add_topic_index].id : '';

        $http({
            method: 'POST',
            url: $scope.add_question_url,
            processData: false,
            transformRequest: function(data) {
                var formData = new FormData();
                formData.append("action", "add_question");
                formData.append("user_id", $scope.user_id);
                formData.append("level", $scope.level);
                formData.append("image", $scope.uploadfile);
                formData.append("ct_id", $scope.ct_id);
                formData.append("mid", $scope.current_subject.mid);
                formData.append("subject_index", $scope.subject_index);
                formData.append("class_index", $scope.add_class_index);
                formData.append("chapter_index", $scope.add_chapter_index);
                formData.append("topic_index", $scope.add_topic_index);
                formData.append("qchoice_type", $scope.qchoice_type);
                formData.append("class_id", class_id);
                formData.append("chapter_id", chapter_id);
                formData.append("topic_id", topic_id);
                formData.append("question", $("#question").val());
                formData.append("ans1", $("#ans1").val());
                formData.append("ans2", $("#ans2").val());
                formData.append("ans3", $("#ans3").val());
                formData.append("ans4", $("#ans4").val());
                formData.append("answer", $scope.answer);
                formData.append("numeric_answer", $scope.numeric_answer);
                formData.append("course", $scope.course_id);
                formData.append("subject", $scope.subject_id);
                formData.append("difficulty", $('#difficulty').val());
                formData.append("subject", angular.toJson($scope.selected_subjects[$scope.subject_index]));
                formData.append("solution_type", $scope.solution_type);
                formData.append("solution", $("#solution").val());
                formData.append("video", $scope.video);
                formData.append("image", $scope.uploadfile);
                return formData;
            },
            data: $scope.form,
            headers: {
                'Content-Type': undefined
            }
        }).success(function(response) {
            if (response.error == false) {
                //$scope.loading_img=false;
                $scope.no_of_questions_added = response.no_of_questions_added;
                $scope.no_of_questions_msg = ($scope.no_of_questions_added > 1) ? " Questions added successfully" : " Question added successfully";
                $scope.data_status = response.data_status;
                $scope.message = response.message;

                $scope.added_msg = response.message;
                $scope.add_class = 'label-success';
                var succmsg = "<b style='color:green;'>" + response.message + "</b>";
                bootbox.alert({
                    message: "Success :<br/>" + succmsg,
                    // size:"small",
                    backdrop: true,
                });

                //Modifying Current Subject Information after saving questions
                //Questions Analysis
                $scope.selected_subjects[$scope.subject_index].number_of_q = response.subject[$scope.subject_index].number_of_q;
                $scope.selected_subjects[$scope.subject_index].selected_q = response.subject[$scope.subject_index].selected_q;
                $scope.selected_subjects[$scope.subject_index].comman_qlist = response.subject[$scope.subject_index].comman_qlist;
                //Subjects
                var index = $scope.current_subject.index;
                $scope.subjects[index].number_of_q = response.subject[$scope.subject_index].number_of_q;
                $scope.subjects[index].selected_q = response.subject[$scope.subject_index].selected_q;
                $scope.subjects[index].comman_qlist = response.subject[$scope.subject_index].comman_qlist;

                $scope.current_subject.number_of_q = response.subject[$scope.subject_index].number_of_q;
                $scope.current_subject.selected_q = response.subject[$scope.subject_index].selected_q;
                $scope.current_subject.comman_qlist = response.subject[$scope.subject_index].comman_qlist;

                $scope.total_selected_q = $scope.current_subject.number_of_q;
                $scope.current_subject_selected_qcnt = 0;
                $scope.requiredQ = ($scope.current_subject.selected_qcnt - $scope.current_subject.number_of_q);
                $scope.subject_questions_list = $scope.current_subject.comman_qlist;
                $scope.overall_composed_questions = response.overall_number_of_q;

                //Manage Tabs Options
                if ($scope.requiredQ == 0) {
                    $scope.compose_type = '';
                    $scope.subject_index = '';
                    $scope.composing_subject_successfully = $scope.current_subject.category + " composed successfully";
                    $scope.tabs_options = false;
                    $scope.tabs_options_success = true;

                    tinyMCE.get('question').setContent('');
                    tinyMCE.get('ans1').setContent('');
                    tinyMCE.get('ans2').setContent('');
                    tinyMCE.get('ans3').setContent('');
                    tinyMCE.get('ans4').setContent('');
                    tinyMCE.get('solution').setContent('');

                    tinyMCE.get('question').remove();
                    tinyMCE.get('ans1').remove();
                    tinyMCE.get('ans2').remove();
                    tinyMCE.get('ans3').remove();
                    tinyMCE.get('ans4').remove();
                    tinyMCE.get('solution').remove();
                }

                $timeout(function() {
                    $scope.added_msg = '';
                    $scope.add_class = '';
                    $scope.refreshForm();
                }, 1000);
            } else {
                var errmsg = "<b style='color:red;'>" + response.message + "</b>";
                bootbox.alert({
                    message: "Error :<br/>" + errmsg,
                    // size:"small",
                    backdrop: true,
                });
            }

            $timeout(function() {
                $scope.add_tabloader = false;
            }, 1000);

            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }

        });
    };

    //Clear PickTab Information
    $scope.clearPickTabInfo = function() {
        //Picking
        $scope.tabs_options = true;
        $scope.questionsTab = false;

        $scope.current_subject_selected_qcnt = 0;
        $scope.current_subject_selected_mcqcnt = 0;
        $scope.current_subject_selected_numqcnt = 0;
        $scope.chapterQ = [];
        $scope.overall_chapterQ = [];
        $scope.chapterQcnt = 0;
        var allselectedQIds = [];
        $scope.allselectedQ = [];
        //$scope.total_selected_q=0;
        $scope.remain_selected_q = 0;
        $scope.selected_sub_qcount = 0;
        $scope.chapter_index = '';
        $scope.qchoicetype = '';
        $scope.topic_index = '';

        /*if(tinyMCE.get('question')===null){
          tinyMCE.get('question').setContent('');
          tinyMCE.get('ans1').setContent('');
          tinyMCE.get('ans2').setContent('');
          tinyMCE.get('ans3').setContent('');
          tinyMCE.get('ans4').setContent('');
          tinyMCE.get('solution').setContent('');

          tinyMCE.get('question').remove();
          tinyMCE.get('ans1').remove();
          tinyMCE.get('ans2').remove();
          tinyMCE.get('ans3').remove();
          tinyMCE.get('ans4').remove();
          tinyMCE.get('solution').remove();
        }*/


        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    }

    //Clear AddTab Information
    $scope.refreshForm = function() {
        //,#ans1,#ans2,#ans3,#ans4,#ans5
        //$('#question').val('');
        $scope.add_class_index = '';
        $scope.add_chapter_index = '';
        $scope.add_topic_index = '';
        $scope.answer = '';
        //$scope.difficulty='';
        $scope.solution_type = '';
        $scope.solution = '';
        $scope.video = '';
        $scope.uploadfile = '';
        $scope.subject_chapters = [];
        $scope.topics = [];

        if ($scope.requiredQ > 0) {
            tinyMCE.get('question').setContent('');
            tinyMCE.get('ans1').setContent('');
            tinyMCE.get('ans2').setContent('');
            tinyMCE.get('ans3').setContent('');
            tinyMCE.get('ans4').setContent('');
            tinyMCE.get('solution').setContent('');
            //tinyMCE.get('ans5').setContent('');
        }

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    }

    //Get Chapter Questions
    $scope.getChapterQuestions = function(chapter_index) {
        if (chapter_index != null && chapter_index != "") {
            $scope.chapter_index = '';
            $scope.topic_index = '';
            $scope.topic_id = '';
            $scope.psearchQ = '';
            //Initial
            $scope.chapter_index = chapter_index;
            $scope.chapterQ = [];
            $scope.overall_chapterQ = [];
            $scope.chapterQcnt = 0;

            //Current Chapter Info
            $scope.current_chapter = $scope.subject_chapters[chapter_index];
            $scope.chapter_id = $scope.current_chapter.id;

            //Initialize topics
            $scope.topics = [];
            $scope.topics = $scope.current_chapter.topics;
            //Show questions tab
            $scope.questionsTab = true;

            $scope.questions_tabloader = true;
            var params = $.param({
                'key_index': chapter_index,
                'chapter_id': $scope.chapter_id,
                'comman_qlist': $scope.current_subject.comman_qlist,
                'selected_q': $scope.all_subject_chapters[$scope.chapter_id].selected_q,
                'course': $scope.course_id,
                'subject_id': $scope.subject_id,
                'qchoice_type': $scope.qchoicetype,
                'action': 'getchapter_questions',
                'user_id': $scope.user_id,
                'level': $scope.level,
                'campus_id':$scope.campus_id,
                'source_type':$scope.source_type
            });

            $http({ method: 'POST', url: API_URL, data: params }).success(function(response, status, headers, config) {
                $scope.chapterQ = response.qlist;
                $scope.chapterQcnt = response.result_cnt;
                $scope.overall_chapterQ = response.overall_qlist;
                $timeout(function() {
                    $scope.questions_tabloader = false;
                    $('[data-toggle="tooltip"]').tooltip();
                }, 1000);
                renderQuestions();
                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
            });

        } else {
            $scope.chapter_index = '';
            $scope.topic_index = '';
            $scope.qchoicetype = '';
            $scope.questionsTab = false;
            if ($scope.current_subject_selected_qcnt > 0) {
                $scope.resetSubjectChapters();
            }
        }

    }

    //Get Chapter Questions
    $scope.getChapterTopicQuestions = function(topic_index) {
        console.log(topic_index);
        if (topic_index != null && topic_index != "") {
            $scope.topic_index = '';
            $scope.topic_id = '';
            console.log($scope.topics[topic_index]);
            $scope.topic_index = topic_index;
            $scope.current_topic = $scope.topics[topic_index];
            $scope.topic_id = $scope.current_topic.topic_id;

            //Show questions tab
            $scope.questions_tabloader = true;
            var params = $.param({ 'key_index': $scope.chapter_index, 'chapter_id': $scope.chapter_id, 'topic_id': $scope.topic_id, 'comman_qlist': $scope.current_subject.comman_qlist, 'selected_q': $scope.all_subject_chapters[$scope.chapter_id].selected_q, 'course': $scope.course_id, 'subject_id': $scope.subject_id, 'qchoice_type': $scope.qchoicetype, 'action': 'getchapter_questions', 'user_id': $scope.user_id, 'level': $scope.level,'campus_id':$scope.campus_id,
                'source_type':$scope.source_type});

            $http({ method: 'POST', url: API_URL, data: params }).success(function(response, status, headers, config) {
                $scope.chapterQ = response.qlist;
                $scope.chapterQcnt = response.result_cnt;
                $scope.overall_chapterQ = response.overall_qlist;

                $timeout(function() {
                    $scope.questions_tabloader = false;
                    $('[data-toggle="tooltip"]').tooltip();
                }, 1000);
                renderQuestions();

                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
            });

        } else {
            $scope.topic_index = '';
            $scope.questionsTab = false;
            $scope.getChapterQuestions($scope.chapter_index);
        }

    }

    $scope.gettoqiQuestions = function(type_of_question_id) {

        if (type_of_question_id != null && type_of_question_id != "") {

            //Show questions tab
            $scope.questions_tabloader = true;
            var params = $.param({ 'key_index': $scope.chapter_index, 'chapter_id': $scope.chapter_id, 'topic_id': $scope.topic_id, 'type_of_question_id': $scope.type_of_question_id, 'comman_qlist': $scope.current_subject.comman_qlist, 'selected_q': $scope.all_subject_chapters[$scope.chapter_id].selected_q, 'course': $scope.course_id, 'subject_id': $scope.subject_id, 'qchoice_type': $scope.qchoicetype, 'action': 'getchapter_questions', 'user_id': $scope.user_id, 'level': $scope.level,'campus_id':$scope.campus_id,'source_type':$scope.source_type});

            $http({ method: 'POST', url: API_URL, data: params }).success(function(response, status, headers, config) {
                $scope.chapterQ = response.qlist;
                $scope.chapterQcnt = response.result_cnt;
                $scope.overall_chapterQ = response.overall_qlist;

                $timeout(function() {
                    $scope.questions_tabloader = false;
                    $('[data-toggle="tooltip"]').tooltip();
                }, 1000);
                renderQuestions();

                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                    $scope.$apply();
                }
            });

        } else {
            $scope.type_of_question_id = '';
            $scope.questionsTab = false;
            $scope.getChapterQuestions($scope.chapter_index);
        }

    }

    //Select one question
    $scope.optionToggled = function(key, chapter_id) {
        $scope.isAllSelected = $scope.chapterQ.every(function(itm) { return itm.done_status; })
        $timeout(function() {
            $scope.getSelectedQuestions(key, chapter_id);
        }, 500);
    }

    //Get selected items count
    $scope.getSelectedQuestions = function(key_index, chapter_id) {
        $scope.question_index = key_index;
        //console.log($scope.chapterQ[$scope.question_index]);
        angular.forEach($scope.overall_chapterQ, function(vitm, vkey) {
            if (vitm.question_id == $scope.chapterQ[$scope.question_index].question_id) {
                //console.log(vitm.question_id+"---"+$scope.chapterQ[$scope.question_index].done_status+"--"+$scope.question_index+"---"+$scope.chapterQ[$scope.question_index].question_id);
                if ($scope.chapterQ[$scope.question_index].done_status == true) {
                    vitm.done_status = true;
                    console.log($scope.current_subject.number_of_spaq);
                    if ($scope.chapterQ[$scope.question_index].qchoice_type == "M") {
                        $scope.current_subject.number_of_smcq = $scope.current_subject.number_of_smcq + 1;
                    }
                    if ($scope.chapterQ[$scope.question_index].qchoice_type == "N") {
                        $scope.current_subject.number_of_snumq = $scope.current_subject.number_of_snumq + 1;
                    }



                } else if ($scope.chapterQ[$scope.question_index].done_status == false) {
                    vitm.done_status = false;

                    $scope.allselectedQ.splice(jQuery.inArray($scope.chapterQ[$scope.question_index].question_id, $scope.allselectedQ), 1);
                    if ($scope.chapterQ[$scope.question_index].qchoice_type == "M") {
                        $scope.current_subject.number_of_smcq = $scope.current_subject.number_of_smcq - 1;
                    }
                    if ($scope.chapterQ[$scope.question_index].qchoice_type == "N") {
                        $scope.current_subject.number_of_snumq = $scope.current_subject.number_of_snumq - 1;
                    }
                    if ($scope.current_subject.number_of_spaq == 35 && $scope.current_subject.number_of_spbq <= 15 && $scope.is_neet_new_pattern == 1) {
                        $scope.current_subject.number_of_spbq_arr.splice(jQuery.inArray($scope.chapterQ[$scope.question_index].question_id, $scope.current_subject.number_of_spbq_arr), 1);
                    }
                    if ($scope.current_subject.number_of_spaq < 35 && $scope.is_neet_new_pattern == 1) {
                        $scope.current_subject.number_of_spaq_arr.splice(jQuery.inArray($scope.chapterQ[$scope.question_index].question_id, $scope.current_subject.number_of_spaq_arr), 1);
                    }

                }
                console.log($scope.current_subject.number_of_spaq);
                console.log($scope.current_subject.number_of_spbq);
                return;
            }
        });


        /*if($scope.current_subject.number_of_smcq==20 && $scope.is_jee_new_pattern == 1){
          //alert('Subject composed successfully');
          $scope.congradulation=$scope.current_subject.category+" MCQ Questions Composed successfully";
          $("#composing").modal({
            backdrop: 'static',
            keyboard: false  // to prevent closing with Esc button (if you want this too)
          });
        }*/
        if ($scope.current_subject.number_of_smcq > 20 && $scope.is_jee_new_pattern == 1) {
            var edata = "<b style='color:red;'>MCQ questions limit exceeded</b>";
            bootbox.alert({
                message: "Error :<br/>" + edata,
                // size:"small",
                backdrop: true,
            });
            $scope.chapterQ[$scope.question_index].done_status = false;
            $scope.current_subject.number_of_smcq = $scope.current_subject.number_of_smcq - 1;
            return false;
        }
        if ($scope.current_subject.number_of_snumq > 10 && $scope.is_jee_new_pattern == 1) {
            var edata = "<b style='color:red;'>Numeric questions limit exceeded</b>";
            bootbox.alert({
                message: "Error :<br/>" + edata,
                // size:"small",
                backdrop: true,
            });
            $scope.chapterQ[$scope.question_index].done_status = false;
            $scope.current_subject.number_of_snumq = $scope.current_subject.number_of_snumq - 1;
            return false;
        }


        //Store Selected Questions
        var selectedQIds = [];
        $scope.selected_sub_qcount = 0;
        $scope.selected_subjects[$scope.subject_index].selected_q = '';
        $scope.subjects[$scope.current_subject.index].selected_q = '';
        $scope.all_subject_chapters[chapter_id].selected_q = '';
        $scope.current_subject.selected_q = '';

        /*angular.forEach($scope.chapterQ, function(itm,key){ 
            if(itm.done_status==true)
            selectedQIds.push(itm.question_id);
        });*/

        angular.forEach($scope.overall_chapterQ, function(itm, key) {
            if (itm.done_status == true)
                selectedQIds.push(itm.question_id);
        });

        console.log($scope.chapterQ[$scope.question_index].qchoice_type);


        console.log($scope.current_subject.number_of_spaq);
        console.log($scope.current_subject.number_of_spbq);
        /*console.log($scope.current_subject.number_of_smcq);
        console.log($scope.current_subject.number_of_snumq);*/
        $scope.current_subject_mcq_q = $scope.current_subject.number_of_smcq;
        $scope.current_subject_num_q = $scope.current_subject.number_of_snumq;
        //Chapter Identification
        $scope.selected_subjects[$scope.subject_index].selected_q = selectedQIds;
        $scope.current_subject.selected_q = selectedQIds;
        $scope.subjects[$scope.current_subject.index].selected_q = selectedQIds;

        $scope.all_subject_chapters[chapter_id].selected_q = selectedQIds;
        $scope.all_subject_chapters[chapter_id].selected_qcnt = selectedQIds.length;

        $timeout(function() { $scope.getTotalSelectedQuestions(); }, 100);
        console.log($scope.all_subject_chapters[chapter_id].selected_q);
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }

        /*if($scope.current_subject.number_of_spaq==35 && $scope.current_subject.number_of_spbq==0 && $scope.is_neet_new_pattern == 1)
        {
        	$scope.savePickedQ();
        }*/
    };

    //Total Selected Items
    $scope.getTotalSelectedQuestions = function() {
        //Store All Selected Questions
        var allselectedQIds = [];
        $scope.current_subject_selected_qcnt = 0;
        $scope.current_subject_remain_q = 0;

        //console.log($scope.current_subject.number_of_spaq_arr);
        //console.log($scope.current_subject.number_of_spbq_arr);

        //$scope.allselectedQ=[];
        angular.forEach($scope.all_subject_chapters, function(itm, key) {
            //allselectedQIds.push(itm.selected_q);

            if (itm.selected_q.length > 0) {
                angular.forEach(itm.selected_q, function(itm1, key1) {
                    allselectedQIds.push(itm1);

                    if (jQuery.inArray(itm1, $scope.allselectedQ) != -1) {
                        //console.log("is in array");

                    } else {
                        //console.log("is NOT in array");
                        $scope.allselectedQ.push(itm1);

                        if ($scope.current_subject.number_of_spaq_arr.length == 35) {
                            if (jQuery.inArray(itm1, $scope.current_subject.number_of_spbq_arr) != -1) {
                                //console.log("is in array");
                            } else {
                                $scope.current_subject.number_of_spbq_arr.push(itm1);
                            }
                        } else {
                            if (jQuery.inArray(itm1, $scope.current_subject.number_of_spaq_arr) != -1) {
                                //console.log("is in array");
                            } else {
                                $scope.current_subject.number_of_spaq_arr.push(itm1);
                            }
                        }
                    }

                });
            }
            //Adding Subject Selection Count
            //$scope.current_subject_selected_qcnt+=itm.selected_qcnt;
        });
        console.log($scope.current_subject.number_of_spaq_arr);
        console.log($scope.current_subject.number_of_spbq_arr);
        //console.log($scope.current_subject_selected_qcnt);
        $scope.current_subject_selected_qcnt = $scope.allselectedQ.length;
        $scope.current_subject.number_of_spaq = $scope.current_subject.number_of_spaq_arr.length;
        $scope.current_subject.number_of_spbq = $scope.current_subject.number_of_spbq_arr.length;
        //$scope.allselectedQ=allselectedQIds;

        //console.log($scope.current_subject.selected_q);
        //Get Remaing Questions
        console.log($scope.allselectedQ);
        //$scope.current_subject_remain_q=$scope.current_subject_selected_qcnt+$scope.total_selected_q;
        $scope.current_subject_remain_q = $scope.allselectedQ.length + $scope.total_selected_q;
        //console.log($scope.current_subject.selected_qcnt+"=="+($scope.current_subject_selected_qcnt+$scope.total_selected_q)+"===="+$scope.requiredQ);
        if (($scope.current_subject.selected_qcnt == $scope.current_subject_remain_q) && $scope.requiredQ > 0) {
            //alert('Subject composed successfully');
            $scope.congradulation = $scope.current_subject.category + " Questions Composed successfully";
            $("#composing").modal({
                backdrop: 'static',
                keyboard: false // to prevent closing with Esc button (if you want this too)
            });
        }
        //console.log($scope.allselectedQ);
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };

    //Save Picked Questions
    $scope.savePickedQ = function() {
        //Case1 selected questions greater than subject questions size
        if ($scope.current_subject_remain_q > $scope.current_subject.selected_qcnt) {
            var edata = "<b style='color:red;'>Your questions limit exceeded</b>";
            bootbox.alert({
                message: "Error :<br/>" + edata,
                // size:"small",
                backdrop: true,
            });
        } else {
            //Case2 selected questions 0
            if ($scope.current_subject_selected_qcnt == 0) {
                var edata = "<b style='color:red;'>Please Select Questions</b>";
                bootbox.alert({
                    message: "Error :<br/>" + edata,
                    // size:"small",
                    backdrop: true,
                });
            } else {
                //Case3 selected questions and subject questions size equal
                if ($scope.current_subject_remain_q == $scope.current_subject.selected_qcnt) {
                    $("#composing").modal('hide');
                    $scope.saveSelectedQuestions();
                } else {
                    //Case2 selected questions less than subject questions size equal
                    if ($scope.current_subject_remain_q < $scope.current_subject.selected_qcnt) {
                        //var required_q=$scope.subject.questions_size-$scope.remain_selected_q;
                        bootbox.confirm({
                            title: "You didn't reached your questions limit. Selected questions <span class='label label-inline label-success font-weight-bold'>" + $scope.current_subject_selected_qcnt + "</span><br> your required questions <span class='label label-inline label-warning font-weight-bold'>" + $scope.requiredQ + "</span>",
                            message: " Are you sure do you want to save these questions ?",
                            buttons: {
                                cancel: {
                                    label: '<i class="fa fa-times"></i> Cancel'
                                },
                                confirm: {
                                    label: '<i class="fa fa-check"></i> Confirm'
                                }
                            },
                            callback: function(result) {
                                //console.log('This feature comming soon');
                                if (result == true) {
                                    //console.log('This was logged in the callback: ' + result);
                                    $scope.saveSelectedQuestions();
                                }
                            }
                        });
                    }
                }
            }

        }

    };

    //Save Picked Questions all
    $scope.saveSelectedQuestions = function() {
        $("#processing").modal({
            backdrop: 'static',
            keyboard: false // to prevent closing with Esc button (if you want this too)
        });
        $scope.loading_img = true;
        var selectedq_info = { 'questions': $scope.allselectedQ, 'subject': $scope.current_subject };
        //console.log(selectedq_info);
        //$scope.savequestions_url
        //'subject':$scope.current_subject,
        //console.log($scope.current_subject);
        //return false;
        var params = $.param({ 'compose_type': $scope.compose_type, 'subject_index': $scope.subject_index, 'questions': $scope.allselectedQ, 'mid': $scope.current_subject.mid, 'test_id': $scope.current_subject.test_id, 'selected_qcnt': $scope.current_subject.selected_qcnt, 'action': 'savequestions', 'user_id': $scope.user_id, 'level': $scope.level, 'is_jee_new_pattern': $scope.is_jee_new_pattern, 'is_neet_new_pattern': $scope.is_neet_new_pattern, 'pa_questions': $scope.current_subject.number_of_spaq_arr, 'pb_questions': $scope.current_subject.number_of_spbq_arr });
        $http({ method: 'POST', url: API_URL, data: params }).success(function(response, status, headers, config) {

            if (response.error == false) {
                $scope.loading_img = false;
                $scope.loading_msg = true;
                $scope.no_of_questions_added = response.no_of_questions_added;
                $scope.no_of_questions_msg = ($scope.no_of_questions_added > 1) ? " Questions added successfully" : " Question added successfully";
                $scope.data_status = response.data_status;
                $scope.message = response.message;

                //Modifying Current Subject Information after saving questions
                //Questions Analysis
                $scope.selected_subjects[$scope.subject_index].number_of_q = response.subject[$scope.subject_index].number_of_q;
                $scope.selected_subjects[$scope.subject_index].number_of_smcq = response.subject[$scope.subject_index].number_of_smcq;
                $scope.selected_subjects[$scope.subject_index].number_of_snumq = response.subject[$scope.subject_index].number_of_snumq;
                $scope.selected_subjects[$scope.subject_index].selected_q = response.subject[$scope.subject_index].selected_q;
                $scope.selected_subjects[$scope.subject_index].comman_qlist = response.subject[$scope.subject_index].comman_qlist;

                $scope.selected_subjects[$scope.subject_index].number_of_spaq = response.subject[$scope.subject_index].number_of_spaq;
                $scope.selected_subjects[$scope.subject_index].number_of_spbq = response.subject[$scope.subject_index].number_of_spbq;
                //Subjects
                var index = $scope.current_subject.index;
                $scope.subjects[index].number_of_q = response.subject[$scope.subject_index].number_of_q;
                $scope.subjects[index].selected_q = response.subject[$scope.subject_index].selected_q;
                $scope.subjects[index].number_of_smcq = response.subject[$scope.subject_index].number_of_smcq;
                $scope.subjects[index].number_of_snumq = response.subject[$scope.subject_index].number_of_snumq;
                $scope.subjects[index].comman_qlist = response.subject[$scope.subject_index].comman_qlist;

                $scope.subjects[index].number_of_spaq = response.subject[$scope.subject_index].number_of_spaq;
                $scope.subjects[index].number_of_spbq = response.subject[$scope.subject_index].number_of_spbq;


                $scope.current_subject.number_of_q = response.subject[$scope.subject_index].number_of_q;
                $scope.current_subject.selected_q = response.subject[$scope.subject_index].selected_q;
                $scope.current_subject.number_of_smcq = response.subject[$scope.subject_index].number_of_smcq;
                $scope.current_subject.number_of_snumq = response.subject[$scope.subject_index].number_of_snumq;
                $scope.current_subject.comman_qlist = response.subject[$scope.subject_index].comman_qlist;

                $scope.current_subject.number_of_spaq = response.subject[$scope.subject_index].number_of_spaq;
                $scope.current_subject.number_of_spbq = response.subject[$scope.subject_index].number_of_spbq;


                $scope.total_selected_q = $scope.current_subject.number_of_q;
                $scope.current_subject_selected_qcnt = 0;
                $scope.requiredQ = ($scope.current_subject.selected_qcnt - $scope.current_subject.number_of_q);
                $scope.requiredMCQ = (20 - $scope.current_subject.number_of_smcq);
                $scope.requiredNUMQ = (10 - $scope.current_subject.number_of_snumq);
                $scope.requiredPAQ = (35 - $scope.current_subject.number_of_spaq);
                $scope.requiredPBQ = (15 - $scope.current_subject.number_of_spbq);
                $scope.current_subject_mcq_q = 0;
                $scope.current_subject_num_q = 0;
                $scope.subject_questions_list = $scope.current_subject.comman_qlist;

                //Current Subject Chapters info
                $scope.selected_subjects[$scope.subject_index].chapters = response.subject[$scope.subject_index].chapters;
                $scope.selected_subjects[$scope.subject_index].classes = response.subject[$scope.subject_index].classes;
                $scope.subjects[index].chapters = response.subject[$scope.subject_index].chapters;
                $scope.subjects[index].classes = response.subject[$scope.subject_index].classes;
                $scope.current_subject.chapters = response.subject[$scope.subject_index].chapters;
                $scope.current_subject.classes = response.subject[$scope.subject_index].classes;
                //$scope.subject_chapters=$scope.current_subject.chapters;

                $scope.all_subjects[$scope.current_subject.id].chapters = response.single_allchapters;
                $scope.all_subject_chapters = $scope.all_subjects[$scope.current_subject.id].chapters;

                $scope.overall_composed_questions = response.overall_number_of_q;
                //$scope.subject_index='';
                //$scope.subject_id='';
                $scope.chapter_index = '';
                $scope.chapter = '';
                $scope.compose_type = '';
                $scope.topic_index = '';
                $scope.qchoicetype = '';
                $scope.pickingTab = false;
                $scope.addTab = false;
                $scope.autogeneratedTab = false;
                $scope.questionsTab = false;

                $timeout(function() {
                    $("#processing").modal('hide');
                    $('.modal-backdrop').remove();
                }, 1000);

                $timeout(function() {
                    $scope.getSubjectChapters($scope.subject_index);
                }, 1000);
            }

            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        });

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };

    $scope.saveAutoGeneratedQ = function() {
        $scope.selected_subject_chapters = [];
        $("#auto_processing").modal({
            backdrop: 'static',
            keyboard: false // to prevent closing with Esc button (if you want this too)
        });
        $scope.loading_img = true;
        var selectedq_info = { 'subject_chapters': $scope.subject_chapters };
        console.log(selectedq_info);
        //$scope.savequestions_url
        //'subject':$scope.current_subject,
        //console.log($scope.current_subject);
        console.log($scope.subject_chapters);
        angular.forEach($scope.subject_chapters, function(cvalue, key) {
            if (cvalue.chapter_selected == true) {
                $scope.selected_subject_chapters.push(cvalue);
            } else {
                if (cvalue.topics.length != 0) {
                    angular.forEach(cvalue.topics, function(tvalue, key) {
                        if (tvalue.topic_selected == true) {
                            $i = 0;
                            angular.forEach($scope.selected_subject_chapters, function(ccvalue, key) {
                                console.log(ccvalue.id + " -- " + cvalue.id);
                                if (ccvalue.id == cvalue.id) {
                                    $i++;
                                }
                            });
                            if ($i == 0) {
                                $scope.selected_subject_chapters.push(cvalue);
                            }
                        }
                    });
                }
            }
        });
        //console.log($scope.selected_subject_chapters);
        //return false;
        //$scope.subject_chapters
        var params = $.param({
            'subject_chapters': JSON.stringify($scope.selected_subject_chapters),
            'compose_type': $scope.compose_type,
            'subject_index': $scope.subject_index,
            'questions': $scope.allselectedQ,
            'mid': $scope.current_subject.mid,
            'test_id': $scope.current_subject.test_id,
            'selected_qcnt': $scope.current_subject.selected_qcnt,
            'action': 'save_auto_generated_questions',
            'user_id': $scope.user_id,
            'level': $scope.level,
            'is_jee_new_pattern': $scope.is_jee_new_pattern,
            'is_neet_new_pattern': $scope.is_neet_new_pattern
        });
        $http({ method: 'POST', url: API_URL, data: params }).success(function(response, status, headers, config) {

            if (response.error == false) {
                $scope.loading_img = false;
                $scope.loading_msg = true;
                $scope.no_of_questions_added = response.no_of_questions_added;
                $scope.no_of_questions_msg = ($scope.no_of_questions_added > 1) ? " Questions added successfully" : " Question added successfully";
                $scope.data_status = response.data_status;
                $scope.message = response.message;

                //Modifying Current Subject Information after saving questions
                //Questions Analysis
                $scope.selected_subjects[$scope.subject_index].number_of_q = response.subject[$scope.subject_index].number_of_q;
                $scope.selected_subjects[$scope.subject_index].number_of_smcq = response.subject[$scope.subject_index].number_of_smcq;
                $scope.selected_subjects[$scope.subject_index].number_of_snumq = response.subject[$scope.subject_index].number_of_snumq;
                $scope.selected_subjects[$scope.subject_index].selected_q = response.subject[$scope.subject_index].selected_q;
                $scope.selected_subjects[$scope.subject_index].comman_qlist = response.subject[$scope.subject_index].comman_qlist;

                $scope.selected_subjects[$scope.subject_index].number_of_spaq = response.subject[$scope.subject_index].number_of_spaq;
                $scope.selected_subjects[$scope.subject_index].number_of_spbq = response.subject[$scope.subject_index].number_of_spbq;
                //Subjects
                var index = $scope.current_subject.index;
                $scope.subjects[index].number_of_q = response.subject[$scope.subject_index].number_of_q;
                $scope.subjects[index].selected_q = response.subject[$scope.subject_index].selected_q;
                $scope.subjects[index].number_of_smcq = response.subject[$scope.subject_index].number_of_smcq;
                $scope.subjects[index].number_of_snumq = response.subject[$scope.subject_index].number_of_snumq;
                $scope.subjects[index].comman_qlist = response.subject[$scope.subject_index].comman_qlist;

                $scope.subjects[index].number_of_spaq = response.subject[$scope.subject_index].number_of_spaq;
                $scope.subjects[index].number_of_spbq = response.subject[$scope.subject_index].number_of_spbq;


                $scope.current_subject.number_of_q = response.subject[$scope.subject_index].number_of_q;
                $scope.current_subject.selected_q = response.subject[$scope.subject_index].selected_q;
                $scope.current_subject.number_of_smcq = response.subject[$scope.subject_index].number_of_smcq;
                $scope.current_subject.number_of_snumq = response.subject[$scope.subject_index].number_of_snumq;
                $scope.current_subject.comman_qlist = response.subject[$scope.subject_index].comman_qlist;

                $scope.current_subject.number_of_spaq = response.subject[$scope.subject_index].number_of_spaq;
                $scope.current_subject.number_of_spbq = response.subject[$scope.subject_index].number_of_spbq;


                $scope.total_selected_q = $scope.current_subject.number_of_q;
                $scope.current_subject_selected_qcnt = 0;
                $scope.requiredQ = ($scope.current_subject.selected_qcnt - $scope.current_subject.number_of_q);
                $scope.requiredMCQ = (20 - $scope.current_subject.number_of_smcq);
                $scope.requiredNUMQ = (10 - $scope.current_subject.number_of_snumq);
                $scope.requiredPAQ = (35 - $scope.current_subject.number_of_spaq);
                $scope.requiredPBQ = (15 - $scope.current_subject.number_of_spbq);
                $scope.current_subject_mcq_q = 0;
                $scope.current_subject_num_q = 0;
                $scope.subject_questions_list = $scope.current_subject.comman_qlist;

                //Current Subject Chapters info
                $scope.selected_subjects[$scope.subject_index].chapters = response.subject[$scope.subject_index].chapters;
                $scope.selected_subjects[$scope.subject_index].classes = response.subject[$scope.subject_index].classes;
                $scope.subjects[index].chapters = response.subject[$scope.subject_index].chapters;
                $scope.subjects[index].classes = response.subject[$scope.subject_index].classes;
                $scope.current_subject.chapters = response.subject[$scope.subject_index].chapters;
                $scope.current_subject.classes = response.subject[$scope.subject_index].classes;
                //$scope.subject_chapters=$scope.current_subject.chapters;

                $scope.all_subjects[$scope.current_subject.id].chapters = response.single_allchapters;
                $scope.all_subject_chapters = $scope.all_subjects[$scope.current_subject.id].chapters;

                $scope.overall_composed_questions = response.overall_number_of_q;
                //$scope.subject_index='';
                //$scope.subject_id='';
                $scope.chapter_index = '';
                $scope.chapter = '';
                $scope.compose_type = '';
                $scope.topic_index = '';
                $scope.qchoicetype = '';
                $scope.pickingTab = false;
                $scope.addTab = false;
                $scope.autogeneratedTab = false;
                $scope.questionsTab = false;

                $timeout(function() {
                    $("#auto_processing").modal('hide');
                    $('.modal-backdrop').remove();
                }, 1000);

                $timeout(function() {
                    $scope.getSubjectChapters($scope.subject_index);
                }, 1000);
            }

            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        });

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };

    $scope.pagination = {
        current: 1
    };
    //Subject Wise View Questions
    $scope.viewQuestions = function(index_key) {
        $("#addedq").modal({
            backdrop: 'static',
            keyboard: false // to prevent closing with Esc button (if you want this too)
        });

        //Before view questions
        $scope.class_index = '';
        $scope.chapter_index = '';
        $scope.topic_index = '';
        $scope.chapter = '';
        //$scope.subject_index='';
        //$scope.compose_type='';
        //$scope.subject_id='';
        //$scope.pickingTab=false;
        $scope.addTab = false;
        $scope.autogeneratedTab = false;
        //$scope.questionsTab=false;
        //View Questions

        $scope.view_subjectq = {};
        $scope.view_subject_index = index_key;
        $scope.view_subjectq = $scope.selected_subjects[index_key];

        $scope.viewquestions_tabloader = true;
        //Configs
        //'subject':$scope.view_subjectq,
        $scope.sComposeQuestions = [];
        var params = $.param({ 'subject_index': index_key, 'mid': $scope.view_subjectq.mid, 'test_id': $scope.view_subjectq.test_id, 'action': 'viewquestions' });
        $http({ method: 'POST', url: API_URL, data: params }).success(function(response, status, headers, config) {

            if (response.error == false) {
                $scope.sComposeQuestions = response.qlist;
                $scope.no_of_students = response.no_of_students;
                $scope.totalItems = response.result_cnt;
            }
            $scope.viewquestions_tabloader = false;
            renderQuestions();
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        });

    };

    //Delete Question
    $scope.deleteComposedQ = function(index) {
        $scope.question = {};
        $scope.question_index = index;
        //$scope.view_subject_index
        $scope.question = $scope.sComposeQuestions[index];
        $('#composeid_' + index).addClass('danger');
        //console.log($scope.view_subjectq);
        bootbox.confirm({
            title: "Delete <span class='label label-inline label-danger font-weight-bold'>" + $scope.question.question_id + "</span>",
            backdrop: false,
            message: " Are you sure do you want to delete this Question from <span class='label label-inline label-light-default font-weight-bold'>" + $scope.view_subjectq.category + "</span> ?",
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> Cancel'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Confirm'
                }
            },
            callback: function(result) {
                //console.log('This feature comming soon');
                if (result == true) {
                    $scope.deleteQuestion(index);
                } else {
                    $('#composeid_' + index).removeClass('danger');
                }
            }
        });
    };

    //Delete Question
    $scope.deleteQuestion = function(question_index) {
        $scope.viewquestions_tabloader = true;
        $scope.vqindex = question_index;
        //console.log('qindex:' + question_index + "----subject:" + $scope.view_subject_index);
        var params = $.param({ 'qindex_key': question_index, 'view_subject_index': $scope.view_subject_index, 'delrecord': $scope.question, 'user_id': $scope.user_id, 'subject': JSON.stringify($scope.view_subjectq), 'action': 'delete_q' });
        $http({ method: 'POST', url: API_URL, data: params }).success(function(response, status, headers, config) {
            if (response.error == false) {
                $('#composeid_' + response.qindex_key).remove();
                $scope.deletedMsg = response.message;

                //Modifying Current Subject Information after delete questions
                //Questions Analysis
                $scope.selected_subjects[$scope.view_subject_index].number_of_q = response.subject[$scope.view_subject_index].number_of_q;
                $scope.selected_subjects[$scope.view_subject_index].selected_q = response.subject[$scope.view_subject_index].selected_q;
                $scope.selected_subjects[$scope.view_subject_index].comman_qlist = response.subject[$scope.view_subject_index].comman_qlist;

                //Subjects
                var index = response.view_subject_index;
                $scope.subjects[index].number_of_q = response.subject[$scope.view_subject_index].number_of_q;
                $scope.subjects[index].selected_q = response.subject[$scope.view_subject_index].selected_q;
                $scope.subjects[index].comman_qlist = response.subject[$scope.view_subject_index].comman_qlist;

                $scope.view_subjectq.number_of_q = response.subject[$scope.view_subject_index].number_of_q;
                $scope.view_subjectq.selected_q = response.subject[$scope.view_subject_index].selected_q;
                $scope.view_subjectq.comman_qlist = response.subject[$scope.view_subject_index].comman_qlist;

                $scope.total_selected_q = $scope.view_subjectq.number_of_q;
                $scope.current_subject_selected_qcnt = 0;
                $scope.requiredQ = ($scope.view_subjectq.selected_qcnt - $scope.view_subjectq.number_of_q);
                $scope.subject_questions_list = $scope.view_subjectq.comman_qlist;

                //Current Subject Chapters info
                $scope.selected_subjects[$scope.view_subject_index].chapters = response.subject[$scope.view_subject_index].chapters;
                $scope.selected_subjects[$scope.view_subject_index].classes = response.subject[$scope.view_subject_index].classes;
                $scope.subjects[index].chapters = response.subject[$scope.view_subject_index].chapters;
                $scope.subjects[index].classes = response.subject[$scope.view_subject_index].classes;
                $scope.view_subjectq.chapters = response.subject[$scope.view_subject_index].chapters;
                $scope.view_subjectq.classes = response.subject[$scope.view_subject_index].classes;
                //$scope.subject_chapters=$scope.view_subjectq.chapters;

                $scope.all_subjects[$scope.view_subjectq.id].chapters = response.single_allchapters;
                $scope.all_subject_chapters = $scope.all_subjects[$scope.view_subjectq.id].chapters;

                $scope.overall_composed_questions = response.overall_number_of_q;

                //Get View Questions
                $scope.sComposeQuestions = response.qlist;
                //console.log(response.qlist);
                $scope.no_of_students = response.no_of_students;
                $scope.totalItems = response.result_cnt;
                renderQuestions();
                //$scope.reArrangeViewQ($scope.vqindex);
                $scope.viewquestions_tabloader = false;

                $timeout(function() {
                    $scope.getSubjectChapters($scope.view_subject_index);
                }, 1000);
            }

            $timeout(function() { $scope.deletedMsg = ''; }, 500);
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        });

        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };

    $scope.reArrangeViewQ = function() {
        $scope.current_del_q = $scope.sComposeQuestions[$scope.vqindex];
        $scope.sComposeQuestions_temp = $scope.sComposeQuestions;
        $scope.sComposeQuestions = [];
        var sComposeQuestions = [];
        angular.forEach($scope.sComposeQuestions_temp, function(ditm, dkey) {
            if (ditm.question_id != $scope.current_del_q.question_id) {
                sComposeQuestions.push(ditm);
            }
        });
        $scope.sComposeQuestions = sComposeQuestions;

    }


    $scope.pageChanged = function(pageNumber) {
        $('[data-toggle="tooltip"]').tooltip();
        renderQuestions();
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
    $scope.pageChangedQ = function(pageNumber) {
        $('[data-toggle="tooltip"]').tooltip();
        renderQuestions();
    }

    $scope.UnassignedStudents = function() {
        $scope.tabloader = true;
        $scope.currentPage = 1;
        var params = $.param({ course_id: $scope.course_id, test_id: $scope.ct_id,campus_id:$scope.campus_id });
        $http({ method: 'POST', url: 'getUnassignedStudents.php', data: params }).success(function(data, status, headers, config) {
            //console.log(data);
            $scope.UnAssignData = data.users;
            $scope.AllUnassignedStudents = data.users;
            $scope.totalItems = data.tot_users;
            $scope.tabloader = false;
            if ($scope.totalItems > 0) {
                $scope.chapter_unuprocess = false;
            } else {
                $scope.chapter_unuprocess = true;
            }
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        });
    }
    $scope.AssignedStudents = function() {
        $scope.user_tabloader = true;
        $scope.chapter_uprocess = false;
        var params = $.param({ course_id: $scope.course_id, test_id: $scope.ct_id,campus_id:$scope.campus_id });
        $http({ method: 'POST', url: 'getAssignedStudents.php', data: params }).success(function(data, status, headers, config) {
            //console.log(data);
            $scope.AllAssignedStudents = data.users;
            $scope.AssignedData = data.users;
            $scope.tot_users = data.tot_users;
            $scope.user_tabloader = false;
            $scope.ucurrentPage = 1;
            if ($scope.tot_users > 0) {
                $scope.chapter_uprocess = false;
            } else {
                $scope.chapter_uprocess = true;
            }
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        });
    }
    $scope.getStudents = function() {
        $scope.UnassignedStudents();
        $scope.AssignedStudents();
    }
    $scope.userToggleAll = function() {
        //alert(toggleStatus+'tt');
        var toggleStatus = $scope.isAllSelected;

        angular.forEach($scope.UnAssignData, function(itm) {
            //alert(itm.done+'tt');
            itm.done_status = toggleStatus;
        });
        $scope.getStudentsSelectedCount();
    }

    $scope.userOptionToggled = function() {
        $scope.isAllSelected = $scope.UnAssignData.every(function(itm) { return itm.done_status; })
        $scope.getStudentsSelectedCount();
    }
    $scope.CuserToggleAll = function() {
        //alert(toggleStatus+'tt');
        var toggleStatus = $scope.CisAllSelected;
        angular.forEach($scope.students, function(itm) {
            //alert(itm.done+'tt');
            itm.done_status = toggleStatus;
        });
        $scope.CgetStudentsSelectedCount();
    }
    $scope.CuserOptionToggled = function() {
        $scope.CisAllSelected = $scope.students.every(function(itm) { return itm.done_status; });
        $scope.CgetStudentsSelectedCount();
    }
    $scope.CgetStudentsSelectedCount = function() {
        var selectedSIds = [];
        $scope.cselected_students_cnt = 0;
        $scope.cselected_students = [];
        angular.forEach($scope.students, function(itm, key) {
            if (itm.done_status == true)
                selectedSIds.push(itm.id);
        });

        $scope.cselected_students_cnt = selectedSIds.length;
        $scope.cselected_students = selectedSIds;
        console.log($scope.cselected_students);
    }
    $scope.getStudentsSelectedCount = function() {
        var selectedSIds = [];
        $scope.selected_students_cnt = 0;
        $scope.selected_students = [];
        angular.forEach($scope.UnAssignData, function(itm, key) {
            if (itm.done_status == true)
                selectedSIds.push(itm.section_id);
        });

        $scope.selected_students_cnt = selectedSIds.length;
        $scope.selected_students = selectedSIds;
        //console.log($scope.selected_students_cnt);
    }

    $scope.checkStudentsSelectedCount = function() {
        var selectedSIds = [];
        $scope.selected_students = [];
        angular.forEach($scope.UnAssignData, function(itm, key) {
            if (itm.done_status == true)
                selectedSIds.push(itm.section_id);
        });
        $scope.ck_selected_students_cnt = selectedSIds.length;
        $scope.selected_students = selectedSIds;
        return $scope.ck_selected_students_cnt;
    };
    // Assign button code start
    $scope.userAssignToggleAll = function() {
        //alert(toggleStatus+'tt');
        var toggleStatus = $scope.isAssignAllSelected;

        angular.forEach($scope.AssignedData, function(itm) {
            //alert(itm.done+'tt');
            itm.done_status = toggleStatus;
        });
        $scope.getStudentsAssinedSelectedCount();
    }
    $scope.userOptionAssignToggled = function() {
        $scope.isAssignAllSelected = $scope.AssignedData.every(function(itm) { return itm.done_status; })
        $scope.getStudentsAssinedSelectedCount();
    }
    $scope.getStudentsAssinedSelectedCount = function() {
        var selectedAssingedSIds = [];
        $scope.selected_assigned_students_cnt = 0;
        $scope.selected_assigned_students = [];
        angular.forEach($scope.AssignedData, function(itm, key) {
            if (itm.done_status == true)
                selectedAssingedSIds.push(itm.section_id);
        });

        $scope.selected_assigned_students_cnt = selectedAssingedSIds.length;
        $scope.selected_assigned_students = selectedAssingedSIds;
        //console.log($scope.selected_students_cnt);
    }
    $scope.checkStudentsassignedSelectedCount = function() {
        var selectedAssingedSIds = [];
        $scope.selected_assigned_students = [];
        angular.forEach($scope.AssignedData, function(itm, key) {
            if (itm.done_status == true)
                selectedAssingedSIds.push(itm.section_id);
        });
        $scope.ck_selected_assigned_students_cnt = selectedAssingedSIds.length;
        $scope.selected_assigned_students = selectedAssingedSIds;
        return $scope.ck_selected_assigned_students_cnt;
    };
    $scope.ClcheckStudentsassignedSelectedCount = function() {
        var selectedAssingedSIds = [];
        $scope.cselected_assigned_students = [];
        angular.forEach($scope.students, function(itm, key) {
            if (itm.done_status == true)
                selectedAssingedSIds.push(itm.id);
        });
        $scope.clck_selected_assigned_students_cnt = selectedAssingedSIds.length;
        $scope.cselected_assigned_students = selectedAssingedSIds;
        return $scope.clck_selected_assigned_students_cnt;
    };
    // Assign button code end
    //Assign to Selected Users
    $scope.CassignToEnroll = function(param) {
        $('#assigned_students').modal('hide');
        var edata = "";
        if (param == "selected_enroll") {
            var ck_selected_assigned_students_cnt = $scope.ClcheckStudentsassignedSelectedCount();
            console.log(ck_selected_assigned_students_cnt);
            if ($scope.cselected_students_cnt == 0 && ck_selected_assigned_students_cnt == 0) {
                edata += "<b style='color:red;'>Please select section</b> <br/>";
            }
        }

        if (edata != "") {
            bootbox.alert({
                message: "Please fix the following issues:<br/>" + edata,
                // size:"small",
                title: $scope.title,
                backdrop: true
            });

            return false;
        }

        $("#assign_processing").modal({
            backdrop: 'static',
            keyboard: false // to prevent closing with Esc button (if you want this too)
        });
        $scope.assign_loading_img = true;

        var params = $.param({ 'course_id': $scope.current_course, 'test_id': $scope.ct_id, 'students': $scope.cselected_students, 'param': param,'campus_id':$scope.campus_id });
        $http({ method: 'POST', url: "Assign_remove_students.php", data: params }).success(function(response, status, headers, config) {
            $scope.assign_loading_img = false;
            $scope.assign_loading_msg = true;
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
    $scope.assignToEnroll = function(param) {
        var edata = "";
        if (param == "selected_enroll") {
            var ck_selected_students_cnt = $scope.checkStudentsSelectedCount();
            if ($scope.selected_students_cnt == 0 && ck_selected_students_cnt == 0) {
                edata += "<b style='color:red;'>Please select section</b> <br/>";
            }
        }

        if (edata != "") {
            bootbox.alert({
                message: "Please fix the following issues:<br/>" + edata,
                // size:"small",
                title: $scope.title,
                backdrop: true
            });

            return false;
        }

        $("#assign_processing").modal({
            backdrop: 'static',
            keyboard: false // to prevent closing with Esc button (if you want this too)
        });
        $scope.assign_loading_img = true;

        var params = $.param({ 'course_id': $scope.current_course, 'test_id': $scope.ct_id, 'students': $scope.selected_students, 'assignto': param,'campus_id':$scope.campus_id });
        $http({ method: 'POST', url: $scope.test_assign_to_url, data: params }).success(function(response, status, headers, config) {
            $scope.assign_loading_img = false;
            $scope.assign_loading_msg = true;
            $scope.no_of_add_cnt = response.add_cnt;
            $scope.no_of_remove_cnt = response.removed_cnt;
            $scope.no_of_exist_cnt = response.exist_cnt;
            $scope.no_of_users_enroll_msg = " Assigned successfully";
            $scope.no_of_users_exist_msg = "  already existed";
            $scope.no_of_users_unenroll_msg = "  Unassigned successfully";
            //$scope.assign_message=response.message;
            $scope.isAllSelected = false;
            $scope.selected_students_cnt = 0;
            $scope.selected_students = [];

            $timeout(function() {
                $("#assign_processing").modal("hide");
                $scope.no_of_add_cnt = 0;
                $scope.no_of_remove_cnt = 0;
                $scope.no_of_exist_cnt = response.exist_cnt0;
                $scope.no_of_users_enroll_msg = "";
                $scope.no_of_users_exist_msg = "";
                $scope.no_of_users_unenroll_msg = "";
            }, 1000);
            $scope.UnassignedStudents();
            $scope.AssignedStudents();

            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        });
    };
    $scope.CassignToUnroll = function(param) {
        var edata = "";
        if (param == "selected_uneroll") {
            var ck_selected_assigned_students_cnt = $scope.ClcheckStudentsassignedSelectedCount();
            console.log(ck_selected_assigned_students_cnt);
            if ($scope.cselected_students_cnt == 0 && ck_selected_assigned_students_cnt == 0) {
                edata += "<b style='color:red;'>Please select student</b> <br/>";
            }
            var selected_assigned_students = ($scope.cselected_students_cnt > 0) ? $scope.cselected_students_cnt : ck_selected_assigned_students_cnt;
        } else {
            var selected_assigned_students = $scope.ctot_users;
        }

        if (edata != "") {
            bootbox.alert({
                message: "Please fix the following issues:<br/>" + edata,
                // size:"small",
                title: $scope.title,
                backdrop: true
            });

            return false;
        }


        bootbox.confirm({
            title: "Unassign <span class='label-inline label-danger font-weight-bold'>" + $scope.cselected_students_cnt + " students</span>",
            backdrop: true,
            message: " Are you sure do you want to unassign students from <span class='label label-inline label-warning font-weight-bold'>" + $scope.title + "</span> ?",
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> Cancel'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Confirm'
                }
            },
            callback: function(result) {
                //console.log('This feature comming soon');
                if (result == true) {
                    //$scope.deleteQuestion(index);
                    $scope.CdeleteUnrollUsers("RemoveData");
                }
            }
        });

    }
    $scope.assignToUnroll = function(param) {
        var edata = "";
        if (param == "selected_unassign") {
            var ck_selected_assigned_students_cnt = $scope.checkStudentsassignedSelectedCount();
            if ($scope.selected_assigned_students == 0 && ck_selected_assigned_students_cnt == 0) {
                edata += "<b style='color:red;'>Please select section</b> <br/>";
            }
            var selected_assigned_students = ($scope.selected_assigned_students > 0) ? $scope.selected_assigned_students : ck_selected_assigned_students_cnt;
        } else {
            var selected_assigned_students = $scope.tot_users;
        }

        if (edata != "") {
            bootbox.alert({
                message: "Please fix the following issues:<br/>" + edata,
                // size:"small",
                title: $scope.title,
                backdrop: true
            });

            return false;
        }


        bootbox.confirm({
            title: "Unassign <span class='label-inline label-danger font-weight-bold'>" + $scope.selected_assigned_students_cnt + " students</span>",
            backdrop: true,
            message: " Are you sure do you want to unassign this sections from <span class='label label-inline label-warning font-weight-bold'>" + $scope.title + "</span> ?",
            buttons: {
                cancel: {
                    label: '<i class="fa fa-times"></i> Cancel'
                },
                confirm: {
                    label: '<i class="fa fa-check"></i> Confirm'
                }
            },
            callback: function(result) {
                //console.log('This feature comming soon');
                if (result == true) {
                    //$scope.deleteQuestion(index);
                    $scope.deleteUnrollUsers(param);
                }
            }
        });

    }
    $scope.viewEnrolledStudents = function(class_id, section_id) {
        $scope.CisAllSelected = false;
        $scope.students = [];
        $("#assigned_students").modal({
            backdrop: 'static',
            keyboard: false // to prevent closing with Esc button (if you want this too)
        });
        $scope.cselected_students_cnt = 0;
        $scope.ctot_users = 0;
        $scope.assign_loading_img = true;
        var params = $.param({ 'course_id': $scope.current_course, 'test_id': $scope.ct_id, 'section_id': section_id, 'class_id': class_id, 'page': 1, 'range': 10,'campus_id':$scope.campus_id });
        $http({ method: 'POST', url: "getStudents.php", data: params }).success(function(response, status, headers, config) {
            $scope.assign_loading_img = false;
            $scope.students = response.students;
            $scope.cassigned_students = response.assigned_students;
            $scope.cselected_students_cnt = response.assigned_students;
            $scope.ctotalItems = response.total;
            //console.log($scope.students);
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        });
    }
    $scope.CdeleteUnrollUsers = function(param) {
        $('#assigned_students').modal('hide');
        $("#assign_processing").modal({
            backdrop: 'static',
            keyboard: false // to prevent closing with Esc button (if you want this too)
        });
        $scope.assign_loading_img = true;
        var params = $.param({ 'course_id': $scope.current_course, 'test_id': $scope.ct_id, 'students': $scope.cselected_students, 'param': param });
        $http({ method: 'POST', url: "Assign_remove_students.php", data: params }).success(function(response, status, headers, config) {
            $scope.assign_loading_img = false;
            $scope.assign_loading_msg = true;
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
    $scope.deleteUnrollUsers = function(param) {
        $("#assign_processing").modal({
            backdrop: 'static',
            keyboard: false // to prevent closing with Esc button (if you want this too)
        });
        $scope.assign_loading_img = true;

        var params = $.param({ 'course_id': $scope.current_course, 'test_id': $scope.ct_id, 'students': $scope.selected_assigned_students, 'assignto': param });
        $http({ method: 'POST', url: $scope.test_assign_to_url, data: params }).success(function(response, status, headers, config) {
            $scope.assign_loading_img = false;
            $scope.assign_loading_msg = true;
            $scope.no_of_add_cnt = response.add_cnt;
            $scope.no_of_remove_cnt = response.removed_cnt;
            $scope.no_of_exist_cnt = response.exist_cnt;
            $scope.no_of_users_enroll_msg = " Unassigned successfully";
            $scope.no_of_users_exist_msg = "  already existed";
            $scope.no_of_users_unenroll_msg = "  Unassigned successfully";
            //$scope.assign_message=response.message;
            $scope.isAssignAllSelected = false;
            $scope.selected_assigned_students_cnt = 0;
            $scope.selected_assigned_students = [];
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

    //Mathjax implementation
    function renderQuestions() //not the exact meaning but updates view
    { //$scope.$apply();      //gives $apply already in progress error
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
        setTimeout(function() {
            var elements = $(".latex");
            renderMaths(elements);
            // $(".latex").latex();
        }, 100);
        $('[data-toggle="tooltip"]').tooltip();
    }
    //Set Dates
    $scope.setDates = function() {
        $scope.publishconfig.start_date = $("#start_date").val();
        $scope.publishconfig.end_date = $("#end_date").val();
        //console.log($scope.publishconfig.start_date+"-----"+$scope.publishconfig.end_date);
        /*if(angular.isDefined($scope.publishconfig.start_date) && angular.isDefined($scope.publishconfig.end_date)){
         // $scope.course_disable=false;
        }*/
        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
        }
    };
    //TinyMce
    $scope.tinymceLoad = function() {
        tinymce.init({
            selector: "textarea",
            file_picker_types: 'gif,jpg,jpeg,png',
            browser_spellcheck: true,
            spellchecker_language: 'en',
            toolbar: false,
            plugins: [
                "autolink lists link  charmap print preview hr anchor pagebreak",
                "searchreplace wordcount visualblocks visualchars code",
                "insertdatetime media nonbreaking save table contextmenu directionality",
                "emoticons template paste textcolor colorpicker textpattern imagetools advlist"
            ],
            image_advtab: true,
            file_picker_callback: function(callback, value, meta) {},
            relative_urls: false,
            templates: [
                { title: 'Test template 1', content: 'Test 1' },
                { title: 'Test template 2', content: 'Test 2' }
            ],
            mode: "specific_textareas",
            valid_elements: '*[*]',
            editor_selector: "mceEditor",
            apply_source_formatting: true,
            entity_encoding: 'raw'
        });
    }
    $scope.tinymceLoadold = function() {
        tinymce.init({
            selector: "textarea",
            file_picker_types: 'gif,jpg,jpeg,png',
            theme: "modern",
            browser_spellcheck: true,
            spellchecker_language: 'en',
            toolbar: false,
            plugins: [
                "jbimages autolink lists link  charmap print preview hr anchor pagebreak",
                "searchreplace wordcount visualblocks visualchars code",
                "insertdatetime media nonbreaking save table contextmenu directionality",
                "emoticons template paste textcolor colorpicker textpattern imagetools advlist"
            ],

            image_advtab: true,
            file_picker_callback: function(callback, value, meta) {
                alert('f');

            },
            relative_urls: false,

            templates: [
                { title: 'Test template 1', content: 'Test 1' },
                { title: 'Test template 2', content: 'Test 2' }
            ],
            mode: "specific_textareas",
            valid_elements: '*[*]',
            editor_selector: "mceEditor",
            apply_source_formatting: true,
            entity_encoding: 'raw'
        });

        $timeout(function() {
            $scope.refreshForm();
        }, 1000);
    }

    function renderMaths(elements) {
        $.each(elements, function(index, item) {
            var script = document.createElement("script");
            script.type = "math/tex";
            var latex = $(item).text();
            MathJax.HTML.setScript(script, latex);
            $(item).replaceWith(script);
        });
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        setTimeout(function() {
            $('.math').find('span').css('border-left-color', 'transparent'); //this is to remove unwanted right border after math elements
        }, 1000);

    }

    $scope.showQtypeDifficulty = function() {
        // console.log($scope.course_id);
        // console.log(typeof $scope.course_id);
        // console.log($scope.course_list.indexOf($scope.course_id));
        var result = false;
        if ($scope.course_list.indexOf($scope.course_id) > 0) {
            result = true;
        }

        return result;
    }

    $scope.getCurrentSubjectCount = function() {
        var subject_cnt = 0;
        console.log($scope.current_subject.number_of_q + '--' + $scope.current_subject_remain_q);
        subject_cnt = $scope.current_subject.number_of_q + $scope.current_subject_remain_q;
        return subject_cnt;
    }


    $scope._initWizard();
    $scope._initFormValidation();


});
$(document).ready(function() {
    $("#start_date").on("change", function(e) {
        $('#end_date').attr('disabled', false);
        jQuery('#end_date').val("");
        var datetime = jQuery('#start_date').val();
        var endd = datetime.split(' ')[0];

        var thirtyMinutes = 5 * 60 * 1000; // convert 5 minutes to milliseconds
        var date1 = new Date(datetime);
        var date2 = new Date(date1.getTime() + thirtyMinutes);
        //console.log(date1);
        var hrs = date2.getHours();
        var mins = date2.getMinutes();

        jQuery('#end_date').datetimepicker({
            format: 'Y-m-d H:i',
            onShow: function(ct) {
                this.setOptions({
                    minDate: endd
                })
            },
            timepicker: true,
            step: 5,
            //minTime:hrs+":"+mins
        });
    });
    $("#end_date").on("change", function(e) {
        /*    	jQuery('#end_date').datetimepicker({
            		timepicker:true,
                	minTime:"00:00"
        	    });*/
        setDates();
    });
    $('#end_date').attr('disabled', true);
    jQuery('#start_date').datetimepicker({
        format: 'Y-m-d H:i',
        minDate: 0,
        onShow: function(ct) {
            this.setOptions({
                maxDate: jQuery('#end_date').val() ? jQuery('#end_date').val() : false
            })
            setDates();
        },
        timepicker: true,
        step: 5,
        minTime: 0
    });

    setDates = function() {
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
    if (charCode > 31 && (charCode < 48 || charCode > 57)) { return false; } else { return true; }
}