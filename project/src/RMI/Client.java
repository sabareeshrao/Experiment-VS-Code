package RMI;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class Client {
    public static void main(String a[]){
        try {
            Registry registry = LocateRegistry.getRegistry("localhost", 1009);
            RemoteInterface stub = (RemoteInterface) registry.lookup("HelloService");
            String response = stub.sayHello();
            System.out.println("response.." + response);
        }catch(Exception e){
            e.printStackTrace();
        }

    }
}
