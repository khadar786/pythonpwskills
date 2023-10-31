"use strict";
var API_URL='api/Adminservice.php';
var courses=[];
var custom_courses=[];
var selected_subjects=[];

var notify_options={
      	icon: 'glyphicon glyphicon-warning-sign',
      	title:'Error',
      	message:'',
      	type:'danger',
      	spacing: 10,
      	z_index: 9999,
      	timer: 1000,
      };

/*$('#first_name').val('khadar');
$('#email').val('khadar@gamil.com');
$('#password').val('123456');
$('#mobile').val('9505437866');*/
// Class Definition
var KTAddUser = function () {
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
				console.log(wizard.getStep());
		        if (status == 'Valid') {
		        	var wizard_status=true;
		        	if(wizard.getStep()==3){
		        		if(KTAddUser.checkSubjectSelection()){
		        			KTAddUser.viewSubjectPreview('review_selected_subjects');
		        			KTAddUser.reviewDetails();
		        			wizard_status=true;
		        		}else{
		        			wizard_status=false;
					        Swal.fire({
							  icon: 'error',
							  title: 'Error',
							  text: 'Oops, Something Went Wrong'
							});
							//KTUtil.scrollTop();
		        		}
		        	}

		        	if(wizard_status){
		        		_wizard.goNext();
						KTUtil.scrollTop();
		        	}
					
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
		// Handle submit button
	    $('#student_submit').on('click', function (e) {
	    	//student_submit
	        e.preventDefault();
	        $('#pmain').addClass('overlay-block rounded');
	        $('#loader').show();
	        $('#student_submit').attr('disabled', true);
	        var formData = new FormData();

			formData.append('photo', $('#profile_avatar')[0].files[0]);
			formData.append('first_name',$.trim($('#first_name').val()));
			formData.append('email',$.trim($('#email').val()));
			formData.append('password',$.trim($('#password').val()));
			formData.append('mobile',$.trim($('#mobile').val()));
			formData.append('campus_id',$.trim($('#campus_id').val()));
			formData.append('address1',$.trim($('#address1').val()));
			formData.append('address2',$.trim($('#address2').val()));
			formData.append('postcode',$.trim($('#postcode').val()));
			formData.append('city',$.trim($('#city').val()));
			formData.append('state',$.trim($('#state').val()));
			formData.append('country',$.trim($('#country').val()));
			formData.append('selected_subjects',JSON.stringify(selected_subjects));
			
			
			var xhr = new XMLHttpRequest();
	        xhr.onreadystatechange = function() {
	            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
	            console.log(xhr.responseText);
	            var parsedJson = $.parseJSON(xhr.responseText);
	             //console.log(parsedJson);
	            $('#pmain').removeClass('overlay-block rounded');
	        	$('#loader').hide();
	        	$('#student_submit').attr('disabled', false);
	        	if(parsedJson.mid>0){
					Swal.fire({
	                    text: 'User added successfully',
	                    icon: "success",
	                    buttonsStyling: false,
	                    confirmButtonText: "Ok, got it!",
	                    customClass: {
	                        confirmButton: "btn font-weight-bold btn-light-primary"
	                    }
	                }).then(function() {
		                selected_subjects=[];
			        	$('#selected_subjects').empty();
						$('#review_selected_subjects').empty();
						$('#kt_form_add_student')[0].reset();
	                    window.location.replace('teachers'); 
	                });
	        	}
	          }
	        }
	      xhr.open("POST", "update_add_teacher.php");
	      xhr.send(formData);
	     	
	    });
		// Change Event
		_wizard.on('change', function (wizard) {
			KTUtil.scrollTop();
		});
	}

	var _initValidations = function () {
		// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
		//[A-Za-z0-9_@./#&+-]*$
		const USERID_REGEXP = "^[A-Za-z0-9_@./-]*$";

		// Validation Rules For Step 1
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					first_name: {
						validators: {
							notEmpty: {
								message: 'Full Name is required'
							}
						}
					},
					email: {
						validators: {
							notEmpty: {
								message: 'User ID is required'
							},
							regexp: {
		                        regexp: USERID_REGEXP,
		                        message: 'The input is not a valid User ID',
		                    },
			                remote: {
			                	data:{action:'check_user'},
	                            message: 'The user id already existed',
	                            method: 'POST',
	                            url: API_URL,
	                        }
						}
					},
					password: {
						validators: {
							notEmpty: {
								message: 'Password is required'
							}
						}
					},
					mobile: {
						validators: {
							notEmpty: {
								message: 'Phone is required'
							},
							mobile: {
								//country: 'US',
								message: 'The value is not a valid phone number. (e.g 5554443333)'
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

		

		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					campus_id: {
						validators: {
							notEmpty: {
								message: 'Campus is required'
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
		
		_validations.push(FormValidation.formValidation(
			_formEl,
			{
				fields: {
					class_id: {
						validators: {
							notEmpty: {
								message: 'Class is required'
							}
						}
					},
					stream_id: {
						validators: {
							notEmpty: {
								message: 'Stream is required'
							}
						}
					},
					section_id: {
						validators: {
							notEmpty: {
								message: 'Section is required'
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

	var _initCourses = function () {
		$('#pmain').addClass('overlay-block rounded');
	    $('#loader').show();
		var params={
					action:'teacher_subscription',
					campus_id: campus_id
				  };
		axios({
			  method: 'post',
			  url:API_URL,
			  data: params,
			  headers: {
    			'Content-Type': 'multipart/form-data'
			  }
		}).then(function(response){
			courses=response.data.courses;
			custom_courses=response.data.custom_courses;
			var course_tree="";
			if(courses.length>0){
				var course="";
				for(var i=0;i<courses.length;i++){
					var course_id=courses[i]['course_id'];
					//card start
					course+='<div class="card card-custom gutter-b">';
					course+='<div class="card-header">';
					course+='<div class="card-title">';
					course+='<h3 class="card-label">';
					//course+='<label class="checkbox checkbox-primary mb-4">';
					//course+='<input type="checkbox"/><strong style="vertical-align: text-bottom;">'+courses[i]['course_name']+'</strong><span></span>';
					//course+='</label>';
					course+='<strong style="vertical-align:text-bottom;">'+courses[i]['course_name']+'</strong>';
					course+='</h3>';
					course+='</div>';
					course+='</div>';
					//card body start
					course+='<div class="card-body">';
					for(var j=0;j<courses[i]['subjects'].length;j++){
						//form-group start
						course+='<div class="form-group row wfield">';
						course+='<label class="checkbox checkbox-primary mb-12" style="margin-bottom: 1rem !important;margin-left: 1.6%;">';
						var subject_id=courses[i]['subjects'][j]['subject_id'];
						course+='<input type="checkbox" id="sid_'+subject_id+'" name="sid_'+subject_id+'" value="'+subject_id+'" onclick="KTAddUser.selectSubject('+j+','+subject_id+');" data-cid="'+course_id+'" data-sid="'+subject_id+'"/><strong class="text-primary">'+courses[i]['subjects'][j]['subject']+'</strong><span></span>';
						course+='</label>';
						for(var k=0;k<courses[i]['subjects'][j]['classes'].length;k++){
							var cls_details=courses[i]['subjects'][j]['classes'][k];
							//col-md-12 start
							course+='<div class="col-md-12">';
							course+='<label class="checkbox checkbox-primary mb-4"><input type="checkbox" id="cls_'+subject_id+'_'+cls_details.class_id+'" name="cls_'+subject_id+'_'+cls_details.class_id+'" data-cid="'+course_id+'" data-sid="'+subject_id+'" data-cls-id="'+cls_details.class_id+'" onclick="KTAddUser.selectClass('+j+','+k+','+subject_id+','+cls_details.class_id+');"/><strong>Class '+courses[i]['subjects'][j]['classes'][k]['class_name']+'</strong> <span></span></label>';
							//checkbox-inline start
							course+='<div class="checkbox-inline">';
							for(var l=0;l<courses[i]['subjects'][j]['classes'][k]['sections'].length;l++){
								var section=courses[i]['subjects'][j]['classes'][k]['sections'][l];
								course+='<label class="checkbox checkbox-primary"><input type="checkbox" id="sec_'+subject_id+'_'+cls_details.class_id+'_'+section.section_id+'" name="sec_'+subject_id+'_'+cls_details.class_id+'_'+section.section_id+'" data-cid="'+course_id+'" data-sid="'+subject_id+'" data-cls-id="'+cls_details.class_id+'" data-sec-id="'+section.section_id+'" onclick="KTAddUser.selectSections('+j+','+k+','+l+','+subject_id+','+cls_details.class_id+','+section.section_id+');"/>Section '+courses[i]['subjects'][j]['classes'][k]['sections'][l]['section_name']+'<span></span></label>';
							}
							course+='</div>';
							//checkbox-inline end
							course+='<div class="separator separator-dashed mt-4 mb-4"></div>';
							course+='</div>';
							//col-md-12 end
						}
						course+='</div>';
						//form-group end
					}
					course+='</div>';
					//card body end

					course+='</div>';
					//card end
				}
			}
			course_tree+=course;
			$('#course_tree').html(course_tree);
			//Show Preview Btn
			$('#preview_id').show();
			$('#pmain').removeClass('overlay-block rounded');
	        $('#loader').hide();
		});
	}

	return {
		// public functions
		init: function () {
			_wizardEl = KTUtil.getById('kt_wizard_student');
			_formEl = KTUtil.getById('kt_form_add_student');

			_initWizard();
			_initValidations();
			_initAvatar();
			_initCourses();
		},
		selectSubject:function(sindex,subject_id){
			var cid=$('#sid_'+subject_id).attr("data-cid");
			//console.log(sindex+'==='+suject_id);
			//console.log(custom_courses);
			if($('#sid_'+subject_id).prop('checked') == true){
			    custom_courses[cid][subject_id].is_selected=true;
			}else{
				custom_courses[cid][subject_id].is_selected=false;
				//Uncheck the class and sections
				$('#sid_'+subject_id).prop('checked',false);
				KTAddUser.unselectClasses(sindex,subject_id);
			}
		},
		selectClass:function(sindex,cindex,subject_id,class_id){
			var cid=$('#cls_'+subject_id+'_'+class_id).attr("data-cid");

			if($('#cls_'+subject_id+'_'+class_id).prop('checked') == true){
				if(custom_courses[cid][subject_id].is_selected){
					custom_courses[cid][subject_id]['classes'][class_id].is_selected=true;
				}else{
					custom_courses[cid][subject_id]['classes'][class_id].is_selected=false;
					$('#cls_'+subject_id+'_'+class_id).prop('checked',false);
					KTAddUser.unselectSections(sindex,cindex,subject_id,class_id);
					//Alert
					notify_options.type='danger';
					notify_options.title=custom_courses[cid][subject_id].subject;
					notify_options.message='Please select subject';
					KTAddUser.notifyAlerts();
				}
			}else{
				custom_courses[cid][subject_id]['classes'][class_id].is_selected=false;
				//Uncheck the class and sections
				$('#cls_'+subject_id+'_'+class_id).prop('checked',false);
				KTAddUser.unselectSections(sindex,cindex,subject_id,class_id);
			}
			//console.log(custom_courses[cid][subject_id]['classes'][class_id]);
		},
		selectSections:function(sindex,cindex,secindex,subject_id,class_id,section_id){
			var cid=$('#sec_'+subject_id+'_'+class_id+'_'+section_id).attr("data-cid");

			if($('#sec_'+subject_id+'_'+class_id+'_'+section_id).prop('checked') == true){
				if(custom_courses[cid][subject_id]['classes'][class_id].is_selected){
					custom_courses[cid][subject_id]['classes'][class_id]['sections'][section_id].is_selected=true;
				}else{
					custom_courses[cid][subject_id]['classes'][class_id]['sections'][section_id].is_selected=false;
					$('#sec_'+subject_id+'_'+class_id+'_'+section_id).prop('checked',false);
					//Alert
					notify_options.type='danger';
					notify_options.title=custom_courses[cid][subject_id]['classes'][class_id].class_name;
					notify_options.message='Please select class';
					KTAddUser.notifyAlerts();
				}
			    
			}else{
				custom_courses[cid][subject_id]['classes'][class_id]['sections'][section_id].is_selected=false;
				//Uncheck the class and sections
				$('#sec_'+subject_id+'_'+class_id+'_'+section_id).prop('checked',false);
				//KTAddUser.unselectSections(sindex);
			}
			//console.log(custom_courses[cid][subject_id]['classes'][class_id]['sections'][section_id]);
		},
		unselectClasses:function(sindex,subject_id){
			var cid=$('#sid_'+subject_id).attr("data-cid");
			//console.log('@@@'+custom_courses[cid][subject_id]['classes']);
			var len = $.map(custom_courses[cid][subject_id]['classes'], function(n, i) { return i; }).length;
			if(len>0){
				$.each(custom_courses[cid][subject_id]['classes'], function(index, element) {
  					custom_courses[cid][subject_id]['classes'][element.class_id].is_selected=false;
  					$('#cls_'+subject_id+'_'+element.class_id).prop('checked',false);
  					KTAddUser.unselectSections(sindex,index,subject_id,element.class_id);
				});
			}
		},
		unselectSections:function(sindex,cindex,subject_id,class_id){
			var cid=$('#cls_'+subject_id+'_'+class_id).attr("data-cid");
			var len = $.map(custom_courses[cid][subject_id]['classes'][class_id]['sections'], function(n, i) { return i; }).length;
			if(len>0){
				$.each(custom_courses[cid][subject_id]['classes'][class_id]['sections'], function(index, element) {
  					custom_courses[cid][subject_id]['classes'][element.class_id]['sections'][element.section_id].is_selected=false;
  					$('#sec_'+subject_id+'_'+class_id+'_'+element.section_id).prop('checked',false);
				});
			}
		},
		checkSubjectSelection:function(){
			selected_subjects=[];
			$.each(custom_courses,function(index, element){
				var course_id=index;
				$.each(custom_courses[index],function(sindex, selement){
					var subject_id=sindex;
					if(selement.is_selected){
						//console.log(selement.classes);
						var check_cls_status=KTAddUser.checkSelectedClass(selement.classes);
						if(check_cls_status){
							//console.log(selement.classes);
							var check_sec_status=KTAddUser.checkSelectedSections(selement.classes);
							if(check_sec_status){
								//console.log(element);
								selected_subjects.push(selement);
							}
						}
					}
				});
			});

			var rstatus=true;
			if(selected_subjects.length==0){
				rstatus=false;
			}

			return rstatus;
		},
		viewSubjectPreview:function(selector_id){
			selected_subjects=[];
			$.each(custom_courses,function(index, element){
				var course_id=index;
				$.each(custom_courses[index],function(sindex, selement){
					var subject_id=sindex;
					if(selement.is_selected){
						//console.log(selement.classes);
						var check_cls_status=KTAddUser.checkSelectedClass(selement.classes);
						if(check_cls_status){
							//console.log(selement.classes);
							var check_sec_status=KTAddUser.checkSelectedSections(selement.classes);
							if(check_sec_status){
								//console.log(element);
								selected_subjects.push(selement);
							}
						}
					}
				});
			});

			if(selected_subjects.length>0){
				var selected_subs="";
				$('#selected_subjects').empty();
				$('#review_selected_subjects').empty();
				if(selector_id=='selected_subjects'){
					$('#teacher_selected').modal('show');
				}
				
				//card start
				selected_subs+='<div class="card card-custom gutter-b">';
				//card body start
				selected_subs+='<div class="card-body">';
				for(var i=0;i<selected_subjects.length;i++){
					var subject_details=selected_subjects[i];
					//console.log(subject_details);
					//form-group start
					selected_subs+='<div class="form-group row wfield">';
					selected_subs+='<label class="checkbox checkbox-primary mb-12" style="margin-bottom: 1rem !important;margin-left: 1.6%;">';
					selected_subs+='<input type="checkbox" checked disabled/><strong class="text-primary">'+subject_details.subject+'('+subject_details.course_name+')</strong><span></span>';
					selected_subs+='</label>';
					$.each(subject_details.classes,function(index,element){
						
						if(element.is_selected){
							//col-md-12 start
							selected_subs+='<div class="col-md-12">';
							selected_subs+='<label class="checkbox checkbox-primary mb-4"><input type="checkbox" checked disabled/><strong>Class '+element.class_name+'</strong> <span></span></label>';
							//checkbox-inline start
							selected_subs+='<div class="checkbox-inline">';
							$.each(element.sections,function(sindex,sec_element){
								if(sec_element.is_selected){
									selected_subs+='<label class="checkbox checkbox-primary"><input type="checkbox" checked disabled/>Section '+sec_element.section_name+'<span></span></label>';
								}
							});
							selected_subs+='</div>';
							//checkbox-inline end
							selected_subs+='<div class="separator separator-dashed mt-4 mb-4"></div>';
							selected_subs+='</div>';
							//col-md-12 end
						}
					});
					selected_subs+='</div>';
					//form-group end
				}
				selected_subs+='</div>';
				//card body end
				selected_subs+='</div>';
				//card end

				$('#'+selector_id).html(selected_subs);
			}else{
				Swal.fire({
				  icon: 'error',
				  title: 'Error',
				  text: 'Oops, Something Went Wrong'
				});
			}
		},
		checkSelectedClass:function(class_list){
			//console.log(class_list);
			var cls_list=[];
			cls_list= $.map(class_list, function(n, i) { 
				//console.log(n);
				return (n.is_selected)?n:null; 
			});
			return (cls_list.length>0)?true:false;
		},
		checkSelectedSections:function(class_list){
			var sec_list=[];
			$.each(class_list,function(index, element){
				if(element.is_selected){
					var section= $.map(element.sections, function(n, i) { 
						return (n.is_selected)?n:null; 
					});

					if(section.length>0){
						sec_list.push(section);
					}
				}
			});
			
			return (sec_list.length>0)?true:false;
		},
		reviewDetails:function(){
			$('#user_name').text($.trim($('#first_name').val()));
			$('#user_email').text($.trim($('#email').val()));
			$('#user_mobile').text($.trim($('#mobile').val()));
			$('#user_addr1').text($.trim($('#address1').val()));
			$('#user_addr2').text($.trim($('#address2').val()));
			$('#user_addr2').text($.trim($('#address2').val()));
			$('#user_postcode').text($.trim($('#postcode').val()));
			$('#user_city').text($.trim($('#city').val()));
			$('#user_state').text($.trim($('#state').val()));
			$('#user_country').text($("#country option:selected").text());
			$('#campus_info').text($.trim($('#campus_id option:selected').text()));
		},
		notifyAlerts:function(){
			$.notify({
				// options
				icon: 'glyphicon glyphicon-warning-sign',
				title: notify_options.title,
				message: notify_options.message 
			},{
				// settings
				element: 'body',
				position: null,
				type: notify_options.type,
				allow_dismiss:notify_options.allow_dismiss,
				newest_on_top: false,
				showProgressbar: false,
				placement: {
					from: "top",
					align: "right"
				},
				offset: 20,
				spacing: notify_options.spacing,
				z_index: notify_options.z_index,
				timer: notify_options.timer,
				mouse_over: null,
				animate: {
					enter: 'animated fadeInDown',
					exit: 'animated fadeOutUp'
				}
			});
		}
	};
 	
}();

jQuery(document).ready(function () {
	KTAddUser.init();



$('#kt_tree_subjects').jstree({
 "plugins": ["contextmenu", "checkbox", "types"],
 "core": {
     "themes": {
         "responsive": false,
         "icons": false
     },
     "data": [{
            "text": "Physics",
             "children": [{
                 "text": "Class 11",
                 "children": [{
	                 "text": "Section1",
	                 "children": [{
		                 "text": "Stream",
		                 "state": {
		                     "opened": true
		                 }
		             }]
	                 
	             },{
	                 "text": "Section2",
	                 "children": [{
		                 "text": "Stream",
		                 "state": {
		                     "opened": true
		                 }
		             }]
	                 
	             }]
                 
             },
             {
                 "text": "Class 12",
                 "children": [{
	                 "text": "Section1",
	                 "children": [{
		                 "text": "Stream",
		                 "state": {
		                     "opened": true
		                 }
		             }]
	                 
	             },{
	                 "text": "Section2",
	                 "children": [{
		                 "text": "Stream",
		                 "state": {
		                     "opened": true
		                 }
		             }]
	                 
	             }]
                 
             }]
         	}]
	 },
	 "types": {
	     "default": {
	         "icon": "fa fa-folder text-warning"
	     },
	     "file": {
	         "icon": "fa fa-file  text-warning"
	     }
	 },
}).bind("loaded.jstree", function (event, data) {
        // you get two params - event & data - check the core docs for a detailed description
        $(this).jstree("open_all");
    });



});

