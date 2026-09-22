package RMI;

import java.rmi.RemoteException;

public class RemoteImpl implements RemoteInterface {
    RemoteImpl() throws RemoteException {
        super();
    }

    public String sayHello() throws RemoteException {
        return "Hi from Remote server";
    }
}
