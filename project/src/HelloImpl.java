import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;

// Implementation of remote interfacHelloe
public class HelloImpl implements Hello {

    public HelloImpl() {}

    public String sayHello() throws java.rmi.RemoteException {
        return "Hello from RMI Server!";
    }

    public static void main(String[] args) {
        try {
            // Create implementation object
            HelloImpl obj = new HelloImpl();

            // Export it to make it available remotely
            Hello stub = (Hello) UnicastRemoteObject.exportObject(obj, 0);

            // Start RMI registry on port 1099
            Registry registry = LocateRegistry.createRegistry(1099);

            // Bind the remote object to the registry with name "Hello"
            registry.rebind("Hello", stub);

            System.out.println("RMI Server is ready!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
