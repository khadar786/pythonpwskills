"use strict";
var API_URL='api/Adminservice.php';
var usertable='';
var user_status='';
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
						title: 'WRITTEN STATUS',
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
						field: 'start_date',
						title: 'Test time',
						width: 200,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							var written_status="";
							written_status+='<span class="label label-lg font-weight-bold label-light-info label-inline mb-1 mr-1">'+data.start_date+'</span> TO <span class="label label-lg font-weight-bold label-light-info label-inline mb-1 mr-1">'+data.end_date+'</span>';
							return written_status;
						}
				},
				{
						field: 'is_extended',
						title: 'Time extended',
						width: 90,
						type: 'string',
						selector: false,
						textAlign: 'left',
						template: function(data) {
							var written_status="";
							if(data.user_test_id>0){
								written_status+='<span class="label label-lg font-weight-bold label-light-primary label-inline mb-1 mr-1"><i class="fa fa-info-circle text-success mr-1"></i>'+data.is_time_extended+'</span>&nbsp;';
							}else{
								written_status+='<span class="label label-lg font-weight-bold label-light-primary label-inline mb-1 mr-1">'+data.is_time_extended+'</span>';
							}

							return written_status;
						}
				},
				{
						field: 'Actions',
						title: 'Actions',
						sortable: false,
						overflow: 'visible',
						autoHide: false,
						template: function(data){

							if(data.is_test_finished==0 && data.user_test_id>0){
								return '\<a href="javascript:void(0);" class="label label-primary label-inline font-weight-bolder mr-2" onclick="KTUserList.confirmSubmitTest('+data.user_test_id+',\''+ data.email +'\','+data.test_id+');">Submit</a><a href="javascript:void(0);" class="label label-danger label-inline font-weight-bolder mr-2" onclick="KTUserList.loginTestData('+data.user_id+',\''+data.first_name+'\',\''+ data.email +'\','+data.test_id+');">Login & Test Data</a>\
									\<a href="javascript:void(0);" class="btn btn-sm btn-default btn-text-primary btn-hover-primary btn-icon mr-2" title="Edit" onclick="KTUserList.extendUserTime('+data.user_test_id+','+data.test_id+',\''+ data.email +'\',\''+ data.start_date +'\',\''+ data.end_date +'\');">\
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
		                       ';
							}else{
								return '\<a href="javascript:void(0);" class="label label-danger label-inline font-weight-bolder mr-2" onclick="KTUserList.loginTestData('+data.user_id+',\''+data.first_name+'\',\''+ data.email +'\','+data.test_id+');">Login & Test Data</a>\
		                       ';
							}
						}
					}
			]
		});
	}

	return {
		init: function () {
			userlist();
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
		}
	};
}();

jQuery(document).ready(function () {
	KTUserList.init();
});