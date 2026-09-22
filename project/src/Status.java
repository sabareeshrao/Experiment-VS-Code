public enum Status {
    //OrderStatus - NEW , PROCESSED , SHIPPED, DELIVERD -
    ACTIVE{
        public boolean activate() {
            return true;
        }
    },
    INACTIVATE{
        public boolean inactivate() {
            return false;
        }
    };

    public class EnumExample{
        public static void main(String f[]){
            Status st = Status.ACTIVE;
            System.out.println("Active" + st.activate());
        }
    }

    private static String activate() {
        return ACTIVE.activate();
    }
}
