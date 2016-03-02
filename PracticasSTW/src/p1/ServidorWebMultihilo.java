package p1;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * @author Jaime Ruiz-Borau Vizarraga (546751)
 * 
 *         La clase ServidorWebMultihilo gestiona las peticiones del servidor
 *         web propuesto en la pr�ctica 1 de Sistemas y Tecnolog�as web mediante
 *         varios hilos de procesamiento. Atiende una petici�n y le asigna un
 *         hilo para que el cliente sea atendido por un proceso concreto.
 *         Despu�s queda a la espera de nuevas peticiones.
 */
public class ServidorWebMultihilo {

	/**
	 * M�todo main de la clase ServidorWebMultihilo. Pone en marcha el servidor
	 * web multihilo y gestiona las peticiones que recibe.
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
			
			// Se la asigno a un hilo individual para que lo atienda
			Worker w = new Worker(cliente);
			Thread t = new Thread(w);
			t.start();
		}
	}
}