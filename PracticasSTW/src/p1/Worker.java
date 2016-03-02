package p1;

import java.net.Socket;

/**
 * @author Jaime Ruiz-Borau Vizarraga (546751)
 * 
 *         La clase Worker es la clase encargada de gestionar las peticiones de
 *         los clientes en el servidor multihilo. Posee un m�todo run() que
 *         contiene la gesti�n de la petici�n del cliente y que permite la
 *         ejecuci�n de varias peticiones en paralelo.
 */
public class Worker implements Runnable {

	/* Atributos privados */
	private Socket cliente;

	/**
	 * Constructor
	 * 
	 * @param cliente
	 *            : Socket para comunicarse con el cliente
	 */
	public Worker(Socket cliente) {
		this.cliente = cliente;
	}

	/**
	 * M�todo run. Gestiona la petici�n del cliente.
	 */
	public void run() {
		Handler.handlePetition(cliente);
	}
}
