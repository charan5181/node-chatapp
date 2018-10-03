var socket = io();


function scroll_bottom() {
  var messages = jQuery('#messages');
  //Getting last list item in the selector
  var newmessage = messages.children('li:last-child');
  var clientHeight = messages.prop('clientHeight');
  var scrollHeight = messages.prop('scrollHeight');
  var scrollTop = messages.prop('scrollTop');
  //Getting the heights of last and prev message
  var newmessageHeight = newmessage.innerHeight();
  var lastmessageHeight = newmessage.prev().innerHeight();
  if (scrollTop + clientHeight + newmessageHeight + lastmessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }

}

socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server')
});


socket.on('updateuserList', function (users) {
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});


socket.on('newmessage', function(message) {
  var formattedtime = moment(message.createdAt).format('h:mm a');
  //using Mustache Template engine
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedtime
  });

  jQuery('#messages').append(html);
  scroll_bottom();


});

socket.on('newlocationmessage', function(message) {

  var formattedtime = moment(message.createdAt).format('h:mm:a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedtime
  });

  jQuery('#messages').append(html);
  scroll_bottom();

});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  var namemessageset = jQuery('[name=message]');
  socket.emit('createmessage', {
    from: 'User',
    text: namemessageset.val()
  }, function(data) {
    console.log('got it from server', data);
    namemessageset.val('');
  });
});

var locationbutton = jQuery('#send-location');
locationbutton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by Browser');
  }

  locationbutton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(position) {
    locationbutton.removeAttr('disabled').text('Send location');
    socket.emit('createlocationmessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    locationbutton.removeAttr('disabled').text('Send location');
    return alert('Unable to fetch Location');
  });

});
