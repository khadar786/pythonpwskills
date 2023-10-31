var Students;
var API_URL='api/Service.php';
var loader_fa='<i class="fa fa-circle-o-notch fa-spin" style="font-size:15px"></i>';
var class_id=course_id=subject_id='';
(function($) {
	Students={
		init:function() {
			var validation;

			//Schedule list
			var datatable=$('#kt_datatable').KTDatatable({
				// datasource definition
				data: {
					type: 'remote',
					source: {
						read: {
							url:API_URL,
							params:{action:'meetingslist'},
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
					input: $('#teachersearch'),
					delay: 400,
					key: 'teachersearch'
				},
				// columns definition
				columns: [
					{
						field: 'bbmid',
						title: 'ID',
						sortable: 'desc',
						width: 40,
						type: 'number',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.bbmid +'</span>';
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
						field: 'meeting_id',
						title: 'Meeting ID',
						sortable: 'asc',
						width: 100,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							var output = '';
							if (data.meeting_id !=null) {
								output = '<span class="font-weight-bolder">'+data.meeting_id+'</span>';
							}else{
								output = '--';
							}
							return output;
						}
					},
					{
						field: 'meeting_desc',
						title: 'Meeting Desc',
						sortable: 'asc',
						width: 100,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							var output = '';
							if (data.meeting_desc !=null) {
								output = '<span class="font-weight-bolder text-primary mb-0">'+data.meeting_desc+'</span>';
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
						field: 'Actions',
						title: 'Actions',
						sortable: false,
						width: 130,
						overflow: 'visible',
						autoHide: false,
						template: function(data){
							var output = '';
							if(data.meeting_url != ''){
							 output =  '\
		                        <a href="'+data.meeting_url+'" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon mr-2" title="Download">\
									<i class="icon-2x text-dark-50 flaticon-download"></i>\
		                        </a>\
		                       ';
	                       }else{
	                       		output = '--';
	                       }
	                       return output;
						}
					}
				]
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