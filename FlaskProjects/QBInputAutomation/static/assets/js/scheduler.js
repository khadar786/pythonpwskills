var Scheduler;
var API_URL='api/Service.php';
var loader_fa='<i class="fa fa-circle-o-notch fa-spin" style="font-size:15px"></i>';
var class_id=course_id=subject_id='';
(function($) {
	Scheduler={
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
							params:{action:'schedulerlist',eid:eid},
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
					input: $('#kt_subheader_search_form'),
					delay: 400,
					key: 'generalSearch'
				},
				// columns definition
				columns: [
					{
						field: 'cid',
						title: '#',
						sortable: 'asc',
						width: 40,
						type: 'number',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.cid +'</span>';
						}
					},
					{
						field: 'cd_id',
						title: 'CRID',
						width: 50,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.cd_id +'</span>';
						}
					},
					{
						field: 'cdate',
						title: 'DATE',
						sortable: 'asc',
						width: 100,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.cdate_new +'</span>';
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
							return '<span class="font-weight-bolder">'+data.class_name +'</span>';
						}
					},
					{
						field: 'event',
						title: 'Event',
						sortable: 'asc',
						width: 100,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.event+'</span>';
						}
					},
					{
						field: 'activity',
						title: 'Activity',
						sortable: 'asc',
						width: 100,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.activity+'</span>';
						}
					},
					{
						field: 'date_type',
						title: 'DATE TYPE',
						sortable: 'asc',
						width: 100,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.datetype+'</span>';
						}
					},
					/*{
						field: 'details',
						title: 'DETAILS',
						sortable: 'asc',
						width: 100,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.detatils+'</span>';
						}
					},*/
					{
						field: 'Actions',
						title: 'Actions',
						sortable: false,
						width: 130,
						overflow: 'visible',
						autoHide: false,
						template: function(data){
						 return '\
	                        <a href="edit-event-'+data.cid+'" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon mr-2" title="Edit details">\
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
	                        <a href="javascript:void(0);" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon" title="Delete" onclick="Scheduler.delEvent('+data.cid+');">\
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
							course_id: {
								validators: {
									notEmpty: {
										message: 'Course is required'
									}
								}
							},
							subject_id: {
								validators: {
									notEmpty: {
										message: 'Subject is required'
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
							/*console.log('success');
							// Append the text fields
							var params={};
							var formData = new FormData();
							formData.append('class_id', form.querySelector('[name="class_id"]').value);
			            	formData.append('subject_id', form.querySelector('[name="subject_id"]').value);

			            	// Append the file
				            var uploadFiles = form.querySelector('[name="uploadfile"]').files;
				            if (uploadFiles.length > 0) {
				                formData.append('uploadfile', uploadFiles[0]);
				            }
				            params.uploadfile=uploadFiles[0];
				            console.log(uploadFiles[0]);
				            params.formData=formData;
							FormValidation.utils.fetch('upload_scheduler.php', {
					            method: 'POST',
					            params:params,
					            headers: {
			                    'Content-Type': 'multipart/form-data'
			                	}
					        }).then(function(response) {
					            
					        });*/

	                    /*swal.fire({
			                text: "All is cool! Now you submit this form",
			                icon: "success",
			                buttonsStyling: false,
			                confirmButtonText: "Ok, got it!",
			                confirmButtonClass: "btn font-weight-bold btn-light-primary"
			            }).then(function() {
							KTUtil.scrollTop();
						});*/

							var formData = new FormData();
							formData.append('class_id', form.querySelector('[name="class_id"]').value);
							formData.append('course_id', form.querySelector('[name="course_id"]').value);
			            	formData.append('subject_id', form.querySelector('[name="subject_id"]').value);
			            	// Append the file
				            var uploadFiles = form.querySelector('[name="uploadfile"]').files;
				            if(uploadFiles.length>0){
				                formData.append('uploadfile', uploadFiles[0]);
				            }

							axios({
							  method: 'post',
							  url: 'upload_scheduler.php',
							  data: formData,
							  headers: {
                    			'Content-Type': 'multipart/form-data'
                			  }
							}).then(function(response){
               					//console.log(response.data);
               					if(response.data.status){
               						//console.log('####');
               						//form.resetForm(true);
               						$('#fileupload').trigger("reset");
               						document.getElementById("submit").disabled=false;
               						$('#alert_box').show();
               						$('#alert_box').addClass('alert-success');
               						$('#alert_title').html('Success!');
               						$('#alert_msg').html('scheduler prepared successfully!');
               						$("#kt_datatable").KTDatatable("reload");
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
		getSubjects:function(cid){
			course_id='';
			if(cid!=""){
				  course_id=cid;
				  console.log(cid);
				  jQuery.post(API_URL,{action:"subjects",class_id:class_id,course_id:course_id})
				  .done(function( data ) {
				    	//alert( "Data Loaded: " + data );
				    	//console.log(data.subjects);
				    	var subjects=data.subjects;
						jQuery('#subject_id option[value!=""]').remove();
						for (var i=0;i<subjects.length;i++) {
							jQuery('#subject_id').append('<option value="'+subjects[i].subject_id+'">'+subjects[i].subject+'</option>');
						};
				  });
			}else{
				jQuery('#subject_id option[value!=""]').remove();
			}
		},
		getTeachers:function(sid){
			if(sid!=""){
				  jQuery.post(API_URL,{action:"getteachers",class_id:class_id,course_id:course_id,sid:sid})
				  .done(function( data ) {
				    	var teachers=data.teachers;
						jQuery('#teacher_id option[value!=""]').remove();
						for (var i=0;i<teachers.length;i++) {
							jQuery('#teacher_id').append('<option value="'+teachers[i].teacher_id+'">'+teachers[i].teacher+'</option>');
						};
				  });
			}else{
				jQuery('#teacher_id option[value!=""]').remove();
			}
		},
		delEvent:function(cid){
			//console.log(eid);
			Swal.fire({
			  title: 'Are you sure?',
			  text: "You won't be able to revert this!",
			  icon: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Yes, delete it!'
			}).then((result) => {
			  if(result.value) {
			    Scheduler.confirmToDel(cid);
			  }
			})
		},
		confirmToDel:function(cid){
		  jQuery.post(API_URL,{action:"delevent",cid:cid})
		  .done(function( data ){
		    	if(data.del_status){
				    Swal.fire({
					  icon: 'success',
					  title: 'Event',
					  text: 'Event deleted successfully'
					});
				    $("#kt_datatable").KTDatatable("reload");
		    	}
		  });
		}
	};
	$(document).ready(function($){ 
		Scheduler.init(); 
		//Scheduler.getScheduleList();
	});
})(jQuery);
function EventFilter(data){
	if(data == ""){
		window.location.href='scheduler';
	}else{
		window.location.href='scheduler-'+data;
	}
}
/*Scheduler = function() {

	

	return{
		init:function() {
			//importExcel();
			importExcel=function(e){
				$('#importExcel').modal('show');
			}
		}
	}
}();

jQuery(document).ready(function() {
    Scheduler.init();
});*/


