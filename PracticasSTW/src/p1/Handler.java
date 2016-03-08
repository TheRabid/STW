package p1;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.NoSuchElementException;
import java.util.Scanner;

/**
 * @author Jaime Ruiz-Borau Vizarraga (546751)
 * 
 *         La clase Handler es la que se encarga de procesar la petici�n del
 *         cliente y de generar las respuestas correspondientes en funci�n de lo
 *         que se pida. Tambi�n se asegura de que la petici�n del cliente est�
 *         bien formada y no realiza peticiones no v�lidas.
 */
public class Handler {

	/* Atributos privados */
	private static final int NOGET = 0;
	private static final int NOTFOUND = 1;
	private static final int HTML = 2;
	private static final int GIF = 3;
	private static final int UNKNOWN = 4;
	private static final boolean DEBUG = true;

	/**
	 * M�todo handlePetition. Es el principal m�todo de esta clase, el que
	 * procesa y hace llamadas a otros m�todos para responder a la petici�n del
	 * cliente. Tambi�n comprueba que la petici�n del cliente est� bien formada
	 * para este servidor.
	 * 
	 * @param cliente
	 *            : Socket para comunicarse con el cliente
	 */
	public static void handlePetition(Socket cliente) {
		byte[] buffer = new byte[1024];
		int bytes;
		String debugString = "";
		try {
			// Nos aseguramos de que el fin de l�nea se ajuste al est�ndar
			System.setProperty("line.separator", "\r\n");
			Scanner lee = new Scanner(cliente.getInputStream());
			PrintWriter escribe = new PrintWriter(cliente.getOutputStream(), true);
			debugString += "Recibido:\n";

			// Comprobar que lo siguiente le�do es el GET
			String checkGET = lee.next();
			debugString += checkGET + " ";
			String response = "";

			if (checkGET.equalsIgnoreCase("GET")) {
				// Esto deber�a ser el fichero
				String checkPath = lee.next();
				debugString += checkPath + "\n\nEnviado:\n";

				if (checkPath.startsWith("/stw") && !checkPath.contains("/..")) {
					String fichero = "." + checkPath;
					// Comprobamos si existe
					FileInputStream fis = null;
					boolean existe = true;
					try {
						fis = new FileInputStream(fichero);
					} catch (FileNotFoundException e) {
						existe = false;
					}
					if (existe && fichero.length() > 2) {
						// Comprobamos la extensi�n del fichero
						File f = new File(fichero);
						String extension = "";
						int i = fichero.lastIndexOf('.');
						if (i > 0) {
							extension = fichero.substring(i + 1);
						}

						// Generamos una respuesta u otra dependiendo de lo que
						// nos piden
						if (extension.equalsIgnoreCase("html")) {
							response = makeResponse(HTML, (int) f.length());
						} else if (extension.equalsIgnoreCase("gif")) {
							response = makeResponse(GIF, (int) f.length());
						} else {
							response = makeResponse(UNKNOWN, (int) f.length());
						}

						// Enviamos la respuesta
						debugString += response + "\n";
						escribe.println(response);
						String infoSent = "";
						
						// Enviamos el fichero
						while ((bytes = fis.read(buffer)) > 0) {
							// enviar fichero
							cliente.getOutputStream().write(buffer, 0, bytes);
							if(infoSent.length() < 120){
								infoSent += new String(buffer).substring(0,bytes);
							}
						}
						
						debugString += infoSent + "\n";
						// Fin de la comunicaci�n
						escribe.println();
						debugString += "\n";
					} else {
						// Not found
						response = makeResponse(NOTFOUND, 0);
						debugString += response + "\n";
						escribe.println(response);
					}
				} else {
					// Not found
					response = makeResponse(NOTFOUND, 0);
					debugString += response + "\n";
					escribe.println(response);
				}
			} else {
				// Not implemented
				response = makeResponse(NOGET, 0);
				debugString += "\nEnviado:\n" +  response  + "\n";
				escribe.println(response);
			}
			escribe.close();
			cliente.close();
			lee.close();
			showDebug(debugString);
		} catch (IOException e) {
			e.printStackTrace();
		} catch (NoSuchElementException e) {
			showDebug("No se ha podido leer de la petici�n del cliente\n");
		}
	}

	/**
	 * M�todo makeResponse. En base a un c�digo que referencia el tipo de
	 * petici�n que hace el cliente, genera un String de respuesta para mandarle
	 * de vuelta
	 * 
	 * @param code
	 *            : C�digo del tipo de petici�n recibido
	 * @param length
	 *            : Longitud del fichero que solicita el cliente
	 * 
	 * @return String con una respuesta generada para el cliente
	 */
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
			String p2 = makeContentTypeTag("unknown");
			String p3 = makeContentLengthTag(length);
			returned = p1 + "\n" + p2 + "\n" + p3;
		}
		return returned;
	}

	/**
	 * M�todo makeHTTPProtocolTag. Genera un String que representa la etiqueta
	 * de protocolo HTTP que formar� parte de la respuesta enviada al cliente
	 * junto al c�digo de respuesta
	 * 
	 * @param respCode
	 *            : C�digo de respuesta para enviar al cliente
	 * 
	 * @return String con la etiqueta HTTP que formar� parte de la respuesta
	 */
	private static String makeHTTPProtocolTag(String respCode) {
		return "HTTP/1.0 " + respCode;
	}

	/**
	 * M�todo makeContentLength. Genera un String que representa la etiqueta de
	 * longitud del contenido que formar� parte de la respuesta enviada al
	 * cliente junto a la longitud del contenido que se va a enviar
	 * 
	 * @param length
	 *            : Longitud de lo que se va a enviar
	 * 
	 * @return String con la etiqueta de longitud de contenido que se enviar�
	 */
	private static String makeContentLengthTag(int length) {
		return "Content-Length: " + length;
	}

	/**
	 * M�todo makeContentTypeTag. Genera un String que representa la etiqueta de
	 * tipo del fichero solicitado que formar� parte de la respuesta enviada al
	 * cliente junto con el tipo del contenido que se va a enviar
	 * 
	 * @param extension
	 *            : String que contiene la extensi�n del fichero que se enviar�
	 * 
	 * @return String con la etiqueta del tipo de contenido que se enviar�
	 */
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

	/**
	 * M�todo makeContentFromString. Usado principalmente para enviar un texto
	 * embebido en c�digo html para que un navegador lo visualice. Genera un
	 * String que representa el contenido de un fichero html y que utliza el
	 * String pasado por par�metro para emplearlo como cuerpo del mensaje.
	 * 
	 * @param body
	 *            : String que contiene el cuerpo del mensaje
	 * 
	 * @return String con el c�gido html con el String body como cuerpo del
	 *         mensaje
	 */
	private static String makeContentFromString(String body) {
		return "<html><body><h1>" + body + "</h1></body></html>";
	}

	/**
	 * M�todo showDebug. Si la variable DEBUG fue activada (su valor es true)
	 * mostrar� mensajes por pantalla para informar de las interacciones con los
	 * clientes que se est�n llevando a cabo.
	 * 
	 * @param msg
	 *            : String que contiene el mensaje a mostrar
	 */
	private static void showDebug(String msg) {
		if (DEBUG) {
			System.out.print(msg);
		}
	}
}
