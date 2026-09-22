package Collections;

import java.util.*;

public class SetExample {
    //List - {1,2,2,3,4,5} - duplicate
    //set - 1,2,3,4,5
    //equals , hashcode methods

    //east - hashcode - agdjagds
    //east - hashcode - agdjagds - duplicate
    //east - hashcode - jgasjdgsa -
    //equals() -> oldvalue with newvalue -> false
    public static void main(String a[]){
        //Set<String> stringSet = new HashSet<>();
        Set<String> stringSet = new LinkedHashSet<>(); //insertion order
       // Set<String> stringSet = new TreeSet<>();//natural ordering -asc
        //Single element addition
        stringSet.add("east");
        stringSet.add("east");
        stringSet.add("west");
        stringSet.add("north");
        stringSet.add("south");



       // System.out.println("Set elements" + stringSet);
//[east, SouthEast, NorthWest, south, north, west, SouthWest, NorthEast] - HashSet
        //[east, west, north, south, NorthWest, NorthEast, SouthWest, SouthEast]
        //[NorthEast, NorthWest, SouthEast, SouthWest, east, north, south, west] -- Sorted
       // [east, north, northEast, northWest, south, southEast, southWest, west] -- Ascending
        List<String> directions = Arrays.asList("northWest", "northEast", "northEast", "southWest", "southEast");
        //LIst
        stringSet.addAll(directions);
        System.out.println("Set elements" + stringSet);
        for(String dir: stringSet){
            System.out.println("Dir...." + dir);
        }

    }
}
