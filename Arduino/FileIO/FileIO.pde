import processing.serial.*;
import http.requests.*;

Serial myPort;  // The serial port

void setup() {
  // List all the available serial ports:
  printArray(Serial.list());
  // Open the port you are using at the rate you want:
  myPort = new Serial(this, Serial.list()[0], 9600);
}

void draw() {
  while (myPort.available() > 0) {
    delay(100);
    String inBuffer = myPort.readString();   
    if (inBuffer != null) {
      int[] nums = int(split(inBuffer, ','));
      if (nums[0] == 0) {
        System.out.println(nums[1]);
        PostRequest post = new PostRequest("http://taskitplatform.azurewebsites.net/login", "utf-8");
        post.addData("RFID", str(nums[1]));
        post.send();
        System.out.println("Reponse Content: " + post.getContent());
        System.out.println("Reponse Content-Length Header: " + post.getHeader("Content-Length"));
      } else {
        PostRequest post = new PostRequest("http://taskitplatform.azurewebsites.net/asset");
        post.addData("RFID", inBuffer);
        post.send();
        System.out.println("Reponse Content: " + post.getContent());
        System.out.println("Reponse Content-Length Header: " + post.getHeader("Content-Length"));
       
      }
    }
  }
}