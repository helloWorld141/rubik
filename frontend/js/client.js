const { HelloRequest } = require('./model/helloworld_pb.js');
const { GreeterClient } = require('./model/helloworld_grpc_web_pb.js');

var greeterClient = new GreeterClient('http://localhost:8080');
// TODO: seems like js code can't connect directly to the gRPC server but has to go through a proxy
// https://github.com/grpc/grpc-web/tree/master/net/grpc/gateway/examples/helloworld
var request = new HelloRequest();
request.setName('You');
console.log("test client");

greeterClient.sayHello(request, {}, (err, response) => {
    console.log("Response from server:");
    if (err) {
        console.log(err);
    } else {
        console.log(response.getMessage());
    }
});