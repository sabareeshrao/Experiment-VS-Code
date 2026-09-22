package Exception;

public class CustomExceptionExample {
    public static void main(String p[]) throws InvalidAgeException {
        int age = 20;
        try{
            validAge(age);
        } catch(InvalidAgeException x){
            System.out.println("Custom exception" + x.getMessage());
        }
    }

    static void validAge(int age) throws InvalidAgeException {
        if(age > 18){
            throw new InvalidAgeException("Invalid Age");
        }
    }
}
