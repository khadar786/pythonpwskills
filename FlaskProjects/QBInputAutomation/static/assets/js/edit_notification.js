//Custom Test App
var loader_fa='<i class="fas fa-spinner fa-spin" style="font-size:15px"></i>';
var API_URL='api/Service.php';
var class_id='';
var addcls='overlay-block rounded';
(function($){
AddNotification={
	init:function(){
		addnotification=KTUtil.getById('addnotification');

		_validation=FormValidation.formValidation(addnotification,
			{
				fields:{
     				usertype:{
						validators: {
							choice: {
						      min:1,
						      max:3,
						      message: 'Please check at least 1 and maximum 2 options'
						     }
						}
					},
					title:{
						validators: {
							notEmpty: {
								message: 'Title is required'
							}
						}
					},
					description: {
						validators: {
							notEmpty: {
								message: 'Description is required'
							}
						}
					},
					send: {
						validators: {
							notEmpty: {
								message: 'Schedule Post is required'
							}
						}
					}
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap()
				}
			}
		);

		$('#addbtn').on('click',function(e){
			e.preventDefault();
			_validation.validate().then(function(status){
				//var usertype=addnotification.querySelector('[id="all"]').value;
				//console.log("$$$$$$"+usertype);
				
				//console.log("$$$$$$"+$('#all').checked);
				// $('input[name="usertype"]:checked').each(function() {
				//    console.log(this.value);
				// });
				var usertype='all';
				var selectall='N';
				var usertype_list=[];
				var class_id='';
				var error='';
				var class_id=addnotification.querySelector('[name="class_id"]').value;
				var sections=$('#section_id').val();
				var send=$("input[name='send']:checked").val();
				
				if($('#students').is(":checked"))
				{
				  usertype=$('#students').val();
				  usertype_list.push(usertype);
				}

				if($('#teachers').is(":checked"))
				{
				  usertype=$('#teachers').val();
				  usertype_list.push(usertype);
				}

				if(usertype==1 || usertype==2){
					if(class_id=='' || class_id=='undefined'){
						error+='<p style="color:red;">Class is required</p>';
					}

					if(sections.length==0){
						error+='<p style="color:red;">Sections is required</p>';
					}
				}else{
					selectall='Y';
				}

				if(error!=''){
					Swal.fire({
					  icon: 'error',
					  title: 'Please fix below error',
					  html: error
					});
					return;
				}

				if(status=='Valid'){
					$('#pmain').addClass(addcls);
					$('#loader').show();
					var formData = new FormData();
					formData.append('selectall',selectall);
					formData.append('usertype_list',usertype_list);
					formData.append('class_id',class_id);
					formData.append('sections',sections);
					formData.append('title',addnotification.querySelector('[name="title"]').value);
					formData.append('description',addnotification.querySelector('[name="description"]').value);
					formData.append('send',send);
					formData.append('postdate',addnotification.querySelector('[name="postdate"]').value);
					var attachments=document.getElementById('attachments').files.length;
					for(var x=0;x<attachments;x++) {
					    formData.append("attachments[]",document.getElementById('attachments').files[x]);
					}
					formData.append('nid',nid);
					formData.append('action','updatenotifi');
					axios({
					  method: 'post',
					  url:API_URL,
					  data: formData,
					  headers: {
            			'Content-Type': 'multipart/form-data'
        			  }
					}).then(function(response){
						if(response.data.nid>0){
							Swal.fire({
							  icon: 'success',
							  title: 'Notification updated successfully!',
							  html: ''
							});
						}
						
						setTimeout(function(){
							$('#pmain').removeClass(addcls);
							$('#loader').hide();
							window.location.replace('edit-notifications-'+nid);
						},1000);
					});
				}
			});
		});

		$('#all').change(function(){
			if(this.checked) {
				$('#students,#teachers').prop('checked',false);
				$('#catlog').hide();
			}
		});

		$('#students').change(function(){
			if(this.checked) {
				$('#all').prop('checked',false);
				$('#catlog').show();
			}
		});

		$('#teachers').change(function(){
			if(this.checked) {
				$('#all').prop('checked',false);
				$('#catlog').show();
			}
		});

		$('#sendnow').change(function(){
			if(this.checked) {
				$('#schedule').hide();
			}
		});

		$('#later').change(function(){
			if(this.checked) {
				$('#schedule').show();
			}
		});

	  $('#postdate').datetimepicker({
	   todayHighlight: true,
	   autoclose: true,
	   pickerPosition: 'bottom-left',
	   todayBtn: true,
	   format: 'yyyy-mm-dd hh:ii'
	  });
	},
	getSections:function(cls_id){
		class_id='';
		if(cls_id!=""){
			class_id=cls_id;
			jQuery.post(API_URL,{action:"sections",class_id:class_id})
			  .done(function( data ) {
			    	//alert( "Data Loaded: " + data );
			    	//console.log(data.subjects);
			    	var sections=data.sections;
					jQuery('#section_id option[value!=""]').remove();
					for (var i=0;i<sections.length;i++) {
						jQuery('#section_id').append('<option value="'+sections[i].section_id+'">Section '+sections[i].section_name+'</option>');
					};
					$('#section_id').selectpicker('refresh');
			  });
		}else{
			jQuery('#section_id option[value!=""]').remove();
		}
	},
	deleteConfirm:function(nid,na_id){
		var filename=$('#'+na_id).attr('data-file');

		Swal.fire({
		  title: 'Are you sure ?',
		  text: "You want to delete this "+filename,
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
		  if(result.value) {
		    AddNotification.deleteFile(nid,na_id);
		  }
		})
	},
	deleteFile:function(nid,na_id){
		//console.log(nid+'---'+na_id);
	  jQuery.post(API_URL,{action:"delattachment",nid:nid,na_id:na_id})
	  .done(function(data){
	     window.location.replace('edit-notifications-'+nid);
	  });
	},
	changeStatus:function(param){
		
	}
}
$(document).ready(function($){
	AddNotification.init(); 
});
})(jQuery);