package RMI;

import java.rmi.Remote;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;

public class Server {
    public static void main(String h[]) {
        try {

            RemoteImpl obj = new RemoteImpl();
            Remote stub = (Remote) UnicastRemoteObject.exportObject(obj, 0);
            Registry registry = LocateRegistry.createRegistry(1009);
            registry.rebind("HelloService", obj);

           /* Registry registry2 = LocateRegistry.createRegistry(1909);
            registry.rebind("HelloService1", (Remote) obj);*/

            System.out.println("RMI server is running..");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
