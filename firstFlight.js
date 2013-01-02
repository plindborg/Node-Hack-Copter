var arDrone = require('ar-drone');
var client  = arDrone.createClient();
var http = require("http");
var cv = require('opencv');

var droneStatus = 'Drone alive'; 
var readyImages = new Array();
var index = 0;

// Get image data from the drone
var pngStream = client.createPngStream();
//pngStream.on('data', console.log);
var face_cascade = new cv.CascadeClassifier("data/haarcascade_frontalface_alt.xml");


pngStream.on('data', function(image){
		//console.log(image);
		try
		{	
			cv.readImage(image, function(err,mat){
				if (mat == null)
					return;
				//mat.detectObject("haarcascade_frontalface_alt.xml", {}, function(err, faces){
				face_cascade.detectMultiScale(mat, function(err, faces){
					console.log('detecting');
      		for (var i=0;i<faces.length; i++){
						console.log("Found face");
						client.animateLeds('doubleMissile', 5,5);
        		var x = faces[i]
        		//mat.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
							
						readyImages[index++] = mat.toBuffer().toString('base64'); 
      		}
   			});
			});
		}
		catch(err)
		{
		
		}
		
		//readyImages[index++] = image.toString('base64'); 
});

// Handle web request
function onRequest(request, response) {
  console.log("Request received.");
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<html><title>test</title><body> <h1>Hello World</h1><p> ");
	for (var i in readyImages)
	{
		response.write("<img src='data:image/png;base64," + readyImages[i] + "'/><br>");
  }	
	response.write("</body></html>");
	response.end();
}

// Create a server
http.createServer(onRequest).listen(8888);


// Lift off
//client.takeoff();




// Print out data from the drone
//client.on('navdata', function(nav) {
//	console.log(nav.demo);
//})

// Get image data from the drone
//var pngStream = client.createPngStream();
//pngStream.on('data', console.log);
/*
// Spin the drone
client
  .after(5000, function() {
    this.clockwise(0.5);
  })

.after(3000, function() {
	this.animateLeds('doubleMissile', 5,5);
	this.stop();
	this.land();
});

/*client
  .after(5000, function() {
    this.clockwise(0.5);
  })

	var pngStream = client.createPngStream();
	pngStream.on('data', console.log);

//	.after(5000,function() {
//		this.animate('flipLeft',15);
//	})
  .after(3000, function() {
		this.animateLeds('doubleMissile', 5,5);
    this.stop();
    this.land();
  });*/
