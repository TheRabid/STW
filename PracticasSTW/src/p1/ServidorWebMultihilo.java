package p1;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.UnknownHostException;

public class ServidorWebMultihilo {

	public static void main(String args[]) throws UnknownHostException, IOException {
		int puerto = 9000;
		@SuppressWarnings("resource")
		ServerSocket servidor = new ServerSocket(puerto);
		while (true) {
			// espero a que venga un cliente Socket
			Socket cliente = servidor.accept();
			Worker w = new Worker(cliente);
			Thread t = new Thread(w);
			t.start();
		}
	}
}