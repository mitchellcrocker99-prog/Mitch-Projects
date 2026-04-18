# Regular Expression to NFA


## Overview

Takes in a regular expression from a text file and converts it to an NFA

## Compiling and Using

To compile, execute the following command in the main project directory:
```
$ javac -cp ".:./text_to_nfa.jar" re/REDriver.java
```

Run the compiled class with the command:
```
$ java -cp ".:./text_to_nfa.jar" re.REDriver *insert file path and name here*
```

## Sources used

Recursive descent parsing algorithm:

http://matt.might.net/articles/parsing-regex-with-recursive-descent/