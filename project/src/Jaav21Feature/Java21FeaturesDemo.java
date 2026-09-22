package Jaav21Feature;

import java.util.*;
import java.util.stream.Collectors;

public class Java21FeaturesDemo {

    // ============================================================
    // 1. ENUM
    // ============================================================

    enum PaymentMethod {
        CARD,
        UPI,
        NET_BANKING
    }


    // ============================================================
    // 2. RECORD
    // Immutable data carrier
    // ============================================================

    record Customer(
            int id,
            String name,
            String email
    ) {
    }

   /* class Customer {

        Customer(int id, String name, String email){

        }
    }*/


    record Product(
            int id,
            String name,
            double price
    ) {
    }


    // Record containing another record
    record OrderItem(
            Product product,
            int quantity
    ) {
        double total() {
            return product.price() * quantity;
        }

    }


    // ============================================================
    // 3. SEALED CLASS
    // Only these classes can extend Payment
    // ============================================================

    sealed interface Payment
            permits CardPayment, UpiPayment, NetBankingPayment {
    }

   /* final class CardPayment implements Payment {

    }*/


    record CardPayment(String cardNumber) implements Payment {
    }


    record UpiPayment(String upiId) implements Payment {
    }


    record NetBankingPayment(String bankName) implements Payment {
    }


    // ============================================================
    // MAIN
    // ============================================================

    public static void main(String[] args) {

        // --------------------------------------------------------
        // 4. var
        // Java infers the type
        // --------------------------------------------------------
        // Customer c = new Customer();
        var customer = new Customer(
                101,
                "Rahul",
                "rahul@example.com"
        );

        var laptop = new Product(
                1,
                "Laptop",
                75000
        );

        var mouse = new Product(
                2,
                "Mouse",
                1500
        );


        // --------------------------------------------------------
        // 5. RECORD + LIST
        // --------------------------------------------------------
      //  List<String> items = new ArrayList<>().asList("rr", "mm");
        var items = new ArrayList<OrderItem>();

        items.add(new OrderItem(laptop, 1));
        items.add(new OrderItem(mouse, 2));


        // --------------------------------------------------------
        // 6. Sequenced Collections
        // Java 21 feature
        //
        // getFirst()
        // getLast()
        // addFirst()
        // addLast()
        // removeFirst()
        // removeLast()
        // reversed()
        // --------------------------------------------------------

        System.out.println("First item : " + items.getFirst());
        System.out.println("Last item  : " + items.getLast());


        // --------------------------------------------------------
        // 7. TEXT BLOCK
        // Java 15+
        // --------------------------------------------------------

        String orderJson = """
                {
                    "customerId": 101,
                    "customerName": "Rahul",
                    "status": "CONFIRMED"
                }
                """;

        System.out.println("\nOrder JSON:");
        System.out.println(orderJson);


        // --------------------------------------------------------
        // 8. SWITCH EXPRESSION
        // --------------------------------------------------------

        PaymentMethod paymentMethod = PaymentMethod.UPI;

        String paymentDescription = switch (paymentMethod) {

            case CARD -> "Payment using Credit/Debit Card";

            case UPI -> "Payment using UPI";

            case NET_BANKING -> "Payment using Net Banking";
        };

        System.out.println(paymentDescription);


        // --------------------------------------------------------
        // 9. CREATE DIFFERENT PAYMENT TYPES
        // --------------------------------------------------------

        Payment payment = new UpiPayment("rahul@upi");
       // Payment payment1 = new CardPayment("rahul@upi");


        // --------------------------------------------------------
        // 10. PATTERN MATCHING FOR instanceof
        // --------------------------------------------------------

        if (payment instanceof UpiPayment upi) {

            System.out.println(
                    "\nUPI Payment ID: " + upi.upiId()
            );
        }

        //super class (Veicle), subclass (Car)
        //Class c extends Vehicle
        //Car c = new Car();
        //if(c instanceof Vehicle)



        // --------------------------------------------------------
        // 11. PATTERN MATCHING FOR switch
        //
        // Java 21 permanent feature
        // --------------------------------------------------------

        String paymentMessage = switch (payment) {

            case CardPayment card -> "Card payment: " + card.cardNumber();

            case UpiPayment upi -> "UPI payment: " + upi.upiId();

            case NetBankingPayment bank -> "Net banking: " + bank.bankName();
        };

        System.out.println(paymentMessage);


        // --------------------------------------------------------
        // 12. RECORD PATTERN
        //
        // Directly extract values from a record
        // --------------------------------------------------------

        OrderItem firstItem = items.getFirst();

        if (firstItem instanceof OrderItem(
                Product product,
                int quantity
        )) {

            System.out.println("\nProduct: " + product.name());
            System.out.println("Quantity: " + quantity);
            System.out.println("Price: " + product.price());
        }


        // --------------------------------------------------------
        // 13. RECORD PATTERN + PATTERN MATCHING
        // --------------------------------------------------------

        printItem(firstItem);


        // --------------------------------------------------------
        // 14. LAMBDA + STREAM
        // --------------------------------------------------------

        double total = items.stream()

                .mapToDouble(OrderItem::total)

                .sum();

        System.out.println("\nOrder Total: ₹" + total);


        // --------------------------------------------------------
        // 15. STREAM FILTERING
        // --------------------------------------------------------

        var expensiveProducts = items.stream()

                .filter(item -> item.product().price() > 5000)

                .map(item -> item.product().name())

                .toList();

        System.out.println(
                "Expensive products: " + expensiveProducts
        );


        // --------------------------------------------------------
        // 16. OPTIONAL
        // --------------------------------------------------------

        Optional<Product> product =
                findProduct(items, "Laptop");

        product.ifPresent(
                p -> System.out.println(
                        "\nFound product: " + p.name()
                )
        );


        // --------------------------------------------------------
        // 17. STREAM + COLLECTORS
        // --------------------------------------------------------

        var productNames = items.stream()

                .map(item -> item.product().name())

                .collect(Collectors.joining(", "));

        System.out.println(
                "\nProducts in order: " + productNames
        );


        // --------------------------------------------------------
        // 18. REVERSED SEQUENCED COLLECTION
        // --------------------------------------------------------

        System.out.println(
                "\nItems in reverse order:"
        );

        for (var item : items.reversed()) {
            System.out.println(
                    item.product().name()
            );
        }


        // --------------------------------------------------------
        // FINAL ORDER SUMMARY
        // --------------------------------------------------------

        printOrderSummary(
                customer,
                items,
                payment
        );
    }


