var socket = io();

socket.on('connect', function() {
  console.log('connected to the server');

});

socket.on('disconnect', function() {
  console.log('Disconnected from server')
});

socket.on('newmessage', function(message) {
  console.log(message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});

socket.on('newlocationmessage', function(message){
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My Current Location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
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
