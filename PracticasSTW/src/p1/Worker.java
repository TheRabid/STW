package p1;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Scanner;

public class Worker implements Runnable{
	
	private Socket cliente;
	private static final int NOGET = 0;
	private static final int NOTFOUND = 1;
	private static final int HTML = 2;
	private static final int GIF = 3;
	private static final int UNKNOWN = 4;
	
	public Worker(Socket cliente){
		this.cliente = cliente;
	}
	
	public void run(){
		try{
		byte[] buffer = new byte[1024];
		int bytes;
		// nos aseguramos de que el fin de línea se ajuste al estándar
		System.setProperty("line.separator", "\r\n");
		Scanner lee = new Scanner(cliente.getInputStream());
		PrintWriter escribe = new PrintWriter(cliente.getOutputStream(), true);
		System.out.println("Recibido:");
		// esto debe ser el "GET"
		String checkGET = lee.next();
		System.out.print(checkGET + " ");
		if (checkGET.equalsIgnoreCase("GET")) {
			// esto es el fichero
			String checkPath = lee.next();
			System.out.println(checkPath);
			System.out.println();
			System.out.println("Enviado:");
			if (checkPath.startsWith("/stw")) {
				String fichero = "." + checkPath;
				// comprobamos si existe
				FileInputStream fis = null;
				boolean existe = true;
				try {
					fis = new FileInputStream(fichero);
				} catch (FileNotFoundException e) {
					existe = false;
				}
				if (existe && fichero.length() > 2) {
					File f = new File(fichero);
					String extension = "";
					int i = fichero.lastIndexOf('.');
					if (i > 0) {
						extension = fichero.substring(i + 1);
					}
					if (extension.equalsIgnoreCase("html")) {
						String response = makeResponse(HTML, (int) f.length());
						System.out.println(response);
						escribe.println(response);
					} else if (extension.equalsIgnoreCase("gif")) {
						String response = makeResponse(GIF, (int) f.length());
						System.out.println(response);
						escribe.println(response);
					} else {
						String response = makeResponse(UNKNOWN, (int) f.length());
						System.out.println(response);
						escribe.println(response);
					}

					while ((bytes = fis.read(buffer)) != -1) {
						// enviar fichero
						cliente.getOutputStream().write(buffer, 0, bytes);
					}
					escribe.println();
					System.out.println();
				} else {
					// Not found
					String response = makeResponse(NOTFOUND, 0);
					System.out.println(response);
					escribe.println(response);
				}
			} else {
				// Not found
				String response = makeResponse(NOTFOUND, 0);
				System.out.println(response);
				escribe.println(response);
			}
		} else {
			// Not implemented
			String response = makeResponse(NOGET, 0);
			System.out.println(response);
			escribe.println(response);
		}
		cliente.close();
		lee.close();
		} catch(IOException e){
			e.printStackTrace();
		}
	}

	private static String makeResponse(int code, int length) {
		String returned = null;
		if (code == NOGET) {
			// Responder not implemented
			String respCode = "501 Not Implemented";
			String p1 = makeHTTPProtocolTag(respCode);
			String p2 = makeContentLengthTag(respCode.length());
			String p3 = makeContentTypeTag("html");
			String p4 = makeContentFromString(respCode);
			returned = p1 + "\n" + p2 + "\n" + p3 + "\n" + p4 + "\n";
		} else if (code == NOTFOUND) {
			// Responder not found
			String respCode = "404 Not Found";
			String p1 = makeHTTPProtocolTag(respCode);
			String p2 = makeContentLengthTag(respCode.length());
			String p3 = makeContentTypeTag("html");
			String p4 = makeContentFromString(respCode);
			returned = p1 + "\n" + p2 + "\n" + p3 + "\n" + p4 + "\n";
		} else if (code == HTML) {
			// Responder ok y mandar el fichero
			String respCode = "200 OK";
			String p1 = makeHTTPProtocolTag(respCode);
			String p2 = makeContentLengthTag(length);
			String p3 = makeContentTypeTag("html");
			returned = p1 + "\n" + p2 + "\n" + p3;
		} else if (code == GIF) {
			// Responder ok y mandar el fichero
			String respCode = "200 OK";
			String p1 = makeHTTPProtocolTag(respCode);
			String p2 = makeContentLengthTag(length);
			String p3 = makeContentTypeTag("gif");
			returned = p1 + "\n" + p2 + "\n" + p3 + "\n";
		} else if (code == UNKNOWN) {
			// Responder ok y mandar el fichero
			String respCode = "200 OK";
			String p1 = makeHTTPProtocolTag(respCode);
			String p2 = makeContentLengthTag(length);
			String p3 = makeContentTypeTag("unknown");
			returned = p1 + "\n" + p2 + "\n" + p3;
		}
		return returned;
	}

	private static String makeHTTPProtocolTag(String respCode) {
		return "HTTP/1.0 " + respCode;
	}

	private static String makeContentLengthTag(int length) {
		return "Content-Length: " + length;
	}

	private static String makeContentTypeTag(String extension) {
		String base = "Content-Type: ";
		if (extension.equalsIgnoreCase("html")) {
			return base + "text/html";
		} else if (extension.equalsIgnoreCase("gif")) {
			return base + "image/gif";
		} else {
			return base + "application/octet-stream";
		}
	}

	private static String makeContentFromString(String body) {
		return "<html><body><h1>" + body + "</h1></body></html>";
	}

	private static String makeBodyOpener() {
		return "<html><body><h1>";
	}

	private static String makeBodyClosener() {
		return "</h1></body></html>";
	}
	
}
