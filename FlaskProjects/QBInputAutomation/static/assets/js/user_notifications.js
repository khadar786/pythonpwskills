//"use strict";
var API_URL='api/Service.php';
var addclass='overlay-block rounded';
var event_info={};
var KTCalendarBasic = function() {
    return {
        //main function to initiate the module
        init: function() {
            $('#pmain').addClass(addclass);
            $('#loader').show();
            var todayDate = moment().startOf('day');
            var YM = todayDate.format('YYYY-MM');
            var YESTERDAY = todayDate.clone().subtract(1, 'day').format('YYYY-MM-DD');
            var TODAY = todayDate.format('YYYY-MM-DD');
            var TOMORROW = todayDate.clone().add(1, 'day').format('YYYY-MM-DD');

            var calendarEl = document.getElementById('kt_calendar');
            var calendar = new FullCalendar.Calendar(calendarEl, {
                schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
                plugins: [ 'bootstrap', 'interaction','dayGrid', 'timeGrid','resourceDayGrid','resourceTimeGrid','resourceTimeline','list'],
                themeSystem: 'bootstrap',
                isRTL: KTUtil.isRTL(),
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'listMonth,listWeek,listDay'
                },
                slotWidth: 50,
                height:800,
                contentHeight: 780,
                aspectRatio: 1.5,  // see: https://fullcalendar.io/docs/aspectRatio
                nowIndicator: true,
                now: TODAY + 'T06:00:00', // just for demo
                views: {
                    listMonth: { buttonText: 'Month' },
                    listWeek: { buttonText: 'Week' },
                    listDay: { buttonText: 'Day' }
                },
                defaultView: 'listMonth',
                scrollTime: '05:00',
                //defaultDate: '2020-06-01',
                selectable: true,
                editable: false,
                eventLimit: true, // allow "more" link when too many events
                navLinks: true,
                eventOverlap: true, // will cause the event to take up entire resource height
                events:{
                    url: API_URL,
                    method: 'POST',
                    extraParams: {
                      action: 'usernoti',
                      user_id:user_id,
                      level:level,
                      campus_id:campus_id
                    },
                    success:function(){
                        $('#pmain').removeClass(addclass);
                        $('#loader').hide();
                    },
                    failure: function() {
                      alert('there was an error while fetching events!');
                    }
                },
                eventRender: function(info) {
                    var element = $(info.el);
                    //console.log(element[0].className);
                    if (info.event.extendedProps && info.event.extendedProps.description) {
                        if(element.hasClass('fc-day-grid-event')){
                            element.data('content', info.event.extendedProps.description);
                            element.data('placement', 'top');
                            KTApp.initPopover(element);
                        }else if(element.hasClass('fc-time-grid-event')){
                            element.find('.fc-title').append('<div class="fc-description">' + info.event.extendedProps.description + '</div>');
                        }else if(element.find('.fc-list-item-title').lenght !== 0){
                            element.find('.fc-list-item-title').append('<div class="fc-description">' + info.event.extendedProps.description + '</div>');
                        }

                        var str=element[0].className; 
                        var n=str.search("fc-timeline-event");
                        if(n>=0){
                            //var time=info.event
                            //+"<span class='label label-inline font-weight-bold label-light-danger'></span>"
                            //console.log(info.event);
                            element.data('title', info.event.title);
                            element.data('content', info.event.extendedProps.description);
                            element.data('placement', 'top');
                            element.data('html',true);
                            KTApp.initPopover(element);
                            //console.log('###');
                            // element.find('.fc-title').append('<div class="fc-description">' + info.event.extendedProps.description + '</div>');
                        }
                    }
                },
                eventClick:function(info){
                         event_info={};
                         var eventObj = info.event;
                         var event=eventObj.extendedProps
                         //console.log(event);

                         $('#exampleModalLabel').empty();
                         $('#tableid').empty();
                         //$('#modal-footer').empty();
                         var evt_info='';
                         var btn_info='';
                         event_info=event;
                         $('#exampleModalLabel').html(event_info.event_details.title);
                         $('#startclass').modal('show');

                        evt_info+='<tr><th scope="row">Description</th><td>'+event_info.event_details.description+'</td></tr>';
                        var attachments=event_info.event_details.attachments;
                        var length=Object.keys(attachments).length;
                        if(length>0){
                            evt_info+='<tr><th scope="row" colspan="2">Attachments</th></tr>';
                            for(var i=0;i<length;i++){
                                evt_info+='<tr><td colspan="2"><a href="notifications/'+attachments[i].file_name+'" target="_blank"><span class="label label-warning label-pill label-inline mr-2">'+attachments[i].file_type+'</span></a></td></tr>';
                            }
                        }
                                      
                        $('#tableid').append(evt_info);
                }
            });

            calendar.render();
        },

        startClass: function(){
            //console.log('wroking'+event_info);
            document.getElementById('liveclass').disabled=true;
            var data=event_info.event_details;
            var form = document.createElement("form");
            form.action="teacher-live-class";
            form.method="POST";
            form.target="_self";
            for(var key in data){
              //console.log(key+"=="+data[key]);
              var input = document.createElement("textarea");
              input.name = key;
              input.value = typeof data[key] === "object" ? JSON.stringify(data[key]):data[key];
              form.appendChild(input);
            }
            form.style.display = 'none';
            document.body.appendChild(form);
            form.submit();
        }
    };
}();

jQuery(document).ready(function() {
    KTCalendarBasic.init();
});