var API_URL='api/Adminservice.php';
var getSavedData_url = 'st/getSavedData.php';
var OMR_API="https://api.etutor.co/evaluate/omr/response";
var usertable='';
var user_status='';
var courses=[];
var custom_courses=[];
var selected_courses=[];
var unselected_courses=[];
var candidates=[];
var selectedUser={};
var validation;
var validation2;
var part_type='';
var nas_template='';
var form = KTUtil.getById('uploadForm');
var form2 = KTUtil.getById('uploadJEESheet');

var notify_options={
      	icon: 'glyphicon glyphicon-warning-sign',
      	title:'Error',
      	message:'',
      	type:'danger',
      	spacing: 10,
      	z_index: 9999,
      	timer: 1000,
      };


var KTUserList = function () {
	var userlist=function(){
		usertable=$('#kt_datatable').KTDatatable({
			// datasource definition
			data: {
				type: 'remote',
				source: {
					read: {
						url:API_URL,
						params:{action:'testsubscribedlist',
								test_mode:'Offline',
								test_id:testconfig.test_id,
								course_id:testconfig.course_id,
								user_status:user_status
							   },
					},
					
				},
				pageSize: 20, // display 20 records per page
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
				input: $('#usersearch'),
				delay: 500,
				key: 'usersearch'
			},

			// columns definition
			columns:[
				{
					field: 'id',
					title: 'ID',
					sortable: 'desc',
					width: 50,
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
						width: 80,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.first_name +'</span>';
						}
				},
				{
						field: 'email',
						title: 'EMAIL',
						width: 80,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							return '<span class="font-weight-bolder">'+data.email +'</span>';
						}
				},
				{
						field: 'is_test_finished',
						title: 'EXAM STATUS',
						width: 100,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							var written_status="";
							if(data.is_test_finished==1 && data.user_test_id>0){
								written_status+='<span class="label label-lg font-weight-bold label-light-primary label-inline mb-1 mr-1">Finished</span>';
							}else if(data.is_test_finished==0 && data.user_test_id>0){
								written_status+='<span class="label label-lg font-weight-bold label-light-info label-inline mb-1 mr-1">Pending</span>';
							}else{
								written_status+='<span class="font-weight-bolder">Not Started Yet</span>';
							}

							return written_status;
						}
				},
				{
						field: 'score',
						title: 'Score',
						width: 80,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							if(data.is_test_finished==1 && data.user_test_id>0){
								return '<span class="font-weight-bolder">'+data.score+'</span>';
							}else{
								return '<span class="font-weight-bolder">-:-</span>';
							}
							
						}
				},
				{
						field: 'Actions',
						title: 'Actions',
						sortable: false,
						overflow: 'visible',
						autoHide: false,
						template: function(data){
							if(testconfig.test_mode=='Offline' && data.user_test_id>0 && data.is_test_finished==0){

								var btn='';

								if(testconfig.is_neet_new_pattern>0){

									btn='\<a href="javascript:void(0);" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon mr-2" title="Upload OMR Sheet" onclick="KTUserList.uploadOMRSheet('+data.user_id+','+data.user_test_id+',\'A\',\'NAS200\');">\
					                            <span class="svg-icon svg-icon-md">\
													<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
													    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
													        <polygon points="0 0 24 0 24 24 0 24"/>\
													        <path d="M5.85714286,2 L13.7364114,2 C14.0910962,2 14.4343066,2.12568431 14.7051108,2.35473959 L19.4686994,6.3839416 C19.8056532,6.66894833 20,7.08787823 20,7.52920201 L20,20.0833333 C20,21.8738751 19.9795521,22 18.1428571,22 L5.85714286,22 C4.02044787,22 4,21.8738751 4,20.0833333 L4,3.91666667 C4,2.12612489 4.02044787,2 5.85714286,2 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"/>\
													        <path d="M8.95128003,13.8153448 L10.9077535,13.8153448 L10.9077535,15.8230161 C10.9077535,16.0991584 11.1316112,16.3230161 11.4077535,16.3230161 L12.4310522,16.3230161 C12.7071946,16.3230161 12.9310522,16.0991584 12.9310522,15.8230161 L12.9310522,13.8153448 L14.8875257,13.8153448 C15.1636681,13.8153448 15.3875257,13.5914871 15.3875257,13.3153448 C15.3875257,13.1970331 15.345572,13.0825545 15.2691225,12.9922598 L12.3009997,9.48659872 C12.1225648,9.27584861 11.8070681,9.24965194 11.596318,9.42808682 C11.5752308,9.44594059 11.5556598,9.46551156 11.5378061,9.48659872 L8.56968321,12.9922598 C8.39124833,13.2030099 8.417445,13.5185067 8.62819511,13.6969416 C8.71848979,13.773391 8.8329684,13.8153448 8.95128003,13.8153448 Z" fill="#000000"/>\
													    </g>\
													</svg>\
					                            </span>\
			                        		 </a>';

								}else if(testconfig.is_jee_new_pattern>0){
									btn='\<a href="javascript:void(0);" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon mr-5" title="Upload OMR Sheet" onclick="KTUserList.uploadJEEOMRSheet('+data.user_id+','+data.user_test_id+');">\
					                            <span class="svg-icon svg-icon-md">\
													<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
													    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
													        <polygon points="0 0 24 0 24 24 0 24"/>\
													        <path d="M5.85714286,2 L13.7364114,2 C14.0910962,2 14.4343066,2.12568431 14.7051108,2.35473959 L19.4686994,6.3839416 C19.8056532,6.66894833 20,7.08787823 20,7.52920201 L20,20.0833333 C20,21.8738751 19.9795521,22 18.1428571,22 L5.85714286,22 C4.02044787,22 4,21.8738751 4,20.0833333 L4,3.91666667 C4,2.12612489 4.02044787,2 5.85714286,2 Z" fill="#000000" fill-rule="nonzero" opacity="0.3"/>\
													        <path d="M8.95128003,13.8153448 L10.9077535,13.8153448 L10.9077535,15.8230161 C10.9077535,16.0991584 11.1316112,16.3230161 11.4077535,16.3230161 L12.4310522,16.3230161 C12.7071946,16.3230161 12.9310522,16.0991584 12.9310522,15.8230161 L12.9310522,13.8153448 L14.8875257,13.8153448 C15.1636681,13.8153448 15.3875257,13.5914871 15.3875257,13.3153448 C15.3875257,13.1970331 15.345572,13.0825545 15.2691225,12.9922598 L12.3009997,9.48659872 C12.1225648,9.27584861 11.8070681,9.24965194 11.596318,9.42808682 C11.5752308,9.44594059 11.5556598,9.46551156 11.5378061,9.48659872 L8.56968321,12.9922598 C8.39124833,13.2030099 8.417445,13.5185067 8.62819511,13.6969416 C8.71848979,13.773391 8.8329684,13.8153448 8.95128003,13.8153448 Z" fill="#000000"/>\
													    </g>\
													</svg>\
					                            </span>\
			                        		 </a>';
								}else{

								}

								return btn;
							}else{

								if(data.user_test_id>0 && data.is_test_finished==1){
									btn="";

									if(data.is_evaluated=='Y'){
										btn+='\<a href="'+data.omr_sheet+'" class="btn btn-sm btn-default btn-text-info btn-hover-primary btn-icon mr-2" title="View OMR" target="_blank">\
						                            <span class="svg-icon svg-icon-md">\
														<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">\
														    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\
														        <polygon points="0 0 24 0 24 24 0 24"/>\
														        <path d="M6,5 L18,5 C19.6568542,5 21,6.34314575 21,8 L21,17 C21,18.6568542 19.6568542,20 18,20 L6,20 C4.34314575,20 3,18.6568542 3,17 L3,8 C3,6.34314575 4.34314575,5 6,5 Z M5,17 L14,17 L9.5,11 L5,17 Z M16,14 C17.6568542,14 19,12.6568542 19,11 C19,9.34314575 17.6568542,8 16,8 C14.3431458,8 13,9.34314575 13,11 C13,12.6568542 14.3431458,14 16,14 Z" fill="#000000"/>\
														    </g>\
														</svg>\
						                            </span>\
						                        </a>\
						                        <a href="candidate-result-'+data.user_id+'-'+data.user_test_id+'" class="label label-primary label-inline font-weight-bolder mr-1">Review</a>';
									}

									return btn;
								}else{
									return '--';
								}
							}
						}
					}
			]
		});

		validation=FormValidation.formValidation(form,{
                fields: {
                     uploadfile: {
                        validators: {
                            notEmpty: {
                                message: 'File is required'
                            },
                        	file: {
                                extension: 'jpeg,jpg,png',
                                type: 'image/jpeg,image/png',
                                maxSize: 2097152, // 2048 * 1024
                                message: 'The selected file is not valid',
                            }
                        }
                    }

                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        ).on('core.form.valid', function() {
            
        });


        $('#submitBtn').on('click', function (e) {
        	e.preventDefault();
        	validation.validate().then(function(status) {
        		if(status=='Valid'){
				KTUserList.updateOMRSheetResult();
        		}
        	});
        });


        validation2=FormValidation.formValidation(form2,{
                fields: {
                     uploadfile_mcq: {
                        validators: {
                            notEmpty: {
                                message: 'File is required'
                            },
                        	file: {
                                extension: 'jpeg,jpg,png',
                                type: 'image/jpeg,image/png',
                                maxSize: 2097152, // 2048 * 1024
                                message: 'The selected file is not valid',
                            }
                        }
                    },
                    uploadfile_n: {
                        validators: {
                            notEmpty: {
                                message: 'File is required'
                            },
                        	file: {
                                extension: 'jpeg,jpg,png',
                                type: 'image/jpeg,image/png',
                                maxSize: 2097152, // 2048 * 1024
                                message: 'The selected file is not valid',
                            }
                        }
                    }

                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap()
                }
            }
        ).on('core.form.valid', function() {
            
        });

        $('#submitJEEBtn').on('click', function (e) {
        	e.preventDefault();
        	validation2.validate().then(function(status) {
        		if(status=='Valid'){
					KTUserList.updateJEEOMRSheetResult();
        		}
        	});
        });
	}

	return {
		init: function () {
			userlist();
			KTUserList.fetchBatchCandidates();
		},
		onChangeUserStatus:function(status){
			user_status=status;
			if(usertable!=''){
  				usertable.destroy();
  			}
  			userlist();
			//$("#kt_datatable").KTDatatable("reload");
		},
		confirmSubmitTest:function(user_test_id,email,test_id){
			Swal.fire({
			  title: 'Test Submit',
			  html:'Are you sure you want submit the `<strong>'+email+'<strong>` test?',
			  icon: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Confirm'
			}).then((result) => {

			  if(result.value) {
			  	 KTUserList.submitTest(user_test_id,test_id,email);
			  }
			});
		},
		submitTest:function(user_test_id,test_id,email){
			var params={
		  	  	action:"finishtest",
		  	  	user_test_id:user_test_id,
		  	  	test_id:test_id
		  	  };

			  jQuery.post(API_URL,params)
			  .done(function( data ) {
			  		//var result=$.parseJSON(data);
			  		if(data.user_test_updated){
			  			notify_options.title='Success';
			  			notify_options.message='`<strong>'+email+'<strong>` test sumitted successfully';
			  			notify_options.type='success';
			  			 KTUserList.notifyAlerts();
			  			$("#kt_datatable").KTDatatable("reload");
			  		}
			  });
		},
		extendUserTime:function(user_test_id,test_id,email,stime,etime){
			$('#user_email').text('');
			$('#end_date').val('');
			$('#user_email').text(email);
			$('#user_test_id').val(user_test_id);
			$('#test_id').val(test_id);
			$('#uemail').val(email);
			$('#extend_user_time').modal('show');
		},
		updateUserTestTime:function(){
			var duration=parseInt($('#duration').val());
			if(duration>testconfig.duration){
				notify_options.title='Error';
	  			notify_options.message='Exam time('+duration+') mins extention should be less than or equal to the Test time('+testconfig.duration+') mins';
	  			notify_options.type='danger';
	  			KTUserList.notifyAlerts();
				return;
			}

			$('#overlay_block').addClass('overlay overlay-block');
			$('#time_ext_id').show();
			var params={
		  	  	action:"updatetest",
		  	  	user_test_id:$('#user_test_id').val(),
		  	  	test_id:$('#test_id').val(),
		  	  	uemail:$('#uemail').val(),
		  	  	duration:$('#duration').val()
		  	  };

		  	jQuery.post(API_URL,params).done(function(data){
	  			if(data.user_test_updated){
	  				$('#overlay_block').removeClass('overlay overlay-block');
	  				$('#time_ext_id').hide();
	  				$('#extend_user_time').modal('hide');

		  			notify_options.title='Success';
		  			notify_options.message='`<strong>'+data.uemail+'<strong>` end date('+data.new_enddate+') updated successfully';
		  			notify_options.type='success';
		  			KTUserList.notifyAlerts();
		  			$("#kt_datatable").KTDatatable("reload");
		  		}else{
		  			$('#overlay_block').removeClass('overlay overlay-block');
	  				$('#time_ext_id').hide();
	  				$('#extend_user_time').modal('hide');

		  			notify_options.title='Warning';
		  			notify_options.message='Sorry `<strong>Exam<strong>` is running';
		  			notify_options.type='warning';
		  			KTUserList.notifyAlerts();
		  			$("#kt_datatable").KTDatatable("reload");
		  		}
			}).fail(function(data){
				$('#time_ext_id').hide();
				$('#overlay_block').removeClass('overlay overlay-block');
			});
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
		},
		loginTestData:function(user_id,user_name,email,test_id){
			$('#ltd_user_email').text('');
			$('#ltd_user_name').text('');
			$('#ltd_user_email').text(email);
			$('#ltd_user_name').text(user_name);
			$('#ltd_user_id').val(user_id);
			$('#ltd_test_id').val(test_id);
			$('#login_test_data_activity').modal('show');

			var params={
				  	action:"login_test_activity",
				  	user_id:user_id,
				  	test_id:test_id
			};
			jQuery('#login_activity').html("");
			jQuery('#test_activity').html("");
			jQuery('#test_data_activity').html("");
			
			jQuery.post(API_URL,params)
			.done(function( data ) {
				var uld = data.user_login_data;
				jQuery('#login_activity').html("");
				if(uld.length == 0){
					jQuery('#login_activity').append('<tr><td colspan="6"> No Activity Found!</td></tr>');
				}else{
					for (var i = 0; i < uld.length; i++) {
						jQuery('#login_activity').append('<tr><td>'+(i+1)+'</td><td>'+uld[i].login_time+'</td><td>'+uld[i].logout_time+'</td><td>'+uld[i].IP+'</td></td><td>'+uld[i].device_name+'</td><td>'+uld[i].ua_formated+'</td></tr>');
					};
				}
				var ut = data.user_test;
				//console.log(ut);
				jQuery('#test_activity').html("");
				if(ut.length == 0){
					jQuery('#test_activity').append('<tr><td colspan="7"> No Activity Found!</td></tr>');
				}else{
					
					jQuery('#test_activity').append('<tr><td>'+ut.score+'</td><td>'+ut.negative_score+'</td><td>'+ut.attempted_total+'</td><td>'+ut.attempted_correct+'</td><td>'+ut.start_date+'</td><td>'+ut.end_date+'</td><td>'+ut.submited_by+'</td></tr>');
					
				}
				var utd = data.user_test_data;
				var qstatus = ["Not Answered","Visited","Visited","Answered & Saved","Marked for Review","Answered &amp; Marked for Review"];
				var attempted = ["No","Yes"];
				console.log(utd);
				jQuery('#test_data_activity').html("");
				if(utd.length == 0){
					jQuery('#test_data_activity').append('<tr><td colspan="6"> No Activity Found!</td></tr>');
				}else{
					for (var i = 0; i < utd.length; i++) {
						if(utd[i].user_answer == "" && utd[i].is_skipped == 1){
							var qstatus_value = "Skipped";
						}else{
							var qstatus_value = qstatus[utd[i].question_status];
						}
						if(utd[i].question_status == 1){
							var user_score = "";
						}else{
							var user_score = utd[i].user_score;
						}

						jQuery('#test_data_activity').append('<tr><td>'+(i+1)+'</td><td>'+user_score+'</td><td>'+utd[i].user_answer+'</td><td>'+attempted[utd[i].is_attempted]+'</td><td>'+qstatus_value+'</td><td>'+utd[i].qchoice_type+'</td></tr>');
					};
				}
					
			});
		},
		downloadReport:function(){
			var user_id = $('#ltd_user_id').val();
			var test_id = $('#ltd_test_id').val();
			window.location.replace("download-user-login-test-activity-"+user_id+"-"+test_id);
		},
		fetchBatchCandidates:function(){
			var params={
					'action':'alltestsubscribedlist',
					'test_id':testconfig.test_id,
					'course_id':testconfig.course_id
				  };

			axios({
			  method: 'post',
			  url:API_URL,
			  data: params,
			  headers: {
    			'Content-Type': 'multipart/form-data'
			  }
			}).then(function(response){
				if(response.data.candidates.length>0){
					candidates=response.data.candidates;
				}
			}).catch(error => {
     			console.log(error.response.data.error)
  			});
		},
		downLoadSheet:function(){
			window.location.replace("generateomr-"+testconfig.test_id);
		},
		generateOMR:async function(){
			$('#modalOverlay').modal('show');
			$('#omr_count').text(0);
			$('#modalFooterId').hide();
			$('#modalOverlayBlock').addClass('overlay-block');
			$('#modalOverlayLoader').show();

			if(candidates.length>0){
				for(let i=0;i<candidates.length;i++){

					const result=await KTUserList.saveUserOMR(candidates[i].user_id);
					if(result.user_test_id>0){
						candidates[i].is_omr_generate_status=true;

						let omrCount=$.map(candidates,(item,index)=>{
							if(item.is_omr_generate_status){
								return (index+1);
							}
						}).length;

						$('#omr_count').text(omrCount);
						if((i+1)==candidates.length){
							
							setTimeout(()=>{
								$('#modalOverlayLoader').hide();
								$('#modalOverlayBlock').removeClass('overlay-block');
								$('#modalFooterId').show();
								//$('#modalOverlay').modal('hide');
								$("#kt_datatable").KTDatatable("reload");
							},1000);
						}
					}
					//console.log(candidates[i]);
					/*result.then((response)=>{
						console.log(response);
						candidates[i].is_omr_generate_status=true;

						let omrCount=$.map(candidates,(item,index)=>{
							if(item.is_omr_generate_status){
								return (index+1);
							}
						}).length;

						$('#omr_count').text(omrCount);
						if((i+1)==candidates.length){
							
							setTimeout(()=>{
								$('#modalOverlayLoader').hide();
								$('#modalOverlayBlock').removeClass('overlay-block');
								$('#modalFooterId').show();
								//$('#modalOverlay').modal('hide');
							},1000);
						}
					}).catch((err)=>{

					});*/

					
				}
			}
		},
		saveUserOMR:function(user_id){
			return new Promise((resolve,reject)=>{
									let params={
												'action':'generateomr',
												'test_id':testconfig.test_id,
												'user_id':user_id
											   };

									axios({
									  method: 'post',
									  url:API_URL,
									  data: params,
									  headers: {
						    			'Content-Type': 'multipart/form-data'
									  }
									}).then(function(response){
										resolve(response.data);
									}).catch(error => {
     									//console.log(error.response.data.error)
     									reject(error.response.data);
  									});
								});
		},
		uploadOMRSheet:function(user_id,user_test_id,parm_part_type,parm_nas_template){
			$('#uploadOverlayLoader').hide();
			$('#uploadSheetOverlayBlock').removeClass('overlay-block');
			part_type=parm_part_type;
			nas_template=parm_nas_template;
			let userInfo=candidates.find((user)=>user.user_id==user_id);
			selectedUser={...userInfo,user_test_id}
			$('#userName').text(' ('+selectedUser.first_name+') ');
			$('#uploadSheet').modal('show');
		},
		uploadJEEOMRSheet:function(user_id,user_test_id){
			$('#uploadJEEOverlayLoader').hide();
			$('#uploadJEESheetOverlayBlock').removeClass('overlay-block');
			let userInfo=candidates.find((user)=>user.user_id==user_id);
			selectedUser={...userInfo,user_test_id}
			$('#userNameJEE').text(' ('+selectedUser.first_name+') ');
			$('#uploadJEESheet').modal('show');
		},
		updateOMRSheetResult:async function(){
			//console.log(selectedUser);
			const result=await KTUserList.getOMRSheetResult();
			
			if(result.status===200){
				//console.log(result.data);
				//Upload OMR
				KTUserList.uploadUserOMR();
				let params={
							'action':'updateomrresult',
							'test_id':testconfig.test_id,
							'user_id':selectedUser.user_id,
							'user_test_id':selectedUser.user_test_id,
							'part_type':part_type,
							'nas_template':nas_template,
							'data':JSON.stringify(result.data)
						   };
				axios({
				  method: 'post',
				  url:API_URL,
				  data: params,
				  headers: {
	    			'Content-Type': 'multipart/form-data'
				  }
				}).then(function(response){
					/*setTimeout(()=>{
						$('#uploadSheetOverlayBlock').removeClass('overlay-block');
						$('#uploadOverlayLoader').hide();
					},2000);*/
					if(response.data.is_test_finished){
						$('#uploadSheet').modal('hide');
						$('#kt_datatable').KTDatatable().reload();

						notify_options.type='success';
						notify_options.title=selectedUser.first_name+" OMR Sheet";
						notify_options.message='OMR sheet updated successfully';
						KTUserList.notifyAlerts();
					}

					$('#uploadSheetOverlayBlock').removeClass('overlay-block');
					$('#uploadOverlayLoader').hide();

				}).catch(error => {
	     			$('#uploadSheetOverlayBlock').removeClass('overlay-block');
					$('#uploadOverlayLoader').hide();
	  			});

			}else{
				$('#uploadSheetOverlayBlock').removeClass('overlay-block');
				$('#uploadOverlayLoader').hide();
			}
		},
		getOMRSheetResult:function(){
			$('#uploadSheetOverlayBlock').addClass('overlay-block');
			$('#uploadOverlayLoader').show();
			const formData = new FormData();
			formData.append("images",document.getElementById('uploadfile').files[0]);
			formData.append("config",nas_template);
			
			const promise= new Promise((resolve,reject)=>{
								axios({
								  method: 'post',
								  url:OMR_API,
								  data: formData,
								  headers: {
					    			'Content-Type': 'multipart/form-data'
								  }
								}).then(function(response){
									resolve(response);
									/*setTimeout(()=>{
										$('#uploadSheetOverlayBlock').removeClass('overlay-block');
										$('#uploadOverlayLoader').hide();
									},2000);*/
								}).catch(error => {
					     			reject(error.response);
					  			});
						});

			return promise;
		},
		uploadUserOMR:function(){
			const formData = new FormData();
			formData.append("uploadfile",document.getElementById('uploadfile').files[0]);
			formData.append("user_test_id",selectedUser.user_test_id);
			formData.append("action","uploadomr");

			axios({
			  method: 'post',
			  url:API_URL,
			  data: formData,
			  headers: {
    			'Content-Type': 'multipart/form-data'
			  }
			}).then(function(response){

			}).catch(error => {
 				
			});
		},
		updateJEEOMRSheetResult:async function(){
			//console.log(selectedUser);
			const resultMCQ=await KTUserList.getJEEOMRSheetResult('MCQ');
			if(resultMCQ.status===200){
				//Upload OMR
				//KTUserList.uploadJEEUserOMR('MCQ');

				const resultN=await KTUserList.getJEEOMRSheetResult('N');
				if(resultN.status===200){
					//Upload OMR
					KTUserList.uploadJEEUserOMR('N');

					let params={
							'action':'updateomrresult',
							'test_id':testconfig.test_id,
							'user_id':selectedUser.user_id,
							'user_test_id':selectedUser.user_test_id,
							'part_type':part_type,
							'nas_template':nas_template,
							'mcqdata':JSON.stringify(resultMCQ.data),
							'ndata':JSON.stringify(resultN.data)
						   };

					axios({
					  method: 'post',
					  url:API_URL,
					  data: params,
					  headers: {
		    			'Content-Type': 'multipart/form-data'
					  }
					}).then(function(response){
						/*setTimeout(()=>{
							$('#uploadJEESheetOverlayBlock').removeClass('overlay-block');
							$('#uploadJEEOverlayLoader').hide();
						},2000);
						
						if(response.data.is_test_finished){
							$('#uploadJEESheet').modal('hide');
							$('#kt_datatable').KTDatatable().reload();

							notify_options.type='success';
							notify_options.title=selectedUser.first_name+" OMR Sheet";
							notify_options.message='OMR sheet updated successfully';
							KTUserList.notifyAlerts();
						}

						$('#uploadJEESheetOverlayBlock').removeClass('overlay-block');
						$('#uploadJEEOverlayLoader').hide();*/

					}).catch(error => {
		     			$('#uploadJEESheetOverlayBlock').removeClass('overlay-block');
						$('#uploadJEEOverlayLoader').hide();
		  			});

				}else{
					$('#uploadJEESheetOverlayBlock').removeClass('overlay-block');
					$('#uploadJEEOverlayLoader').hide();
				}

			}else{
				$('#uploadJEESheetOverlayBlock').removeClass('overlay-block');
				$('#uploadJEEOverlayLoader').hide();
			}
			/*
			
			if(result.status===200){
				//console.log(result.data);
				//Upload OMR
				KTUserList.uploadJEEUserOMR();
				let params={
							'action':'updateomrresult',
							'test_id':testconfig.test_id,
							'user_id':selectedUser.user_id,
							'user_test_id':selectedUser.user_test_id,
							'part_type':part_type,
							'nas_template':nas_template,
							'data':JSON.stringify(result.data)
						   };
				axios({
				  method: 'post',
				  url:API_URL,
				  data: params,
				  headers: {
	    			'Content-Type': 'multipart/form-data'
				  }
				}).then(function(response){
					setTimeout(()=>{
						$('#uploadSheetOverlayBlock').removeClass('overlay-block');
						$('#uploadOverlayLoader').hide();
					},2000);
					if(response.data.is_test_finished){
						$('#uploadSheet').modal('hide');
						$('#kt_datatable').KTDatatable().reload();

						notify_options.type='success';
						notify_options.title=selectedUser.first_name+" OMR Sheet";
						notify_options.message='OMR sheet updated successfully';
						KTUserList.notifyAlerts();
					}

					$('#uploadSheetOverlayBlock').removeClass('overlay-block');
					$('#uploadOverlayLoader').hide();

				}).catch(error => {
	     			$('#uploadSheetOverlayBlock').removeClass('overlay-block');
					$('#uploadOverlayLoader').hide();
	  			});

			}else{
				$('#uploadSheetOverlayBlock').removeClass('overlay-block');
				$('#uploadOverlayLoader').hide();
			}*/
		},
		getJEEOMRSheetResult:function(partType){
			$('#uploadJEESheetOverlayBlock').addClass('overlay-block');
			$('#uploadJEEOverlayLoader').show();
			const formData = new FormData();

			if(partType=='MCQ'){
				part_type='A';
				nas_template='NAS90MCQ';
				formData.append("images",document.getElementById('uploadfile_mcq').files[0]);
				formData.append("config",nas_template);
			}else{
				part_type='B';
				nas_template='NAS90N';
				formData.append("images",document.getElementById('uploadfile_n').files[0]);
				formData.append("config",nas_template);
			}
			
			
			const promise= new Promise((resolve,reject)=>{
								axios({
								  method: 'post',
								  url:OMR_API,
								  data: formData,
								  headers: {
					    			'Content-Type': 'multipart/form-data'
								  }
								}).then(function(response){
									resolve(response);
									/*setTimeout(()=>{
										$('#uploadSheetOverlayBlock').removeClass('overlay-block');
										$('#uploadOverlayLoader').hide();
									},2000);*/
								}).catch(error => {
					     			reject(error.response);
					  			});
						});

			return promise;
		},
		uploadJEEUserOMR:function(){
			const formData = new FormData();
			formData.append("uploadfile",document.getElementById('uploadfile').files[0]);
			formData.append("user_test_id",selectedUser.user_test_id);
			formData.append("action","uploadomr");

			axios({
			  method: 'post',
			  url:API_URL,
			  data: formData,
			  headers: {
    			'Content-Type': 'multipart/form-data'
			  }
			}).then(function(response){

			}).catch(error => {
 				
			});
		}
	};
}();

jQuery(document).ready(function () {
	KTUserList.init();
});