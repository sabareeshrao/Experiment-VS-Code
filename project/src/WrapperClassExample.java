public class WrapperClassExample {
    public static void main(String a1[]){
        //primitive to Wrapper class
        int a = 10;
        Integer b = Integer.valueOf(a);//wrapping
        Integer c = a;//no wrapping logic , wrapper object
        System.out.println("Primitive " + a);
        System.out.println("Wrapped Object  " + b);
        System.out.println("Autoboxed Object  " + c);

       // double d = 9.5;
        //Wrapper class to Primitive
        Double wrapperD = Double.valueOf(9.5);
        double primitiveD = wrapperD.doubleValue();
        System.out.println("WrppaerD" + wrapperD);
        System.out.println("primitiveD" + primitiveD);
    }
}
//Wrapper class - methods
