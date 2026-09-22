package Java8Features;


public class FunctionalInterface implements Greeting {
    public static void main(String a[]){
        Greeting greetObj = name -> System.out.println("Hi" + name);
        greetObj.greet("Java 8 ");

       /* Greeting greetObj = new Greeting() {
            @Override
            public void greet(String name) {

            }
        }*/

        //Greeting greetObj = new Greeting();
    }

    @Override
    public void greet(String name) {
      System.out.println("Greet in definition");
    }
}

