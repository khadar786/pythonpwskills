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
                plugins: [ 'bootstrap', 'interaction', 'dayGrid', 'list' ],
                themeSystem: 'bootstrap',
                isRTL: KTUtil.isRTL(),
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek,dayGridDay,listMonth,listWeek,listDay'
                },
                height: 800,
                contentHeight: 780,
                aspectRatio: 3,  // see: https://fullcalendar.io/docs/aspectRatio
                nowIndicator: true,
                now: TODAY + 'T09:25:00', // just for demo
                views: {
                    dayGridMonth: { buttonText: 'month' },
                    dayGridWeek: { buttonText: 'week' },
                    dayGridDay: { buttonText: 'day' },
                    listMonth: { buttonText: 'list month' },
                    listWeek: { buttonText: 'list week' },
                    listDay: { buttonText: 'list day' }
                },

                defaultView: 'dayGridMonth',
                defaultDate: TODAY,
                editable: true,
                eventLimit: true, // allow "more" link when too many events
                navLinks: true,
                events:{
                    url: API_URL,
                    method: 'POST',
                    extraParams: {
                      action: 'fullcalendar'
                    },
                    failure: function() {
                      alert('there was an error while fetching events!');
                    }
                },
                //events: 'http://localhost/shedule_tables/events.php?action=test',
                eventRender: function(info) {
                    var element = $(info.el);

                    if (info.event.extendedProps && info.event.extendedProps.description) {
                        if (element.hasClass('fc-day-grid-event')) {
                            element.data('content', info.event.extendedProps.description);
                            element.data('placement', 'top');
                            KTApp.initPopover(element);
                        } else if (element.hasClass('fc-time-grid-event')) {
                            element.find('.fc-title').append('<div class="fc-description">' + info.event.extendedProps.description + '</div>');
                        } else if (element.find('.fc-list-item-title').lenght !== 0) {
                            element.find('.fc-list-item-title').append('<div class="fc-description">' + info.event.extendedProps.description + '</div>');
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
