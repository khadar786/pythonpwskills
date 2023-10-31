//"use strict";

// Class Definition
var KTResources = function() {
    var _login;
    var _avatar;
    var _showForm = function(form) {
        var cls = 'login-' + form + '-on';
        var form = 'kt_login_' + form + '_form';

        _login.removeClass('login-forgot-on');
        _login.removeClass('login-signin-on');
        _login.removeClass('login-signup-on');

        _login.addClass(cls);

        KTUtil.animateClass(KTUtil.getById(form), 'animate__animated animate__backInUp');
    }

    var _handleResourceForm = function() {
        var validation;

        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        var form=KTUtil.getById('kt_resources_form');
        validation = FormValidation.formValidation(
			KTUtil.getById('kt_resources_form'),
			{
				fields: {
					class: {
						validators: {
							notEmpty: {
								message: 'Class is required'
							}
						}
					},
					subject: {
						validators: {
							notEmpty: {
								message: 'Subject is required'
							}
						}
					},
                    chapter: {
                        validators: {
                            notEmpty: {
                                message: 'Chapter is required'
                            }
                        }
                    },
                    selectfile: {
                        validators: {
                            notEmpty: {
                                message: 'Type is required'
                            }
                        }
                    },
                    videourl: {
                        validators: {
                            notEmpty: {
                                message: 'Video id is required'
                            }
                        }
                    },
                    upload_file: {
                            validators: {
                                notEmpty: {
                                    message: 'Please select an file'
                                },
                                file: {
                                    extension: 'jpeg,jpg,png,ppt,pdf',
                                    type: 'image/jpeg,image/png,application/vnd.ms-powerpoint,application/pdf',
                                    //maxSize: 2097152,   // 2048 * 1024
                                    message: 'The selected file is not valid'
                                },
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
        
        $('#kt_resources_submit').on('click', function (e) {
            e.preventDefault();

            validation.validate().then(function(status) {
                var default_dashboard = "all-resources"; 
                var validate_status = status;
                 var form_data = new FormData();

              var uploadFiles = document.getElementById('upload_file').files[0];
                    form_data.append('uploadfile', uploadFiles);
                    form_data.append('userid', form.querySelector('[name="userid"]').value);
                    form_data.append('class', form.querySelector('[name="class"]').value);
                    form_data.append('subject', form.querySelector('[name="subject"]').value);
                    form_data.append('chapter', form.querySelector('[name="chapter"]').value);
                    //form_data.append('topic', form.querySelector('[name="topic"]').value);
                    //form_data.append('subtopic', form.querySelector('[name="subtopic"]').value);
                    form_data.append('videourl', form.querySelector('[name="videourl"]').value);
                    form_data.append('selectfile', form.querySelector('[name="selectfile"]').value);
                    
                $.ajax({
                     url: 'add_resource.php', 
                     type: 'post',
                     data: form_data,
                     dataType: 'json',
                     contentType: false,
                     processData: false,
                   beforeSend: function(){
                   },
                     success: function (response) {
                     },
                   complete:function(response){
                    var error = response.responseJSON.error;
                    var msg = response.responseJSON.message;
                       if( error==true)
                        {
                            swal.fire({
                                text: msg,
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
                        else
                        {
                            swal.fire({
                                text: msg,
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn font-weight-bold btn-light-primary"
                                }
                            }).then(function() {
                                KTUtil.scrollTop();
                                window.location.replace(default_dashboard);
                            });
                        }

                   }
                   });
		    });
        });

        // Handle forgot button
       
    }


    // Public Functions
    return {
        // public functions
        init: function() {
            _login = $('#kt_login');

            _handleResourceForm();
        }
    };
}();

// Class Initialization
jQuery(document).ready(function() {
    KTResources.init();
});
    function selectFile(type)
    {
        if(type=='video')
        {
            document.getElementById("youtube_url").style.display = "block";
            document.getElementById("filedata").style.display = "none";
        }
        else if(type=='file')
        {
            document.getElementById("filedata").style.display = "block";
            document.getElementById("youtube_url").style.display = "none";
        }
    }
    function getsubjectdata(subject_id)
    {
        var class_id = $("#classid").val();
        $("select#loadtopics").html('<option value="">Select Topic</option>');
         $.ajax({
            url:'ajax.php',
            type:'POST',
            data: {action: "getchapterlistdata",class_id: class_id,subject_id:subject_id},
            dataType: 'json',
            success: function( json ) {
                var options = '<option value="">Select Chapter</option>';
                if(json!=null){
                for (var i = 0; i < json.length; i++) {
                    options += '<option value="' + json[i].chapter_id + '">' + json[i].chapter + '</option>';
                  }
                  $("select#loadchapters").html(options);
                }
            }
        });
    }

            function getTopics(chapter_id) {
                var class_id = $("#classid").val();
                $.ajax({
                    url:'ajax.php',
                    type:'POST',
                    data: {action: "gettopicslist",chapter_id: chapter_id,class_id:class_id},
                    dataType: 'json',
                    success: function( json ) {
                        var options = '<option value="">Select Topic</option>';
                        if(json!=null){
                       
                          for (var i = 0; i < json.length; i++) {
                            options += '<option value="' + json[i].topic_id + '">' + json[i].topic + '</option>';
                          }
                          $("select#loadtopics").html(options);
                        }
                    }
                });
            }

            function getchapter(class_id)
            {
                var subject_id = $("#subject").val();
                $("select#loadtopics").html('<option value="">Select Topic</option>');
                 $.ajax({
                    url:'ajax.php',
                    type:'POST',
                    data: {action: "getchapterlist",class_id: class_id,subject_id:subject_id},
                    dataType: 'json',
                    success: function( json ) {
                        var options = '<option value="">Select Chapter</option>';
                        if(json!=null){
                        for (var i = 0; i < json.length; i++) {
                            options += '<option value="' + json[i].chapter_id + '">' + json[i].chapter + '</option>';
                          }
                          $("select#loadchapters").html(options);
                        }
                    }
                });
            }

            function getsubTopics(topic_id)
            {
                 $.ajax({
                    url:'ajax.php',
                    type:'POST',
                    data: {action: "getsubtopicslist",topic_id: topic_id},
                    dataType: 'json',
                    success: function( json ) {
                        var options = '';
                        if(json!=null){
                        for (var i = 0; i < json.length; i++) {
                            options += '<option value="' + json[i].stopic_id + '">' + json[i].sub_topic + '</option>';
                          }
                          $("select#loadsubtopics").html(options);
                        }
                    }
                });
            }


