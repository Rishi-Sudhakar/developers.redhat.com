/**
 * @file
 * Javascript Countdown Component
 * Provides a countdown to reveal the call to action.
 * Also see https://codepen.io/SitePoint/pen/MwNPVq,
 * https://www.techrepublic.com/article/convert-the-local-time-to-another-time-zone-with-this-javascript/
 */

(function ($, Drupal) {

  function toggleCountdownAndCTA(clock) {
    $(clock).next().removeClass('hide');
    $(clock).addClass('hide');
  }

  function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date().toLocaleString('en-US', {timeZone: 'America/New_York'}));
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }

  function initializeClock(clock, endtime) {
    var daysSpan = clock.find('.days span');
    var hoursSpan = clock.find('.hours span');
    var minutesSpan = clock.find('.minutes span');
    var secondsSpan = clock.find('.seconds span');

    function updateClock(clock) {
      var t = getTimeRemaining(endtime);
      daysSpan.html(t.days);
      hoursSpan.html(('0' + t.hours).slice(-2));
      minutesSpan.html(('0' + t.minutes).slice(-2));
      secondsSpan.html(('0' + t.seconds).slice(-2));

      if (t.total <= 0) {
        clearInterval(timeinterval);
        toggleCountdownAndCTA(clock);
      }
    }

    updateClock(clock);
    var timeinterval = setInterval(updateClock, 1000, clock);
  }

  Drupal.behaviors.rhd_CtaCountdown = {
    attach: function (context, settings) {
      $('.assembly-type-call_to_action.has-countdown', context).once('rhdCTACountdown').each(function (){
        var deadline = new Date(Date.parse(settings.rhd_assemblies.countdown_date)).toUTCString();
        var startingOffsetTime = getTimeRemaining(deadline);
        var clock = $('.rhd-c-countdown', $(this));

        if (startingOffsetTime.total == 0) {
          toggleCountdownAndCTA(clock);
        } else {
          $(clock).removeClass('hide');
          initializeClock( clock, deadline);
        }
      });
    }
  }

})(jQuery, Drupal);
