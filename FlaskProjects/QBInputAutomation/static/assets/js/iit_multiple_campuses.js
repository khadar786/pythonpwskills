var API="api/Adminservice.php";
var TestCopyApp=angular.module('TestCopy',['ui.bootstrap','ngSanitize','angularUtils.directives.dirPagination']);
TestCopyApp.controller('TestCopyCtrl',function($scope,$http,$timeout){
	console.log('###');
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

	$scope.loader=false;
	$scope.notify_options={
        icon: 'glyphicon glyphicon-warning-sign',
        title:'Error',
        message:'',
        type:'danger',
        spacing: 10,
        z_index: 9999,
        timer: 1000,
    };

    $scope.campusList=[];
    $scope.testcomposed_campus=[];
    $scope.fetchCampusDetails=function(){
        $scope.loader=true;
    	var params=$.param({action:'allcampuslist',
    						campus_id:userInfo.campus_id,
    						user_id:userInfo.user_id,
    						level:userInfo.level,
    						course_id:userInfo.course_id,
                            sadmin_tid:testconfig.sadmin_tid
    					   });
    	 $http({method:'POST',url:API,data:params})
    	 .success(function(response, status, headers, config) {
    	 	$scope.campusList=response.campuslist;
            $scope.testcomposed_campus=response.testcomposed_campus;
            setTimeout(()=>{
                $scope.applyDateTimePicker();
            },1000);

            $scope.loader=false;
 		    if($scope.$root.$$phase != "$apply" && $scope.$root.$$phase != "$digest") {
                $scope.$apply();
            }
    	 }).error(function(data, status, headers, config) {
            console.log('error');
            $scope.loader = false;
         });
    }

    $scope.applyDateTimePicker=function(){
        var dateToday = new Date();
        var dateFormat = "yyyy-mm-dd hh:ii";
        $scope.campusList.forEach((value,key)=>{
            jQuery("#start_date_"+value.campus_id)
            .datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                startDate: 0,
                autoclose: true,
                minDate:dateToday
            }).on("changeDate", function(ev) {
                $("#end_date_"+value.campus_id).attr("disabled", false);
                $("#end_date_"+value.campus_id).val("");
                $("#end_date_"+value.campus_id).datetimepicker("setStartDate", $("#start_date_"+value.campus_id).val());
            });

            jQuery("#end_date_"+value.campus_id).datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                validateOnBlur: false,
                autoclose: true,
            });

            if(value.is_published){
                jQuery("#start_date_"+value.campus_id).val(value.start_date);
                jQuery("#end_date_"+value.campus_id).val(value.end_date);

                let totalSelected=0;
                let campusSectionCount=$scope.campusList[key].sections_cnt;
                $scope.campusList[key].classes.forEach((value,key)=>{
                    value.sections.forEach((svalue,seckey)=>{
                        if(svalue.is_selected){
                            totalSelected+=1;
                        }
                    });
                });;

                //console.log(campusSectionCount,totalSelected);
                if(campusSectionCount==totalSelected){
                    $scope.campusList[key].is_selected=true;
                }else{
                    $scope.campusList[key].is_selected=false;
                }
            }
        });
    }
    $scope.selectAllCampus=function(){

        if($scope.allcampus){
            $scope.campusList.forEach((value,cpkey)=>{
                $scope.campusList[cpkey].is_selected=true;

                $scope.campusList[cpkey].classes.forEach((value,ckey)=>{
                    $scope.campusList[cpkey].classes[ckey].sections.forEach((value,skey)=>{
                        $scope.campusList[cpkey].classes[ckey].sections[skey].is_selected=true;
                    });
                });
            });
        }else{
            $scope.campusList.forEach((value,cpkey)=>{
                $scope.campusList[cpkey].is_selected=false;
                
                $scope.campusList[cpkey].classes.forEach((value,ckey)=>{
                    $scope.campusList[cpkey].classes[ckey].sections.forEach((value,skey)=>{
                        $scope.campusList[cpkey].classes[ckey].sections[skey].is_selected=false;
                    });
                });
            });
        }

		if($scope.$root.$$phase != "$apply" && $scope.$root.$$phase != "$digest") {
	        $scope.$apply();
	    }
    }

    $scope.selectCampusAllSections=function(cpkey){
        if($scope.campusList[cpkey].is_selected){
            angular.forEach($scope.campusList[cpkey].classes,function (value, ckey) { 
                $scope.campusList[cpkey].classes[ckey].sections.forEach((value,skey)=>{
                    $scope.campusList[cpkey].classes[ckey].sections[skey].is_selected=true;
                });
            }); 

        }else{
            angular.forEach($scope.campusList[cpkey].classes,function (value, ckey) { 
                $scope.campusList[cpkey].classes[ckey].sections.forEach((value,skey)=>{
                    $scope.campusList[cpkey].classes[ckey].sections[skey].is_selected=false;
                });
            });
        }

        let allCampus=$.map($scope.campusList,(value,key)=>{
            if(value.sections_cnt>0){
                return true;
            }
        }).length;

        let selectedCampus=$.map($scope.campusList,(value,key)=>{
            if(value.is_selected){
                return true;
            }
        }).length;
        
        //console.log(selectedCampus,$scope.campusList.length);
        if(allCampus==selectedCampus){
            $scope.allcampus=true;
        }else{
            $scope.allcampus=false;
        }

        if($scope.$root.$$phase != "$apply" && $scope.$root.$$phase != "$digest") {
            $scope.$apply();
        }
    }

    $scope.selectClassSections=function(cpkey,ckey){
        //console.log($scope.campusList[cpkey]);
        if($scope.campusList[cpkey].is_selected){
            angular.forEach($scope.campusList[cpkey].classes[ckey],function (value, key) { 
                $scope.campusList[cpkey].classes[ckey].sections.forEach((value,key)=>{
                    $scope.campusList[cpkey].classes[ckey].sections[key].is_selected=true;
                });
            }); 

        }else{
            angular.forEach($scope.campusList[cpkey].classes[ckey],function (value, key) { 
                $scope.campusList[cpkey].classes[ckey].sections.forEach((value,key)=>{
                    $scope.campusList[cpkey].classes[ckey].sections[key].is_selected=false;
                });
            });
        }


    	if($scope.$root.$$phase != "$apply" && $scope.$root.$$phase != "$digest") {
	        $scope.$apply();
	    }
    }

    $scope.selectSection=function(cpkey,ckey,skey){
    	//$scope.campusList[cpkey].classes[ckey].sections[skey].is_selected=false;
        let totalSelected=0;
        let campusSectionCount=$scope.campusList[cpkey].sections_cnt;
        $scope.campusList[cpkey].classes.forEach((value,key)=>{
            //console.log(value);
            value.sections.forEach((svalue,seckey)=>{
                if(svalue.is_selected){
                    totalSelected+=1;
                }
            });
        });;

        
        if(campusSectionCount==totalSelected){
            $scope.campusList[cpkey].is_selected=true;
        }else{
            $scope.campusList[cpkey].is_selected=false;
        }

        let allCampus=$.map($scope.campusList,(value,key)=>{
            if(value.sections_cnt>0){
                return true;
            }
        }).length;

        let selectedCampus=$.map($scope.campusList,(value,key)=>{
            if(value.is_selected){
                return true;
            }
        }).length;
        
        //console.log(selectedCampus,$scope.campusList.length);
        if(allCampus==selectedCampus){
            $scope.allcampus=true;
        }else{
            $scope.allcampus=false;
        }

    	if($scope.$root.$$phase != "$apply" && $scope.$root.$$phase != "$digest") {
	        $scope.$apply();
	    }
    }

    $scope.copyAndPublishTest=function(){
        $scope.loader=true;
        let selectedCnt=0;
        $scope.campusList.forEach((value,cpkey)=>{
            $scope.campusList[cpkey].classes.forEach((value,ckey)=>{
                $scope.campusList[cpkey].classes[ckey].sections.forEach((value,skey)=>{
                    if($scope.campusList[cpkey].classes[ckey].sections[skey].is_selected){
                        selectedCnt++;
                    }
                });
            });
        });

        
        if(selectedCnt==0){
            $scope.loader=false;
            $scope.notify_options.type = 'danger';
            $scope.notify_options.title = 'Error';
            $scope.notify_options.message = "Please select sections.";
            $scope.notifyAlerts();
            return;
        }

        let errors=[];

       /*if($("#assess_csdate_"+globalID+"_"+i).val()==""){
           $("#assess_csdate_"+globalID+"_"+i).addClass('border border-danger');
           isError=true;
       }else{
           $("#assess_csdate_"+globalID+"_"+i).removeClass('border border-danger');
           isError=false;
       }*/

       for(var i=0;i<$scope.campusList.length;i++){
           let campus_id=$scope.campusList[i].campus_id;
           let campus_name=$scope.campusList[i].campus_name;
           let classes=$scope.campusList[i].classes;

           let classCnt=$.map(classes,(value,key)=>{
                return $.map(value.sections,(svalue,skey)=>{
                    if(svalue.is_selected){
                        return true;
                    }
                });
           }).length;

           if(classCnt>0){
               let campusErrors=[];

               if($("#start_date_"+campus_id).val()==""){
                   $("#start_date_"+campus_id).addClass('border border-danger');
                   campusErrors.push({error:'Start date required.'});
               }else{
                   $("#start_date_"+campus_id).removeClass('border border-danger');
               }

               if($("#end_date_"+campus_id).val()==""){
                   $("#end_date_"+campus_id).addClass('border border-danger');
                   campusErrors.push({error:'End date required.'});
               }else{
                   $("#end_date_"+campus_id).removeClass('border border-danger');
               }

                var current_date = moment();

                let start_date=moment($("#start_date_"+campus_id).val());
                let end_date=moment($("#end_date_"+campus_id).val());

                var current_date_format=moment().format('YYYY-MM-d h:mm');
                let start_date_format=moment($("#start_date_"+campus_id).val()).format('YYYY-MM-d h:mm');
                let end_date_format=moment($("#end_date_"+campus_id).val()).format('YYYY-MM-d h:mm');

                if(start_date==end_date){
                    campusErrors.push({error:`<b style="color:red;">Both dates are same, <strong><em>invalid!</em><strong></b>`});
                }else if(start_date>end_date){
                    campusErrors.push({error:`<b style="color:red;">${start_date_format} is greater than ${end_date_format}, <strong><em>invalid!</em><strong></b>`});
                }else if(end_date<current_date){
                    campusErrors.push({error:`<b style="color:red;">${end_date_format} is less than ${current_date_format}, <strong><em>invalid!</em><strong></b>`});
                }

               if(campusErrors.length>0){
                   errors.push({campus:campus_name,errors:campusErrors});
               }
           }else{
               $("#start_date_"+campus_id).removeClass('border border-danger');
               $("#end_date_"+campus_id).removeClass('border border-danger');
           }
       }

       if(errors.length>0){
            $scope.loader=false;
            var errorHtml=`<table class="table table-bordered">`;
               errors.forEach((value,key)=>{
                   errorHtml+=`<tr class="table-danger"><td>${value.campus}</td></tr>`;

                   errorHtml+=`<tr><td>`;
                   value.errors.forEach((evalue,ekey)=>{
                       errorHtml+=`<p>${evalue.error}</p>`;
                   });
                   errorHtml+=`</td></tr>`;
               }); 
            errorHtml+=`</table>`;

            Swal.fire({
                title: "Please fix below errors",
                html: errorHtml,
                icon: "error"
            });

            return;
       }

       /*Swal.fire({
            title: "Are you sure?",
            html: "You want to delete this <b>"+title+"</b>",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then(function(result) {
            if(result.value){
                $scope.confirmDelContent(index);
            }else if(result.dismiss==="cancel"){
                
            }
        });*/

        let selectedCampus=[];
        $scope.campusList.forEach((value,cpkey)=>{

            let classes=value.classes;
            let classCnt=$.map(classes,(value,key)=>{
                return $.map(value.sections,(svalue,skey)=>{
                    if(svalue.is_selected){
                        return true;
                    }
                });
            }).length;

            if(classCnt>0){
                let campus_name=value.campus_name;
                let campus_id=value.campus_id;

                let selectedSections=[];
                $scope.campusList[cpkey].classes.forEach((value,ckey)=>{
                    let class_name=value.class_name;
                    $scope.campusList[cpkey].classes[ckey].sections.forEach((value,skey)=>{
                        if($scope.campusList[cpkey].classes[ckey].sections[skey].is_selected){
                            selectedSections.push({
                                                    campus_id:$scope.campusList[cpkey].classes[ckey].sections[skey].campus_id,
                                                    class_id:$scope.campusList[cpkey].classes[ckey].sections[skey].class_id,
                                                    section_id:$scope.campusList[cpkey].classes[ckey].sections[skey].section_id

                                                 });
                        }
                    });
                });

                let s_date=$("#start_date_"+campus_id).val();
                let e_date=$("#end_date_"+campus_id).val();

                selectedCampus.push({campus_id:campus_id,
                                    campus_name:campus_name,
                                    start_date:s_date,
                                    end_date:e_date,
                                    sections:selectedSections
                                    });
            }
            

            
        });

        //console.log(selectedSections);

        var params=$.param({action:'copyPublishTest',
                            campus_id:userInfo.campus_id,
                            user_id:userInfo.user_id,
                            level:userInfo.level,
                            course_id:userInfo.course_id,
                            test_id:testconfig.test_id,
                            sadmin_tid:testconfig.sadmin_tid,
                            campuses:JSON.stringify(selectedCampus)
                           });
         $http({method:'POST',url:API,data:params})
         .success(function(response, status, headers, config) {
             
             var successHtml=`<table class="table table-bordered">`;
               response.copy_completed_campus.forEach((value,key)=>{
                   successHtml+=`<tr class="table-success"><td>${value.campus_name}</td></tr>`;
               }); 
            successHtml+=`</table>`;

            Swal.fire({
                title: "Success",
                html: successHtml,
                icon: "success"
            });

             $scope.loader=false;
             $scope.fetchCampusDetails();    
             if($scope.$root.$$phase != "$apply" && $scope.$root.$$phase != "$digest") {
                $scope.$apply();
             }
         }).error(function(data, status, headers, config) {
            console.log('error');
            $scope.loader = false;
         });
    }

    $scope.updatePublishTest=function(cpkey){
        $scope.loader=true;

        let campus_id=$scope.campusList[cpkey].campus_id;
        let campus_name=$scope.campusList[cpkey].campus_name;
        let selectedCnt=0;
        $scope.campusList[cpkey].classes.forEach((value,ckey)=>{
            $scope.campusList[cpkey].classes[ckey].sections.forEach((value,skey)=>{
                if($scope.campusList[cpkey].classes[ckey].sections[skey].is_selected){
                    selectedCnt++;
                }
            });
        });

        
        if(selectedCnt==0){
            $scope.loader=false;
            $scope.notify_options.type = 'danger';
            $scope.notify_options.title = 'Error';
            $scope.notify_options.message = `Please select sections in ${campus_name}`;
            $scope.notifyAlerts();
            return;
        }

       let errors=[];
       let classes=$scope.campusList[cpkey].classes;

       let classCnt=$.map(classes,(value,key)=>{
            return $.map(value.sections,(svalue,skey)=>{
                if(svalue.is_selected){
                    return true;
                }
            });
       }).length;

       if(classCnt>0){
           let campusErrors=[];

           if($("#start_date_"+campus_id).val()==""){
               $("#start_date_"+campus_id).addClass('border border-danger');
               campusErrors.push({error:'Start date required.'});
           }else{
               $("#start_date_"+campus_id).removeClass('border border-danger');
           }

           if($("#end_date_"+campus_id).val()==""){
               $("#end_date_"+campus_id).addClass('border border-danger');
               campusErrors.push({error:'End date required.'});
           }else{
               $("#end_date_"+campus_id).removeClass('border border-danger');
           }

            var current_date = moment();

            let start_date=moment($("#start_date_"+campus_id).val());
            let end_date=moment($("#end_date_"+campus_id).val());

            var current_date_format=moment().format('YYYY-MM-d h:mm');
            let start_date_format=moment($("#start_date_"+campus_id).val()).format('YYYY-MM-d h:mm');
            let end_date_format=moment($("#end_date_"+campus_id).val()).format('YYYY-MM-d h:mm');

            if(start_date==end_date){
                campusErrors.push({error:`<b style="color:red;">Both dates are same, <strong><em>invalid!</em><strong></b>`});
            }else if(start_date>end_date){
                campusErrors.push({error:`<b style="color:red;">${start_date_format} is greater than ${end_date_format}, <strong><em>invalid!</em><strong></b>`});
            }else if(end_date<current_date){
                campusErrors.push({error:`<b style="color:red;">${end_date_format} is less than ${current_date_format}, <strong><em>invalid!</em><strong></b>`});
            }

           if(campusErrors.length>0){
               errors.push({campus:campus_name,errors:campusErrors});
           }
       }else{
           $("#start_date_"+campus_id).removeClass('border border-danger');
           $("#end_date_"+campus_id).removeClass('border border-danger');
       }

       if(errors.length>0){
            $scope.loader=false;
            var errorHtml=`<table class="table table-bordered">`;
               errors.forEach((value,key)=>{
                   errorHtml+=`<tr class="table-danger"><td>${value.campus}</td></tr>`;

                   errorHtml+=`<tr><td>`;
                   value.errors.forEach((evalue,ekey)=>{
                       errorHtml+=`<p>${evalue.error}</p>`;
                   });
                   errorHtml+=`</td></tr>`;
               }); 
            errorHtml+=`</table>`;

            Swal.fire({
                title: "Please fix below errors",
                html: errorHtml,
                icon: "error"
            });

            return;
       }

        let selectedSections=[];
        $scope.campusList[cpkey].classes.forEach((value,ckey)=>{
            let class_name=value.class_name;
            $scope.campusList[cpkey].classes[ckey].sections.forEach((value,skey)=>{

                if($scope.campusList[cpkey].test_id==""){
                    if($scope.campusList[cpkey].classes[ckey].sections[skey].is_selected){
                        selectedSections.push({
                                        campus_id:$scope.campusList[cpkey].classes[ckey].sections[skey].campus_id,
                                        class_id:$scope.campusList[cpkey].classes[ckey].sections[skey].class_id,
                                        section_id:$scope.campusList[cpkey].classes[ckey].sections[skey].section_id,
                                        is_selected:$scope.campusList[cpkey].classes[ckey].sections[skey].is_selected
                                     });
                    }
                }else{
                    selectedSections.push({
                                        campus_id:$scope.campusList[cpkey].classes[ckey].sections[skey].campus_id,
                                        class_id:$scope.campusList[cpkey].classes[ckey].sections[skey].class_id,
                                        section_id:$scope.campusList[cpkey].classes[ckey].sections[skey].section_id,
                                        is_selected:$scope.campusList[cpkey].classes[ckey].sections[skey].is_selected
                                     });
                }
                
            });
        });

        let s_date=$("#start_date_"+campus_id).val();
        let e_date=$("#end_date_"+campus_id).val();
        
        var params=$.param({action:'singleCopyPublishTest',
                            campus_id:campus_id,
                            campus_name:campus_name,
                            user_id:userInfo.user_id,
                            level:userInfo.level,
                            course_id:userInfo.course_id,
                            test_id:testconfig.test_id,
                            sadmin_tid:testconfig.sadmin_tid,
                            start_date:s_date,
                            end_date:e_date,
                            sections:JSON.stringify(selectedSections)
                           });
         $http({method:'POST',url:API,data:params})
         .success(function(response, status, headers, config) {
             
            Swal.fire({
                title:response.campus_name,
                html:"Updated successfully!",
                icon: "success"
            });

             $scope.loader=false;
             $scope.fetchCampusDetails();    
             if($scope.$root.$$phase != "$apply" && $scope.$root.$$phase != "$digest") {
                $scope.$apply();
             }
         }).error(function(data, status, headers, config) {
            console.log('error');
            $scope.loader = false;
         });
    }

    $scope.notifyAlerts = function() {
        $.notify({
            // options
            icon: 'glyphicon glyphicon-warning-sign',
            title: $scope.notify_options.title,
            message: $scope.notify_options.message
        }, {
            // settings
            element: 'body',
            position: null,
            type: $scope.notify_options.type,
            allow_dismiss: $scope.notify_options.allow_dismiss,
            newest_on_top: false,
            showProgressbar: false,
            placement: {
                from: "top",
                align: "right"
            },
            offset: 20,
            spacing: $scope.notify_options.spacing,
            z_index: $scope.notify_options.z_index,
            timer: $scope.notify_options.timer,
            mouse_over: null,
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            }
        });
    }

    $scope.fetchCampusDetails();
});