import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class Client {
    public static void main(String[] args) {
        try {
            // Connect to registry on localhost, port 1099
            Registry registry = LocateRegistry.getRegistry("localhost", 1099);

            // Lookup remote object by name
            Hello stub = (Hello) registry.lookup("Hello");

            // Call remote method
            String response = stub.sayHello();
            System.out.println("Response from Server: " + response);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

