package Generics;

public class Box<T> {
    private T dataValue; //int float STring
   // private int value1;

    public void set(T value){
        this.dataValue = value;
    }

   /* public void set(int value){
        this.value1 = value;
    }

    public int get(){
        return value1;
    }*/

    public T get() {
        return dataValue;
    }
}
