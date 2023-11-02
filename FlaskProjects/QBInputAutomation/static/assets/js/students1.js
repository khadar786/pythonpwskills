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
							params:{action:'studentslist'},
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
						title: 'CLASS',
						sortable: 'asc',
						width: 100,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							var output = '';
							if (data.class_name !=null) {
								output = '<span class="font-weight-bolder">'+data.class_name+'</span>';
							}else{
								output = '--';
							}
							return output;
						}
					},
					{
						field: 'stream_name',
						title: 'STREAM',
						sortable: 'asc',
						width: 100,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							var output = '';
							if (data.stream_name !=null) {
								output = '<span class="font-weight-bolder text-primary mb-0">'+data.stream_name+'</span>';
							}else{
								output = '--';
							}
							return output;
						}
					},
					{
						field: 'section_name',
						title: 'Section',
						sortable: 'asc',
						width: 75,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							var output = '';
							if (data.section_name !=null) {
								output = '<span class="font-weight-bolder">'+data.section_name+'</span>';
							}else{
								output = '--';
							}
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
						width: 130,
						overflow: 'visible',
						autoHide: false,
						template: function(data){
						 return '\
	                        <a href="edit-student-'+data.id+'" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon mr-2" title="Edit">\
	                            <span class="svg-icon svg-icon-md">\
									<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
										<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
											<rect x="0" y="0" width="24" height="24"/>\
											<path d="M12.2674799,18.2323597 L12.0084872,5.45852451 C12.0004303,5.06114792 12.1504154,4.6768183 12.4255037,4.38993949 L15.0030167,1.70195304 L17.5910752,4.40093695 C17.8599071,4.6812911 18.0095067,5.05499603 18.0083938,5.44341307 L17.9718262,18.2062508 C17.9694575,19.0329966 17.2985816,19.701953 16.4718324,19.701953 L13.7671717,19.701953 C12.9505952,19.701953 12.2840328,19.0487684 12.2674799,18.2323597 Z" fill="#000000" fill-rule="nonzero" transform="translate(14.701953, 10.701953) rotate(-135.000000) translate(-14.701953, -10.701953) "/>\
											<path d="M12.9,2 C13.4522847,2 13.9,2.44771525 13.9,3 C13.9,3.55228475 13.4522847,4 12.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L12.9,2 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"/>\
										</g>\
									</svg>\
	                            </span>\
	                        </a>\
	                        <a href="javascript:;" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon" title="Delete">\
								<span class="svg-icon svg-icon-md">\
									<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
										<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
											<rect x="0" y="0" width="24" height="24"/>\
											<path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fill-rule="nonzero"/>\
											<path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3"/>\
										</g>\
									</svg>\
								</span>\
	                        </a>\
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

			
		},
		importExcel:function(){
				$('#alert_box').hide();
				$('#alert_title,#alert_msg').html('');
				$('#importExcel').modal('show');
		},
		importExistData:function(){
			$('#importExistData').modal('show');
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

	};
	$(document).ready(function($){ 
		Students.init(); 
	});
})(jQuery);


