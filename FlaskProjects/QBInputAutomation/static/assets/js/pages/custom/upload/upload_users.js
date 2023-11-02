"use strict";

// Class Definition
var KTLogin = function() {
    var _handleSignInForm = function() {
        var validation;

        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validation = FormValidation.formValidation(
            KTUtil.getById('kt_login_signin_form'),
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
                    student_file: {
                        validators: {
                            notEmpty: {
                                message: 'Student File is required'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    submitButton: new FormValidation.plugins.SubmitButton(),
                    //defaultSubmit: new FormValidation.plugins.DefaultSubmit(), // Uncomment this line to enable normal button submit after form validation
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        );

        $('#kt_login_signin_submit').on('click', function (e) {
            e.preventDefault();

            validation.validate().then(function(status) {
                console.log( status ); 

                if (status == 'Valid') {
                    return false;
                var default_dashboard = "admin-dashboard"; 
                var validate_status = status;
                var posting = $.post( "dologin.php", $( "#kt_login_signin_form" ).serialize() );
                posting.done(function( data ) {
                    console.log(data);
                    var obj = jQuery.parseJSON(data);
                    console.log( obj );    
                    if (status == 'Valid') {
                        /*swal.fire({
                            text: "All is cool! Now you submit this form",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light-primary"
                            }
                        }).then(function() {*/
                            //KTUtil.scrollTop();
                            //window.location.replace(obj.default_dashboard);
                        //});
                    } else {
                        swal.fire({
                            text: "test",
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

                } else {
                        swal.fire({
                            text: "Sorry, looks like there are some errors detected, please try again.",
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
            });


        });


    }


    // Public Functions
    return {
        // public functions
        init: function() {
            _handleSignInForm();
        }
    };
}();

// Class Initialization
jQuery(document).ready(function() {
    KTLogin.init();
});
