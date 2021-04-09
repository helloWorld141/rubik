import sys, os
# add model to sys path so that the below import works regardless where the main program is called
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import helloworld_pb2
import helloworld_pb2_grpc