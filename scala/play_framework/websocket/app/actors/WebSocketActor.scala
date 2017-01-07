package actors

import akka.actor._

object WebSocketActor {
	def props(out: ActorRef) = Props(new WebSocketActor(out))
}

class WebSocketActor(out: ActorRef) extends Actor {
	def receive = {
		case msg: String =>
			out ! ("I received your message: " + msg)
	}
}