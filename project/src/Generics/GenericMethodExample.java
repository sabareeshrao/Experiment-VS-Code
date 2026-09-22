package Generics;

public class GenericMethodExample {

    public static <T> void printArray(T[] array){
        for(T element: array) {
            System.out.println(element);
        }
    }

    public void printArray1(int element){
        //for(T element: array) {
            System.out.println(element);
        //}
    }


    public static void main(String as[]){
        Integer[] intArray = {1,2,3};
        String[] strArray = {"A", "B", "C"};
  /// create object ??
        GenericMethodExample genericMethodExample = new GenericMethodExample();
        genericMethodExample.printArray1(12);

        printArray(intArray);//Integer[]
        printArray(strArray);//String[]
    }
}
