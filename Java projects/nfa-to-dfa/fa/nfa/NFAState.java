package fa.nfa;

import java.util.Set;
import java.util.HashMap;
import java.util.HashSet;

import fa.State;

/**
 * implementation of NFAState
 */
public class NFAState extends State{

    private HashMap<Character, Set<NFAState>> delta;
    private boolean isFinal;

    /**
	 * Default constructor
	 * @param name the state name
	 */
    public NFAState(String name) {
            initDefault(name);
            isFinal = false;
    }

    /**
	 * Overlaoded constructor that sets the state type
	 * @param name the state name
	 * @param isFinal the type of state: true - final, false - nonfinal.
	 */
    public NFAState(String name, boolean isFinal) {
        initDefault(name);
        this.isFinal = isFinal;
    }

    private void initDefault(String name) {
        this.name = name;
        delta = new HashMap<Character, Set<NFAState>>();
    }


    /**
	 * Accessor for the state type
	 * @return true if final and false otherwise
	 */
    public boolean isFinal() {
        return isFinal;
    }

    /**
	 * Add the transition from <code> this </code> object
	 * @param onSymb the alphabet symbol
	 * @param toState to DFA state
	 */
    public void addTransition(char onSymb, NFAState toState) {
        // delta.put(onSymb, new HashSet<NFAState>()); 
        // delta.get(onSymb).add(toState); //adds state to the map
        if (!delta.containsKey(onSymb)) {
			delta.put(onSymb, new HashSet<NFAState>());
		}
		delta.get(onSymb).add(toState);
    }

    /**
	 * Retrieves the state that <code>this</code> transitions to
	 * on the given symbol
	 * @param symb - the alphabet symbol
	 * @return the new state 
	 */
    public Set<NFAState> getTo(char symb) {
        if(delta.get(symb) == null) {
            return new HashSet<NFAState>();
        }
        return delta.get(symb);
    }



}