    // ============================================================
    // RECORD PATTERN METHOD
    // ============================================================

    static void printItem(OrderItem item) {

        if (item instanceof OrderItem(
                Product(int id, String name, double price),
                int quantity
        )) {

            double total = price * quantity;

            System.out.println(
                    "\nItem Summary: " +
                            name +
                            " x " +
                            quantity +
                            " = ₹" +
                            total
            );
        }
    }


    // ============================================================
    // OPTIONAL EXAMPLE
    // ============================================================

    static Optional<Product> findProduct(
            List<OrderItem> items,
            String productName
    ) {

        return items.stream()

                .map(OrderItem::product)

                .filter(product ->
                        product.name()
                                .equalsIgnoreCase(productName))

                .findFirst();
    }


    // ============================================================
    // COMBINE EVERYTHING
    // ============================================================

    static void printOrderSummary(
            Customer customer,
            List<OrderItem> items,
            Payment payment
    ) {

        System.out.println(
                "\n=============================="
        );

        System.out.println(
                "        ORDER SUMMARY"
        );

        System.out.println(
                "=============================="
        );

        System.out.println(
                "Customer : " + customer.name()
        );

        System.out.println(
                "Email    : " + customer.email()
        );


        double total = items.stream()
                .mapToDouble(OrderItem::total)
                .sum();

        System.out.println(
                "Total    : ₹" + total
        );


        String paymentType = switch (payment) {

            case CardPayment card -> "CARD";

            case UpiPayment upi -> "UPI";

            case NetBankingPayment bank -> "NET BANKING";
        };

        System.out.println(
                "Payment  : " + paymentType
        );

        System.out.println(
                "=============================="
        );
    }
}