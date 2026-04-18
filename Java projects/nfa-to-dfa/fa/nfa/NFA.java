package fa.nfa;

import java.util.Set;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Queue;
import java.util.LinkedList;

import fa.State;
import fa.dfa.DFA;

/**
 * Implementation of NFA class
 */
public class NFA implements NFAInterface{

	private Set<NFAState> nfaStates;
	private NFAState start;
	private Set<Character> ordAbc;


	public NFA(){
		nfaStates = new LinkedHashSet<NFAState>();
		ordAbc = new LinkedHashSet<Character>();
	}


  /**
   * converts NFA to a DFA using a BFS and Queue
   * 
   * source: https://java2blog.com/breadth-first-search-in-java/
   * 
   * @return the dfa resulting from the nfa provided
   */
	public DFA getDFA() { 
		DFA dfa = new DFA();
		Set<Set<NFAState>> dfaStates = new HashSet<Set<NFAState>>();
		Queue<Set<NFAState>> q = new LinkedList<Set<NFAState>>();

		//adding start states to DFA and Queue
		dfa.addStartState(eClosure(start).toString());
		q.add(eClosure(start));

		// check to see if start state is also a final state, add to DFA as final state if so
		if (isFinal(eClosure(start))) {
			dfa.addFinalState(eClosure(start).toString());
		}

		//add start to dfaStates
		dfaStates.add(eClosure(start));

		//BFS
		while(!q.isEmpty()) {
			Set<NFAState> current = q.poll(); // pop and remove head of queue

			//need to search routes for every alphabet symbol
			for (Character symb : ordAbc) {
				Set<NFAState> route = getToState(current, symb); // fills route up nearby states based on 'symb'
				route = eClosureSet(route); // accounts for transitions involving 'e'
				//route now contains all states reachable by 'symb' and 'e'

				// for (NFAState s : current) {
				// 	//route.add(eClosure(s.getTo(symb))); //factors in 'e' for routes
				// 	Set<NFAState> temp = s.getTo(symb);
				// 	for (NFAState tempState : temp){
				// 		route.addAll(eClosure(tempState));
				// 	}
				// }
				String routeString = route.toString();
				//add route to DFA, dfaStates, q
				if (!dfaStates.contains(route)) {
					dfaStates.add(route);
					q.add(route);

					//check if its a final state
					if (isFinal(route)) {
						dfa.addFinalState(routeString);
					} else {
						dfa.addState(routeString);
					}
				}
				// add transition from current set to the route set
				dfa.addTransition(current.toString(), symb, routeString);
			}

		}
	 
	 	return dfa;
	 } 
	
	/**
	 * Return delta entries
	 * @param from - the source state
	 * @param onSymb - the label of the transition
	 * @return a set of sink states
	 */
	public Set<NFAState> getToState(NFAState from, char onSymb) {
		return from.getTo(onSymb);
    }
	
	/**
	 * Traverses all epsilon transitions and determine
	 * what states can be reached from s through e
	 * @param s
	 * @return set of states that can be reached from s on epsilon trans.
	 */
	public Set<NFAState> eClosure(NFAState s) {
		// use Depth-First Seach
		Set<NFAState> ret = new LinkedHashSet<NFAState>();
		//populate ret with results of DFS()
		ret = DFS(s, ret); //will eventually equal the 'visited' set from DFS()
		return ret;
	}

	@Override
	public void addStartState(String name) {
		NFAState startState = checkIfExists(name);
		if (startState == null) {
			startState = new NFAState(name);
			addState(startState);
		} else {
			System.out.println("WARNING: A state with name " + name + " already exists in the NFA");
		}
		start = startState;	
	}

	@Override
	public void addState(String name) {
		NFAState s = checkIfExists(name);
		if (s == null) {
			s = new NFAState(name);
			nfaStates.add(s);
		} else {
			System.out.println("WARNING: A state with name " + name + " already exists in the NFA");
		}
		
	}

	/**
	 * private helper method for adding a state
	 * @param s		state to be added
	 */
	private void addState(NFAState s) {
		nfaStates.add(s);
	}

