package AbstractClassExample;

public abstract class Vehicle1 {
     //Vehicle1() {}
     Vehicle1(){
         System.out.println("In Vehicle1 COntrsutor");
     }
     public void start() {
         System.out.println("vehicle starte");
     }

     public abstract void fuel();

     public abstract void stop();

}


