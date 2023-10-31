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
                    right: 'resourceTimeGridDay,dayGridMonth,listDay,listWeek,listMonth'
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
                defaultView: 'resourceTimeGridDay',
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
                      level:level
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
                      level:level
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
                    var eventObj = info.event;
                    //console.log(eventObj.title);
                }
            });

            calendar.render();
        }
    };
}();

jQuery(document).ready(function() {
    KTCalendarBasic.init();
});