	@Override
	public void addFinalState(String name) {
		NFAState finalState = checkIfExists(name);
		if (finalState == null) {
			finalState = new NFAState(name, true);
			addState(finalState);
		} else {
			System.out.println("WARNING: A state with name " + name + " already exists in the NFA");
		}
		
	}

	@Override
	public void addTransition(String fromState, char onSymb, String toState) {
		NFAState from = checkIfExists(fromState);
		NFAState to = checkIfExists(toState);
		if(from == null){
			System.err.println("ERROR: No NFA state exists with name " + fromState);
			System.exit(2);
		} else if (to == null){
			System.err.println("ERROR: No NFA state exists with name " + toState);
			System.exit(2);
		}
		from.addTransition(onSymb, to);
		
		if(!ordAbc.contains(onSymb) && onSymb != 'e'){
			ordAbc.add(onSymb);
		}
		
	}

	/**
	 * Get all states currently in the NFA
	 * @return Set of existing states
	 */
	@Override
	public Set<NFAState> getStates() {
		return nfaStates;
	}

	/**
	 * Get all final states in the NFA
	 * @return Set of all final states in the NFA
	 */
	@Override
	public Set<NFAState> getFinalStates() {
		Set<NFAState> ret = new LinkedHashSet<NFAState>();
		for (NFAState s : nfaStates) {
			if (s.isFinal()) {
				ret.add(s);
			}
		 }
		 return ret;
	}

	/**
	 * Get NFA start state
	 * @return NFAState marked as the initial state
	 */
	@Override
	public State getStartState() {
		return start;
	}

	/**
	 * Get alphabet
	 * @return Set of all valid transition characters, except e.
	 */
	@Override
	public Set<Character> getABC() {
		return ordAbc;
	}

	//============================================================================
	//---------------------------- HELPER METHODS --------------------------------
	//============================================================================

	/**
	 * needed an eClosure method that takes in a set
	 * @param s set of states to search
	 * @return DFS results in a set
	 */
	private Set<NFAState> eClosureSet(Set<NFAState> s) {
		Set<NFAState> result = new HashSet<NFAState>();
		for (NFAState state : s) {
			result.addAll(eClosure(state));
		}
		return result;
	}

	/**
	 * helper method allowing a set to pass into getToState
	 * @param from set of states to be passed into getTo()
	 * @param onSymb symbol for the route that getTo() explores
	 * @return returns a set of the possible route
	 */
	private Set<NFAState> getToState(Set<NFAState> from, char onSymb) {
		Set<NFAState> ret = new HashSet<NFAState>();

		for (NFAState nfaState : from) {
			ret.addAll(nfaState.getTo(onSymb));
		}

		return ret;
	}

	/**
	 * helper method implementing recursive Depth-First Search 
	 * on a provided state
	 * sources used: https://www.baeldung.com/java-depth-first-search
	 * 				 https://java2blog.com/depth-first-search-in-java/
	 * @param searchStart 	the state where the search starts
	 * @param visited 			set to be filled with the eClosure's
	 * @return 				the result set of the search
	 */
	private Set<NFAState> DFS(NFAState searchStart, Set<NFAState> visited) {
		if (visited.contains(searchStart) == false) { // if the state hasnt been visited
			visited.add(searchStart); // add to visited Set
			Set<NFAState> routes = getToState(searchStart, 'e'); //create a set of states reachable by 'e'
			for (NFAState s : routes) {
				DFS(s, visited); //recursively search for more reachable states 
			}
		}

		return visited; //return eClosure set when search is finished
	}

	/**
	 * Check if a state with such name already exists
	 * @param name
	 * @return null if no state exist, or DFAState object otherwise.
	 */
	private NFAState checkIfExists(String name) {
		NFAState ret = null;
		for (NFAState s : nfaStates) {
			if(s.getName().equals(name)) {
				ret = s;
				break;
			}
		}
		return ret;
	}

	/**
	 * isFinal but can accept a set, helper for eClosure
	 * @param s set of states to check if any are final states
	 * @return true if any state is final, false if none are
	 */
	private boolean isFinal(Set<NFAState> s) {
		for (NFAState state : s) {
			if (state.isFinal()) {
				return true;
			}
		}
		return false;
	}
}