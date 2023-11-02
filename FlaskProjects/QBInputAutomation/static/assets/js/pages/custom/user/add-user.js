"use strict";
var API_URL='api/Adminservice.php';
var courses=[];
var custom_courses=[];
var selected_courses=[];
var unselected_courses=[];
var notify_options={
      	icon: 'glyphicon glyphicon-warning-sign',
      	title:'Error',
      	message:'',
      	type:'danger',
      	spacing: 10,
      	z_index: 9999,
      	timer: 1000,
      };


/*$("#first_name").val('khadar');
$("#email").val('khadar@gmail.com');
$("#password").val('khadar');
$("#mobile").val('9505437866');*/

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
			
			// alert(wizard.isLastStep());
			// alert(wizard.getStep());

			//if(wizard.getStep() == 3){
				//$('.campus_id').html($( "#campus_id option:selected" ).text());
				//$('.class_id').html($( "#class_id option:selected" ).text());
				//$('.stream_id').html($( "#stream_id option:selected" ).text());
				//$('.section_id').html($( "#section_id option:selected" ).text());
			//}

			_validations[wizard.getStep() - 1].validate().then(function(status) {
		        if (status == 'Valid') {
		        	 var wizard_status=true;
		        	 if(wizard.getStep()==3){
		        		if(KTAddUser.checkSubjectSelection()){
					        // console.log($( "#kt_form_add_student" ).serialize());
							var form_data = $("#kt_form_add_student").serializeArray();
							// console.log(form_data);
							for(var i=0;i<form_data.length;i++){
								//data[form_data[i].name] = form_data[i].value;
								var elmname = '.'+form_data[i].name;
								// console.log(elmname +' : '+ form_data[i].value);
								$(elmname).html(form_data[i].value);
							}

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
	        e.preventDefault();
	        $('#student_submit').attr('disabled', true);
			var file_data = $('#profile_avatar').prop('files')[0];   
			var form_data = new FormData(document.getElementById("kt_form_add_student"));                  
			form_data.append('file', file_data);
			form_data.append('selected_courses', JSON.stringify(selected_courses));
			form_data.append('unselected_courses', JSON.stringify(unselected_courses));
			
			//alert(form_data);                             
			$.ajax({
				url: 'update_add_student.php', // point to server-side PHP script 
				dataType: 'text',  // what to expect back from the PHP script, if anything
				cache: false,
				contentType: false,
				processData: false,
				data: form_data,                         
				type: 'post',
				success: function(data){

					//console.log(data);
	                var obj = jQuery.parseJSON(data);
	                //console.log( obj );

	                if ( obj.error == false) {
	                        Swal.fire({
	                            text: obj.message,
	                            icon: "success",
	                            buttonsStyling: false,
	                            confirmButtonText: "Ok, got it!",
	                            customClass: {
	                                confirmButton: "btn font-weight-bold btn-light-primary"
	                            }
	                        }).then(function() {
	                            //KTUtil.scrollTop();
	                            //window.location.replace('add-student');
	                            window.location.replace('students'); 
	                        });
	                } else {
	                    Swal.fire({
	                        text: obj.message,
	                        icon: "error",
	                        buttonsStyling: false,
	                        confirmButtonText: "Ok, got it!",
	                        customClass: {
	                            confirmButton: "btn font-weight-bold btn-light-primary"
	                        }
	                    }).then(function() {
	                        KTUtil.scrollTop();
	                    });
	                }

	                $('#student_submit').attr('disabled', false);

				}
			});

			// var posting = $.post( "update_add_student.php", $( "#kt_form_add_student" ).serialize() );
   //          posting.done(function( data ) {
   //              console.log(data);
   //              var obj = jQuery.parseJSON(data);
   //              console.log( obj );

   //              if ( obj.error == false) {
   //                      Swal.fire({
   //                          text: obj.message,
   //                          icon: "success",
   //                          buttonsStyling: false,
   //                          confirmButtonText: "Ok, got it!",
   //                          customClass: {
   //                              confirmButton: "btn font-weight-bold btn-light-primary"
   //                          }
   //                      }).then(function() {
   //                          //KTUtil.scrollTop();
   //                          window.location.replace('add-student-new');                    
   //                      });
   //              } else {
   //                  Swal.fire({
   //                      text: obj.message,
   //                      icon: "error",
   //                      buttonsStyling: false,
   //                      confirmButtonText: "Ok, got it!",
   //                      customClass: {
   //                          confirmButton: "btn font-weight-bold btn-light-primary"
   //                      }
   //                  }).then(function() {
   //                      KTUtil.scrollTop();
   //                  });
   //              }

			// 	//jQuery("#cres_message").html("<span class='sucess-msg'>"+data+"</span>");
			// 	//clear_form_elements('contactus_form')
			// 	//setTimeout(function(){ jQuery("#cres_message").html("");  }, 6000);
			// 	//var content = $( data ).find( "#content" );
			// 	//$( "#result" ).empty().append( content );

   //          });		

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
								message: 'Roll Number / Email is required'
							},
							regexp: {
		                        regexp: USERID_REGEXP,
		                        message: 'The input is not a valid Roll Number / Email',
		                    },
			                remote: {
			                	data:{action:'check_user'},
	                            message: 'The roll number / email id already existed',
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

					father_email: {
						validators: {
							// notEmpty: {
							// 	message: 'Father Email is required'
							// },

							emailAddress: {
								message: 'The value is not a valid email address'
							}
						}
					},

					mobile: {
						validators: {
							notEmpty: {
								message: 'Father Phone is required'
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
					campus_id: {
						validators: {
							notEmpty: {
								message: 'Campus is required'
							}
						}
					},
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

		KTAddUser.loadCourses();
	}


	var _initEditValidations = function () {

		// Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
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
								message: 'Roll Number / Email is required'
							},
							regexp: {
		                        regexp: USERID_REGEXP,
		                        message: 'The input is not a valid roll number / email',
		                    },
			                remote: {
			                	data:{action:'check_user',user_id:user_edit},
	                            message: 'The roll number / email id already existed',
	                            method: 'POST',
	                            url: API_URL,
	                        }
						}
					},

					father_email: {
						validators: {
							// notEmpty: {
							// 	message: 'Father Email is required'
							// },

							emailAddress: {
								message: 'The value is not a valid email address'
							}
						}
					},

					mobile: {
						validators: {
							notEmpty: {
								message: 'Father Phone is required'
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
					campus_id: {
						validators: {
							notEmpty: {
								message: 'Campus is required'
							}
						}
					},
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

		KTAddUser.loadCourses();
	}

	var _initAvatar = function () {
		_avatar = new KTImageInput('kt_user_add_avatar');
	}

	return {
		// public functions
		init: function () {
			_wizardEl = KTUtil.getById('kt_wizard_student');
			_formEl = KTUtil.getById('kt_form_add_student');

			_initWizard();
			if(user_edit != 0){
				_initEditValidations();
			}else{
				_initValidations();	
			}


			_initAvatar();
		},
		loadCourses:function(){
			var params={
					action:'student_subscription',
					user_id:user_edit,
					campus_id:campus_id
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
						course+='<label class="checkbox checkbox-primary mb-4">';
						if(courses[i].is_selected){
						course+='<input type="checkbox" id="cid_'+course_id+'" name="cid_'+course_id+'" onclick="KTAddUser.selectCourse('+i+','+course_id+');" checked/><strong style="vertical-align: text-bottom;">'+courses[i]['course_name']+'</strong><span></span>';
						}else{
						course+='<input type="checkbox" id="cid_'+course_id+'" name="cid_'+course_id+'" onclick="KTAddUser.selectCourse('+i+','+course_id+');"/><strong style="vertical-align: text-bottom;">'+courses[i]['course_name']+'</strong><span></span>';
						}
						
						course+='</label>';
						course+='</h3>';
						course+='</div>';
						course+='</div>';

						//card body start
						course+='<div class="card-body">';
						//course+='<strong style="vertical-align:text-bottom;">'+courses[i]['course_name']+'</strong>';
						//form-group start
						course+='<div class="form-group row wfield">';
						for(var j=0;j<courses[i]['classes'].length;j++){
							var cls_details=courses[i]['classes'][j];
							//col-md-12 start
							course+='<div class="col-md-12">';
							if(cls_details.is_selected){
							course+='<label class="radio mb-4"><input type="radio" id="cls_'+course_id+'_'+cls_details.class_id+'" name="cls_'+course_id+'" data-cid="'+course_id+'" data-cls-id="'+cls_details.class_id+'" onclick="KTAddUser.selectClass('+i+','+j+','+course_id+','+cls_details.class_id+');" checked/><strong>Class '+courses[i]['classes'][j]['class_name']+'</strong> <span></span></label>';
							}else{
							course+='<label class="radio mb-4"><input type="radio" id="cls_'+course_id+'_'+cls_details.class_id+'" name="cls_'+course_id+'" data-cid="'+course_id+'" data-cls-id="'+cls_details.class_id+'" onclick="KTAddUser.selectClass('+i+','+j+','+course_id+','+cls_details.class_id+');"/><strong>Class '+courses[i]['classes'][j]['class_name']+'</strong> <span></span></label>';
							}
							
							//checkbox-inline start
							course+='<div class="radio-inline">';
							for(var k=0;k<courses[i]['classes'][j]['sections'].length;k++){
								var section=courses[i]['classes'][j]['sections'][k];
								if(section.is_selected){
								course+='<label class="radio"><input type="radio" id="sec_'+course_id+'_'+cls_details.class_id+'_'+section.section_id+'" name="sec_'+course_id+'_'+cls_details.class_id+'" data-cid="'+course_id+'" data-sid="'+course_id+'" data-cls-id="'+cls_details.class_id+'" data-sec-id="'+section.section_id+'" onclick="KTAddUser.selectSection('+i+','+j+','+k+','+course_id+','+cls_details.class_id+','+section.section_id+');" class="'+course_id+'" checked/>Section '+courses[i]['classes'][j]['sections'][k]['section_name']+'<span></span></label>';
								}else{
								course+='<label class="radio"><input type="radio" id="sec_'+course_id+'_'+cls_details.class_id+'_'+section.section_id+'" name="sec_'+course_id+'_'+cls_details.class_id+'" data-cid="'+course_id+'" data-sid="'+course_id+'" data-cls-id="'+cls_details.class_id+'" data-sec-id="'+section.section_id+'" onclick="KTAddUser.selectSection('+i+','+j+','+k+','+course_id+','+cls_details.class_id+','+section.section_id+');" class="'+course_id+'"/>Section '+courses[i]['classes'][j]['sections'][k]['section_name']+'<span></span></label>';
								}
								
							}
							course+='</div>';
							//checkbox-inline end
							course+='<div class="separator separator-dashed mt-4 mb-4"></div>';
							course+='</div>';
							//col-md-12 end
						}
						course+='</div>';
						//form-group end
						course+='</div>';
						//card body end

						course+='</div>';
						//card end
					}
				}

				course_tree+=course;
				$('#course_tree').html(course_tree);
			});
		},
		selectCourse:function(cindex,course_id){
			var cid=course_id;
			if($('#cid_'+course_id).prop('checked') == true){
			    custom_courses[cid].is_selected=true;
			}else{
				custom_courses[cid].is_selected=false;
				//Uncheck the class and sections
				$('#cid_'+course_id).prop('checked',false);
				KTAddUser.unselectClasses(cindex,course_id);
			}
		},
		selectClass:function(cindex,cls_index,course_id,class_id){
			var cid=course_id;
			if($('#cls_'+course_id+'_'+class_id).prop('checked') == true){
				if(custom_courses[cid].is_selected){
					custom_courses[cid]['classes'][class_id].is_selected=true;
					KTAddUser.unselectRemClasses(cindex,cls_index,course_id,class_id);
					KTAddUser.unselectSections(cindex,cls_index,course_id,class_id);
				}else{
					custom_courses[cid]['classes'][class_id].is_selected=false;
					$('#cls_'+course_id+'_'+class_id).prop('checked',false);
					KTAddUser.unselectSections(cindex,cls_index,course_id,class_id);
					//Alert
					notify_options.type='danger';
					notify_options.title=custom_courses[cid].course_name;
					notify_options.message='Please select course';
					KTAddUser.notifyAlerts();
				}
			}
		},
		selectSection:function(cindex,cls_index,sec_index,course_id,class_id,section_id){
			var cid=course_id;
			if($('#sec_'+course_id+'_'+class_id+'_'+section_id).prop('checked') == true){
				if(custom_courses[cid]['classes'][class_id].is_selected){
					custom_courses[cid]['classes'][class_id]['sections'][section_id].is_selected=true;
					KTAddUser.unselectRemSections(cindex,cls_index,sec_index,course_id,class_id,section_id);
				}else{
					custom_courses[cid]['classes'][class_id]['sections'][section_id].is_selected=false;
					$('#sec_'+cid+'_'+class_id+'_'+section_id).prop('checked',false);
					//Alert
					notify_options.type='danger';
					notify_options.title=custom_courses[cid]['classes'][class_id].class_name;
					notify_options.message='Please select class';
					KTAddUser.notifyAlerts();
				}
			    
			}
		},
		unselectRemClasses:function(cindex,cls_index,course_id,selected_class_id){
			var cid=course_id;
			//console.log('@@@'+custom_courses[cid][subject_id]['classes']);
			var len = $.map(custom_courses[cid]['classes'], function(n, i) { return i; }).length;
			if(len>0){
				$.each(custom_courses[cid]['classes'], function(index, element) {
					if(selected_class_id!=element.class_id){
						custom_courses[cid]['classes'][element.class_id].is_selected=false;
	  					$('#cls_'+course_id+'_'+element.class_id).prop('checked',false);
	  					KTAddUser.unselectSections(cindex,index,cid,element.class_id);
					}
				});
			}
		},
		unselectRemSections:function(cindex,cls_index,sec_index,course_id,class_id,selected_section_id){
			var cid=course_id;
			var len = $.map(custom_courses[cid]['classes'][class_id]['sections'], function(n, i) { return i; }).length;
			if(len>0){
				$.each(custom_courses[cid]['classes'][class_id]['sections'], function(index, element) {
					if(selected_section_id!=element.section_id){
						custom_courses[cid]['classes'][element.class_id]['sections'][element.section_id].is_selected=false;
  						$('#sec_'+course_id+'_'+class_id+'_'+element.section_id).prop('checked',false);
					}
				});
			}
		},
		unselectClasses:function(cindex,course_id){
			var cid=course_id;
			//console.log('@@@'+custom_courses[cid][subject_id]['classes']);
			var len = $.map(custom_courses[cid]['classes'], function(n, i) { return i; }).length;
			if(len>0){
				$.each(custom_courses[cid]['classes'], function(index, element) {
  					custom_courses[cid]['classes'][element.class_id].is_selected=false;
  					$('#cls_'+course_id+'_'+element.class_id).prop('checked',false);
  					KTAddUser.unselectSections(cindex,index,cid,element.class_id);
				});
			}
		},
		unselectSections:function(cindex,cls_index,course_id,class_id){
			var cid=course_id;
			var len = $.map(custom_courses[cid]['classes'][class_id]['sections'], function(n, i) { return i; }).length;
			if(len>0){
				$.each(custom_courses[cid]['classes'][class_id]['sections'], function(index, element) {
  					custom_courses[cid]['classes'][element.class_id]['sections'][element.section_id].is_selected=false;
  					$('#sec_'+course_id+'_'+class_id+'_'+element.section_id).prop('checked',false);
				});
			}
		},
		checkSubjectSelection:function(){
			selected_courses=[];
			unselected_courses=[];
			$.each(custom_courses,function(index, element){
				var course_id=index;
				if(element.is_selected){
					var check_cls_status=KTAddUser.checkSelectedClass(element.classes);
					if(check_cls_status){
						var check_sec_status=KTAddUser.checkSelectedSections(element.classes);
						if(check_sec_status){
							selected_courses.push(element);
						}
					}
				}else{
					unselected_courses.push(element);
				}
				
			});

			var rstatus=true;
			if(selected_courses.length==0){
				rstatus=false;
			}

			return rstatus;
		},
		viewSubjectPreview:function(selector_id){
			selected_courses=[];
			$.each(custom_courses,function(index, element){
				var course_id=index;
				if(element.is_selected){
					var check_cls_status=KTAddUser.checkSelectedClass(element.classes);
					if(check_cls_status){
						var check_sec_status=KTAddUser.checkSelectedSections(element.classes);
						if(check_sec_status){
							selected_courses.push(element);
						}
					}
				}
				
			});

			if(selected_courses.length>0){
				var selected_subs="";
				$('#selected_subjects').empty();
				$('#review_selected_subjects').empty();
				if(selector_id=='selected_subjects'){
					$('#student_selected').modal('show');
				}

								
				//card start
				selected_subs+='<div class="card card-custom gutter-b">';
				//card body start
				selected_subs+='<div class="card-body">';
				for(var i=0;i<selected_courses.length;i++){
					var course_details=selected_courses[i];
					//console.log(subject_details);
					//form-group start
					selected_subs+='<div class="form-group row wfield">';
					selected_subs+='<label class="checkbox checkbox-primary mb-12" style="margin-bottom: 1rem !important;margin-left: 1.6%;">';
					selected_subs+='<input type="checkbox" checked disabled/><strong class="text-primary">'+course_details.course_name+'</strong><span></span>';
					selected_subs+='</label>';
					$.each(course_details.classes,function(index,element){
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
			$('#user_first_name').text($.trim($('#first_name').val()));
			$('#user_email').text($.trim($('#email').val()));
			$('#user_father_name').text($.trim($('#father_name').val()));
			$('#user_father_email').text($.trim($('#father_email').val()));
			$('#user_mobile').text($.trim($('#mobile').val()));
			$('#user_mother_name').text($.trim($('#mother_name').val()));
			$('#user_mother_mobile').text($.trim($('#mother_mobile').val()));
			$('#user_address1').text($.trim($('#address1').val()));
			$('#user_address2').text($.trim($('#address2').val()));
			$('#user_postcode').text($.trim($('#postal_code').val()));
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

	if(user_edit != 0){
		console.log(user_edit);
		// console.log(user_data.first_name);
		// var form_data = $("#kt_form_add_student").serializeArray();
		// for(var i=0;i<form_data.length;i++){
		// 	var elmname = '.'+form_data[i].name;
		// 	$(elmname).val(user_data+'.'+form_data[i].name);
		// }

		for (const [key, value] of Object.entries(user_data)) {
			var elmname = '#'+`${key}`;
			$(elmname).val( `${value}`);
		}
	}    
});