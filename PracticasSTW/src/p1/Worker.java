package p1;

import java.net.Socket;

/**
 * @author Jaime Ruiz-Borau Vizarraga (546751)
 * 
 *         La clase Worker es la clase encargada de gestionar las peticiones de
 *         los clientes en el servidor multihilo. Posee un método run() que
 *         contiene la gestión de la petición del cliente y que permite la
 *         ejecución de varias peticiones en paralelo.
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
	 * Método run. Gestiona la petición del cliente.
	 */
	public void run() {
		Handler.handlePetition(cliente);
	}
}
