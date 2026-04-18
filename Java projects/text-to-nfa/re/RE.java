package re;


import fa.State;
import fa.dfa.DFA;
import fa.nfa.NFA;
import fa.nfa.NFAState;


/**
 * This program converts a regular expression to an NFA
 * using recursive descent parsing
 * 
 * @author Mitchell Crocker
 */
public class RE implements REInterface {

    private String regEx;
    private int stateCount = 0;


    /**
     * RE constructor
     * @param regEx
     */
    public RE(String regEx) {
        this.regEx = regEx;
    }



    @Override
    public NFA getNFA() {
        return regex();
    }

    /**
     * returns first item in the regular expression
     * @return char
     */
    private char peek() {
        return regEx.charAt(0);
    }

    /**
     * takes in first item in regular expression and processes it, shortening the string
     * and checking it against c
     * @param c
     */
    private void eat(char c) {
        if (peek() == c) {
            regEx = regEx.substring(1);
        } else {
            throw new RuntimeException("Expected: " + c + "; got: " + peek());
        }
    }


    /**
     * returns next item in the regular expression
     * @return char
     */
    private char next() {
        char c = peek();
        eat(c);
        return c;
    }

    /**
     * true if there's more to the string, false if it's empty
     * @return boolean
     */
    private boolean more() {
        return regEx.length() > 0;
    }

    /**
     * parses at least one term
     * @return
     */
    private NFA regex() {
        NFA term = term();

        if (more() && peek() == '|'){
            eat('|');
            return merge(term, regex());
        } else {
            return term;
        }
    }


    /**
     * combines 2 NFA's
     * @param nfa1
     * @param nfa2
     * @return NFA
     */
    public NFA merge(NFA nfa1, NFA nfa2) {
        NFAState nfaState1 = (NFAState) nfa1.getStartState();
        NFAState nfaState2 = (NFAState) nfa2.getStartState();

        nfa1.addNFAStates(nfa2.getStates());
        nfa1.addAbc(nfa2.getABC());

        String startState = Integer.toString(stateCount++);
        nfa1.addStartState(startState);
        String finalState = Integer.toString(stateCount++);
        nfa1.addFinalState(finalState);

        nfa1.addTransition(startState, 'e', nfaState1.getName());
        nfa1.addTransition(startState, 'e', nfaState2.getName()); 

        for(State s : nfa2.getFinalStates()) {
            NFAState state = (NFAState) s;
            state.setNonFinal();
            nfa1.addTransition(state.getName(), 'e', finalState);
        }

        return nfa1;
    }


    /**
     * parse base and any '*'
     * @return NFA
     */
    private NFA factor() {
        NFA base = base();

        while (more() && peek() == '*') {
            eat('*');
            base = repetition(base);
        }

        return base;
    }


    /**
     * returns new NFA if an OR symbol is found
     * also accounts for '*' in the regEx
     * @param base
     * @return NFA
     */
    private NFA repetition(NFA base) {
        NFAState baseStart = (NFAState) base.getStartState();

        for (State s : base.getFinalStates()) {
            base.addTransition(s.getName(), 'e', baseStart.getName());
        }

        String state = Integer.toString(stateCount++);
        base.addStartState(state);
        base.addFinalState(state);
        base.addTransition(state, 'e', baseStart.getName());

        return base;
    }


    /**
     * adds two NFA's to each other
     * @param nfa1
     * @param nfa2
     * @return NFA
     */
    public NFA combine(NFA nfa1, NFA nfa2){
        nfa1.addAbc(nfa2.getABC());

        for (State s : nfa1.getFinalStates()) {
            NFAState state = (NFAState) s;
            state.setNonFinal();
            state.addTransition('e', (NFAState) nfa2.getStartState());
        }
        nfa1.addNFAStates(nfa2.getStates());

        return nfa1;
    }


    /**
     * checking to see if the end of the input (regEx) has been reached
     * @return NFA
     */
    private NFA term() {
        NFA factor = new NFA();

        factor.addStartState(Integer.toString(stateCount++));
        String finalState = Integer.toString(stateCount);
        factor.addFinalState(Integer.toString(stateCount++));
        factor.addTransition(factor.getStartState().getName(), 'e', finalState);

        while (more() && peek() != ')' && peek() != '|') {
            NFA nextFactor = factor();
            factor = combine(factor, nextFactor);
        }

        return factor;
    }


    /**
     * checks for '(', returns next primative
     * @return NFA
     */
    private NFA base() {
        switch (peek()) {
            case '(':
                eat('(');
                NFA nfa = regex();
                eat(')');
                return nfa;

            default:
                return primitive(next());
        }
    }


    /**
     * returns NFA from char
     * @param c
     * @return NFA
     */
    private NFA primitive(char c) {
        NFA nfa = new NFA();

        String startState = Integer.toString(stateCount++);
        nfa.addStartState(startState);

        String finalState = Integer.toString(stateCount++);
        nfa.addFinalState(finalState);

        nfa.addTransition(startState, c, finalState);

        return nfa;
    }


    


    

    
}
