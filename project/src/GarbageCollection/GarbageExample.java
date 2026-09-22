package GarbageCollection;

public class GarbageExample {
    @Override
    protected void finalize() throws Throwable{
        System.out.println("Garbage collected");
    }

    public static void main(String k[]){
        GarbageExample obj = new GarbageExample();
        obj = null;

        System.gc();
    }
}
