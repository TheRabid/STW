package p1;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * @author Jaime Ruiz-Borau Vizarraga (546751)
 * 
 *         La clase ServidorWebMultihilo gestiona las peticiones del servidor
 *         web propuesto en la práctica 1 de Sistemas y Tecnologías web mediante
 *         varios hilos de procesamiento. Atiende una petición y le asigna un
 *         hilo para que el cliente sea atendido por un proceso concreto.
 *         Después queda a la espera de nuevas peticiones.
 */
public class ServidorWebMultihilo {

	/**
	 * Método main de la clase ServidorWebMultihilo. Pone en marcha el servidor
	 * web multihilo y gestiona las peticiones que recibe.
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
			
			// Se la asigno a un hilo individual para que lo atienda
			Worker w = new Worker(cliente);
			Thread t = new Thread(w);
			t.start();
		}
	}
}