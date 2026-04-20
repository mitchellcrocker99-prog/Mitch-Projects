{\rtf1\ansi\ansicpg1252\cocoartf1671\cocoasubrtf200
{\fonttbl\f0\fnil\fcharset0 HelveticaNeue;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww16220\viewh12940\viewkind0
\deftab560
\pard\pardeftab560\slleading20\partightenfactor0

\f0\fs24 \cf0 ****************\
* Project CircuitTracer\
* CS 221\
* 5/3/19\
* Mitchell Crocker\
**************** \
\
OVERVIEW:\
\
 This program finds  the shortest paths to connect\
Two components on a circuit board together while avoiding\
Other components. It also checks the format of the given boards\
And throws exceptions as needed.\
\
\
INCLUDED FILES:\
\
 * CircuitTracer.java - source file\
 * CircuitBoard.java - source file\
* InvalidFileFormatException.java - source file\
* OccupiedPositionException.java - source file\
* Storage.java - source file\
* TraceState.java - source file\
 * README - this file\
\
\
COMPILING AND RUNNING:\
 \
 \
 From the directory containing all source files, compile the\
 driver class (and all dependencies) with the command:\
 $ javac CircuitTracer.java\
\
 Run the compiled class file with the command:\
 $ java CircuitTracer storage [-s: stack, -q: queue] view [-c: console mode, -g:\
	GUI mode] filename\
\
 Console output will give the results after the program finishes.\
\
ANALYSIS:\
\
Q: How does the choice of\'a0Storage\'a0configuration (stack vs queue) affect the \
sequence in which paths are explored in the search algorithm? (This \
requires more than a "stacks are LIFOs and queues are FIFOs" answer.\
	\
A: This changes the way the points in the completed path are put into the\
 array and are able to be retrieved. When retrieving the path you\'92ll either\
 get the end point or start point first. When requesting the most recent point \
the stack will give you the most recent made while the queue will give you the \
very first point. The interesting thing about it is the same logic for finding the path\
is used for both storage methods. But depending on which you choose, it will work\
From the end point to the starting point or vice versa.\
\
Q: Is the total number of search states (possible paths) affected by the choice \
of stack or queue?\
\
A: Yes, the queue has a possibility of being faster due to it checking all sides, while \
the stack goes one direction until exhausting that. The queue can find more \
possibilities in a faster time given the proper set of data. \
\
Q: How is memory use (the maximum number of states in\'a0Storage\'a0at one time) \
affected by the choice of underlying structure?\
\
A: The program is designed to only hold paths of the lowest steps, that could \
either be one path or multiple of the same length. Any other paths created that \
dont meet that criteria are discarded and not stored. This helps keep memory usage\
 down and therefore speeding up the program if it were given a large dataset. However\
During the process of finding the paths, queue uses less memory due to it being multidirectional\
Which makes the overall steps fewer.\
\
Q: What is the Big-Oh runtime for the search algorithm? Does it reflect the maximum size \
of\'a0Storage? Does it reflect the number of board positions? Does it reflect the number of \
paths explored? Does it reflect the maximum path length? Is it something else?\
\
A: The runtime is linear O(n). This reflects the board size, the bigger the board the more \
possible correct routes there\'92ll be, and that increases linearly. The number of paths \
explored is also a part of this, the bigger the board the more paths there\'92ll be. But again,\
 this only increases linearly. In the code it\'92s apparent due to the use of a single while loop,\
Which has a runtime of O(n), there are no other loops nested in this while loop, just if \
Statements.\
\
Q: Does using one of the storage structures usually find a solution in fewer steps than the \
other? Always?\
\
A: Using queue can be faster, but definitely not always, it all depends on the board configuration\
 and where the start, end, and other components are. \
\
Q: Does using either of the storage structures guarantee that the first solution found\
 will be a shortest path?\
\
A: No, that is all based on where everything is located on the board, both will find\
 the shortest path, but one may find it before the other.\
\
\
PROGRAM DESIGN AND IMPORTANT CONCEPTS:\
\
The program has two main files, CircuitBoard.java and CircuitTracer.java\
CircuitBoard is where the board is created, the dimensions are read, and \
The 2D array is filled using the data from the given file. This is also where\
 the program makes sure that the dataset given is correctly formatted and\
 without error. If there are errors, an exception will be thrown describing \
The apparent problem.\
\
CircuitTracer is where the path is found, this is a simple algorithm \
That checks the state of the surrounding spots to see if they\'92re empty.\
When a path is found it\'92s length is first checked with the previous path found,\
If that length is less, the new path replaces the old. If not then the new path\
Is discarded and another path is generated. This happens until there are no \
New paths to be found, therefore the best path(s) have been found.\uc0\u8232 \
I can\'92t really think of any ways to restructure this program. Having the \
Board populated in a separate file than the path algorithm was very helpful,\
It really helped me keep thoughts and separate, allowing me to experiment with\
More confidence. I also liked having all the storage processes in another class\
As well, I feel that this helped a lot with decluttering and structuring the main two\
Classes.\
\
\
TESTING:\
\
I ran the CircuitTracerTester file and looked at each failed test, modifying\
My program to make that test pass. This method proved extremely effective\
And helped me focus on one part at a time, instead of getting overwhelmed \
By the scale of the program. I also ran CircuitTracer.java on different files to \
See the output of what I was making, which helped me visualize a lot better when\
I was creating the toString and the process of the CircuitTracer algorithm in general.\
\
\
DISCUSSION:\
 \
 This program was extremely difficult for me, it took a lot of time and I had\
To ask for help a lot more than I ever had. I had trouble with index out of bounds\
Exceptions on my board array that I couldn\'92t solve for the longest time, but working \
Through the program step by step fixed a lot of issues. There was a large chunk of tests\
That were failing that I couldn\'92t figure out for a while, turns out I just had a bracket in the \
Wrong place, which felt so good when I finally caught it and everything passed.\
\
The logic for finding the path was much simpler than I expected it to be, it was a lot like\
GridMonitor from 121. Doing that project really helped me here and I used a lot of the same\
Things that I had forgotten from that project.\
 }