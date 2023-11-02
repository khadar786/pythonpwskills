//"use strict";
var API_URL='api/Service.php';
var KTCalendarBasic = function() {

    return {
        //main function to initiate the module
        init: function() {
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
                    left: 'prev,next today,resourceTimelineDay,resourceTimelineWeek',
                    center: 'title',
                    right: 'dayGridMonth,listMonth,listDay,listWeek,resourceTimeGridDay'
                },
                slotWidth: 50,
                height:800,
                contentHeight: 780,
                aspectRatio: 1.5,  // see: https://fullcalendar.io/docs/aspectRatio
                nowIndicator: true,
                now: TODAY + 'T06:00:00', // just for demo
                views: {
                    resourceTimeGridDay: { buttonText: 'day' },
                    //resourceTimeGridWeek: { buttonText: 'week' },
                    resourceTimelineDay: { buttonText: 'day' },
                    resourceTimelineWeek: { buttonText: 'week' },
                    dayGridMonth: { buttonText: 'month' },
                    listDay: { buttonText: 'L day' },
                    listWeek: { buttonText: 'L week' },
                    listMonth: { buttonText: 'L month' }

                },
                defaultView: 'dayGridMonth',
                scrollTime: '05:00',
                //defaultDate: '2020-06-01',
                selectable: true,
                editable: false,
                eventLimit: true, // allow "more" link when too many events
                navLinks: true,
                //events: 'http://localhost/shedule_tables/events.php',
                //resourceGroupField: 'class_name',
                /*resources:[
                          { id: 'a', class_name: 'Class XI JV.IIT', title: 'Toppers'},
                          { id: 'b', class_name: 'Class XI JV.IIT', title: 'Rankers'},
                          { id: 'c', class_name: 'Class XI JV.IIT', title: 'Achievers'},
                          { id: 'd', class_name: 'Class XI JV.MPW', title: 'Toppers'},
                          { id: 'e', class_name: 'Class XI JV.MPW', title: 'Rankers'},
                          { id: 'f', class_name: 'Class XI JV.MPW', title: 'Achievers'},
                          { id: 'g', class_name: 'Class XII JV.IIT', title: 'Toppers'},
                          { id: 'h', class_name: 'Class XII JV.IIT', title: 'Rankers'},
                          { id: 'i', class_name: 'Class XII JV.IIT', title: 'Achievers'},
                          { id: 'j', class_name: 'Class XII JV.MPW', title: 'Toppers'},
                          { id: 'k', class_name: 'Class XII JV.MPW', title: 'Rankers'},
                          { id: 'l', class_name: 'Class XII JV.MPW', title: 'Achievers'},
                        ],*/
                //events:'https://fullcalendar.io/demo-events.json?with-resources=2',
                /*eventAfterAllRender: function( view ) {
                    console.log('###');
                    var resources = $('#kt_calendar').fullCalendar('getResources');
                    $.each(resources, function( index, resource ) {
                        var events = $('#kt_calendar').fullCalendar( 'getResourceEvents', resource );
                        console.log(events);
                    });
                },*/
                eventOverlap: true, // will cause the event to take up entire resource height
                resourceAreaWidth: '25%',
                resourceLabelText: 'Class Rooms',
                resources:{
                    url: API_URL,
                    method: 'POST',
                    extraParams: {
                      action: 'resources',
                      user_id:user_id,
                      level:level,
                      class_id:class_id,
                      course_id:course_id
                    },
                    failure: function() {
                      alert('there was an error while fetching events!');
                    }
                },
                /*resources:[{"id":"1","title":"Class XI",
                            "children":[
                                {"id":"s1","title":"JV.IIT Toppers"},
                                {"id":"s2","title":"JV.IIT Rankers"}
                                ]
                            }
                          ],
                events:[
                        {
                            "resourceId":"1","title":"Event 1","start":"2020-06-14","end":"2020-06-14"
                        },
                        {
                          "title":"Sub Event 1","start":"2020-06-14T06:00:00","end":"2020-06-14T07:00:00",
                          "resourceIds": ["s1"]
                        },
                        {
                          "title":"Sub Event 2","start":"2020-06-14T07:00:00","end":"2020-06-14T08:00:00",
                          "resourceIds": ["s2"]
                        },
                        {
                          "title":"Sub Event 3","start":"2020-06-14T08:00:00","end":"2020-06-14T09:00:00",
                          "resourceIds": ["s1"]
                        },
                        {
                          "title":"Sub Event 2","start":"2020-06-14T09:00:00","end":"2020-06-14T10:00:00",
                          "resourceIds": ["s2"]
                        }

                   ],*/
                  //events:[],
                events:{
                    url: API_URL,
                    method: 'POST',
                    extraParams: {
                      action: 'fullcalendar',
                      user_id:user_id,
                      level:level,
                      class_id:class_id,
                      course_id:course_id,
                      campus_id:campus_id
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
                            console.log(info.event);
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
                eventClick: function(info) {
                    if(level==2 || level==1){
                         event_info={};
                         var eventObj = info.event;
                         var event=eventObj.extendedProps
                         //console.log(eventObj);
                         //console.log(event);
                         if(event.date_type=='W'){
                             $('#exampleModalLabel').empty();
                             $('#tableid').empty();
                             $('#modal-footer').empty();
                             
                             var evt_info='';
                             var btn_info='';
                             event_info=event;

                             if(event_info.event_details.eid==7 || event_info.event_details.eid==8){
                               $('#exampleModalLabel').html(event_info.event_details.subject+' '+event_info.event_details.event);
                               $('#startclass').modal('show');

                                var params={
                                  'cid':event_info.event_details.cid,
                                  'user_id':user_id,
                                  'level':level,
                                  'action':'event_details'
                                };
                                
                                jQuery.post(API_URL,params).done(function(response) {
                                    //console.log(response);
                                    var result=response.data;
                                    evt_info+='<tr><th scope="row">Date</th><td>'+event_info.event_details.start_date+'</td></tr>';
                                    evt_info+='<tr><th scope="row">Teacher</th><td>'+event_info.event_details.teacher+'</td></tr>';
                                    evt_info+='<tr><th scope="row">Section</th><td>'+event_info.event_details.section+'</td></tr>';
                                    evt_info+='<tr><th scope="row">Start</th><td>'+event_info.event_details.stime+'</td></tr>';
                                    evt_info+='<tr><th scope="row">End</th><td>'+event_info.event_details.etime+'</td></tr>';
                                    $('#tableid').append(evt_info);

                                    if(result.comming_soon==false && result.is_running==false){
                                        btn_info+='<button class="btn btn-primary font-weight-bold">Completed</button>';
                                    }else if(result.comming_soon==true && result.is_running==false){
                                        btn_info+='<button class="btn btn-info font-weight-bold">Comming Soon</button>';
                                    }else if(result.comming_soon==false && result.is_running==true){
                                        btn_info+='<button class="btn btn-danger font-weight-bold" onclick="KTCalendarBasic.startClass()" id="liveclass">Live Class</button>';
                                    }

                                    $('#modal-footer').append(btn_info);

                                });
                             }else if(event_info.event_details.eid==4 || event_info.event_details.eid==11 || event_info.event_details.eid==10){
                               $('#exampleModalLabel').html(event_info.event_details.description);
                               $('#startclass').modal('show');
                               var params={
                                  'cid':event_info.event_details.cid,
                                  'user_id':user_id,
                                  'level':level,
                                  'test_id':event_info.event_details.test_id,
                                  'action':'exam_details'
                                };

                                evt_info+='<tr><th scope="row">Date</th><td>'+event_info.event_details.start_date+'</td></tr>';
                                evt_info+='<tr><th scope="row">Start</th><td>'+event_info.event_details.stime+'</td></tr>';
                                evt_info+='<tr><th scope="row">End</th><td>'+event_info.event_details.etime+'</td></tr>';
                                $('#tableid').append(evt_info);

                                /*jQuery.post(API_URL,params).done(function(response) {

                                });*/
                             }
                             
                         }
                    }
                }
            });

            calendar.render();
        },
        startClass: function(){
            //console.log('wroking'+event_info);
            document.getElementById('liveclass').disabled=true;
            var data=event_info.event_details;
            var form = document.createElement("form");

            if(level==1){
              form.action="join-live-class";
            }else{
              form.action="teacher-live-class";
            }

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
