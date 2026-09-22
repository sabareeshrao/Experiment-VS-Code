package AbstractClassExample;

public  class Car extends Vehicle1{
    int carNumber;
    String carType;

    public  void fuel(){

        int liters = 10;
        System.out.println("fuel");
    }

    public  void stop(){
        System.out.println("stopped");

    }
}
