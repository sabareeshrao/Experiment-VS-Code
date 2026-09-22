class EnumExample {
    public static void main(String a[]){
        Day today = Day.SAT;
        System.out.println(today);
        System.out.println(Day.values().length);

        for(Day d: Day.values()) {
            System.out.println("Day" + d);
        }
    }

}
public enum Day { MONDAY, TUESDAY, WED , THUR , FRI , SAT , SUN}

