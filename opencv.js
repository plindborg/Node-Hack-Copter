var cv = require('opencv')

cv.readImage("test.jpg", function(err, im){
im.detectObject("haarcascade_frontalface_alt.xml", {}, function(err, faces){
	for (var i=0;i<faces.length; i++){
		var x = faces[i]
  	im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
	}
  im.save('./out.jpg');
	});
});

