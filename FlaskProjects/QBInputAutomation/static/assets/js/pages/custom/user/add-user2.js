"use strict";

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
		// Handle submit button
	    $('#student_submit').on('click', function (e) {
	        e.preventDefault();
			var posting = $.post( "update_add_student.php", $( "#kt_form_add_student" ).serialize() );
                posting.done(function( data ) {
                    console.log(data);
                    var obj = jQuery.parseJSON(data);
                    console.log( obj );    
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
	                            window.location.replace('add-student-new');
	                            
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
                  //jQuery("#cres_message").html("<span class='sucess-msg'>"+data+"</span>");
                  //clear_form_elements('contactus_form')
                  //setTimeout(function(){ jQuery("#cres_message").html("");  }, 6000);
                //var content = $( data ).find( "#content" );
                //$( "#result" ).empty().append( content );
                });
				
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
							notEmpty: {
								message: 'Father Email is required'
							},
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
			_initValidations();
			_initAvatar();
		}
	};
 	
}();

jQuery(document).ready(function () {
	KTAddUser.init();
});
