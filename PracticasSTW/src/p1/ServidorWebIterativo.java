package p1;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * @author Jaime Ruiz-Borau Vizarraga (546751)
 * 
 *         La clase ServidorWebIterativo gestiona las peticiones del servidor
 *         web propuesto en la práctica 1 de Sistemas y Tecnologías web de una
 *         forma iterativa. Atiende una petición y cuando termina con ella,
 *         atiende la siguiente.
 */

public class ServidorWebIterativo {

	/**
	 * Método main de la clase ServidorWebIterativo. Pone en marcha el servidor
	 * web iterativo y gestiona las peticiones que recibe.
	 * 
	 * @param args
	 *            : No recibe parámetros
	 * @throws IOException
	 *             : Si existe algún problema al montar el servidor o al aceptar
	 *             conexiones con clientes
	 */
	public static void main(String args[]) throws IOException {
		int puerto = 9000;
		@SuppressWarnings("resource")
		ServerSocket servidor = new ServerSocket(puerto);
		while (true) {
			// Obtengo un socket cuando se conecta un cliente
			Socket cliente = servidor.accept();
			Handler.handlePetition(cliente);
		}
	}
}