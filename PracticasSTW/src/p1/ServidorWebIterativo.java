package p1;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * @author Jaime Ruiz-Borau Vizarraga (546751)
 * 
 *         La clase ServidorWebIterativo gestiona las peticiones del servidor
 *         web propuesto en la pr�ctica 1 de Sistemas y Tecnolog�as web de una
 *         forma iterativa. Atiende una petici�n y cuando termina con ella,
 *         atiende la siguiente.
 */

public class ServidorWebIterativo {

	/**
	 * M�todo main de la clase ServidorWebIterativo. Pone en marcha el servidor
	 * web iterativo y gestiona las peticiones que recibe.
	 * 
	 * @param args
	 *            : No recibe par�metros
	 * @throws IOException
	 *             : Si existe alg�n problema al montar el servidor o al aceptar
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