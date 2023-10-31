alert('dfas');
return false;
var app = angular.module("MyApp", ["ui.bootstrap", "ngSanitize"]);

app.controller("MyCtrl", function($scope, $http, $timeout) {

    $scope.loading = true;
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $scope.user_id = user_id;
    $scope.level = level;
    //var validation;    
    $scope.theoryqestions = {};
    $scope.theoryques = []; 


    $scope.models = [{}];
    $scope.addRow = function() {
        $scope.models.push({});
    };
    $scope.Remove = function (index) {
        //alert(index);
        $scope.models.splice(index, 1);
    };

    //var form = KTUtil.getById('createForm');
    //var editform = KTUtil.getById('editForm');
    var API = "api/TheoryService.php";
    $scope.loader = false;

     /* Notifications */
     $scope.notify_options = {
        icon: 'glyphicon glyphicon-warning-sign',
        title: 'Error',
        message: '',
        type: 'danger',
        spacing: 10,
        z_index: 9999,
        timer: 1000,
    };
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
    };

    $scope.saveData = function() {
        alert('dasdf');
        // let error = 0;
        //     for(j=1; j<=$scope.models.length; j++) {
       
        //         if ($("#question" + j).val() == "") {
        //           $("#question" + j).addClass("border border-danger");
        //           error++;
        //         } else {
        //           $("#question" + j).removeClass("border border-danger");
        //         }
        
        //         if ($("#answer" + j).val() == "") {
        //             $("#answer" + j).addClass("border border-danger");
        //             error++;
        //         } else {
        //             $("#answer" + j).removeClass("border border-danger");
        //         }
        //         //Options
        //         if ($("#ans1" + j).val() == "") {
        //             $("#ans1" + j).addClass("border border-danger");
        //             error++;
        //         } else {
        //             $("#ans1" + j).removeClass("border border-danger");
        //         }

        //         if ($("#ans2" + j).val() == "") {
        //             $("#ans2" + j).addClass("border border-danger");
        //             error++;
        //         } else {
        //             $("#ans2" + j).removeClass("border border-danger");
        //         }

        //         if ($("#ans3" + j).val() == "") {
        //             $("#ans3" + j).addClass("border border-danger");
        //             error++;
        //         } else {
        //             $("#ans3" + j).removeClass("border border-danger");
        //         }

        //         if ($("#ans4" + j).val() == "") {
        //             $("#ans4" + j).addClass("border border-danger");
        //             error++;
        //         } else {
        //             $("#ans4" + j).removeClass("border border-danger");
        //         }

        //         if ($("#ans5" + j).val() == "") {
        //             $("#ans5" + j).addClass("border border-danger");
        //             error++;
        //         } else {
        //             $("#ans5" + j).removeClass("border border-danger");
        //         }
        //         //Options End

        //         if ($("#solution" + j).val() == "") {
        //             $("#solution" + j).addClass("border border-danger");
        //             error++;
        //         } else {
        //             $("#solution" + j).removeClass("border border-danger");
        //         }
                
                
        //     }

        //     if (error > 0) {
        //         Swal.fire({
        //             icon: "error",
        //             title: "Viva Questions",
        //             text: "Please fill the required details!",
        //         });
        //     }

            // if(error == 0){
            //     $('#savebutton').attr('disabled', true);
            //     //$('#overlay_id').addClass('overlay overlay-block');
            //     $('#loader').show();
            //     let form = $("#createForm")[0];
            //     var formData = new FormData(form);
            //     formData.append('user_id', $scope.user_id);                
            //     formData.append('action', 'saveThoryQuestion');

            //     axios({
            //         method: 'post',
            //         url: API,
            //         data: formData,
            //         headers: {
            //             'Content-Type': 'multipart/form-data'
            //         }
            //     }).then(function(response) {
            //         $('#overlay_id').removeClass('overlay overlay-block');
            //         $('#loader').hide();
            //         console.log(response);
            //         $('#savebutton').attr('disabled', false);
            //         if (response.data.error == false) {
            //             $("#createModal").modal('hide');
            //             $scope.loader = false;
            //             /* ****** */
            //             $scope.notify_options.type = 'success';
            //             $scope.notify_options.title = '';
            //             $scope.notify_options.message = "Saved successfully";
            //             $scope.notifyAlerts();
            //             /* ***** */
            //             $scope.getList();
            //             $('#createForm').trigger("reset");
            //             $scope.loader = false;
            //             if ($scope.$root.$$phase != "$apply" && $scope.$root.$$phase != "$digest") {
            //                 $scope.$apply();
            //             }
            //         } else {
            //             /* ****** */
            //             $scope.notify_options.type = 'warning';
            //             $scope.notify_options.title = '';
            //             $scope.notify_options.message = response.data.message;
            //             $scope.notifyAlerts();
            //             /* ***** */

            //         }
            //     }).catch(error => {
            //         console.log(error.response)
            //         $('#overlay_id').removeClass('overlay overlay-block');
            //         $('#loader').hide();
            //     });
                    
            // }
    };
});