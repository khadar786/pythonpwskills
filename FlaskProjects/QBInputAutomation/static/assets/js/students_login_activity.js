var Students;
var API_URL='api/Service.php';
var loader_fa='<i class="fa fa-circle-o-notch fa-spin" style="font-size:15px"></i>';
var class_id=course_id=subject_id='';
(function($) {
	Students={
		init:function() {
			var validation;
			var form = KTUtil.getById('fileupload');

			//Schedule list
			var datatable=$('#kt_datatable').KTDatatable({
				// datasource definition
				data: {
					type: 'remote',
					source: {
						read: {
							url:API_URL,
							params:{action:'studentslist',user_status:user_status},
						},
						
					},
					pageSize: 10, // display 20 records per page
					serverPaging: true,
					serverFiltering: true,
					serverSorting: true,
					saveState:false
				},

				// layout definition
				layout: {
					scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
					footer: false, // display/hide footer
				},

				// column sorting
				sortable: true,

				pagination: true,

				search: {
					input: $('#studentsearch'),
					delay: 400,
					key: 'studentsearch'
				},
				// columns definition
				columns: [
					{
						field: 'id',
						title: 'ID',
						sortable: 'desc',
						width: 40,
						type: 'number',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.id +'</span>';
						}
					},
					{
						field: 'first_name',
						title: 'NAME',
						width: 225,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
						//var img_default = 'assets/media/users/default.jpg';

						var output = '';
						if (data.photo !=null && data.photo !="") {
							output = '<div class="d-flex align-items-center">\
								<div class="symbol symbol-40 symbol-sm flex-shrink-0">\
									<img class="" src="images/profile/' + data.photo + '" alt="photo">\
								</div>\
								<div class="ml-4">\
									<div class="text-dark-75 font-weight-bolder font-size-lg mb-0">' + data.first_name + '</div>\
									<a href="#" class="text-muted font-weight-bold text-hover-primary">' + data.email + '</a>\
								</div>\
							</div>';
						}
						else {
							var stateNo = KTUtil.getRandomInt(0, 7);
							var states = [
								'success',
								'primary',
								'danger',
								'success',
								'warning',
								'dark',
								'primary',
								'info'];
							var state = states[stateNo];

							output = '<div class="d-flex align-items-center">\
								<div class="symbol symbol-40 symbol-light-'+state+' flex-shrink-0">\
									<span class="symbol-label font-size-h4 font-weight-bold">' + data.first_name.substring(0, 1) + '</span>\
								</div>\
								<div class="ml-4">\
									<div class="text-dark-75 font-weight-bolder font-size-lg mb-0">' + data.first_name + '</div>\
									<a href="#" class="text-muted font-weight-bold text-hover-primary">' + data.email + '</a>\
								</div>\
							</div>';
						}

						return output;
						}
					},
					{
						field: 'campus_name',
						title: 'CAMPUS',
						sortable: 'asc',
						width: 100,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							var output = '';
							if (data.campus_name !=null) {
								output = '<span class="font-weight-bolder">'+data.campus_name+'</span>';
							}else{
								output = '--';
							}
							return output;
						}
					},
					{
						field: 'class_name',
						title: 'Subscription Details',
						sortable: 'asc',
						width: 300,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							var output = '';
							if(data.subscriptions[0].length != 0){
								for(i=0;i<data.subscriptions[0].length;i++){
									if(data.subscriptions[0][0].status == 1){
										var active_status = 'label-light-info';
									}else{
										var active_status = 'label-light-warning';
									}
									output += '<span class="label label-lg font-weight-bold '+active_status+' label-inline mb-1 mr-1">'+data.subscriptions[0][i].course_name+' / '+data.subscriptions[0][i].class_name+' ('+data.subscriptions[0][i].section_name+')</span>';
								}
							}
							else{
								output = '--';
							}
							/*
							if (data.class_name !=null) {
								output = '<span class="font-weight-bolder">'+data.class_name+'</span>';
							}else{
								output = '--';
							}*/
							return output;
						}
					},
					{
						field: 'mobile',
						title: 'MOBILE NUMBER',
						sortable: 'asc',
						width: 125,
						type: 'number',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.mobile+'</span>';
						}
					},
					{
						field: 'user_status',
						title: 'STATUS',
						width: 100,
						template: function(row) {
							var status = {
								0: {'title': 'Inactive', 'class': ' label-light-danger'},
								1: {'title': 'Active', 'class': ' label-light-success'},
							};
							return '<span class="label label-lg font-weight-bold ' + status[row.user_status].class + ' label-inline">' + status[row.user_status].title + '</span>';
						}
					},			
					{
						field: 'father_name',
						title: 'FATHER NAME',
						sortable: 'asc',
						width: 100,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.father_name+'</span>';
						}
					},
					{
						field: 'father_email',
						title: 'FATHER EMAIL',
						sortable: 'asc',
						width: 100,
						type: 'number',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.father_email+'</span>';
						}
					},
					{
						field: 'mother_name',
						title: 'MOTHER NAME',
						sortable: 'asc',
						width: 100,
						type: 'number',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.mother_name+'</span>';
						}
					},
					{
						field: 'mother_mobile',
						title: 'MOTHER MOBILE',
						sortable: 'asc',
						width: 100,
						type: 'number',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.mother_mobile+'</span>';
						}
					},
					{
						field: 'last_login',
						title: 'LAST LOGIN',
						sortable: 'asc',
						width: 100,
						type: 'number',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							var output = '';
							if (data.last_login !=null) {
								output = '<span class="font-weight-bolder">'+data.last_login+'</span>';
							}else{
								output = '--';
							}
							return output;
						}
					},
					{
						field: 'Actions',
						title: 'Actions',
						sortable: false,
						width: 140,
						overflow: 'visible',
						autoHide: false,
						template: function(data){
							if(data.user_status>0){
							var btn='\<a href="javascript:;" class="btn btn-sm btn-default btn-text-danger btn-hover-danger btn-icon" title="Inactive user" onclick="Students.onChangeUserStatus('+data.id+',\'inactive\');">\
								<span class="svg-icon svg-icon-md">\
									<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
									    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
									        <rect x="0" y="0" width="24" height="24"/>\
									        <circle fill="#000000" opacity="0.3" cx="12" cy="12" r="10"/>\
									        <path d="M12.0355339,10.6213203 L14.863961,7.79289322 C15.2544853,7.40236893 15.8876503,7.40236893 16.2781746,7.79289322 C16.6686989,8.18341751 16.6686989,8.81658249 16.2781746,9.20710678 L13.4497475,12.0355339 L16.2781746,14.863961 C16.6686989,15.2544853 16.6686989,15.8876503 16.2781746,16.2781746 C15.8876503,16.6686989 15.2544853,16.6686989 14.863961,16.2781746 L12.0355339,13.4497475 L9.20710678,16.2781746 C8.81658249,16.6686989 8.18341751,16.6686989 7.79289322,16.2781746 C7.40236893,15.8876503 7.40236893,15.2544853 7.79289322,14.863961 L10.6213203,12.0355339 L7.79289322,9.20710678 C7.40236893,8.81658249 7.40236893,8.18341751 7.79289322,7.79289322 C8.18341751,7.40236893 8.81658249,7.40236893 9.20710678,7.79289322 L12.0355339,10.6213203 Z" fill="#000000"/>\
									    </g>\
									</svg>\
								</span>\
	                        </a>\
	                        ';
	                    	}else{
		                    	var btn='\<a href="javascript:;" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon" title="Active user" onclick="Students.onChangeUserStatus('+data.id+',\'active\');">\
									<span class="svg-icon svg-icon-md">\
									<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
									    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
									        <rect x="0" y="0" width="24" height="24"/>\
									        <circle fill="#000000" opacity="0.3" cx="12" cy="12" r="10"/>\
									        <path d="M16.7689447,7.81768175 C17.1457787,7.41393107 17.7785676,7.39211077 18.1823183,7.76894473 C18.5860689,8.1457787 18.6078892,8.77856757 18.2310553,9.18231825 L11.2310553,16.6823183 C10.8654446,17.0740439 10.2560456,17.107974 9.84920863,16.7592566 L6.34920863,13.7592566 C5.92988278,13.3998345 5.88132125,12.7685345 6.2407434,12.3492086 C6.60016555,11.9298828 7.23146553,11.8813212 7.65079137,12.2407434 L10.4229928,14.616916 L16.7689447,7.81768175 Z" fill="#000000" fill-rule="nonzero"/>\
									    </g>\
									</svg>\
									</span>\
		                        </a>\
		                        ';
	                    	}

						 return '\
	                        <a target="_blank" href="student-login-activity-'+data.id+'" class="label label-danger label-inline font-weight-bolder mr-2" >Login Activity</a>\
	                       ';
						}
					}
				]
			});
			validation = FormValidation.formValidation(form,
			{
						fields: {
							class_id: {
								validators: {
									notEmpty: {
										message: 'Class is required'
									}
								}
							},
							uploadfile: {
								validators: {
									notEmpty: {
										message: 'File is required'
									}
								}
							},
		                    
						},
						plugins: {
							trigger: new FormValidation.plugins.Trigger(),
							bootstrap: new FormValidation.plugins.Bootstrap()
						}
				}
			).on('core.form.valid', function() {
				
				
			});

			$('#submit').on('click', function (e) {
				e.preventDefault();
				validation.validate().then(function(status) {
					if(status=='Valid'){
							document.getElementById("submit").disabled=true;
							$('#loader').html(loader_fa);
							

							var formData = new FormData();
							formData.append('campus_id', form.querySelector('[name="campus_id"]').value);
							formData.append('class_id', form.querySelector('[name="class_id"]').value);
			            	formData.append('course_id', form.querySelector('[name="course_id"]').value);
			            	// Append the file
				            var uploadFiles = form.querySelector('[name="uploadfile"]').files;
				            if(uploadFiles.length>0){
				                formData.append('uploadfile', uploadFiles[0]);
				            }

							axios({
							  method: 'post',
							  url: 'upload_students.php',
							  data: formData,
							  headers: {
                    			'Content-Type': 'multipart/form-data'
                			  }
							}).then(function(response){
               					console.log(response.data);
               					if(response.data.status){
               						console.log('####');
               						//form.resetForm(true);
               						$('#fileupload').trigger("reset");
               						document.getElementById("submit").disabled=false;
               						$('#alert_box').show();
               						$('#alert_box').addClass('alert-success');
               						$('#alert_title').html('Success!');
               						$('#alert_msg').html('Students uploaded successfully!');
               						$("#kt_datatable").KTDatatable("reload");
               						if(response.data.existSCnt!=0){
               							$('#importExcel').modal('hide');
	               						var tr_td = '';
	               						var data = response.data.existSList;
				                        for (var i = 0; i < data.length; i++) {
				                        	var row = i+1;
				                            tr_td += '<tr><td>' + row + '</td><td>' + data[i].fname + '</td><td>' + data[i].email + '</td></tr>';
				                        }
				                        $("#exist_data").html(tr_td);
	               						Students.importExistData();
               						}
               					}else{
               						document.getElementById("submit").disabled=false;
               						$('#alert_box').addClass('alert-danger');
               						$('#alert_title').html('Failure!');
               						$('#alert_msg').html('please try again!');
               					}
               					$('#loader').html('');
            				});
					}else{
						swal.fire({
			                text: "Sorry, looks like there are some errors detected, please try again.",
			                icon: "error",
			                buttonsStyling: false,
			                confirmButtonText: "Ok, got it!",
			                confirmButtonClass: "btn font-weight-bold btn-light"
			            }).then(function() {
							KTUtil.scrollTop();
						});
					}
				});
			});

			$('#password, #confirm_password').on('keyup', function () {
				if ($('#password').val() == $('#confirm_password').val()) {
					$('#message').html('Matching').css('color', 'green');
					$('#uptpassword').removeAttr('disabled');
				} else {
					$('#uptpassword').attr('disabled','disabled');
					$('#message').html('Not Matching').css('color', 'red');
				}
			});
			$('#status').change(function(){
				//console.log($(this).val());
				user_status = $(this).val();
				console.log(user_status);
				$('#loader').html(loader_fa);
				$("#kt_datatable").KTDatatable("reload");
			});


			
		},
		importExcel:function(){
				$('#alert_box').hide();
				$('#alert_title,#alert_msg').html('');
				$('#importExcel').modal('show');
		},
		importExistData:function(){
			$('#importExistData').modal('show');
		},
		resetPassword:function(stu_id,stu_name){
			console.log(stu_id);
			console.log(stu_name);
			$('#resetpassword').modal('show');
			$('#restpassModalLabel').html('Resetting Password of '+stu_name);	
			$('#stu_idreset').val(stu_id);		
		},
		updatePassword:function(){
			var userid = $('#stu_idreset').val();		
			var password = $('#password').val();	
			if(password == ''){
				$('#message').html('Enter Password').css('color', 'red');
				return false;
			}	
			if(userid != ""){
				jQuery.post(API_URL,{action:"admStupasswordReset",userid:userid,password:password})
				  .done(function( data ) {
				    	//alert( "Data Loaded: " + data );
				    	console.log(data);
				    	console.log(data.error);
				    	if(data.error == false){
				    		$('#resetpassword .modal-body').html('<h1>'+data.message+'</h1>').css('color', 'green');	
				    	}else{
				    		$('#message').html(data.message).css('color', 'red');
				    	}
				    	setTimeout(function(){ $('#resetpassword').modal('hide'); }, 1000);
				  });
			}


		},
		getCourses:function(cls_id){
			class_id='';
			if(cls_id!=""){
				  class_id=cls_id;
				  jQuery.post(API_URL,{action:"courses",class_id:class_id})
				  .done(function( data ) {
				    	//alert( "Data Loaded: " + data );
				    	//console.log(data.subjects);
				    	var courses=data.courses;
						jQuery('#course_id option[value!=""]').remove();
						for (var i=0;i<courses.length;i++) {
							jQuery('#course_id').append('<option value="'+courses[i].course_id+'">'+courses[i].course_name+'</option>');
						};
				  });
			}else{
				jQuery('#course_id option[value!=""]').remove();
				jQuery('#subject_id option[value!=""]').remove();
			}
		},
		onChangeUserStatus:function(user_id,action){
			$('#loader').html(loader_fa);
			var formData = new FormData();
			formData.append('user_id',user_id);
			formData.append('action',action);
			axios({
			  method: 'post',
			  url: 'user_change_status.php',
			  data: formData,
			  headers: {
    			'Content-Type': 'multipart/form-data'
			  }
			}).then(function(response){
					$("#kt_datatable").KTDatatable("reload");
			});

		},
		

	};
	$(document).ready(function($){ 
		Students.init(); 
	});
})(jQuery);
function UserStatusFilter(data){
	if(data == ""){
		window.location.href='students-login-activity';
	}else{
		window.location.href='students-login-activity-'+data;
	}
}