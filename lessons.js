window.COURSE = {
  "title": "Java Practice Developer Playback",
  "subtitle": "Lesson-by-lesson reconstruction of the Java teaching repository.",
  "package": {
    "apps": {
      "intellij_idea": {
        "project": {
          "name": "Java Practice",
          "sdk": "Java 21",
          "languageLevel": "21"
        },
        "tree": [],
        "files": {},
        "problems": [],
        "breakpoints": [],
        "runConfigurations": [],
        "maven": {},
        "spring": {},
        "jpa": {},
        "git": {
          "branch": "main",
          "changes": [],
          "history": []
        },
        "database": {},
        "tests": {},
        "terminal": "",
        "console": "",
        "visibleFeatures": []
      }
    }
  },
  "stages": [
    {
      "title": "1: Student Class Fundamentals",
      "subtitle": "Build Student.java from an empty project and understand fields, getters, and setters.",
      "steps": [
        {
          "title": "Create the Java project",
          "why": "A developer begins with an empty Java project. This establishes the project name, JDK, and Java language level before source files are added.",
          "action": {
            "action": "newProject",
            "data": {
              "name": "Java Practice",
              "sdk": "Java 21",
              "languageLevel": "21"
            }
          }
        },
        {
          "title": "Create the src folder",
          "why": "Java source code needs a source location. In this teaching repository, Student.java lives directly under src.",
          "action": {
            "action": "createDirectory",
            "data": {
              "path": "src"
            }
          }
        },
        {
          "title": "Create Student.java",
          "why": "We create the source file first. The class body starts empty so every member can be added deliberately.",
          "action": {
            "action": "createFile",
            "data": {
              "path": "src/Student.java",
              "language": "java",
              "content": ""
            }
          }
        },
        {
          "title": "Declare the Student class",
          "why": "The class declaration defines a new Student type. Everything that describes a student will live inside these braces.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "public class Student {\n"
            }
          }
        },
        {
          "title": "Add the rollNo field",
          "why": "rollNo stores the student's roll number. The int type is appropriate because the value is numeric and whole.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n    int rollNo;\n"
            }
          }
        },
        {
          "title": "Add the attendance field",
          "why": "isPresent stores a true/false condition, so boolean expresses the intent directly.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "    boolean isPresent;\n"
            }
          }
        },
        {
          "title": "Add the marks array",
          "why": "A student can have multiple marks. float[] lets one field hold several decimal numeric values.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "    float[] marks;\n"
            }
          }
        },
        {
          "title": "Add the name field",
          "why": "name stores text, so Java's String type is used.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "    String name;\n"
            }
          }
        },
        {
          "title": "Add getRollNo",
          "why": "A getter returns the current field value. It gives callers a clear method for reading rollNo.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n    public int getRollNo() {\n        return rollNo;\n    }\n"
            }
          }
        },
        {
          "title": "Add setRollNo",
          "why": "A setter receives a new value and assigns it to the object's field. this.rollNo makes it explicit that we are updating the current Student object.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n    public void setRollNo(int rollNo) {\n        this.rollNo = rollNo;\n    }\n"
            }
          }
        },
        {
          "title": "Add the presence getter",
          "why": "For boolean properties, Java commonly uses an is... method name. isPresent() returns the attendance state.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n    public boolean isPresent() {\n        return isPresent;\n    }\n"
            }
          }
        },
        {
          "title": "Add setPresent",
          "why": "setPresent changes the boolean attendance value while keeping the field assignment inside the Student class.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n    public void setPresent(boolean present) {\n        isPresent = present;\n    }\n"
            }
          }
        },
        {
          "title": "Add getMarks",
          "why": "getMarks returns the marks array so callers can read the student's stored marks.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n    public float[] getMarks() {\n        return marks;\n    }\n"
            }
          }
        },
        {
          "title": "Add setMarks",
          "why": "setMarks lets the caller provide the student's marks array and stores that array in the object.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n    public void setMarks(float[] marks) {\n        this.marks = marks;\n    }\n"
            }
          }
        },
        {
          "title": "Add getName",
          "why": "getName exposes the student's name through a method instead of requiring callers to work directly with the field.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n    public String getName() {\n        return name;\n    }\n"
            }
          }
        },
        {
          "title": "Add setName",
          "why": "setName receives a String and assigns it to this student's name field.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n    public void setName(String name) {\n        this.name = name;\n    }\n"
            }
          }
        },
        {
          "title": "Close the Student class",
          "why": "The final closing brace completes the class definition. At this point Student.java matches the repository source.",
          "action": {
            "action": "typeCode",
            "data": {
              "file": "src/Student.java",
              "position": "end",
              "code": "\n}\n"
            }
          }
        },
        {
          "title": "Review the completed class structure",
          "why": "A developer can now inspect the class members together: four fields plus getters and setters. The Structure view is useful for seeing the shape of a class without scanning every line.",
          "action": {
            "action": "openStructure",
            "data": {}
          }
        }
      ]
    }
  ]
};
