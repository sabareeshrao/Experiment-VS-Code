public enum Currency {

    USD("US Dollars"), EURO("Euro"), IND("rupees");

    private String desc;

    Currency(String description){
        this.desc = description;
    }

    public String getDesc() {
        return desc;
    }

    public static Currency fromDescription(String desc){
        for(Currency c: values()){
            if(c.getDesc().equalsIgnoreCase(desc)) {
                return c;
            }
        }
        throw new IllegalArgumentException("No match for " + desc);
    }
}

class callPart {

    public static void main(String a[]){
      //  Currency c = Currency.fromDescription(Currency.IND.getDesc());
        Currency c = Currency.fromDescription("Euro1");
        System.out.println(c);
    }
}
