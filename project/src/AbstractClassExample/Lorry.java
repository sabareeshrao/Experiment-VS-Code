package AbstractClassExample;


class Lorry extends Vehicle1{
    Lorry(){
        System.out.println("In Lorry COntrsutor");
    }

    public void start() {
        System.out.println("Lorry started");
    }

    public  void fuel(){
        System.out.println("lorry fuel");
    }

    public  void stop(){
        System.out.println("lorry stopped");

    }

    public static void main(String a[]){
        //Vehicle1 v1 = new Vehicle1();
        Lorry l1 = new Lorry();
        l1.start();
       // Lorry l2 = new Vehicle1();


    }
}
