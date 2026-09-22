package InnerClass;

interface Greeting{
    void sayHello();
}

class OuterAnonymous {
    public static void main(String a[]){
        Greeting greeting = new Greeting() {
            public void sayHello() {
                System.out.println("Anonymous Inner class");
            }
        };

        greeting.sayHello();
    }
}
